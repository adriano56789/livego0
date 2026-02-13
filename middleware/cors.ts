import { Request, Response, NextFunction } from 'express';

// Forçar ambiente de desenvolvimento para garantir que o CORS funcione localmente
const isDevelopment = true; // Forçar modo de desenvolvimento
const isTesting = false;
const isProduction = false;

console.log(`[CORS] Ambiente: ${isDevelopment ? 'desenvolvimento' : 'produção'}`);

// Configurações de origens permitidas
const ENV_CONFIG = {
  development: {
    allowedOrigins: [
      // URLs locais
      'http://localhost:*',
      'http://127.0.0.1:*',
      'http://0.0.0.0:*',
      'http://[::1]:*',
      'https://localhost:*',
      'https://127.0.0.1:*',
      'https://0.0.0.0:*',
      'https://[::1]:*',
      
      // Frontend local
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      
      // Domínios de produção
      'https://livego.store',
      'https://www.livego.store',
      'https://api.livego.store',
      
      // Outros IPs/portas
      'http://72.60.249.175:5173',
      'http://72.60.249.175:3000',
      'https://72.60.249.175:5173',
      'https://72.60.249.175:3000'
    ]
  },
  test: {
    allowedOrigins: [
      'http://test.localhost',
      'https://test.livego.store',
      'http://localhost:3001',
      'http://localhost:3002'
    ]
  },
  production: {
    allowedOrigins: [
      'https://livego.store',
      'https://www.livego.store',
      'https://api.livego.store',
      'http://localhost:3000' // For local development with production build
    ]
  }
};

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin || '';
    console.log(`[CORS] Request from origin: ${origin}`);
    
    // Get allowed origins based on environment
    let allowedOrigins: string[] = [];
    
    if (isDevelopment) {
        allowedOrigins = ENV_CONFIG.development.allowedOrigins;
    } else if (isTesting) {
        allowedOrigins = ENV_CONFIG.test.allowedOrigins;
    } else {
        // Production
        allowedOrigins = [
            ...ENV_CONFIG.production.allowedOrigins,
            ...(process.env.ADDITIONAL_ALLOWED_ORIGINS?.split(',').map(s => s.trim()) || [])
        ];
    }
    
    // Check if origin is allowed based on environment
    const isAllowedOrigin = (() => {
        // In development, allow all localhost and 127.0.0.1 variations
        if (isDevelopment) {
            console.log('[CORS] Development mode - Checking origin:', origin);
            
            // First check if origin is explicitly listed
            const isExplicitlyAllowed = ENV_CONFIG.development.allowedOrigins.some(pattern => {
                const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
                const matches = regex.test(origin);
                if (matches) {
                    console.log(`[CORS] Origin ${origin} matches allowed pattern: ${pattern}`);
                }
                return matches;
            });
            
            // Then check if it's a localhost/127.0.0.1 variant
            const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)(:\d+)?$/.test(origin);
            
            console.log(`[CORS] Development mode - isLocal: ${isLocal}, isExplicitlyAllowed: ${isExplicitlyAllowed}`);
            return isLocal || isExplicitlyAllowed;
        }
        
        // In testing, only allow test domains and ports
        if (isTesting) {
            return ENV_CONFIG.test.allowedOrigins.some(pattern => 
                new RegExp(`^${pattern.replace(/\*/g, '.*')}$`).test(origin)
            );
        }
        
        // In production, only allow specific domains
        return allowedOrigins.some(pattern => {
            const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
            return regex.test(origin);
        });
    })();
    
    // Set CORS headers for allowed origins
    if (isAllowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
        
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            console.log(`[CORS] Handling preflight request for ${origin}`);
            return res.status(204).end();
        }
    } else {
        console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
        // Don't set Access-Control-Allow-Origin for blocked origins
    }

    // Continue to next middleware
    next();
};

export { corsMiddleware };

