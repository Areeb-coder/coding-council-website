import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, authorize, AuthRequest } from '../middleware/index.js';
import config from '../config/index.js';

const router = Router();

// Ensure upload directory exists
const uploadDir = config.upload.dir;
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

// File filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: config.upload.maxFileSize,
    },
});

// Upload single image (admin only)
router.post('/image', authenticate, authorize('admin', 'super_admin'), upload.single('image'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        res.json({
            message: 'File uploaded successfully',
            url: fileUrl,
            filename: req.file.filename,
            size: req.file.size,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Upload multiple images (admin only)
router.post('/images', authenticate, authorize('admin', 'super_admin'), upload.array('images', 10), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            res.status(400).json({ error: 'No files uploaded' });
            return;
        }

        const urls = files.map((file) => ({
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            size: file.size,
        }));

        res.json({
            message: 'Files uploaded successfully',
            files: urls,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Delete file (admin only)
router.delete('/:filename', authenticate, authorize('admin', 'super_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const filePath = path.join(uploadDir, req.params.filename);

        if (!fs.existsSync(filePath)) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        fs.unlinkSync(filePath);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Delete failed' });
    }
});

// List uploaded files (admin only)
router.get('/', authenticate, authorize('admin', 'super_admin'), async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const files = fs.readdirSync(uploadDir).map((filename) => {
            const filePath = path.join(uploadDir, filename);
            const stats = fs.statSync(filePath);
            return {
                filename,
                url: `/uploads/${filename}`,
                size: stats.size,
                createdAt: stats.birthtime,
            };
        });

        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
