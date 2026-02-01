import nodemailer from 'nodemailer';
import 'dotenv/config';
let transporter = null;
/**
 * Inicializa e retorna a instância do transporter do Nodemailer.
 */
const getTransporter = () => {
    // Reutiliza a instância se já foi criada.
    if (transporter) {
        return transporter;
    }
    const emailConfig = {
        service: process.env.EMAIL_SERVICE || 'gmail',
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    };
    // Valida as configurações essenciais
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
        console.error('[EMAIL_SERVICE] ERRO: Configuração de e-mail incompleta. Verifique suas variáveis de ambiente.');
        throw new Error('O serviço de e-mail não está configurado corretamente.');
    }
    // Cria a instância do transporter
    transporter = nodemailer.createTransport(emailConfig);
    // Verifica a conexão
    transporter.verify(function (error, success) {
        if (error) {
            console.error('Erro na configuração do e-mail:', error);
        }
        else {
            console.log('Servidor de e-mail configurado com sucesso!');
        }
    });
    return transporter;
};
export const emailService = {
    sendVerificationCode: async (to, code) => {
        try {
            const mailer = getTransporter();
            const fromName = process.env.EMAIL_FROM_NAME || 'LiveGo Suporte';
            const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || '';
            if (!fromEmail) {
                throw new Error('Endereço de e-mail do remetente não configurado.');
            }
            const mailOptions = {
                from: `"${fromName}" <${fromEmail}>`,
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
                        <p><b>${fromName}</b></p>
                    </div>
                `,
            };
            const info = await mailer.sendMail(mailOptions);
            console.log(`[EMAIL_SERVICE] E-mail de verificação enviado para ${to}. Message ID: ${info.messageId}`);
            return info;
        }
        catch (error) {
            console.error(`[EMAIL_SERVICE] Falha ao enviar e-mail para ${to}:`, error);
            // Lança um erro mais genérico para ser capturado pelo controller e exibido ao usuário final.
            throw new Error('Falha ao enviar o e-mail de verificação. Verifique as configurações do servidor de e-mail.');
        }
    },
};
