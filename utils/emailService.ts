import nodemailer from 'nodemailer';
import config from '../config/settings.js';

let transporter: nodemailer.Transporter | null = null;

/**
 * Inicializa e retorna a instância do transporter do Nodemailer.
 * Lança um erro se as configurações de e-mail não estiverem completas no .env.
 */
const getTransporter = (): nodemailer.Transporter => {
    // Reutiliza a instância se já foi criada.
    if (transporter) {
        return transporter;
    }

    // Valida se as configurações essenciais de e-mail estão presentes.
    if (!config.emailHost || !config.emailPort || !config.emailUser || !config.emailPass) {
        console.error('[EMAIL_SERVICE] ERRO: Configuração de e-mail incompleta no .env. Todas as variáveis EMAIL_HOST, EMAIL_PORT, EMAIL_USER, e EMAIL_PASS são obrigatórias.');
        throw new Error('O serviço de e-mail não está configurado corretamente no servidor.');
    }

    // Cria a instância do transporter.
    transporter = nodemailer.createTransport({
        host: config.emailHost,
        port: config.emailPort,
        secure: config.emailPort === 465, // true para 465, false para outras portas
        auth: {
            user: config.emailUser,
            pass: config.emailPass,
        },
        connectionTimeout: 5000, 
        greetingTimeout: 5000,
        socketTimeout: 5000,
    });

    return transporter;
}

export const emailService = {
    sendVerificationCode: async (to: string, code: string) => {
        try {
            const mailer = getTransporter();
            
            const mailOptions = {
                from: `"LiveGo Suporte" <${config.emailUser}>`,
                to: to,
                subject: 'Seu Código de Verificação LiveGo',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                        <h2 style="color: #8B5CF6;">Bem-vindo ao LiveGo!</h2>
                        <p>Obrigado por se registrar. Use o código abaixo para verificar seu endereço de e-mail:</p>
                        <p style="background-color: #f4f4f5; border-left: 4px solid #8B5CF6; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 3px; text-align: center; margin: 20px 0;">
                            ${code}
                        </p>
                        <p>Este código é válido por 15 minutos.</p>
                        <p>Se você não solicitou este código, pode ignorar este e-mail com segurança.</p>
                        <br>
                        <p>Atenciosamente,</p>
                        <p><b>Equipe LiveGo</b></p>
                    </div>
                `,
            };

            const info = await mailer.sendMail(mailOptions);
            console.log(`[EMAIL_SERVICE] E-mail de verificação enviado para ${to}. Message ID: ${info.messageId}`);
            return info;
        } catch (error) {
            console.error(`[EMAIL_SERVICE] Falha ao enviar e-mail para ${to}:`, error);
            // Lança um erro mais genérico para ser capturado pelo controller e exibido ao usuário final.
            throw new Error('Falha ao enviar o e-mail de verificação. Verifique as configurações do servidor de e-mail.');
        }
    },
};