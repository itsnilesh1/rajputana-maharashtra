import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  date: Date;
  endDate?: Date;
  venue: string;
  district: string;
  description: string;
  banner: string;
  organizer: string;
  contact?: string;
  isPublished: boolean;
  submittedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    venue: { type: String, required: true, trim: true },
    district: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String, default: '' },
    organizer: { type: String, required: true, trim: true },
    contact: { type: String, default: '' },
    isPublished: { type: Boolean, default: false },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

EventSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
  }
  next();
});

EventSchema.index({ date: -1, isPublished: 1 });
EventSchema.index({ district: 1, isPublished: 1 });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
