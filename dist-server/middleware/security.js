import { sendError } from '../utils/response.js';
const requests = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 100;
export const rateLimiter = (req, res, next) => {
    const ip = req.ip;
    if (!ip)
        return next();
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
const clean = (obj) => {
    for (const key in obj) {
        if (typeof obj[key] === 'string' && suspiciousChars.test(obj[key])) {
            throw new Error('Violação detectada. Tentativa de manipulação do sistema.');
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            clean(obj[key]);
        }
    }
};
export const sanitizeInput = (req, res, next) => {
    try {
        if (req.body)
            clean(req.body);
        if (req.query)
            clean(req.query);
        if (req.params)
            clean(req.params);
        next();
    }
    catch (error) {
        console.error(`[SECURITY] Payload malicioso detectado do IP: ${req.ip}. Rota: ${req.originalUrl}`, { body: req.body, query: req.query });
        return sendError(res, error.message, 400);
    }
};
