import { Router } from 'express';
import authRoutes from './auth.js';
import eventRoutes from './events.js';
import teamRoutes from './team.js';
import registrationRoutes from './registrations.js';
import contactRoutes from './contact.js';
import blogRoutes from './blog.js';
import uploadRoutes from './upload.js';
import reviewRoutes from './reviews.js';
import settingsRoutes from './settings.js';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/team', teamRoutes);
router.use('/registrations', registrationRoutes);
router.use('/contact', contactRoutes);
router.use('/blog', blogRoutes);
router.use('/upload', uploadRoutes);
router.use('/reviews', reviewRoutes);
router.use('/settings', settingsRoutes);

export default router;
