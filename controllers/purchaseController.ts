import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';

class PurchaseController {
    async getPurchaseHistory(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            
            // TODO: Replace with actual database query
            const history = [];
            
            return sendSuccess(res, history, 'Purchase history retrieved successfully');
        } catch (error) {
            console.error('Error getting purchase history:', error);
            return sendError(res, 'Failed to retrieve purchase history', 500);
        }
    }
}

export default new PurchaseController();
