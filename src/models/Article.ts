import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true, maxlength: 500 },
    content: { type: String, required: true },
    image: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['history', 'culture', 'heritage', 'traditions', 'personalities', 'achievements', 'news'],
    },
    tags: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ArticleSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
  }
  next();
});

ArticleSchema.index({ isPublished: 1, category: 1 });
ArticleSchema.index({ createdAt: -1 });
ArticleSchema.index({ '$**': 'text' });

export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
