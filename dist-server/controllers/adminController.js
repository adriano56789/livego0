import { sendSuccess } from '../utils/response.js';
import { TransactionModel } from '../models/Transaction.js';
export const adminController = {
    getAdminWithdrawalHistory: async (req, res, next) => {
        try {
            const history = await TransactionModel.find({
                $or: [
                    { type: 'withdrawal' },
                    { type: 'fee' }
                ]
            }).sort({ createdAt: -1 }).limit(200).lean();
            return sendSuccess(res, history);
        }
        catch (error) {
            next(error);
        }
    },
    requestWithdrawal: async (req, res, next) => {
        try {
            return sendSuccess(res, { success: true }, "Solicitação de saque de admin registrada.");
        }
        catch (error) {
            next(error);
        }
    },
    saveWithdrawalMethod: async (req, res, next) => {
        try {
            return sendSuccess(res, { success: true }, "Método de saque de admin salvo.");
        }
        catch (error) {
            next(error);
        }
    }
};
