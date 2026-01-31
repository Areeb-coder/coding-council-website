import { body, param, query } from 'express-validator';

export const eventValidation = {
    create: [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('shortDescription').trim().notEmpty().isLength({ max: 200 }).withMessage('Short description required (max 200 chars)'),
        body('date').isISO8601().withMessage('Valid date is required'),
        body('time').trim().notEmpty().withMessage('Time is required'),
        body('mode').isIn(['Online', 'Offline', 'Hybrid']).withMessage('Invalid mode'),
        body('category').isIn(['Hackathon', 'Workshop', 'Sprint', 'Meetup', 'Competition']).withMessage('Invalid category'),
        body('image').trim().notEmpty().withMessage('Image URL is required'),
        body('registrationLink').optional().isURL().withMessage('Invalid registration link URL'),
        body('tags').optional().isArray(),
    ],
    update: [
        param('id').isMongoId().withMessage('Invalid event ID'),
        body('title').optional().trim().notEmpty(),
        body('date').optional().isISO8601(),
        body('mode').optional().isIn(['Online', 'Offline', 'Hybrid']),
        body('category').optional().isIn(['Hackathon', 'Workshop', 'Sprint', 'Meetup', 'Competition']),
        body('status').optional().isIn(['Upcoming', 'Ongoing', 'Completed', 'Cancelled']),
    ],
};

export const registrationValidation = {
    create: [
        body('eventId').isMongoId().withMessage('Valid event ID is required'),
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('phone').trim().notEmpty().withMessage('Phone is required'),
        body('college').optional().trim(),
        body('linkedinUrl').optional().isURL().withMessage('Invalid LinkedIn URL'),
        body('foodPreference').optional().isIn(['Veg', 'Non-Veg']),
    ],
};

export const contactValidation = {
    create: [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('subject').trim().notEmpty().isLength({ min: 5 }).withMessage('Subject required (min 5 chars)'),
        body('message').trim().notEmpty().isLength({ min: 10 }).withMessage('Message required (min 10 chars)'),
    ],
};

export const teamValidation = {
    create: [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('role').trim().notEmpty().withMessage('Role is required'),
        body('bio').trim().notEmpty().isLength({ max: 500 }).withMessage('Bio required (max 500 chars)'),
        body('image').trim().notEmpty().withMessage('Image URL is required'),
        body('order').optional().isInt({ min: 0 }),
    ],
};

export const authValidation = {
    login: [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    updateProfile: [
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
    ],
    changePassword: [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
    ],
};

export const idParam = [
    param('id').isMongoId().withMessage('Invalid ID format'),
];

export const paginationQuery = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];
