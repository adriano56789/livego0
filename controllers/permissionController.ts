import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const permissionController = {
    // Obter permissão da câmera do usuário
    getCameraPermission: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.userId;
            const user = await UserModel.findOne({ id: userId }, 'cameraPermission').lean<{
                cameraPermission?: { status: string };
            }>();
            
            if (!user) {
                return sendError(res, 'Usuário não encontrado', 404);
            }
            
            return sendSuccess(res, { 
                status: user?.cameraPermission?.status || 'prompt' 
            });
        } catch (error) {
            console.error('Erro ao obter permissão da câmera:', error);
            next(error);
        }
    },

    // Atualizar permissão da câmera
    updateCameraPermission: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.userId;
            const { status } = req.body;
            
            if (!['granted', 'denied', 'prompt'].includes(status)) {
                return sendError(res, 'Status de permissão inválido', 400);
            }
            
            const updatedUser = await UserModel.findOneAndUpdate(
                { id: userId },
                { 
                    $set: { 
                        'cameraPermission.status': status,
                        'cameraPermission.updatedAt': new Date()
                    } 
                },
                { new: true, upsert: true }
            );
            
            if (!updatedUser) {
                return sendError(res, 'Usuário não encontrado', 404);
            }
            
            return sendSuccess(res, { 
                success: true, 
                status 
            });
        } catch (error) {
            console.error('Erro ao atualizar permissão da câmera:', error);
            next(error);
        }
    },

    // Obter permissão do microfone do usuário
    getMicrophonePermission: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.userId;
            const user = await UserModel.findOne({ id: userId }, 'microphonePermission').lean<{
                microphonePermission?: { status: string };
            }>();
            
            if (!user) {
                return sendError(res, 'Usuário não encontrado', 404);
            }
            
            return sendSuccess(res, { 
                status: user?.microphonePermission?.status || 'prompt' 
            });
        } catch (error) {
            console.error('Erro ao obter permissão do microfone:', error);
            next(error);
        }
    },

    // Atualizar permissão do microfone
    updateMicrophonePermission: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.userId;
            const { status } = req.body;
            
            if (!['granted', 'denied', 'prompt'].includes(status)) {
                return sendError(res, 'Status de permissão inválido', 400);
            }
            
            const updatedUser = await UserModel.findOneAndUpdate(
                { id: userId },
                { 
                    $set: { 
                        'microphonePermission.status': status,
                        'microphonePermission.updatedAt': new Date()
                    } 
                },
                { new: true, upsert: true }
            );
            
            if (!updatedUser) {
                return sendError(res, 'Usuário não encontrado', 404);
            }
            
            return sendSuccess(res, { 
                success: true, 
                status 
            });
        } catch (error) {
            console.error('Erro ao atualizar permissão do microfone:', error);
            next(error);
        }
    }
};
