import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { api } from './api';

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

        try {
            this.peerConnection = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    {
                        urls: 'turn:72.60.249.175:3478',
                        username: 'livego',
                        credential: 'LiveGoSuperSecretPasswordForTURN'
                    }
                ]
            });

            this.peerConnection.onconnectionstatechange = () => {
                 console.log(`[WebRTC] Estado da conexão: ${this.peerConnection?.connectionState}`);
                 if (this.peerConnection?.connectionState === 'failed' || this.peerConnection?.connectionState === 'disconnected' || this.peerConnection?.connectionState === 'closed') {
                    this.stopStreaming();
                 }
            };

            stream.getTracks().forEach(track => {
                this.peerConnection!.addTrack(track, stream);
            });
            console.log("[WebRTC] Tracks de mídia adicionadas.");

            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            console.log("[WebRTC] Oferta SDP criada.");

            const { sdp: answerSdp } = await api.srs.rtcPublish(offer.sdp!, streamUrl);

            if (!answerSdp) {
                throw new Error("SRS não retornou uma resposta SDP válida.");
            }
            
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answerSdp }));
            console.log("[WebRTC] Resposta SDP do SRS recebida.");

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