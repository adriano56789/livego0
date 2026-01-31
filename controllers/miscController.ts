import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

export const miscController = {
    translate: async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const { text } = (req as any).body;
            if (!text) {
                return sendError(res, "O campo 'text' é obrigatório.", 400);
            }
            return sendSuccess(res, { translatedText: `(Traduzido) ${text}` });
        } catch (error) {
            next(error);
        }
    }
};