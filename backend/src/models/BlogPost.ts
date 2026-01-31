import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    author: {
        name: string;
        avatar: string;
    };
    category: string;
    tags: string[];
    published: boolean;
    publishedAt?: Date;
    readTime: number;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        content: { type: String, required: true },
        excerpt: { type: String, required: true, maxlength: 300 },
        coverImage: { type: String, required: true },
        author: {
            name: { type: String, required: true },
            avatar: { type: String, required: true },
        },
        category: { type: String, required: true },
        tags: [{ type: String }],
        published: { type: Boolean, default: false },
        publishedAt: { type: Date },
        readTime: { type: Number, default: 5 },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Auto-generate slug from title
blogPostSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ published: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ tags: 1 });

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
