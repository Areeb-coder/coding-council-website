import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    authorName: string;
    authorRole?: string;
    authorCompany?: string;
    content: string;
    rating: number;
    authorPhoto?: string;
    isApproved: boolean;
    isFeatured: boolean;
    eventRef?: mongoose.Types.ObjectId;
    approvedBy?: string;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        authorName: { type: String, required: true, trim: true },
        authorRole: { type: String, trim: true },
        authorCompany: { type: String, trim: true },
        content: { type: String, required: true, maxlength: 1000 },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        authorPhoto: { type: String },
        isApproved: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
        eventRef: { type: Schema.Types.ObjectId, ref: 'Event' },
        approvedBy: { type: String },
        approvedAt: { type: Date },
    },
    { timestamps: true }
);

// Indexes
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ isFeatured: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
