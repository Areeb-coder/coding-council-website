import { Router, Request, Response } from 'express';
import { validationResult, body, param } from 'express-validator';
import { Review } from '../models/index.js';
import { authenticate, authorize, AuthRequest } from '../middleware/index.js';

const router = Router();

// Validation rules
const reviewValidation = {
    create: [
        body('authorName').trim().notEmpty().withMessage('Author name is required'),
        body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 1000 }),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('authorRole').optional().trim(),
        body('authorCompany').optional().trim(),
        body('authorPhoto').optional().isURL().withMessage('Invalid photo URL'),
    ],
    update: [
        body('authorName').optional().trim().notEmpty(),
        body('content').optional().trim().notEmpty().isLength({ max: 1000 }),
        body('rating').optional().isInt({ min: 1, max: 5 }),
    ],
};

const idParam = param('id').isMongoId().withMessage('Invalid review ID');

// Get approved reviews (public)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const reviews = await Review.find({ isApproved: true })
            .sort({ isFeatured: -1, createdAt: -1 })
            .limit(20);

        res.json({ success: true, data: reviews });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get all reviews (admin only)
router.get('/admin', authenticate, authorize('admin', 'super_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const status = req.query.status as string; // 'approved', 'pending', 'all'
        const featured = req.query.featured === 'true';

        const filter: Record<string, unknown> = {};
        if (status === 'approved') filter.isApproved = true;
        else if (status === 'pending') filter.isApproved = false;
        // if status is 'all' or undefined, filter remains empty (returns all)
        if (req.query.featured) filter.isFeatured = featured;

        const total = await Review.countDocuments(filter);
        const reviews = await Review.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            success: true,
            data: reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get admin reviews error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get single review
router.get('/:id', idParam, async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const review = await Review.findById(req.params.id);
        if (!review) {
            res.status(404).json({ success: false, error: 'Review not found' });
            return;
        }

        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Create review (admin only)
router.post('/', authenticate, authorize('admin', 'super_admin'), reviewValidation.create, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const review = new Review({
            ...req.body,
            isApproved: true, // Admin-created reviews are auto-approved
        });
        await review.save();

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Update review (admin only)
router.put('/:id', authenticate, authorize('admin', 'super_admin'), idParam, reviewValidation.update, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!review) {
            res.status(404).json({ success: false, error: 'Review not found' });
            return;
        }

        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Delete review (admin only)
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            res.status(404).json({ success: false, error: 'Review not found' });
            return;
        }

        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Approve/Reject review (admin only)
router.put('/:id/approve', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const { isApproved } = req.body;
        const updateData: Record<string, unknown> = { isApproved };

        if (isApproved) {
            updateData.approvedBy = req.user?.id;
            updateData.approvedAt = new Date();
        }

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!review) {
            res.status(404).json({ success: false, error: 'Review not found' });
            return;
        }

        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Feature/Unfeature review (admin only)
router.put('/:id/feature', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const { isFeatured } = req.body;

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: { isFeatured } },
            { new: true }
        );

        if (!review) {
            res.status(404).json({ success: false, error: 'Review not found' });
            return;
        }

        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

export default router;
