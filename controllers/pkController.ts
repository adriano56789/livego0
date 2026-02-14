import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';

class PKController {
    async getConfig(req: Request, res: Response) {
        try {
            const config = {
                enabled: true,
                minDiamonds: 10,
                maxDuration: 300, // 5 minutes in seconds
                coolDown: 60, // 1 minute cooldown between PKs
                rewardMultiplier: 1.5,
                maxParticipants: 2
            };
            
            return sendSuccess(res, config, 'PK configuration retrieved successfully');
        } catch (error) {
            console.error('Error getting PK config:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to retrieve PK configuration' 
            });
        }
    }
}

export default new PKController();
