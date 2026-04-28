import mongoose, { Schema, Document } from 'mongoose';

export interface IMemberProfile extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  district: string;
  city: string;
  clan: string;
  profession: string;
  bio: string;
  photo: string;
  photoPublicId: string; // Cloudinary public_id for deletion on update
  phone?: string;
  isPublic: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  moderatorNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MemberProfileSchema = new Schema<IMemberProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    district: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    clan: { type: String, required: true, trim: true, maxlength: 100 },
    profession: { type: String, required: true, trim: true, maxlength: 100 },
    bio: { type: String, maxlength: 1000, default: '' },
    photo: { type: String, default: '' },
    photoPublicId: { type: String, default: '' }, // Cloudinary publicId
    phone: { type: String, default: '' },
    isPublic: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'revision_requested'],
      default: 'pending',
    },
    moderatorNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

MemberProfileSchema.index({ district: 1, approvalStatus: 1 });
MemberProfileSchema.index({ clan: 1 });
MemberProfileSchema.index({ approvalStatus: 1, isPublic: 1 });

export default mongoose.models.MemberProfile ||
  mongoose.model<IMemberProfile>('MemberProfile', MemberProfileSchema);
