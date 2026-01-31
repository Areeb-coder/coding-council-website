import mongoose from 'mongoose';
import config from './index.js';

export async function connectDB(): Promise<void> {
    try {
        const conn = await mongoose.connect(config.mongoUri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});

export default mongoose;
