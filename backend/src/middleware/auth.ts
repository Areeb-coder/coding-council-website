import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { User, IUser } from '../models/index.js';

export interface AuthRequest extends Request {
    user?: IUser;
}

export async function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access denied. No token provided.' });
            return;
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

        const user = await User.findById(decoded.userId);

        if (!user) {
            res.status(401).json({ error: 'Invalid token. User not found.' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Token expired.' });
            return;
        }
        res.status(401).json({ error: 'Invalid token.' });
    }
}

export function authorize(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated.' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
            return;
        }

        next();
    };
}
