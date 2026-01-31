import dotenv from 'dotenv';
dotenv.config();

interface Config {
    env: string;
    port: number;
    mongoUri: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
    adminEmail: string;
    adminPassword: string;
    frontendUrl: string;
    smtp: {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
    };
    upload: {
        maxFileSize: number;
        dir: string;
    };
}

const config: Config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/coding-council',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@codingcouncil.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || 'Coding Council <noreply@codingcouncil.com>',
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
        dir: process.env.UPLOAD_DIR || 'uploads',
    },
};

export default config;
