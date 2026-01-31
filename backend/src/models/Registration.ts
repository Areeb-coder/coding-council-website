import mongoose, { Document, Schema } from 'mongoose';

export interface IRegistration extends Document {
    eventId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    college?: string;
    linkedinUrl?: string;
    foodPreference?: 'Veg' | 'Non-Veg';
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Attended';
    registeredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
    {
        eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, required: true },
        college: { type: String },
        linkedinUrl: { type: String },
        foodPreference: { type: String, enum: ['Veg', 'Non-Veg'] },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Cancelled', 'Attended'],
            default: 'Pending'
        },
        registeredAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Compound index to prevent duplicate registrations
registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });
registrationSchema.index({ eventId: 1 });
registrationSchema.index({ email: 1 });
registrationSchema.index({ status: 1 });

export const Registration = mongoose.model<IRegistration>('Registration', registrationSchema);
