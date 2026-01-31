import dotenv from 'dotenv';
dotenv.config();

const settings = {
    port: Number(process.env.PORT) || 3000,
    https_port: Number(process.env.HTTPS_PORT) || 3001,
    node_env: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGODB_URI || 'mongodb://admin:adriano123@localhost:27017/api?authSource=admin',
    jwtSecret: process.env.JWT_SECRET || 'a_default_secret_that_should_not_be_used',
    srsApiUrl: process.env.SRS_API_URL || 'http://72.60.249.175:1985',
    // Configurações de E-mail
    emailHost: process.env.EMAIL_HOST,
    emailPort: Number(process.env.EMAIL_PORT),
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
};

export default settings;