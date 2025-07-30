import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    tier: 'free' | 'pro' | 'team' | 'enterprise';
    credits: number;
    deviceFingerprint: string;
    isVerified: boolean;
    verificationToken?: string;
    verificationExpires?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    lastLogin?: Date;
    socialLogins?: {
        googleId?: string;
        googleEmail?: string;
        facebookId?: string;
        facebookEmail?: string;
        appleId?: string;
        appleEmail?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map