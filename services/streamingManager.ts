import { obterServicoWebRTC } from './webrtcService';

interface StreamingManagerOptions {
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
    onError?: (error: Error) => void;
    onIceCandidate?: (candidate: RTCIceCandidate) => void;
}

export class StreamingManager {
    private webRTCService: any = null;
    private stream: MediaStream | null = null;
    private streamId: string | null = null;
    private options: StreamingManagerOptions;

    constructor(options: StreamingManagerOptions = {}) {
        this.options = options;
    }

    /**
     * Inicia uma transmissão WebRTC para o SRS
     * @param stream Stream de mídia (vídeo/áudio)
     * @param streamId ID único para o stream
     * @returns Promise que resolve quando a transmissão é iniciada
     */
    async startStreaming(stream: MediaStream, streamId: string): Promise<void> {
        try {
            this.stream = stream;
            this.streamId = streamId;
            
            // 1. Obtém a instância do serviço WebRTC
            this.webRTCService = await obterServicoWebRTC();
            
            // 2. Configura os callbacks
            const callbacks = {
                aoEncontrarCandidatoGelo: (candidate: RTCIceCandidate) => {
                    if (this.options.onIceCandidate) {
                        this.options.onIceCandidate(candidate);
                    }
                },
                aoMudarEstadoConexao: (state: RTCPeerConnectionState) => {
                    if (this.options.onConnectionStateChange) {
                        this.options.onConnectionStateChange(state);
                    }
                },
                aoOcorrerErro: (error: Error) => {
                    if (this.options.onError) {
                        this.options.onError(error);
                    }
                    this.cleanup();
                }
            };
            
            // 3. Inicia a publicação do stream
            const streamUrl = `webrtc://live/live/${streamId}`;
            
            console.log(`[StreamingManager] Iniciando transmissão para ${streamUrl}`);
            
            await this.webRTCService.publicar({
                stream,
                urlStream: streamUrl,
                ...callbacks
            });
            
            console.log('[StreamingManager] Transmissão WebRTC iniciada com sucesso');
            
        } catch (error) {
            console.error('[StreamingManager] Erro ao iniciar transmissão:', error);
            this.cleanup();
            throw error;
        }
    }
    
    /**
     * Para a transmissão atual e limpa os recursos
     */
    async stopStreaming(): Promise<void> {
        try {
            if (this.webRTCService) {
                await this.webRTCService.parar();
                this.webRTCService = null;
            }
            
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
            
            this.streamId = null;
            
            console.log('[StreamingManager] Transmissão finalizada e recursos liberados');
            
        } catch (error) {
            console.error('[StreamingManager] Erro ao parar transmissão:', error);
            throw error;
        }
    }
    
    /**
     * Limpa recursos
     */
    private cleanup(): void {
        try {
            this.stopStreaming();
        } catch (error) {
            console.error('[StreamingManager] Erro ao limpar recursos:', error);
        }
    }
    
    /**
     * Obtém o stream de mídia atual
     */
    getCurrentStream(): MediaStream | null {
        return this.stream;
    }
    
    /**
     * Obtém o ID do stream atual
     */
    getCurrentStreamId(): string | null {
        return this.streamId;
    }
    
    /**
     * Verifica se está transmitindo
     */
    isStreaming(): boolean {
        return this.stream !== null && this.streamId !== null;
    }
}

// Exporta uma instância padrão para facilitar o uso
export const streamingManager = new StreamingManager();
