// Adiciona manipuladores globais para capturar exceções não tratadas e rejeições de promessas.
// Isso garante que qualquer erro não capturado seja logado com detalhes antes de o processo terminar.
(process as any).on('uncaughtException', (err: any) => {
  console.error('Exceção não capturada (uncaughtException):', err && err.stack ? err.stack : err);
  (process as any).exit(1); // Encerra o processo, pois o estado da aplicação é incerto.
});
(process as any).on('unhandledRejection', (reason: any) => {
  console.error('Rejeição não tratada (unhandledRejection):', reason && reason.stack ? reason.stack : reason);
  // Não é recomendado encerrar o processo aqui por padrão, mas é crucial logar o erro.
});

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtendo __filename e __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o arquivo de ambiente .env da raiz do projeto.
dotenv.config();

import config from './config/settings.js';

// Relaxed check: Only warn if variables are missing, rely on config/settings.ts defaults for dev
if (!process.env.PORT || !process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    console.warn("⚠️ AVISO: Algumas variáveis de ambiente não foram encontradas. Usando configurações padrão de desenvolvimento.");
}

// Verifica se a configuração de e-mail está presente, mas não critica se estiver ausente
if (process.env.EMAIL_USER && (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_PASS)) {
    console.warn("AVISO: As configurações de e-mail estão incompletas. A verificação por e-mail pode não funcionar.");
}

import express, { Request as ExpressRequest, Response as ExpressResponse, NextFunction, RequestHandler } from 'express';
import 'express-async-errors';
import { corsMiddleware } from './middleware/cors.js';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './database.js';
import apiRoutes from './routes/api.js';
import srsRoutes from './routes/srsRoutes.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import { setupWebSocket } from './controllers/websocketController.js';
import { rateLimiter, sanitizeInput } from './middleware/security.js';
import os from 'os';

connectDB().catch(err => {
    console.error("ERRO CRÍTICO NA CONEXÃO COM O BANCO:", err);
    // process.exit(1); // Allow retry logic in connectDB to handle this
});

const app = express();
const isProduction = config.node_env === 'production';

// Use custom CORS middleware
app.use(corsMiddleware);

app.use(express.json({ limit: '10mb' }) as any);

// Aplica middlewares de segurança globais
app.use(rateLimiter as any);
app.use(sanitizeInput as any);

// Global request logger middleware
app.use((req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const start = Date.now();
    (res as any).on('finish', () => {
        const duration = Date.now() - start;
        const status = (res as any).statusCode;
        const method = (req as any).method;
        const url = (req as any).originalUrl;
        const ip = (req as any).ip || (req as any).socket?.remoteAddress || '-';
        
        console.log(`[${new Date().toISOString()}] ${method} ${url} ${status} - ${duration}ms - ${ip}`);
    });
    next();
});

const server = http.createServer(app);
// Configuração do Socket.IO com CORS
const io = new Server(server, { 
    cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 10000,
    pingInterval: 5000,
    cookie: false
});

// Log de conexões e desconexões
io.on('connection', (socket) => {
    console.log(`[Socket.IO] Cliente conectado: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`[Socket.IO] Cliente desconectado: ${socket.id}`);
    });
    
    socket.on('error', (error) => {
        console.error(`[Socket.IO] Erro no socket ${socket.id}:`, error);
    });
});

setupWebSocket(io);

// Middleware para adicionar io ao request
app.use((req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    (req as any).io = io;
    next();
});

// Middleware de depuração para registrar todas as rotas acessadas
app.use((req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    console.log(`[DEBUG] Rota acessada: ${req.method} ${req.originalUrl}`);
    next();
});

// Rotas da API
app.use('/api', apiRoutes);
app.use('/api', srsRoutes);

// Rotas de verificação de status
app.get('/health', (req: ExpressRequest, res: ExpressResponse) => {
    (res as any).status(200).send('OK');
});

app.get('/', (req: ExpressRequest, res: ExpressResponse) => {
    (res as any).send(`<h1>Servidor LiveGo Online (HTTP)</h1><p>API em: <a href="/api/status">/api/status</a></p>`);
});

app.use(globalErrorHandler as any);

// Middleware para registrar rotas não encontradas
app.use((req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    console.log(`[DEBUG] Rota não encontrada: ${req.method} ${req.originalUrl}`);
    next();
});

const listenPort = 3000; // Porta alterada para 3000 para evitar conflito com o frontend

server.on('error', (error: any) => {
    if (error.syscall !== 'listen') throw error;
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ ERRO FATAL: A porta ${listenPort} já está em uso.`);
        (process as any).exit(1);
    } else {
        throw error;
    }
});

// Função para obter o endereço IP local
const getLocalIpAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            // Ignora endereços internos e não IPv4
            if ('IPv4' === iface.family && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
};

server.listen(listenPort, '0.0.0.0', () => {
    const logMessage = isProduction ? `
        ################################################
        👑 API REST DEDICADA LIVEGO - ONLINE (PROD - HTTP)
        🔒 PORTA: ${listenPort}
        🌐 ACESSO: http://localhost:${listenPort}
        ################################################
        ` : `
        ################################################
        🔧 API REST DEDICADA LIVEGO - MODO DESENVOLVIMENTO
        ⚡️ PORTA: ${listenPort}
        🌐 BACKEND: http://localhost:${listenPort}
        🌐 FRONTEND: http://localhost:5173
        ################################################
        `;
    console.log(logMessage);
});
