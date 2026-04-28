import mongoose, { Schema, Document } from 'mongoose';

// ─── Announcement ────────────────────────────────────────────────────────────
export interface IAnnouncement extends Document {
  title: string;
  content: string;
  district?: string;
  isGlobal: boolean;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  expiresAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title:    { type: String, required: true, trim: true },
    content:  { type: String, required: true },
    district: { type: String, default: '' },
    isGlobal: { type: Boolean, default: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

AnnouncementSchema.index({ isActive: 1, isGlobal: 1, district: 1 });

// ─── Gallery ─────────────────────────────────────────────────────────────────
export interface IGallery extends Document {
  title: string;
  imageUrl: string;
  imagePublicId: string;  // Cloudinary publicId
  caption?: string;
  district?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  submittedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title:         { type: String, required: true, trim: true },
    imageUrl:      { type: String, required: true },
    imagePublicId: { type: String, default: '' },
    caption:       { type: String, default: '' },
    district:      { type: String, default: '' },
    category: {
      type: String,
      enum: ['events', 'heritage', 'community', 'festivals', 'achievements'],
      default: 'community',
    },
    tags:        [{ type: String }],
    isPublished: { type: Boolean, default: false },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

GallerySchema.index({ isPublished: 1, district: 1, category: 1 });

// ─── District ─────────────────────────────────────────────────────────────────
export interface IDistrict extends Document {
  name: string;
  slug: string;
  description: string;
  image?: string;
  region: string;
  division?: string;
  headquarters?: string;
  area?: string;
  memberCount: number;
  isActive: boolean;
}

const DistrictSchema = new Schema<IDistrict>(
  {
    name:         { type: String, required: true, unique: true },
    slug:         { type: String, required: true, unique: true },
    description:  { type: String, required: true },
    image:        { type: String, default: '' },
    region:       { type: String, required: true },
    division:     { type: String, default: '' },
    headquarters: { type: String, default: '' },
    area:         { type: String, default: '' },
    memberCount:  { type: Number, default: 0 },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

DistrictSchema.index({ slug: 1 });
DistrictSchema.index({ region: 1, isActive: 1 });

// ─── Notification ─────────────────────────────────────────────────────────────
export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'approval' | 'rejection' | 'revision' | 'announcement' | 'general';
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['approval', 'rejection', 'revision', 'announcement', 'general'],
      default: 'general',
    },
    isRead: { type: Boolean, default: false },
    link:   { type: String, default: '' },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

// ─── Activity Log ─────────────────────────────────────────────────────────────
export interface IActivityLog extends Document {
  action: string;
  performedBy: mongoose.Types.ObjectId;
  targetId?: mongoose.Types.ObjectId;
  targetModel?: string;
  details: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    action:       { type: String, required: true },
    performedBy:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId:     { type: Schema.Types.ObjectId },
    targetModel:  { type: String },
    details:      { type: String, default: '' },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ createdAt: -1 });

// ─── Exports ──────────────────────────────────────────────────────────────────
export const Announcement = mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
export const Gallery      = mongoose.models.Gallery      || mongoose.model<IGallery>('Gallery', GallerySchema);
export const District     = mongoose.models.District     || mongoose.model<IDistrict>('District', DistrictSchema);
export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
export const ActivityLog  = mongoose.models.ActivityLog  || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
