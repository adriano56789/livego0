// Default values that work in both browser and server environments
const defaultSettings = {
    port: 3000,
    https_port: 3000,
    node_env: 'development',
    mongoUri: 'mongodb://admin:adriano123@localhost:27017/api?authSource=admin',
    jwtSecret: 'a_default_secret_that_should_not_be_used',
    srsApiUrl: 'http://72.60.249.175:1985',
    emailHost: '',
    emailPort: 587,
    emailUser: '',
    emailPass: ''
};

// Only load environment variables on the server side
const isServer = typeof globalThis.window === 'undefined';

// Initialize settings with defaults
const settings = { ...defaultSettings };

// Update with environment variables if running on server
if (isServer) {
    // Use dynamic import for dotenv to avoid issues with ESM
    import('dotenv/config')
        .then(() => {
            // This runs after dotenv is configured
            settings.port = process.env.PORT ? Number(process.env.PORT) : defaultSettings.port;
            settings.https_port = process.env.HTTPS_PORT ? Number(process.env.HTTPS_PORT) : defaultSettings.https_port;
            settings.node_env = process.env.NODE_ENV || defaultSettings.node_env;
            settings.mongoUri = process.env.MONGODB_URI || defaultSettings.mongoUri;
            settings.jwtSecret = process.env.JWT_SECRET || defaultSettings.jwtSecret;
            settings.srsApiUrl = process.env.SRS_API_URL || defaultSettings.srsApiUrl;
            settings.emailHost = process.env.EMAIL_HOST || defaultSettings.emailHost;
            settings.emailPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : defaultSettings.emailPort;
            settings.emailUser = process.env.EMAIL_USER || defaultSettings.emailUser;
            settings.emailPass = process.env.EMAIL_PASS || defaultSettings.emailPass;
        })
        .catch(err => {
            console.error('Failed to load environment variables:', err);
        });
}

export default settings;