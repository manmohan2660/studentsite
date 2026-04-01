import mongoose, { Document, Schema } from 'mongoose';
import { normalizeSlug } from '@/lib/utils/slug';

export interface ITopic {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "2 weeks"
  resources?: string[]; // Article IDs or URLs
  isCompleted?: boolean;
  subtopics?: ITopic[];
}

export interface IRoadmap extends Document {
  title: string;
  slug: string;
  description: string;
  category: 'semester' | 'govt-exam' | 'skill';
  targetAudience: string; // e.g., "CSE Students", "UPSC Aspirants"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // e.g., "4 months"
  topics: ITopic[];
  prerequisites?: string[];
  relatedArticles?: string[]; // Article IDs
  relatedTools?: string[]; // Tool IDs
  icon?: string;
  color?: string;
  featured: boolean;
  published: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const topicSchema = new Schema<ITopic>({
  id: String,
  title: String,
  description: String,
  duration: String,
  resources: [String],
  isCompleted: { type: Boolean, default: false },
  subtopics: [{ type: Schema.Types.Mixed }],
});

const roadmapSchema = new Schema<IRoadmap>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['semester', 'govt-exam', 'skill'],
      required: true,
    },
    targetAudience: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration: {
      type: String,
      required: true,
    },
    topics: [topicSchema],
    prerequisites: [String],
    relatedArticles: [mongoose.Schema.Types.ObjectId],
    relatedTools: [String],
    icon: String,
    color: String,
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
roadmapSchema.index({ category: 1 });
roadmapSchema.index({ published: 1 });

// Normalize slug before saving
roadmapSchema.pre('save', async function(this: IRoadmap) {
  if (this.slug) {
    this.slug = normalizeSlug(this.slug);
  }
});

// Normalize slug before updating
roadmapSchema.pre('findOneAndUpdate', async function(this: any) {
  const update = this.getUpdate() as any;
  if (update && update.slug && typeof update.slug === 'string') {
    update.slug = normalizeSlug(update.slug);
  }
});

export default mongoose.models.Roadmap ||
  mongoose.model<IRoadmap>('Roadmap', roadmapSchema);
