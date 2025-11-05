import { Schema, model, Document, Types } from 'mongoose'; // <-- 1. IMPORT 'Types'
import bcrypt from 'bcryptjs';
import { UserRole, ROLE_LIST, ROLES } from '../constants/roles.constants';

// Interface for the User document
export interface IUser extends Document {
  _id: Types.ObjectId; // <-- 2. ADD THIS LINE
  email: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  password?: string;
  googleId?: string;
  roles: UserRole[];
  refreshTokens: string[];
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true, 
    trim: true,
  },
  address: {
    type: String,
    required: true, 
    trim: true,
  },
  password: { type: String, required: false, select: false },
  googleId: { type: String, required: false, unique: true, sparse: true },
  roles: { type: [String], enum: ROLE_LIST, default: [ROLES.User] },
  refreshTokens: [{ type: String, select: false }],
}, { timestamps: true });

// --- Mongoose Middleware & Methods ---

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare candidate password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', userSchema);