import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/settings.js';

export interface AuthRequest extends ExpressRequest {
    userId?: string;
    userRole?: string;
    headers: any;
    body: any;
    params: any;
    query: any;
}

export const authMiddleware = (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    const authHeader = (req as any).headers.authorization;

    if (!authHeader) {
        return (res as any).status(401).json({ error: "Token de acesso não fornecido." });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
        req.userId = decoded.userId;
        return next();
    } catch (err) {
        return (res as any).status(401).json({ error: "Token inválido ou expirado." });
    }
};