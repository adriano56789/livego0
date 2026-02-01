import { StreamerModel } from '../models/Streamer.js';
import { UserModel } from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
const genericSuccess = (req, res, next) => {
    try {
        return sendSuccess(res, { success: true });
    }
    catch (error) {
        next(error);
    }
};
export const streamController = {
    listByCategory: async (req, res) => {
        try {
            const { category } = req.params;
            const query = { isLive: true };
            if (category !== 'popular') {
                query.category = category;
            }
            const streams = await StreamerModel.find(query).sort({ viewers: -1 });
            return sendSuccess(res, streams);
        }
        catch (err) {
            return sendError(res, "Erro ao buscar lives do banco: " + err.message, 500);
        }
    },
    create: async (req, res) => {
        try {
            // Check if user already has a live stream and close it
            await StreamerModel.updateMany({ hostId: req.userId, isLive: true }, { isLive: false });
            const stream = await StreamerModel.create({
                ...req.body,
                hostId: req.userId,
                // If ID is not provided, generate one. GoLiveScreen usually provides one.
                id: req.body.id || `live-${Date.now()}`,
                viewers: 0,
                isLive: false, // Created but not yet "Broadcasting" until startBroadcast is called
            });
            return sendSuccess(res, stream, "Stream record created", 201);
        }
        catch (err) {
            return sendError(res, "Erro ao registrar live no banco: " + err.message, 500);
        }
    },
    startBroadcast: async (req, res, next) => {
        const { streamId } = req.body;
        console.log(`[BROADCAST] Starting broadcast for stream: ${streamId}`);
        try {
            const updatedStream = await StreamerModel.findOneAndUpdate({ id: streamId }, {
                isLive: true,
                startedAt: new Date(),
                viewers: 1
            }, { new: true });
            if (!updatedStream) {
                return sendError(res, "Stream não encontrada.", 404);
            }
            // Notify all clients via WebSocket
            const reqWithIo = req;
            reqWithIo.io.emit('stream:started', updatedStream);
            return sendSuccess(res, { success: true, stream: updatedStream, message: "Broadcast iniciado com sucesso." });
        }
        catch (error) {
            console.error(`[BROADCAST-ERROR] Falha ao iniciar broadcast:`, error);
            next(error);
        }
    },
    stopBroadcast: async (req, res, next) => {
        const { streamId } = req.body;
        console.log(`[BROADCAST] Stopping broadcast for stream: ${streamId}`);
        try {
            const updatedStream = await StreamerModel.findOneAndUpdate({ id: streamId }, { isLive: false }, { new: true });
            if (!updatedStream) {
                return sendError(res, "Stream não encontrada.", 404);
            }
            // Notify all clients via WebSocket
            const reqWithIo = req;
            reqWithIo.io.emit('stream:ended', { streamId });
            reqWithIo.io.to(streamId).emit('stream:status', { status: 'offline' });
            return sendSuccess(res, { success: true, message: "Broadcast encerrado." });
        }
        catch (error) {
            next(error);
        }
    },
    deleteById: async (req, res, next) => {
        try {
            await StreamerModel.findOneAndUpdate({ id: req.params.id }, { isLive: false, viewers: 0 });
            return sendSuccess(res, { success: true });
        }
        catch (error) {
            next(error);
        }
    },
    getSession: async (req, res, next) => {
        try {
            const { streamId } = req.params;
            const stream = await StreamerModel.findOne({ id: streamId }).lean();
            if (!stream)
                return sendError(res, "Stream não encontrada", 404);
            const sessionData = {
                viewers: stream.viewers || 0,
                peakViewers: stream.viewers || 0,
                coins: 0,
                followers: 0,
                startTime: stream.createdAt?.getTime() || Date.now(),
            };
            return sendSuccess(res, sessionData);
        }
        catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => genericSuccess(req, res, next),
    updateVideoQuality: async (req, res, next) => genericSuccess(req, res, next),
    search: async (req, res, next) => {
        try {
            const streams = await StreamerModel.find({ isLive: true }).limit(5);
            return sendSuccess(res, streams);
        }
        catch (error) {
            next(error);
        }
    },
    getCategories: async (req, res, next) => {
        try {
            const categories = [
                { id: 'popular', label: 'Popular' }, { id: 'music', label: 'Música' },
                { id: 'dance', label: 'Dança' }, { id: 'pk', label: 'PK' }
            ];
            return sendSuccess(res, categories);
        }
        catch (error) {
            next(error);
        }
    },
    getGiftDonors: async (req, res, next) => {
        try {
            const donors = await UserModel.find().sort({ diamonds: -1 }).limit(10);
            return sendSuccess(res, donors);
        }
        catch (error) {
            next(error);
        }
    },
    inviteToPrivateRoom: async (req, res, next) => genericSuccess(req, res, next),
    inviteFriendForCoHost: async (req, res, next) => genericSuccess(req, res, next),
    kickUser: async (req, res, next) => genericSuccess(req, res, next),
    makeModerator: async (req, res, next) => genericSuccess(req, res, next),
    toggleMicrophone: async (req, res, next) => genericSuccess(req, res, next),
    toggleStreamSound: async (req, res, next) => genericSuccess(req, res, next),
    toggleAutoFollow: async (req, res, next) => genericSuccess(req, res, next),
    toggleAutoPrivateInvite: async (req, res, next) => genericSuccess(req, res, next),
    getBeautySettings: async (req, res, next) => {
        try {
            const settings = {
                tabs: [{ id: 'basic', label: 'Básico' }, { id: 'filters', label: 'Filtros' }],
                effects: {
                    basic: [{ id: 'smooth', label: 'Suavizar', icon: 'FaceSmoothIcon', defaultValue: 50 }, { id: 'whiten', label: 'Clarear', icon: 'SunIcon', defaultValue: 30 }, { id: 'none', label: 'Nenhum', icon: 'BanIcon', defaultValue: 0 }],
                    filters: [{ id: 'vintage', label: 'Vintage', image: 'https://picsum.photos/seed/vintage/100' }],
                },
                slider: { label: 'Intensidade' },
                actions: [{ id: 'save', label: 'Salvar' }, { id: 'reset', label: 'Resetar' }]
            };
            return sendSuccess(res, settings);
        }
        catch (error) {
            next(error);
        }
    },
    saveBeautySettings: async (req, res, next) => genericSuccess(req, res, next),
    resetBeautySettings: async (req, res, next) => genericSuccess(req, res, next),
    applyBeautyEffect: async (req, res, next) => genericSuccess(req, res, next),
    logBeautyTabClick: async (req, res, next) => genericSuccess(req, res, next),
};
