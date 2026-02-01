import { StreamerModel } from '../models/Streamer.js';
const SRS_SUCCESS = '0';
export const srsWebhookController = {
    onPublish: async (req, res) => {
        const { stream, client_id } = req.body;
        console.log(`[SRS-HOOK] on_publish recebido para stream: ${stream} (Client: ${client_id})`);
        try {
            const updatedStream = await StreamerModel.findOneAndUpdate({ id: stream }, {
                isLive: true,
                startedAt: new Date().toISOString()
            }, { new: true });
            if (updatedStream) {
                const io = req.io;
                io.to(stream).emit('stream:status', {
                    streamId: stream,
                    status: 'online',
                    startedAt: updatedStream.startedAt
                });
                io.emit('stream:global_update', { id: stream, isLive: true });
                console.log(`[SRS-HOOK] Stream ${stream} marcada como ONLINE.`);
            }
            else {
                console.warn(`[SRS-HOOK] Stream ${stream} não encontrada no banco.`);
            }
        }
        catch (error) {
            console.error(`[SRS-HOOK] Erro ao processar on_publish:`, error);
        }
        return res.send(SRS_SUCCESS);
    },
    onUnpublish: async (req, res) => {
        const { stream } = req.body;
        console.log(`[SRS-HOOK] on_unpublish recebido para stream: ${stream}`);
        try {
            await StreamerModel.findOneAndUpdate({ id: stream }, { isLive: false });
            const io = req.io;
            io.to(stream).emit('stream:status', {
                streamId: stream,
                status: 'offline'
            });
            io.emit('stream:global_update', { id: stream, isLive: false });
        }
        catch (error) {
            console.error(`[SRS-HOOK] Erro ao processar on_unpublish:`, error);
        }
        return res.send(SRS_SUCCESS);
    },
    onConnect: (req, res) => res.send(SRS_SUCCESS),
    onClose: (req, res) => res.send(SRS_SUCCESS),
    onPlay: (req, res) => res.send(SRS_SUCCESS),
    onStop: (req, res) => res.send(SRS_SUCCESS),
    onDvr: (req, res) => res.send(SRS_SUCCESS),
};
