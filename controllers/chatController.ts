import { Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { ConversationModel } from '../models/Conversation.js';
import { UserModel } from '../models/User.js';
import { MessageModel } from '../models/Message.js';
import { AuthRequest } from '../middleware/auth.js';
import { Server } from 'socket.io';

export const chatController = {
    getConversations: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            
            let conversations = await ConversationModel.find({ 
                participants: userId 
            }).lean();

            if (conversations.length === 0) {
                conversations = [{
                    id: 'conv-support',
                    friend: {
                        id: 'support-livercore',
                        name: 'Suporte LiveGo',
                        avatarUrl: 'https://picsum.photos/seed/support/200',
                        isOnline: true,
                        level: 99
                    },
                    lastMessage: 'Bem-vindo ao LiveGo! Como podemos ajudar?',
                    unreadCount: 1,
                    updatedAt: new Date().toISOString()
                }] as any;
            }

            return sendSuccess(res, conversations);
        } catch (err) {
            return sendSuccess(res, []);
        }
    },

    sendMessageToStream: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { roomId } = req.params;
            const messagePayload = req.body;

            if (!roomId || !messagePayload || !messagePayload.message) {
                return sendError(res, 'Dados da mensagem inválidos.', 400);
            }

            const reqWithIo = req as (AuthRequest & { io: Server });
            const payload = { ...messagePayload, id: Date.now() };

            reqWithIo.io.to(roomId).emit('stream:chat', payload);
            console.log(`[Socket.IO] Sent CHAT message to room ${roomId}`);

            return sendSuccess(res, null, "Mensagem enviada.");
        } catch (error) {
            next(error);
        }
    },

    start: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            return sendSuccess(res, { success: true }, "Conversa iniciada.");
        } catch (error) {
            next(error);
        }
    },

    getFriends: async (req: AuthRequest, res: Response) => {
        try {
            const friends = await UserModel.find({ id: { $ne: req.userId } }).limit(10);
            return sendSuccess(res, friends);
        } catch (err) {
            return sendSuccess(res, []);
        }
    },

    getRanking: async (req: AuthRequest, res: Response) => {
        try {
            const topUsers = await UserModel.find().sort({ diamonds: -1 }).limit(20);
            const formattedRanking = topUsers.map((u, index) => ({
                ...u.toJSON(),
                rank: index + 1,
                value: (Number(u.diamonds) || 0) * 10
            }));
            return sendSuccess(res, formattedRanking);
        } catch (err) {
            return sendSuccess(res, []);
        }
    },

    getStreamMessages: async (req: AuthRequest, res: Response) => {
        try {
            const { roomId } = req.params;
            
            if (!roomId) {
                return sendError(res, 'ID da sala não fornecido', 400);
            }
            
            // Busca as mensagens do banco de dados para a sala específica
            // Ordena por data de criação (mais antigas primeiro) e limita a 100 mensagens
            const messages = await MessageModel.find({ chatId: roomId })
                .sort({ createdAt: 1 }) // Ordena por data de criação (mais antigas primeiro)
                .limit(100) // Limita a 100 mensagens
                .lean();
            
            // Formata as mensagens para o formato esperado pelo frontend
            const formattedMessages = messages.map(msg => ({
                id: msg.id,
                type: 'chat',
                message: msg.text,
                userId: msg.fromUserId,
                timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(),
                // Adicione outros campos necessários aqui
            }));
            
            return sendSuccess(res, formattedMessages);
        } catch (err) {
            console.error('Erro ao buscar mensagens do chat:', err);
            // Em caso de erro, retorna um array vazio para não quebrar o frontend
            return sendSuccess(res, []);
        }
    }
};