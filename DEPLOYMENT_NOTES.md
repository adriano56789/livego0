# Guia de Implantação e Configuração de Servidores (SRS - WebRTC)

Este documento detalha os passos de infraestrutura necessários para configurar o servidor SRS para um ambiente de produção robusto e seguro, focado em WebRTC.

---

## 1. Configuração do Servidor SRS (`srs.conf`)

O SRS atuará como nosso servidor principal de WebRTC, tanto para ingest (entrada de publishers) quanto para egress (saída para viewers).

### 1.1. Habilitar a API HTTP com Autenticação

Nosso backend precisa se comunicar com o SRS para gerenciá-lo.

```
http_api {
    enabled         on;
    listen          1985;
    
    # Adicione esta linha para proteger a API
    auth_token      your_srs_api_token_here;
}
```

-   **Ação:** Copie o valor de `auth_token` e cole na variável `SRS_API_TOKEN` no arquivo `.env` do projeto.

### 1.2. Habilitar o Ingest e Egress WebRTC

A configuração principal é garantir que o SRS aceite publicações WebRTC e as distribua também por WebRTC.

```
vhost __defaultVhost__ {
    # Habilita a reprodução via WebRTC
    rtc {
        enabled on;
        # Converte RTMP para WebRTC (se necessário no futuro)
        rtmp_to_rtc on;
        # Habilita a conversão de WebRTC para RTMP (útil para gravação ou outros fluxos)
        rtc_to_rtmp on;
    }

    # Habilita a reprodução via HTTP-FLV como fallback
    http_remux {
        enabled     on;
        mount       [vhost]/[app]/[stream].flv;
    }
}
```
- **Nota:** A configuração `rtmp_to_rtc` permite que você envie um stream RTMP para o SRS e ele o converterá para WebRTC para os espectadores. `rtc_to_rtmp` faz o inverso. Ambas são úteis para flexibilidade.

### 1.3. Configuração de Rede do SRS

É crucial que o SRS anuncie o IP público correto para os clientes WebRTC.

```
rtc_server {
    enabled on;
    listen 8000; # Porta UDP para WebRTC
    # Substitua pelo IP público da sua VPS
    candidate 72.60.249.175;
}
```
- **Ação:** Certifique-se de que o IP no campo `candidate` é o IP público da sua máquina.

---

## 2. Integração: Frontend -> SRS (WebRTC)

Com o LiveKit removido, a integração agora é direta entre o cliente (navegador do streamer) e o servidor SRS.

### Lógica da Aplicação (Fluxo Esperado)

1.  **Frontend (`GoLiveScreen.tsx`):**
    *   O streamer clica em "Iniciar Transmissão".
    *   O frontend captura a câmera e o microfone do usuário (`getUserMedia`).
    *   O frontend usa a API nativa de WebRTC (`RTCPeerConnection`) para negociar uma conexão com o SRS.
    *   **Importante:** A URL para publicação no SRS geralmente se parece com `webrtc://seu-servidor/live/stream_name`. O frontend fará uma requisição `POST` para a API HTTP do SRS (ex: `http://seu-servidor:1985/rtc/v1/publish/`) com a oferta SDP para iniciar a publicação.
    *   Após a negociação bem-sucedida, o stream é enviado para o SRS.

2.  **Backend (`streamController.ts`):**
    *   A rota `/api/streams/start-broadcast` não é mais responsável por iniciar o Egress do LiveKit. Agora, ela pode ser usada simplesmente para registrar que uma nova live começou, salvar informações no banco de dados e notificar outros usuários via WebSocket.

-   **Ação Futura:** A implementação do cliente WebRTC no frontend para se comunicar com a API do SRS é o próximo passo. Isso envolve a criação de um `RTCPeerConnection`, manipulação de ofertas/respostas SDP e candidatos ICE.

---

## 3. Configuração do Nginx (Proxy Reverso)

A configuração em `nginx/default.conf` está simplificada.

-   **WebSockets:** As diretivas para `/socket.io/` continuam essenciais para o chat em tempo real.
-   **Rotas de Mídia SRS:** A rota `location ~ ^/(live|hls)/` faz proxy para o servidor HTTP do SRS, permitindo a reprodução de streams em formatos como HLS ou HTTP-FLV.
-   **Ação:** Use o Certbot para gerar certificados SSL e descomente o bloco `server { listen 443 ssl; ... }` no arquivo de configuração do Nginx, garantindo que todo o tráfego seja seguro. Isso é **obrigatório** para o WebRTC funcionar corretamente nos navegadores.

Com estes passos, a infraestrutura está 100% focada no SRS, pronta para uma plataforma de streaming moderna e baseada em WebRTC.