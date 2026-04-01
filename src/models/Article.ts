import mongoose, { Schema, Document } from 'mongoose';
import { normalizeSlug } from '@/lib/utils/slug';

export interface IArticle extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt: Date;
  updatedAt: Date;
  createdAt: Date;
  viewCount: number;
  fileUrl?: string; // Attached file URL
  fileName?: string; // Original file name
  featuredImage?: string; // Featured image URL
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt'],
      maxlength: [500, 'Excerpt cannot be more than 500 characters'],
    },
    author: {
      type: String,
      required: true,
      default: 'Admin',
    },
    category: {
      type: String,
      enum: ['Technology', 'Education', 'Tips', 'Tutorial', 'News'],
      default: 'Education',
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    fileUrl: String,
    fileName: String,
    featuredImage: String,
  },
  {
    timestamps: true,
  }
);

// Text index for search
ArticleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Normalize slug before saving
ArticleSchema.pre('save', async function(this: IArticle) {
  if (this.slug) {
    this.slug = normalizeSlug(this.slug);
  }
});

// Normalize slug before updating
ArticleSchema.pre('findOneAndUpdate', async function(this: any) {
  const update = this.getUpdate() as any;
  if (update && update.slug && typeof update.slug === 'string') {
    update.slug = normalizeSlug(update.slug);
  }
});

export default mongoose.models.Article ||
  mongoose.model<IArticle>('Article', ArticleSchema);
