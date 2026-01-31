import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models/index.js';
import { authenticate, AuthRequest, authValidation } from '../middleware/index.js';
import config from '../config/index.js';

const router = Router();

// Login
router.post('/login', authValidation.login, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Update last login
        user.lastLogin = new Date();

        // Generate tokens
        // @ts-ignore
        const accessToken = jwt.sign(
            { userId: user._id.toString() },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn } as any
        );

        // @ts-ignore
        const refreshToken = jwt.sign(
            { userId: user._id.toString() },
            config.jwtSecret,
            { expiresIn: config.jwtRefreshExpiresIn } as any
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            user: user.toJSON(),
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Refresh token
router.post('/refresh', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({ error: 'Refresh token required' });
            return;
        }

        const decoded = jwt.verify(refreshToken, config.jwtSecret) as { userId: string };
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            res.status(401).json({ error: 'Invalid refresh token' });
            return;
        }

        const accessToken = jwt.sign(
            { userId: user._id.toString() },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn } as any
        );

        res.json({ accessToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    res.json({ user: req.user });
});

// Logout
router.post('/logout', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user) {
            req.user.refreshToken = undefined;
            await req.user.save();
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update profile
router.put('/profile', authenticate, authValidation.updateProfile, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { name, email } = req.body;
        const user = req.user!;

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: user.toJSON()
        });
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Change password
router.put('/password', authenticate, authValidation.changePassword, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { currentPassword, newPassword } = req.body;
        const user = req.user!;

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid current password' });
            return;
        }

        user.password = newPassword;
        // Invalidate current refresh token to force logout on other devices if needed
        user.refreshToken = undefined;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
