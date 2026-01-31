import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember extends Document {
    name: string;
    role: string;
    bio: string;
    image: string;
    year?: string;
    social: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        email?: string;
    };
    order: number;
    active: boolean;
    displayInTop6: boolean;
    memberCategory?: 'executive' | 'technical' | 'operations' | 'marketing';
    createdAt: Date;
    updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
    {
        name: { type: String, required: true, trim: true },
        role: { type: String, required: true },
        bio: { type: String, required: true, maxlength: 500 },
        image: { type: String, required: true },
        year: { type: String },
        social: {
            linkedin: { type: String },
            github: { type: String },
            twitter: { type: String },
            email: { type: String },
        },
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
        displayInTop6: { type: Boolean, default: true },
        memberCategory: {
            type: String,
            enum: ['executive', 'technical', 'operations', 'marketing']
        },
    },
    { timestamps: true }
);

teamMemberSchema.index({ order: 1 });
teamMemberSchema.index({ active: 1 });

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
