import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

const requests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; 
const MAX_REQUESTS_PER_WINDOW = 100; 

export const rateLimiter = (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const ip = (req as any).ip;
    if (!ip) return next();

    const now = Date.now();
    const timestamps = requests.get(ip) || [];
    
    const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

    if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
        console.warn(`[SECURITY] Rate limit excedido para o IP: ${ip}`);
        return sendError(res, 'Muitas requisições. Tente novamente mais tarde.', 429);
    }

    recentTimestamps.push(now);
    requests.set(ip, recentTimestamps);

    next();
};

const suspiciousChars = /[<>{}$]/;

const clean = (obj: any) => {
    for (const key in obj) {
        if (typeof obj[key] === 'string' && suspiciousChars.test(obj[key])) {
            throw new Error('Violação detectada. Tentativa de manipulação do sistema.');
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            clean(obj[key]);
        }
    }
};

export const sanitizeInput = (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
        if ((req as any).body) clean((req as any).body);
        if ((req as any).query) clean((req as any).query);
        if ((req as any).params) clean((req as any).params);
        next();
    } catch (error: any) {
        console.error(`[SECURITY] Payload malicioso detectado do IP: ${(req as any).ip}. Rota: ${(req as any).originalUrl}`, { body: (req as any).body, query: (req as any).query });
        return sendError(res, error.message, 400);
    }
};