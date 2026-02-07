import { srsService } from './srsService';
import TurnConfigService, { TurnServerConfig } from './turnConfigService';

// Interface para configuração do WebRTC
interface RTCConfig extends RTCConfiguration {
  iceServers: (RTCIceServer & {
    credentialType?: string;  // Tipo de credencial (opcional)
  })[];
  iceTransportPolicy?: 'relay' | 'all';  // Política de transporte ICE
  // Propriedades adicionais do RTCConfiguration
  bundlePolicy?: RTCBundlePolicy;
  rtcpMuxPolicy?: RTCRtcpMuxPolicy;
  sdpSemantics?: 'unified-plan' | 'plan-b';
}

// Opções para publicação de stream
interface OpcoesPublicacao {
  stream: MediaStream;  // Stream de mídia a ser publicado
  urlStream: string;    // URL do stream
  aoEncontrarCandidatoGelo?: (candidato: RTCIceCandidate) => void;  // Callback para candidatos ICE
  aoMudarEstadoConexao?: (estado: RTCPeerConnectionState) => void;  // Callback para mudanças de estado
  aoOcorrerErro?: (erro: Error) => void;  // Callback para erros
}

export class ServicoWebRTC {
  private conexaoPar: RTCPeerConnection | null = null;
  private stream: MediaStream | null = null;
  private idSessao: string | null = null;

  constructor(private configuracao: RTCConfig) {}

  /**
   * Publica um stream de mídia usando WebRTC
   */
  async publicar({
    stream,
    urlStream,
    aoEncontrarCandidatoGelo,
    aoMudarEstadoConexao,
    aoOcorrerErro,
  }: OpcoesPublicacao): Promise<void> {
    try {
      this.stream = stream;
      this.conexaoPar = new RTCPeerConnection(this.configuracao);

      // Adiciona as faixas de mídia à conexão
      stream.getTracks().forEach((faixa) => {
        if (this.conexaoPar) {
          this.conexaoPar.addTrack(faixa, stream);
        }
      });

      // Configura os manipuladores de eventos
      this.conexaoPar.onicecandidate = (evento) => {
        if (evento.candidate && aoEncontrarCandidatoGelo) {
          aoEncontrarCandidatoGelo(evento.candidate);
        }
      };

      this.conexaoPar.onconnectionstatechange = () => {
        if (aoMudarEstadoConexao && this.conexaoPar) {
          aoMudarEstadoConexao(this.conexaoPar.connectionState);
        }
      };

      // Cria a oferta de conexão
      const oferta = await this.conexaoPar.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await this.conexaoPar.setLocalDescription(oferta);

      // Envia a oferta para o servidor SRS e obtém a resposta
      const { sdp: resposta, sessionId } = await srsService.rtcPublish(
        oferta.sdp || '',
        urlStream
      );

      this.idSessao = sessionId;

      // Define a resposta remota da oferta
      await this.conexaoPar.setRemoteDescription(
        new RTCSessionDescription({ type: 'answer', sdp: resposta })
      );
    } catch (erro) {
      console.error('Erro ao publicar stream via WebRTC:', erro);
      if (aoOcorrerErro) {
        aoOcorrerErro(erro instanceof Error ? erro : new Error(String(erro)));
      }
      this.limparRecursos();
      throw erro;
    }
  }

  /**
   * Para a transmissão e limpa os recursos
   */
  async parar(): Promise<void> {
    if (this.conexaoPar) {
      this.conexaoPar.close();
      this.conexaoPar = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(faixa => faixa.stop());
      this.stream = null;
    }
    
    this.idSessao = null;
  }

  /**
   * Limpa os recursos da conexão
   */
  private limparRecursos(): void {
    if (this.conexaoPar) {
      this.conexaoPar.close();
      this.conexaoPar = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(faixa => faixa.stop());
      this.stream = null;
    }
    
    this.idSessao = null;
  }
}

// Obtém a configuração do TURN/STUN do banco de dados
async function obterConfiguracaoRTC(): Promise<RTCConfig> {
  try {
    const iceServers = await TurnConfigService.getTurnConfig();
    
    return {
      iceServers: iceServers as any[],
      // Configurações de desempenho e segurança
      iceTransportPolicy: 'relay',  // Usa apenas servidores TURN (mais seguro)
      iceCandidatePoolSize: 10,     // Tamanho do pool de candidatos ICE
      // Configurações avançadas
      bundlePolicy: 'max-bundle',   // Otimização de pacotes
      rtcpMuxPolicy: 'require',     // Obriga uso de RTCP multiplexado
      sdpSemantics: 'unified-plan'  // Usa o formato SDP mais recente
    };
  } catch (error) {
    console.error('Erro ao obter configuração RTC:', error);
    throw error;
  }
}

// Cria uma instância do serviço WebRTC com a configuração atual
let instanciaServicoWebRTC: ServicoWebRTC | null = null;

export async function obterServicoWebRTC(): Promise<ServicoWebRTC> {
  if (!instanciaServicoWebRTC) {
    const configuracao = await obterConfiguracaoRTC();
    instanciaServicoWebRTC = new ServicoWebRTC(configuracao);
  }
  return instanciaServicoWebRTC;
}
 
// Exporta a função para obter o serviço WebRTC
export { obterServicoWebRTC as servicoWebRTC };
