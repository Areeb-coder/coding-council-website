import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Event } from '../models/index.js';
import { authenticate, authorize, AuthRequest, eventValidation, idParam, paginationQuery } from '../middleware/index.js';

const router = Router();

// Get all events (public/admin)
router.get('/', paginationQuery, async (req: Request, res: Response): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 100; // Increased default limit
        const status = req.query.status as string;
        const category = req.query.category as string;
        const featured = req.query.featured === 'true';

        const filter: Record<string, unknown> = {};
        if (status && status !== 'all') filter.status = status;
        if (category && category !== 'all') filter.category = category;
        if (req.query.featured) filter.featured = featured;

        const total = await Event.countDocuments(filter);
        const events = await Event.find(filter)
            .sort({ date: status === 'Completed' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            events,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single event (public)
router.get('/:id', idParam, async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create event (admin only)
router.post('/', authenticate, authorize('admin', 'super_admin'), eventValidation.create, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const event = new Event(req.body);
        await event.save();

        res.status(201).json(event);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update event (admin only)
router.put('/:id', authenticate, authorize('admin', 'super_admin'), eventValidation.update, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete event (admin only)
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
