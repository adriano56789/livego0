
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { srsService } from '../services/srsService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { UserModel } from '../models/User.js';
import { StreamerModel } from '../models/Streamer.js';
import { SessaoStreamModel } from '../models/SessaoStream.js';

export const srsController = {
    // --- WebRTC Signaling ---
    
    rtcPublish: async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        let sessao;
        try {
            const { sdp, streamUrl, metadata = {} } = (req as any).body;
            const userId = (req as AuthRequest).userId;

            if (!userId) {
                return sendError(res, "Não autenticado.", 401);
            }

            if (!sdp || !streamUrl) {
                return sendError(res, "SDP e StreamURL são obrigatórios.", 400);
            }

            // Validação de segurança: Garante que a URL da stream pertence ao usuário logado.
            // O padrão da URL no frontend é: .../live/{userId}_{timestamp}
            if (!streamUrl.includes(userId)) {
                console.warn(`[SECURITY] Usuário ${userId} tentou publicar na streamUrl: ${streamUrl}`);
                return sendError(res, "Você não tem permissão para publicar nesta Stream URL.", 403);
            }

            // Salvar a sessão de stream no banco de dados
            const sessao = await SessaoStreamModel.create({
                idUsuario: userId,
                urlStream: streamUrl,
                sdp,
                status: 'ativo',
                metadados: {
                    userAgent: req.headers['user-agent'],
                    ip: req.ip,
                    ...metadata
                }
            });

            const resultado = await srsService.rtcPublish(sdp, streamUrl);
            
            // Atualizar a sessão com o ID da sessão do SRS
            sessao.idSessao = resultado.sessionId;
            await sessao.save();

            return sendSuccess(res, {
                ...resultado,
                sessaoId: sessao._id.toString()
            });
        } catch (error) {
            next(error);
        }
    },

    trickleIce: async (req: ExpressRequest, res: ExpressResponse) => {
        // SRS geralmente não usa Trickle ICE via HTTP API padrão, 
        // ele espera o SDP completo. Se necessário, implementar lógica específica.
        return sendSuccess(res, { success: true, warning: "Trickle ignorado (SRS usa Full SDP)" });
    },

    // --- Gerenciamento ---

    getSummaries: async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const data = await srsService.getSummaries();
            return sendSuccess(res, data);
        } catch (error) {
            next(error);
        }
    },

    getStreams: async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const streams = await srsService.getStreams();
            return sendSuccess(res, streams);
        } catch (error) {
            next(error);
        }
    },

    getClients: async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const clients = await srsService.getClients();
            return sendSuccess(res, clients);
        } catch (error) {
            next(error);
        }
    },

    deleteConnectionById: async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const { id } = (req as any).params; // ID do cliente SRS
            const userId = (req as AuthRequest).userId;

            if (!userId) {
                return sendError(res, "Não autenticado.", 401);
            }

            const currentUser = await UserModel.findOne({ id: userId });
            if (!currentUser) {
                return sendError(res, "Usuário não encontrado.", 404);
            }

            // 1. Se for Admin (Nível 99), permite o kick imediatamente
            if ((currentUser as any).level >= 99) {
                await srsService.kickClient(id);
                return sendSuccess(res, { success: true, message: `Cliente ${id} desconectado por Admin.` });
            }

            // 2. Se não for Admin, verifica se é o dono da Stream
            try {
                // Busca detalhes do cliente no SRS para saber qual stream ele está assistindo/publicando
                const clientData = await srsService.getClient(id);
                
                if (!clientData || !clientData.stream) {
                    return sendError(res, "Cliente não encontrado ou sem stream associada.", 404);
                }

                // O campo 'stream' no SRS geralmente é o ID da nossa stream (ex: 'user123_17000000')
                const streamId = clientData.stream;
                
                // Busca a stream no nosso banco para ver quem é o hostId
                const streamInfo = await StreamerModel.findOne({ id: streamId });

                if (streamInfo && streamInfo.hostId === userId) {
                    await srsService.kickClient(id);
                    return sendSuccess(res, { success: true, message: `Cliente ${id} desconectado pelo Broadcaster.` });
                } else {
                    return sendError(res, "Você não tem permissão para desconectar este cliente.", 403);
                }

            } catch (err) {
                console.error("Erro ao verificar propriedade da stream para kick:", err);
                return sendError(res, "Não foi possível verificar as permissões da stream.", 500);
            }

        } catch (error) {
            next(error);
        }
    },

    // --- Métodos de Proxy "Legado" ou Somente Leitura ---
    
    getVersions: async (req: ExpressRequest, res: ExpressResponse) => sendSuccess(res, { version: "SRS/5.0 via LiveGo Service" }),
    getFeatures: async (req: ExpressRequest, res: ExpressResponse) => sendSuccess(res, { features: "rtc, rtmp, hls" }),
    
    // Agora implementamos o getClientById parcialmente para uso interno se necessário, ou via service
    getClientById: async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const { id } = (req as any).params;
            const client = await srsService.getClient(id);
            return sendSuccess(res, client);
        } catch (error) {
            next(error);
        }
    },

    // Stubs para métodos não prioritários no momento
    getStreamById: (req: ExpressRequest, res: ExpressResponse) => sendError(res, "Not implemented via Service layer yet", 501),
    deleteStreamById: (req: ExpressRequest, res: ExpressResponse) => sendError(res, "Use deleteConnectionById to stop streams", 501),
    getConnections: (req: ExpressRequest, res: ExpressResponse) => sendError(res, "Use getClients instead", 501),
    getConnectionById: (req: ExpressRequest, res: ExpressResponse) => sendError(res, "Not implemented via Service layer yet", 501),
    getConfigs: (req: ExpressRequest, res: ExpressResponse) => sendError(res, "Protected", 403),
    updateConfigs: (req: ExpressRequest, res: ExpressResponse) => sendError(res, "Protected", 403),
    getVhosts: (req: ExpressRequest, res: ExpressResponse) => sendError(res, "Protected", 403),
    getVhostById: (req: ExpressRequest, res: ExpressResponse) => sendError(res, "Protected", 403),
    getRequests: (req: ExpressRequest, res: ExpressResponse) => sendError(res, "Protected", 403),
    getSessions: (req: ExpressRequest, res: ExpressResponse) => sendError(res, "Protected", 403),
    getMetrics: (req: ExpressRequest, res: ExpressResponse) => sendError(res, "Protected", 403),
};
