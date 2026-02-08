import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

const SOCKET_URL = (import.meta as any).env.VITE_WS_URL;

export class WebSocketManager {
    private socket: Socket | null = null;
    private callbacks: Map<string, ((data: any) => void)[]> = new Map();
    private peerConnection: RTCPeerConnection | null = null;

    connect(userId: string) {
        if (this.socket) return;
        this.socket = io(SOCKET_URL, {
            query: { userId },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5
        });

        this.socket.on('connect', () => console.log(`[WS] Conectado ao Servidor em: ${SOCKET_URL}`));
        this.socket.onAny((event: string, data: any) => {
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

            // Usa o servidor SRS local
            const srsApiUrl = (import.meta as any).env.VITE_SRS_API_URL || 'http://localhost:1985';
            const publishUrl = `${srsApiUrl}/rtc/v1/publish/`;
            console.log('[WebRTC] Usando SRS em:', srsApiUrl);

            console.log('[WebRTC] Enviando SDP Offer para SRS:', publishUrl);

            const payload = {
                api: publishUrl,
                streamurl: streamUrl,
                sdp: offer.sdp || ''
            };

            const response = await fetch(publishUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`SRS retornou erro ${response.status}: ${errorText}`);
            }

            const responseData = await response.json();

            if (responseData.code !== 0) {
                throw new Error(`SRS API Error Code ${responseData.code}: ${JSON.stringify(responseData)}`);
            }

            if (!responseData.sdp) {
                throw new Error("SRS não retornou uma resposta SDP válida.");
            }

            const answerSdp = responseData.sdp;
            console.log('[WebRTC] Resposta SDP do SRS recebida:', answerSdp);

            try {
                await this.peerConnection.setRemoteDescription(
                    new RTCSessionDescription({ type: 'answer', sdp: answerSdp })
                );
                console.log('[WebRTC] Descrição remota definida com sucesso');
            } catch (error) {
                console.error('[WebRTC] Erro ao definir descrição remota:', error);
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