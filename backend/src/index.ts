import express from 'express';
import dns from 'dns';

// Force usage of Google DNS to bypass local resolver issues
try {
    dns.setServers(['8.8.8.8']);
    console.log('✅ DNS Servers set to 8.8.8.8');
} catch (e) {
    console.warn('⚠️ Failed to set DNS servers:', e);
}

import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import config from './config/index.js';
import { connectDB } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/index.js';
import { seedAdmin } from './utils/seed.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(config.upload.dir));

// API routes
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        name: 'Coding Council API',
        version: '1.0.0',
        docs: '/api/v1/health',
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
async function startServer() {
    try {
        // Connect to database
        await connectDB();

        // Seed admin user
        await seedAdmin();

        // Start listening
        app.listen(config.port, () => {
            console.log(`\n🚀 Server running on http://localhost:${config.port}`);
            console.log(`📚 API available at http://localhost:${config.port}/api/v1`);
            console.log(`🌐 CORS enabled for ${config.frontendUrl}`);
            console.log(`🔐 Environment: ${config.env}\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

export default app;
