import { Router, Request, Response } from 'express';
import { validationResult, body, param, query } from 'express-validator';
import { BlogPost } from '../models/BlogPost.js';
import { authenticate, authorize, AuthRequest, idParam, paginationQuery } from '../middleware/index.js';

const router = Router();

// Get all published blog posts (public)
router.get('/', paginationQuery, async (req: Request, res: Response): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const category = req.query.category as string;

        const filter: Record<string, unknown> = { published: true };
        if (category) filter.category = category;

        const total = await BlogPost.countDocuments(filter);
        const posts = await BlogPost.find(filter)
            .select('-content')
            .sort({ publishedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            posts,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single post by slug (public)
router.get('/slug/:slug', async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all posts including drafts (admin only)
router.get('/admin/all', authenticate, authorize('admin', 'super_admin'), paginationQuery, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const total = await BlogPost.countDocuments();
        const posts = await BlogPost.find()
            .select('-content')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            posts,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create blog post (admin only)
router.post('/', authenticate, authorize('admin', 'super_admin'), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('excerpt').trim().notEmpty().isLength({ max: 300 }).withMessage('Excerpt required (max 300 chars)'),
    body('coverImage').trim().notEmpty().withMessage('Cover image is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
], async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const post = new BlogPost({
            ...req.body,
            author: {
                name: req.user?.name || 'Admin',
                avatar: req.user?.avatar || 'https://via.placeholder.com/100',
            },
        });

        if (req.body.published) {
            post.publishedAt = new Date();
        }

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update blog post (admin only)
router.put('/:id', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const updateData = { ...req.body };

        // Set publishedAt when publishing
        if (req.body.published && !updateData.publishedAt) {
            updateData.publishedAt = new Date();
        }

        const post = await BlogPost.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete blog post (admin only)
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), idParam, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get categories (public)
router.get('/categories', async (_req: Request, res: Response): Promise<void> => {
    try {
        const categories = await BlogPost.distinct('category', { published: true });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
