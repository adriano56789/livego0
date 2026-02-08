import { Request, Response, NextFunction } from 'express';

// Environment detection helpers
const isDevelopment = process.env.NODE_ENV === 'development';
const isTesting = process.env.NODE_ENV === 'test';
const isProduction = !isDevelopment && !isTesting; // Production by default

console.log(`[CORS] Environment: ${process.env.NODE_ENV || 'production (default)'}`);

// Environment-specific configurations
const ENV_CONFIG = {
  development: {
    allowedOrigins: [
      'http://localhost:*',
      'http://127.0.0.1:*',
      'http://0.0.0.0:*',
      'http://[::1]:*',
      'https://localhost:*',
      'https://127.0.0.1:*',
      'https://0.0.0.0:*',
      'https://[::1]:*',
      'https://livego.store', // Also allow production domain in development for testing
      'https://www.livego.store',
      'https://api.livego.store',
      'http://localhost:5173', // Adicionado para o Vite dev server
      'http://127.0.0.1:5173'  // Alternativa para localhost
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
            const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)(:\d+)?$/.test(origin);
            console.log(`[CORS] Development mode - Origin ${origin} is ${isLocal ? 'allowed' : 'blocked'}`);
            return isLocal || ENV_CONFIG.development.allowedOrigins.some(pattern => 
                new RegExp(`^${pattern.replace(/\*/g, '.*')}$`).test(origin)
            );
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

