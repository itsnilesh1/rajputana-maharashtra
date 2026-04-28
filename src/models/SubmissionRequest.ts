import mongoose, { Schema, Document } from 'mongoose';

export type RequestType = 
  | 'member_profile'
  | 'event'
  | 'article'
  | 'gallery'
  | 'announcement'
  | 'contact'
  | 'volunteer'
  | 'suggestion';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested';

export interface ISubmissionRequest extends Document {
  requestType: RequestType;
  submittedBy: mongoose.Types.ObjectId;
  payload: Record<string, unknown>;
  status: RequestStatus;
  moderatorNotes: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  publishedId?: mongoose.Types.ObjectId;
  publishedModel?: string;
  version: number;
  previousVersionId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionRequestSchema = new Schema<ISubmissionRequest>(
  {
    requestType: {
      type: String,
      enum: ['member_profile', 'event', 'article', 'gallery', 'announcement', 'contact', 'volunteer', 'suggestion'],
      required: true,
    },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'revision_requested'],
      default: 'pending',
    },
    moderatorNotes: { type: String, default: '' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    publishedId: { type: Schema.Types.ObjectId },
    publishedModel: { type: String },
    version: { type: Number, default: 1 },
    previousVersionId: { type: Schema.Types.ObjectId, ref: 'SubmissionRequest' },
  },
  { timestamps: true }
);

SubmissionRequestSchema.index({ status: 1, requestType: 1 });
SubmissionRequestSchema.index({ submittedBy: 1, status: 1 });
SubmissionRequestSchema.index({ createdAt: -1 });

export default mongoose.models.SubmissionRequest ||
  mongoose.model<ISubmissionRequest>('SubmissionRequest', SubmissionRequestSchema);
