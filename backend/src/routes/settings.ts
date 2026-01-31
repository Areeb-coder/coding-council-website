import { Router, Request, Response } from 'express';
import { Settings } from '../models/index.js';
import { authenticate, authorize, AuthRequest } from '../middleware/index.js';

const router = Router();

// Get public settings (no auth required)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        let settings = await Settings.findOne({ key: 'global' });

        // Create default settings if not exists
        if (!settings) {
            settings = new Settings({
                key: 'global',
                homePageContent: {
                    heroTagline: 'Build. Learn. Connect.',
                    heroSubtitle: 'Join the premier coding community at Jamia Millia Islamia',
                },
                socialLinks: {
                    linkedin: 'https://www.linkedin.com/company/coding-council/',
                    instagram: 'https://www.instagram.com/codingcounciljmi',
                    github: 'https://github.com/codingcounciljmi/',
                    email: 'coding.council.jmi@gmail.com',
                    whatsapp: 'https://chat.whatsapp.com/IKPUGagDzlQ5SRLbWGbVyY',
                },
                communityStats: {
                    members: 500,
                    events: 25,
                    workshops: 40,
                    projects: 75,
                },
                announcementBanner: {
                    isActive: false,
                },
            });
            await settings.save();
        }

        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get server time (for countdown sync)
router.get('/time', (_req: Request, res: Response): void => {
    res.json({
        success: true,
        data: {
            timestamp: Date.now(),
            iso: new Date().toISOString(),
            timezone: 'Asia/Kolkata',
        },
    });
});

// Update settings (admin only)
router.put('/', authenticate, authorize('admin', 'super_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { homePageContent, socialLinks, communityStats, announcementBanner } = req.body;

        const updateData: Record<string, unknown> = {};

        if (homePageContent) {
            Object.keys(homePageContent).forEach(key => {
                updateData[`homePageContent.${key}`] = homePageContent[key];
            });
        }

        if (socialLinks) {
            Object.keys(socialLinks).forEach(key => {
                updateData[`socialLinks.${key}`] = socialLinks[key];
            });
        }

        if (communityStats) {
            Object.keys(communityStats).forEach(key => {
                updateData[`communityStats.${key}`] = communityStats[key];
            });
        }

        if (announcementBanner) {
            Object.keys(announcementBanner).forEach(key => {
                updateData[`announcementBanner.${key}`] = announcementBanner[key];
            });
        }

        const settings = await Settings.findOneAndUpdate(
            { key: 'global' },
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Update social links only (admin)
router.put('/social-links', authenticate, authorize('admin', 'super_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { socialLinks } = req.body;

        if (!socialLinks) {
            res.status(400).json({ success: false, error: 'Social links required' });
            return;
        }

        const updateData: Record<string, unknown> = {};
        Object.keys(socialLinks).forEach(key => {
            updateData[`socialLinks.${key}`] = socialLinks[key];
        });

        const settings = await Settings.findOneAndUpdate(
            { key: 'global' },
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Update social links error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Update community stats only (admin)
router.put('/stats', authenticate, authorize('admin', 'super_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { communityStats } = req.body;

        if (!communityStats) {
            res.status(400).json({ success: false, error: 'Community stats required' });
            return;
        }

        const updateData: Record<string, unknown> = {};
        Object.keys(communityStats).forEach(key => {
            updateData[`communityStats.${key}`] = communityStats[key];
        });

        const settings = await Settings.findOneAndUpdate(
            { key: 'global' },
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Update stats error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Update announcement banner (admin)
router.put('/announcement', authenticate, authorize('admin', 'super_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { announcementBanner } = req.body;

        if (!announcementBanner) {
            res.status(400).json({ success: false, error: 'Announcement banner data required' });
            return;
        }

        const updateData: Record<string, unknown> = {};
        Object.keys(announcementBanner).forEach(key => {
            updateData[`announcementBanner.${key}`] = announcementBanner[key];
        });

        const settings = await Settings.findOneAndUpdate(
            { key: 'global' },
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Update announcement error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

export default router;
