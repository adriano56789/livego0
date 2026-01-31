import { Response as ExpressResponse } from 'express';

export const sendSuccess = (res: ExpressResponse, data: any = null, message?: string, status = 200) => {
    return (res as any).status(status).json({
        success: true,
        data,
        message,
        timestamp: new Date().toISOString()
    });
};

export const sendError = (res: ExpressResponse, message: string = 'Erro interno no servidor', status = 500, details?: any) => {
    return (res as any).status(status).json({
        success: false,
        error: message,
        details: details || null,
        timestamp: new Date().toISOString()
    });
};