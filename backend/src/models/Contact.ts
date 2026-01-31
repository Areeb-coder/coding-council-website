import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'New' | 'Read' | 'Replied' | 'Archived';
    createdAt: Date;
    updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: ['New', 'Read', 'Replied', 'Archived'],
            default: 'New'
        },
    },
    { timestamps: true }
);

contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

export const Contact = mongoose.model<IContact>('Contact', contactSchema);
