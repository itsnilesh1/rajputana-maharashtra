import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'guest' | 'user' | 'moderator' | 'admin';
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false, minlength: 6 },
    role: { type: String, enum: ['guest', 'user', 'moderator', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    // Stored as SHA-256 hash — raw token only sent by email, never stored
    passwordResetToken: { type: String, select: false },
    passwordResetExpiry: { type: Date, select: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
