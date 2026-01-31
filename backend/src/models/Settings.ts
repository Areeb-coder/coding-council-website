import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
    key: string;
    homePageContent: {
        heroTagline?: string;
        heroSubtitle?: string;
        aboutMission?: string;
        aboutVision?: string;
    };
    socialLinks: {
        linkedin?: string;
        instagram?: string;
        github?: string;
        email?: string;
        whatsapp?: string;
        twitter?: string;
        youtube?: string;
        discord?: string;
    };
    communityStats: {
        members?: number;
        events?: number;
        workshops?: number;
        projects?: number;
    };
    announcementBanner: {
        isActive: boolean;
        text?: string;
        backgroundColor?: string;
        textColor?: string;
        actionButtonText?: string;
        actionButtonLink?: string;
    };
    updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
    {
        key: { type: String, required: true, unique: true, default: 'global' },
        homePageContent: {
            heroTagline: { type: String },
            heroSubtitle: { type: String },
            aboutMission: { type: String },
            aboutVision: { type: String },
        },
        socialLinks: {
            linkedin: { type: String },
            instagram: { type: String },
            github: { type: String },
            email: { type: String },
            whatsapp: { type: String },
            twitter: { type: String },
            youtube: { type: String },
            discord: { type: String },
        },
        communityStats: {
            members: { type: Number, default: 0 },
            events: { type: Number, default: 0 },
            workshops: { type: Number, default: 0 },
            projects: { type: Number, default: 0 },
        },
        announcementBanner: {
            isActive: { type: Boolean, default: false },
            text: { type: String },
            backgroundColor: { type: String, default: '#10B981' },
            textColor: { type: String, default: '#FFFFFF' },
            actionButtonText: { type: String },
            actionButtonLink: { type: String },
        },
    },
    { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
