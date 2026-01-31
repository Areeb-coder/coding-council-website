import { Request, Response, NextFunction } from 'express';

interface ApiError extends Error {
    statusCode?: number;
    code?: string;
}

export function errorHandler(
    err: ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        res.status(400).json({
            error: 'Validation Error',
            details: err.message,
        });
        return;
    }

    // Mongoose duplicate key error
    if (err.code === '11000') {
        res.status(409).json({
            error: 'Duplicate entry',
            message: 'A record with this value already exists.',
        });
        return;
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        res.status(400).json({
            error: 'Invalid ID format',
        });
        return;
    }

    // Custom error with status code
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal Server Error' : err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}

export function notFound(_req: Request, res: Response): void {
    res.status(404).json({ error: 'Endpoint not found' });
}
