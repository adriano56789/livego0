import nodemailer from 'nodemailer';
import config from '../config/settings';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;
    private from: string;
    private appName: string;
    private frontendUrl: string;

    constructor() {
        console.log('[EMAIL] Inicializando serviço de e-mail...');
        
        // Verifica se as configurações necessárias estão definidas
        if (!config.emailUser || !config.emailPass) {
            const errorMsg = 'Configuração de e-mail ausente. Verifique as variáveis de ambiente.';
            console.error('[EMAIL] ERRO:', errorMsg);
            console.log('[EMAIL] Configurações atuais:', {
                emailHost: config.emailHost || 'NÃO DEFINIDO',
                emailPort: config.emailPort || 'NÃO DEFINIDO',
                emailUser: config.emailUser ? '***' : 'NÃO DEFINIDO',
                hasPassword: !!config.emailPass,
                srsApiUrl: config.srsApiUrl || 'NÃO DEFINIDO'
            });
            throw new Error(errorMsg);
        }

        // Garantir valores padrão para evitar erros de tipo
        this.from = config.emailUser || '';
        this.appName = 'LiveGo';
        this.frontendUrl = config.srsApiUrl ? config.srsApiUrl.replace('/api', '') : '';
        
        // Configuração para produção
        const isProduction = process.env.NODE_ENV === 'production';
        console.log(`[EMAIL] Modo de produção: ${isProduction}`);
        console.log(`[EMAIL] Remetente: ${this.from}`);
        console.log(`[EMAIL] Servidor SMTP: smtp.gmail.com:465`);
        
        // Configurações do servidor SMTP a partir das configurações
        const transporterConfig: any = {
            host: config.emailHost || 'smtp.gmail.com',
            port: config.emailPort || 465,
            secure: true, // true para 465, false para outras portas
            auth: {
                user: config.emailUser,
                pass: config.emailPass,
            },
            // Configurações de pool para melhor desempenho
            pool: isProduction,
            maxConnections: isProduction ? 5 : 1,
            maxMessages: isProduction ? 100 : 5,
            // Timeouts
            connectionTimeout: 10000, // 10 segundos
            greetingTimeout: 5000, // 5 segundos
            socketTimeout: 10000, // 10 segundos
            // Configurações de TLS
            tls: {
                // Não falhar em certificados inválidos (desativado em produção)
                rejectUnauthorized: isProduction,
                minVersion: 'TLSv1.2'
            },
            // Logs apenas em desenvolvimento
            logger: !isProduction,
            debug: !isProduction
        };

        this.transporter = nodemailer.createTransport(transporterConfig);
        
        // Verificar conexão ao iniciar em produção
        if (isProduction) {
            this.verifyConnection().then(success => {
                if (!success) {
                    console.error('[EMAIL] Falha ao verificar a conexão com o servidor SMTP');
                }
            });
        }
    }

    private async sendEmail(options: EmailOptions): Promise<boolean> {
        console.log(`[EMAIL] Iniciando envio de e-mail para: ${options.to}`);
        console.log(`[EMAIL] Assunto: ${options.subject}`);
        console.log(`[EMAIL] Remetente configurado: ${this.from}`);
        console.log(`[EMAIL] Configurações do servidor SMTP: smtp.gmail.com:465`);
        
        try {
            console.log('[EMAIL] Criando opções do e-mail...');
            // Definindo as opções do e-mail com tipos corretos
            const mailOptions: any = {
                from: this.from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                // Adiciona cabeçalhos para melhorar a entrega
                headers: {
                    'X-LAZY-APP': this.appName,
                    'X-Auto-Response-Suppress': 'OOF, AutoReply',
                    'X-Priority': '1',
                    'X-MSMail-Priority': 'High',
                    'Importance': 'high'
                },
                // Configurações adicionais para melhorar a entrega
                dsn: {
                    id: `${Date.now()}`,
                    return: 'headers',
                    notify: ['failure', 'delay'],
                    recipient: 'admin@livego.store'
                }
            };
            
            // Configurações adicionais para o envio
            // As configurações de pool já foram definidas no construtor
            // Não é necessário redefiní-las aqui

            console.log('[EMAIL] Configurações do e-mail:', {
                from: mailOptions.from,
                to: mailOptions.to,
                subject: mailOptions.subject,
                hasHtml: !!mailOptions.html
            });

            console.log('[EMAIL] Iniciando envio...');
            
            // Enviando o e-mail
            const info = await this.transporter.sendMail(mailOptions);
            
            // Verificando a resposta do envio
            const response = info.response || 'No response';
            const messageId = info.messageId || 'No messageId';
            const accepted = Array.isArray(info.accepted) ? info.accepted.join(', ') : 'None';
            const rejected = Array.isArray(info.rejected) ? info.rejected.join(', ') : 'None';
            
            console.log('[EMAIL] E-mail enviado com sucesso:', {
                messageId: messageId,
                accepted: accepted,
                rejected: rejected,
                response: response
            });
            
            if (info.rejected && info.rejected.length > 0) {
                console.error('[EMAIL] E-mail rejeitado pelo servidor:', info.rejected);
                return false;
            }
            
            return info.accepted && info.accepted.length > 0;
            
        } catch (error: any) {
            console.error('[EMAIL] ERRO CRÍTICO ao enviar e-mail:', {
                para: options.to,
                erro: error.message,
                code: error.code,
                stack: error.stack,
                response: error.response,
                command: error.command
            });
            
            // Tratamento específico para erros comuns
            if (error.code === 'EAUTH') {
                console.error('[EMAIL] ERRO DE AUTENTICAÇÃO: Credenciais inválidas ou não autorizadas');
                console.error('[EMAIL] Verifique se a senha do aplicativo está correta e se a autenticação de dois fatores está configurada corretamente');
            } else if (error.code === 'EENVELOPE') {
                console.error('[EMAIL] ERRO DE ENVELOPE: Verifique os endereços de e-mail (de/para)');
            } else if (error.code === 'ECONNECTION') {
                console.error('[EMAIL] ERRO DE CONEXÃO: Não foi possível conectar ao servidor SMTP');
                console.error('[EMAIL] Verifique sua conexão com a internet e as configurações do firewall');
            }
            
            return false;
        }
    }

    public async sendVerificationEmail(email: string, verificationCode: string, userName: string = 'Usuário'): Promise<boolean> {
        console.log(`[EMAIL] =========================================`);
        console.log(`[EMAIL] INICIANDO ENVIO DE E-MAIL DE VERIFICAÇÃO`);
        console.log(`[EMAIL] =========================================`);
        console.log(`[EMAIL] Destinatário: ${email}`);
        console.log(`[EMAIL] Código de verificação: ${verificationCode}`);
        console.log(`[EMAIL] Nome do usuário: ${userName}`);
        console.log(`[EMAIL] Configurações atuais:`);
        console.log(`[EMAIL] - Remetente: ${this.from}`);
        console.log(`[EMAIL] - Aplicativo: ${this.appName}`);
        console.log(`[EMAIL] - URL do Frontend: ${this.frontendUrl}`);
        
        try {
            const subject = `🔐 Verificação de E-mail - ${this.appName}`;
            const verificationLink = `${this.frontendUrl}/verify-email?email=${encodeURIComponent(email)}&code=${verificationCode}`;
            
            console.log(`[EMAIL] Link de verificação gerado: ${verificationLink}`);
            console.log(`[EMAIL] Gerando HTML do e-mail...`);
            
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #4a6bff;">${this.appName}</h1>
                        <h2 style="color: #333;">Confirme seu endereço de e-mail</h2>
                    </div>
                    
                    <p>Olá ${userName},</p>
                    <p>Obrigado por se cadastrar no ${this.appName}! Para ativar sua conta, por favor use o seguinte código de verificação:</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; border-radius: 4px; font-size: 24px; letter-spacing: 2px; font-weight: bold; color: #4a6bff;">
                        ${verificationCode}
                    </div>
                    
                    <p>Ou clique no botão abaixo para verificar seu e-mail:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationLink}" 
                        style="display: inline-block; padding: 12px 24px; background-color: #4a6bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                            Verificar E-mail
                        </a>
                    </div>
                    
                    <p>Se você não se cadastrou no ${this.appName}, por favor ignore este e-mail.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
                        <p>Este é um e-mail automático, por favor não responda a esta mensagem.</p>
                        <p>© ${new Date().getFullYear()} ${this.appName}. Todos os direitos reservados.</p>
                    </div>
                </div>
            `;
            
            console.log(`[EMAIL] Chamando método sendEmail...`);
            const startTime = Date.now();
            
            try {
                const emailSent = await this.sendEmail({
                    to: email,
                    subject,
                    html
                });
                
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000;
                
                if (!emailSent) {
                    console.error(`[EMAIL] ❌ Falha ao enviar e-mail para ${email} (${duration.toFixed(2)}s)`);
                    console.error(`[EMAIL] O método sendEmail retornou false`);
                    return false;
                }
                
                console.log(`[EMAIL] ✅ E-mail de verificação enviado com sucesso para: ${email} (${duration.toFixed(2)}s)`);
                console.log(`[EMAIL] Código de verificação enviado: ${verificationCode}`);
                return true;
            } catch (sendError: any) {
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000;
                console.error(`[EMAIL] ❌ Erro durante o envio do e-mail (${duration.toFixed(2)}s):`, {
                    error: sendError.message,
                    code: sendError.code,
                    stack: sendError.stack
                });
                return false;
            }
            
        } catch (error: any) {
            console.error('[EMAIL] Erro inesperado ao enviar e-mail de verificação:', {
                error: error.message,
                code: error.code,
                stack: error.stack,
                response: error.response,
                command: error.command
            });
            return false;
        }
    }
    
    /**
     * Verifica a conexão com o servidor SMTP e as credenciais
     * @returns Promise<boolean> - Retorna true se a conexão for bem-sucedida
     */
    public async verifyConnection(): Promise<boolean> {
        console.log('[EMAIL] Verificando conexão com o servidor SMTP...');
        
        try {
            // Verifica a conexão com o servidor SMTP
            const transporter = this.transporter as any;
            
            // Testa a conexão com o servidor
            console.log('[EMAIL] Testando conexão com o servidor...');
            await transporter.verify();
            
            // Se chegou aqui, a conexão foi bem-sucedida
            console.log('[EMAIL] ✅ Conexão com o servidor SMTP verificada com sucesso');
            
            // Tenta enviar um e-mail de teste
            try {
                console.log('[EMAIL] Enviando e-mail de teste...');
                const testEmail = 'test@example.com';
                const testResult = await this.sendEmail({
                    to: testEmail,
                    subject: `[${this.appName}] Teste de Conexão`,
                    html: '<p>Este é um e-mail de teste para verificar a conexão com o servidor SMTP.</p>'
                });
                
                if (testResult) {
                    console.log('[EMAIL] ✅ E-mail de teste enviado com sucesso!');
                } else {
                    console.error('[EMAIL] ❌ Falha ao enviar e-mail de teste');
                }
                
                return testResult;
                
            } catch (testError: any) {
                console.error('[EMAIL] ❌ Erro ao enviar e-mail de teste:', {
                    error: testError.message,
                    code: testError.code,
                    response: testError.response
                });
                return false;
            }
            
        } catch (error: any) {
            console.error('[EMAIL] ❌ Falha na verificação da conexão SMTP:', {
                error: error.message,
                code: error.code,
                command: error.command,
                response: error.response
            });
            
            // Tratamento específico para erros comuns
            if (error.code === 'EAUTH') {
                console.error('[EMAIL] ERRO DE AUTENTICAÇÃO: Credenciais inválidas ou não autorizadas');
                console.error('[EMAIL] Verifique se:');
                console.error('1. A senha do aplicativo está correta');
                console.error('2. A autenticação de dois fatores está ativada na conta do Gmail');
                console.error('3. Foi gerada uma senha de aplicativo para este serviço');
                console.error('4. A opção "Acesso a app menos seguro" está ativada (caso não use autenticação em duas etapas)');
            } else if (error.code === 'ECONNECTION') {
                console.error('[EMAIL] ERRO DE CONEXÃO: Não foi possível conectar ao servidor SMTP');
                console.error('Verifique:');
                console.error('1. Sua conexão com a internet');
                console.error('2. Se as portas 465 (SSL) ou 587 (TLS) estão abertas no firewall');
                console.error('3. Se o domínio não está bloqueado pelo provedor de serviços');
            }
            
            return false;
        }
    }
}

// Exporta uma instância única do serviço de e-mail
export const emailService = new EmailService();

// Verifica a conexão com o servidor de e-mail ao iniciar
if (process.env.NODE_ENV !== 'test') {
    emailService.verifyConnection().then(success => {
        if (!success) {
            console.error('[EMAIL] AVISO: Não foi possível verificar a conexão com o servidor de e-mail. Verifique as configurações.');
        }
    });
}
