import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  tier: {
    type: String,
    enum: ['free', 'pro', 'team', 'enterprise'],
    default: 'free'
  },
  credits: {
    type: Number,
    default: 3,
    min: [0, 'Credits cannot be negative']
  },
  deviceFingerprint: {
    type: String,
    required: true,
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationExpires: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  socialLogins: {
    googleId: String,
    googleEmail: String,
    facebookId: String,
    facebookEmail: String,
    appleId: String,
    appleEmail: String
  }
}, {
  timestamps: true
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ deviceFingerprint: 1 });
userSchema.index({ tier: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for credit status
userSchema.virtual('hasCredits').get(function() {
  return this.credits > 0;
});

// JSON serialization
  userSchema.set('toJSON', {
    transform: function(doc, ret: any) {
      ret.password = undefined;
      delete ret.verificationToken;
      delete ret.resetPasswordToken;
      return ret;
    }
  });

export const User = mongoose.model<IUser>('User', userSchema); 