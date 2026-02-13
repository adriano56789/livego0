import { Response, NextFunction } from 'express';
import { UserModel } from '../models/User.js';
import { TransactionModel } from '../models/Transaction.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { Request } from 'express';

export const walletController = {
    getBalance: async (req: AuthRequest, res: Response) => {
        try {
            const user: any = await UserModel.findOne({ id: req.userId });
            if (!user) return sendError(res, "Usuário não encontrado", 404);
            
            const earnings = user.earnings || 0;
            return sendSuccess(res, { 
                diamonds: user.diamonds || 0,
                earnings: earnings,
                userEarnings: {
                    available_diamonds: earnings,
                    gross_brl: earnings * 0.05,
                    platform_fee_brl: (earnings * 0.05) * 0.20,
                    net_brl: (earnings * 0.05) * 0.80
                }
            });
        } catch (err: any) {
            return sendError(res, "Erro ao consultar saldo.");
        }
    },

    purchase: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { diamonds, price } = req.body;
            const userId = req.params.userId === 'me' ? req.userId : req.params.userId;

            if (!diamonds || typeof price === 'undefined' || diamonds <= 0 || price < 0) {
                return sendError(res, "Dados de compra inválidos.", 400);
            }

            const user = await UserModel.findOne({ id: userId });
            if (!user) {
                return sendError(res, "Usuário não encontrado.", 404);
            }

            await TransactionModel.create({
                id: `purchase-${Date.now()}`,
                userId: userId,
                type: 'recharge',
                amountDiamonds: diamonds,
                amountBRL: price,
                status: 'completed',
                details: { method: 'confirmed_purchase' }
            });

            const updatedUser = await UserModel.findOneAndUpdate(
                { id: userId }, 
                { $inc: { diamonds: diamonds } }, 
                { new: true } 
            );

            return sendSuccess(res, { success: true, user: updatedUser });
        } catch (error) {
            next(error);
        }
    },

    confirmPurchase: async (req: AuthRequest, res: Response) => {
        try {
            const { details } = req.body;
            const { diamonds } = details;
            const userId = req.userId;

            const pendingTransaction: any = await TransactionModel.findOne({
                userId: userId,
                status: 'pending',
                type: 'recharge',
                amountDiamonds: diamonds
            }).sort({ createdAt: -1 });

            if (!pendingTransaction) {
                return sendError(res, "Nenhuma transação pendente encontrada.", 404);
            }

            pendingTransaction.status = 'completed';
            await pendingTransaction.save();
            
            const updatedUser = await UserModel.findOneAndUpdate(
                { id: userId },
                { $inc: { diamonds: diamonds } },
                { new: true }
            );

            return sendSuccess(res, [{ success: true, transactionId: pendingTransaction.id, user: updatedUser }]);
        } catch (err) {
            console.error("Falha ao confirmar compra:", err);
            return sendError(res, "Falha ao confirmar compra no servidor.");
        }
    },

    cancelPurchase: async (req: AuthRequest, res: Response) => {
        try {
            return sendSuccess(res, { message: "Transação cancelada." });
        } catch (err) {
            return sendError(res, "Erro ao cancelar.");
        }
    },

    calculateWithdrawal: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { amount } = req.body;
            const gross = amount * 0.05;
            const fee = gross * 0.20;
            const net = gross * 0.80;
            return sendSuccess(res, { gross_value: gross, platform_fee: fee, net_value: net });
        } catch (error) {
            next(error);
        }
    },
    
    requestWithdrawal: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            return sendSuccess(res, { success: true, message: 'Solicitação de saque enviada.' });
        } catch (error) {
            next(error);
        }
    },

    updateWithdrawalMethod: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
             const user = await UserModel.findOne({id: req.userId});
            return sendSuccess(res, { success: true, user });
        } catch (error) {
            next(error);
        }
    },

    getPurchaseHistory: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            const requestingUserId = req.userId;
            
            // Check if the requesting user is an admin or the same user
            const isAdmin = req.userRole === 'admin';
            if (!isAdmin && userId !== requestingUserId) {
                return sendError(res, 'Acesso não autorizado', 403);
            }
            
            const targetUserId = isAdmin ? userId : requestingUserId;
            
            const transactions = await TransactionModel.find({
                userId: targetUserId,
                type: 'recharge',
                status: 'completed'
            }).sort({ createdAt: -1 });

            return sendSuccess(res, transactions);
        } catch (error) {
            console.error('Erro ao buscar histórico de compras:', error);
            next(error);
        }
    }
};