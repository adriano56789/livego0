
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { StreamerModel } from '../models/Streamer.js';
import { Server } from 'socket.io';

const SRS_SUCCESS = '0';

export const srsWebhookController = {
    onPublish: async (req: ExpressRequest, res: ExpressResponse) => {
        const { stream, client_id } = (req as any).body;
        
        console.log(`[SRS-HOOK] on_publish recebido para stream: ${stream} (Client: ${client_id})`);

        try {
            const updatedStream = await StreamerModel.findOneAndUpdate(
                { id: stream },
                { 
                    isLive: true, 
                    startedAt: new Date().toISOString() 
                },
                { new: true }
            );

            if (updatedStream) {
                const io = (req as any).io as Server;
                
                io.to(stream).emit('stream:status', { 
                    streamId: stream,
                    status: 'online',
                    startedAt: (updatedStream as any).startedAt
                });
                
                io.emit('stream:global_update', { id: stream, isLive: true });
                
                console.log(`[SRS-HOOK] Stream ${stream} marcada como ONLINE.`);
            } else {
                console.warn(`[SRS-HOOK] Stream ${stream} não encontrada no banco.`);
            }

        } catch (error) {
            console.error(`[SRS-HOOK] Erro ao processar on_publish:`, error);
        }

        return (res as any).send(SRS_SUCCESS);
    },

    onUnpublish: async (req: ExpressRequest, res: ExpressResponse) => {
        const { stream } = (req as any).body;
        console.log(`[SRS-HOOK] on_unpublish recebido para stream: ${stream}`);

        try {
            await StreamerModel.findOneAndUpdate(
                { id: stream },
                { isLive: false }
            );

            const io = (req as any).io as Server;
            
            io.to(stream).emit('stream:status', { 
                streamId: stream, 
                status: 'offline' 
            });
            
            io.emit('stream:global_update', { id: stream, isLive: false });

        } catch (error) {
            console.error(`[SRS-HOOK] Erro ao processar on_unpublish:`, error);
        }

        return (res as any).send(SRS_SUCCESS);
    },

    onConnect: (req: ExpressRequest, res: ExpressResponse) => (res as any).send(SRS_SUCCESS),
    onClose: (req: ExpressRequest, res: ExpressResponse) => (res as any).send(SRS_SUCCESS),
    onPlay: (req: ExpressRequest, res: ExpressResponse) => (res as any).send(SRS_SUCCESS),
    onStop: (req: ExpressRequest, res: ExpressResponse) => (res as any).send(SRS_SUCCESS),
    onDvr: (req: ExpressRequest, res: ExpressResponse) => (res as any).send(SRS_SUCCESS),
};