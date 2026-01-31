import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'super_admin';
    avatar?: string;
    lastLogin?: Date;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        name: { type: String, required: true, trim: true },
        role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
        avatar: { type: String },
        lastLogin: { type: Date },
        refreshToken: { type: String },
    },
    { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON
userSchema.set('toJSON', {
    transform: (_doc, ret: any) => {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
    },
});

export const User = mongoose.model<IUser>('User', userSchema);
