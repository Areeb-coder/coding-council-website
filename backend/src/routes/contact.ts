import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Contact } from '../models/index.js';
import { authenticate, authorize, AuthRequest, contactValidation, idParam, paginationQuery } from '../middleware/index.js';

const router = Router();

// Submit contact form (public)
router.post('/', contactValidation.create, async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const contact = new Contact(req.body);
        await contact.save();

        // TODO: Send notification email to admin

        res.status(201).json({
            message: 'Message sent successfully. We will get back to you soon!',
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all contacts (admin only)
router.get('/', authenticate, authorize('admin', 'super_admin'), paginationQuery, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const status = req.query.status as string;

        const filter: Record<string, unknown> = {};
        if (status) filter.status = status;

        const total = await Contact.countDocuments(filter);
        const contacts = await Contact.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            contacts,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update contact status (admin only)
router.patch('/:id/status', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        if (!['New', 'Read', 'Replied', 'Archived'].includes(status)) {
            res.status(400).json({ error: 'Invalid status' });
            return;
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!contact) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }

        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete contact (admin only)
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
