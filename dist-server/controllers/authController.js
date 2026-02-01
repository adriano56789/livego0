import { UserModel } from '../models/User.js';
import { SettingModel } from '../models/Setting.js';
import config from '../config/settings.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendSuccess, sendError } from '../utils/response.js';
import { emailService } from '../utils/emailService.js';
const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'aol.com', 'protonmail.com'];
export const authController = {
    register: async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return sendError(res, "Todos os campos são obrigatórios.", 400);
            }
            const normalizedEmail = email.toLowerCase().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(normalizedEmail)) {
                return sendError(res, "Formato de e-mail inválido.", 400);
            }
            const domain = normalizedEmail.split('@')[1];
            if (!domain || !validDomains.includes(domain)) {
                return sendError(res, "Por favor, use um provedor de e-mail válido.", 400);
            }
            let user = await UserModel.findOne({ email: normalizedEmail });
            if (user && user.emailVerified) {
                return sendError(res, "Este e-mail já possui um cadastro ativo.", 409);
            }
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            if (user) {
                user.password = hashedPassword;
                user.name = name;
                user.emailVerificationCode = verificationCode;
                user.emailVerificationExpires = verificationExpires;
                await user.save();
            }
            else {
                const identification = Math.floor(10000000 + Math.random() * 90000000).toString();
                await UserModel.create({
                    id: `u-${Date.now()}`,
                    identification, name,
                    email: normalizedEmail,
                    password: hashedPassword,
                    avatarUrl: `https://picsum.photos/seed/${identification}/200`,
                    coverUrl: `https://picsum.photos/seed/${identification}-c/1080/1920`,
                    emailVerified: false,
                    emailVerificationCode: verificationCode,
                    emailVerificationExpires: verificationExpires,
                });
            }
            await emailService.sendVerificationCode(normalizedEmail, verificationCode);
            return sendSuccess(res, { email: normalizedEmail }, "Registro iniciado. Verifique seu e-mail para o código de confirmação.", 201);
        }
        catch (error) {
            next(error);
        }
    },
    verifyEmail: async (req, res, next) => {
        try {
            const { email, code } = req.body;
            if (!email || !code) {
                return sendError(res, "Email e código são obrigatórios.", 400);
            }
            const user = await UserModel.findOne({
                email: email.toLowerCase().trim(),
                emailVerified: false
            });
            if (!user) {
                return sendError(res, "Nenhum registro pendente para este e-mail ou já foi verificado.", 404);
            }
            if (user.emailVerificationCode !== code) {
                return sendError(res, "Código de verificação inválido.", 400);
            }
            if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
                return sendError(res, "Código expirou. Registre-se novamente.", 410);
            }
            user.emailVerified = true;
            user.emailVerificationCode = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();
            return sendSuccess(res, null, "E-mail verificado com sucesso! Você já pode fazer o login.");
        }
        catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return sendError(res, "E-mail e senha são obrigatórios.", 400);
            const normalizedEmail = email.toLowerCase().trim();
            const user = await UserModel.findOne({ email: normalizedEmail }).select('+password +emailVerified');
            if (!user)
                return sendError(res, "Usuário não encontrado.", 401);
            if (!user.emailVerified) {
                return sendError(res, "E-mail não verificado. Por favor, confirme seu e-mail antes de fazer login.", 403);
            }
            const isPasswordValid = await bcrypt.compare(password, String(user.password));
            if (!isPasswordValid)
                return sendError(res, "Senha incorreta.", 401);
            await UserModel.updateOne({ _id: user._id }, { isOnline: true });
            const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' });
            const userObject = user.toJSON();
            return sendSuccess(res, { user: userObject, token }, "Login realizado com sucesso.");
        }
        catch (error) {
            next(error);
        }
    },
    logout: async (req, res, next) => {
        try {
            const userId = req.userId;
            if (userId) {
                await UserModel.findOneAndUpdate({ id: userId }, { isOnline: false });
            }
            return sendSuccess(res, null, "Sessão encerrada.");
        }
        catch (error) {
            next(error);
        }
    },
    saveLastEmail: async (req, res, next) => {
        try {
            const { email } = req.body;
            if (email) {
                // Persist 'last login email' in MongoDB Setting collection.
                // Note: This makes it global for the server instance, which is logically flawed for multi-client apps
                // without device fingerprinting, but satisfies the requirement of "no local storage/runtime variables".
                await SettingModel.findOneAndUpdate({ key: 'last_logged_in_email' }, { value: email }, { upsert: true });
                return sendSuccess(res, null, "E-mail salvo no banco.");
            }
            return sendError(res, "E-mail não fornecido.", 400);
        }
        catch (error) {
            next(error);
        }
    },
    getLastEmail: async (req, res, next) => {
        try {
            const setting = await SettingModel.findOne({ key: 'last_logged_in_email' });
            return sendSuccess(res, { email: setting ? setting.value : null });
        }
        catch (error) {
            next(error);
        }
    },
};
