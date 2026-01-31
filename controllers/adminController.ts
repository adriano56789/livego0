import { Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { TransactionModel } from '../models/Transaction.js';

export const adminController = {
    getAdminWithdrawalHistory: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const history = await TransactionModel.find({
                $or: [
                    { type: 'withdrawal' },
                    { type: 'fee' }
                ]
            }).sort({ createdAt: -1 }).limit(200).lean();

            return sendSuccess(res, history);
        } catch (error) {
            next(error);
        }
    },
    requestWithdrawal: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            return sendSuccess(res, { success: true }, "Solicitação de saque de admin registrada.");
        } catch (error) {
            next(error);
        }
    },
    saveWithdrawalMethod: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            return sendSuccess(res, { success: true }, "Método de saque de admin salvo.");
        } catch (error) {
            next(error);
        }
    }
};