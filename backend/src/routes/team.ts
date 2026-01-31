import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { TeamMember } from '../models/index.js';
import { authenticate, authorize, AuthRequest, teamValidation, idParam } from '../middleware/index.js';

const router = Router();

// Get team members
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const showAll = req.query.all === 'true';
        const filter = showAll ? {} : { active: true };
        const members = await TeamMember.find(filter).sort({ order: 1 });
        res.json(members);
    } catch (error) {
        console.error('Get team members error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single team member (public)
router.get('/:id', idParam, async (req: Request, res: Response): Promise<void> => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            res.status(404).json({ error: 'Team member not found' });
            return;
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create team member (admin only)
router.post('/', authenticate, authorize('admin', 'super_admin'), teamValidation.create, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const member = new TeamMember(req.body);
        await member.save();

        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update team member (admin only)
router.put('/:id', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!member) {
            res.status(404).json({ error: 'Team member not found' });
            return;
        }

        res.json(member);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete team member (admin only)
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);
        if (!member) {
            res.status(404).json({ error: 'Team member not found' });
            return;
        }
        res.json({ message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Reorder team members (admin only)
router.post('/reorder', authenticate, authorize('admin', 'super_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { order } = req.body; // Array of { id, order }

        if (!Array.isArray(order)) {
            res.status(400).json({ error: 'Order must be an array' });
            return;
        }

        await Promise.all(
            order.map(({ id, order: newOrder }: { id: string; order: number }) =>
                TeamMember.findByIdAndUpdate(id, { order: newOrder })
            )
        );

        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
