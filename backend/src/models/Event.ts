import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    shortDescription: string;
    date: Date;
    endDate?: Date;
    time: string;
    mode: 'Online' | 'Offline' | 'Hybrid';
    location?: string;
    category: 'Hackathon' | 'Workshop' | 'Sprint' | 'Meetup' | 'Competition';
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
    image: string;
    registrationLink?: string;
    maxParticipants?: number;
    tags: string[];
    winners: {
        name: string;
        prize: string;
        description?: string;
        image?: string;
    }[];
    gallery: string[];
    featured: boolean;
    priority: number;
    timezone?: string;
    lastModifiedBy?: string;
    lastModifiedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        shortDescription: { type: String, required: true, maxlength: 200 },
        date: { type: Date, required: true },
        endDate: { type: Date },
        time: { type: String, required: true },
        mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], required: true },
        location: { type: String },
        category: {
            type: String,
            enum: ['Hackathon', 'Workshop', 'Sprint', 'Meetup', 'Competition'],
            required: true
        },
        status: {
            type: String,
            enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
            default: 'Upcoming'
        },
        image: { type: String, required: true },
        registrationLink: { type: String },
        maxParticipants: { type: Number },
        tags: [{ type: String }],
        winners: [{
            name: { type: String, required: true },
            prize: { type: String, required: true },
            description: { type: String },
            image: { type: String },
        }],
        gallery: [{ type: String }],
        featured: { type: Boolean, default: false },
        priority: { type: Number, default: 0 },
        timezone: { type: String, default: 'Asia/Kolkata' },
        lastModifiedBy: { type: String },
        lastModifiedAt: { type: Date },
    },
    { timestamps: true }
);

// Indexes
eventSchema.index({ date: -1 });
eventSchema.index({ status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ featured: 1 });

export const Event = mongoose.model<IEvent>('Event', eventSchema);
