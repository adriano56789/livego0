import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

// Usa a URL do ambiente ou fallback para localhost:3000
const SOCKET_URL = (import.meta as any).env.VITE_WS_URL || 'http://localhost:3000';

// Força o protocolo WebSocket para desenvolvimento local
const WS_URL = SOCKET_URL.replace(/^http/, 'ws');

console.log('[WebSocket] Conectando ao servidor WebSocket em:', WS_URL);

export class WebSocketManager {
    private socket: Socket | null = null;
    private callbacks: Map<string, ((data: any) => void)[]> = new Map();
    private peerConnection: RTCPeerConnection | null = null;

    connect(userId: string) {
        if (this.socket) {
            console.log('[WebSocket] Já existe uma conexão ativa. Reconectando...');
            this.disconnect();
        }
        
        console.log(`[WebSocket] Iniciando conexão com ${WS_URL} para o usuário ${userId}`);
        
        this.socket = io(WS_URL, {
            query: { userId },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            forceNew: true,
            withCredentials: true,
            extraHeaders: {
                'Access-Control-Allow-Origin': '*'
            }
        });

        // Configuração de eventos do socket
        this.socket.on('connect', () => {
            console.log(`[WebSocket] Conectado ao servidor em: ${WS_URL}`, {
                socketId: this.socket?.id,
                userId: userId
            });
            
            // Força a reconexão se o socket for desconectado inesperadamente
            this.socket?.on('disconnect', (reason) => {
                console.log(`[WebSocket] Desconectado: ${reason}`);
                if (reason === 'io server disconnect' || reason === 'io client disconnect') {
                    console.log('[WebSocket] Tentando reconectar...');
                    setTimeout(() => this.connect(userId), 1000);
                }
            });
            
            this.socket?.on('connect_error', (error) => {
                console.error('[WebSocket] Erro de conexão:', error.message);
            });
            
            this.socket?.on('error', (error) => {
                console.error('[WebSocket] Erro no socket:', error);
            });
        });
        
        // Encaminha todos os eventos para os handlers registrados
        this.socket.onAny((event: string, data: any) => {
            console.log(`[WebSocket] Evento recebido: ${event}`, data);
            this.triggerHandlers(event, data);
        });
    }

    // Helper para o modo Mock disparar eventos como se viessem do socket real
    emitSimulatedEvent(event: string, data: any) {
        this.triggerHandlers(event, data);
    }

    private triggerHandlers(event: string, data: any) {
        const handlers = this.callbacks.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.stopStreaming();
    }

    emit(event: string, data: any) {
        if (this.socket && this.socket.connected) {
            this.socket.emit(event, data);
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.callbacks.has(event)) this.callbacks.set(event, []);
        this.callbacks.get(event)!.push(callback);
    }

    off(event: string, callback: (data: any) => void) {
        const handlers = this.callbacks.get(event);
        if (handlers) this.callbacks.set(event, handlers.filter(h => h !== callback));
    }

    async startStreaming(stream: MediaStream, streamUrl: string): Promise<void> {
        if (this.peerConnection) {
            console.warn("[WebRTC] Streaming já está ativo. Parando o anterior primeiro.");
            this.stopStreaming();
        }

        console.log("[WebRTC] Iniciando streaming para", streamUrl);
        console.log("[WebRTC] Stream tracks:", stream.getTracks().map(t => ({
            kind: t.kind,
            id: t.id,
            label: t.label,
            enabled: t.enabled,
            muted: t.muted,
            readyState: t.readyState
        })));

        try {
            // Configuração usando servidor TURN/STUN personalizado
            const config: RTCConfiguration = {
                iceServers: [
                    {
                        urls: [
                            'stun:72.60.249.175:3478',
                            'turn:72.60.249.175:3478'
                        ],
                        username: 'livego',
                        credential: 'adriano123'
                    }
                ],
                iceTransportPolicy: 'all',
                iceCandidatePoolSize: 10,
                bundlePolicy: 'max-bundle',
                rtcpMuxPolicy: 'require'
            };

            console.log('[WebRTC] Configuração ICE:', JSON.stringify(config, null, 2));
            this.peerConnection = new RTCPeerConnection(config);

            // Logs de diagnóstico
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('[WebRTC] Candidato ICE encontrado:', event.candidate.candidate);
                } else {
                    console.log('[WebRTC] Todos os candidatos ICE foram coletados');
                }
            };

            this.peerConnection.oniceconnectionstatechange = () => {
                console.log(`[WebRTC] Estado da conexão ICE: ${this.peerConnection?.iceConnectionState}`);
            };

            this.peerConnection.onicegatheringstatechange = () => {
                console.log(`[WebRTC] Estado de coleta ICE: ${this.peerConnection?.iceGatheringState}`);
            };

            this.peerConnection.onsignalingstatechange = () => {
                console.log(`[WebRTC] Estado de sinalização: ${this.peerConnection?.signalingState}`);
            };

            this.peerConnection.onconnectionstatechange = () => {
                const state = this.peerConnection?.connectionState;
                console.log(`[WebRTC] Estado da conexão: ${state}`);
                
                if (state === 'connected') {
                    console.log('[WebRTC] Conexão WebRTC estabelecida com sucesso!');
                    // Dispara evento de início de transmissão
                    this.emit('stream:ready', { 
                        streamUrl: streamUrl,
                        timestamp: new Date().toISOString() 
                    });
                } else if (state === 'failed' || state === 'disconnected' || state === 'closed') {
                    this.stopStreaming();
                }
            };

            // Verifica as tracks de mídia
            console.log('[WebRTC] Tracks de mídia disponíveis:', {
                videoTracks: stream.getVideoTracks().map(t => ({
                    id: t.id,
                    enabled: t.enabled,
                    readyState: t.readyState,
                    settings: t.getSettings()
                })),
                audioTracks: stream.getAudioTracks().map(t => ({
                    id: t.id,
                    enabled: t.enabled,
                    readyState: t.readyState
                }))
            });

            stream.getTracks().forEach(track => {
                this.peerConnection!.addTrack(track, stream);
            });
            console.log("[WebRTC] Tracks de mídia adicionadas.");

            const offer = await this.peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            console.log('[WebRTC] Oferta SDP criada:', offer.sdp);
            await this.peerConnection.setLocalDescription(offer);
            console.log('[WebRTC] Descrição local definida com sucesso');

            // Usa o servidor SRS local na porta 19850 conforme configurado no docker-compose
            const srsApiUrl = (import.meta as any).env.VITE_SRS_API_URL || 'http://localhost:19850';
            const publishUrl = `${srsApiUrl}/rtc/v1/publish/`;
            console.log('[WebRTC] Usando SRS em:', srsApiUrl);

            console.log('[WebRTC] Enviando SDP Offer para SRS:', publishUrl);
            console.log('[WebRTC] Stream URL:', streamUrl);

            const payload = {
                api: publishUrl,
                streamurl: streamUrl,
                sdp: offer.sdp || ''
            };

            console.log('[WebRTC] Payload da requisição:', JSON.stringify({
                ...payload,
                sdp: payload.sdp ? '*** SDP OCULTADO ***' : 'vazio'
            }));

            try {
                const response = await fetch(publishUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                console.log('[WebRTC] Resposta do servidor SRS:', {
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('[WebRTC] Erro na resposta do SRS:', errorText);
                    throw new Error(`SRS retornou erro ${response.status}: ${errorText}`);
                }

                const responseData = await response.json();
                console.log('[WebRTC] Resposta SRS:', responseData);
                
                if (responseData.code !== 0) {
                    throw new Error(`SRS API Error: ${responseData.code} - ${JSON.stringify(responseData)}`);
                }

                if (!responseData.sdp) {
                    throw new Error("SRS não retornou uma resposta SDP válida.");
                }

                const answerSdp = responseData.sdp;
                console.log('[WebRTC] Resposta SDP do SRS recebida:', answerSdp);

                await this.peerConnection.setRemoteDescription(
                    new RTCSessionDescription({ type: 'answer', sdp: answerSdp })
                );
                console.log('[WebRTC] Descrição remota definida com sucesso');

            } catch (error) {
                console.error('[WebRTC] Erro na requisição para SRS:', {
                    error: error.message,
                    url: publishUrl,
                    timestamp: new Date().toISOString()
                });
                throw error;
            }

        } catch (error) {
            console.error("[WebRTC] Falha ao iniciar streaming:", error);
            this.stopStreaming();
            throw error;
        }
    }

    stopStreaming() {
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
            console.log("[WebRTC] Conexão de streaming encerrada.");
        }
    }
}

export const webSocketManager = new WebSocketManager();