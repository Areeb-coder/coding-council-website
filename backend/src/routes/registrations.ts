import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Registration, Event } from '../models/index.js';
import { authenticate, authorize, AuthRequest, registrationValidation, idParam, paginationQuery } from '../middleware/index.js';

const router = Router();

// Create registration (public)
router.post('/', registrationValidation.create, async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { eventId, email } = req.body;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        // Check if event is accepting registrations
        if (event.status !== 'Upcoming') {
            res.status(400).json({ error: 'Event is not accepting registrations' });
            return;
        }

        // Check max participants
        if (event.maxParticipants) {
            const count = await Registration.countDocuments({ eventId, status: { $ne: 'Cancelled' } });
            if (count >= event.maxParticipants) {
                res.status(400).json({ error: 'Event is full' });
                return;
            }
        }

        // Check for duplicate registration
        const existing = await Registration.findOne({ eventId, email });
        if (existing) {
            res.status(409).json({ error: 'Already registered for this event' });
            return;
        }

        const registration = new Registration(req.body);
        await registration.save();

        // TODO: Send confirmation email

        res.status(201).json({
            message: 'Registration successful',
            registration,
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get registrations for an event (admin only)
router.get('/event/:eventId', authenticate, authorize('admin', 'super_admin'), paginationQuery, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const status = req.query.status as string;

        const filter: Record<string, unknown> = { eventId: req.params.eventId };
        if (status) filter.status = status;

        const total = await Registration.countDocuments(filter);
        const registrations = await Registration.find(filter)
            .populate('eventId', 'title date')
            .sort({ registeredAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            registrations,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update registration status (admin only)
router.patch('/:id/status', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        if (!['Pending', 'Confirmed', 'Cancelled', 'Attended'].includes(status)) {
            res.status(400).json({ error: 'Invalid status' });
            return;
        }

        const registration = await Registration.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!registration) {
            res.status(404).json({ error: 'Registration not found' });
            return;
        }

        res.json(registration);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete registration (admin only)
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const registration = await Registration.findByIdAndDelete(req.params.id);
        if (!registration) {
            res.status(404).json({ error: 'Registration not found' });
            return;
        }
        res.json({ message: 'Registration deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get registration stats (admin only)
router.get('/stats/:eventId', authenticate, authorize('admin', 'super_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const stats = await Registration.aggregate([
            { $match: { eventId: req.params.eventId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        const total = stats.reduce((acc, s) => acc + s.count, 0);

        res.json({
            total,
            byStatus: stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
