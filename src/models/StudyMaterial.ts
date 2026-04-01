import mongoose, { Document, Schema } from 'mongoose';
import { normalizeSlug } from '@/lib/utils/slug';

export interface IStudyMaterial extends Document {
  title: string;
  slug: string;
  description: string;
  category: 'notes' | 'guide' | 'exercise' | 'resource';
  subject: string;
  course?: string; // e.g., "BTech", "MBA"
  branch?: string; // e.g., "CSE", "ECE"
  examType?: string; // e.g., "UPSC", "SSC"
  skillPath?: string; // e.g., "Web Dev", "AI/ML"
  content: string; // HTML content
  keyPoints?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  downloadUrl?: string;
  imageUrl?: string; // Material folder/thumbnail image
  attachments?: Array<{ fileName: string; fileUrl: string; fileSize: number; uploadedAt: Date }>;
  author: mongoose.Types.ObjectId;
  viewCount: number;
  published: boolean;
  publishedAt?: Date;
  tags: string[];
  relatedArticles?: string[];
  relatedRoadmaps?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const studyMaterialSchema = new Schema<IStudyMaterial>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['notes', 'guide', 'exercise', 'resource'],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    course: String,
    branch: String,
    examType: String,
    skillPath: String,
    content: {
      type: String,
      required: true,
    },
    keyPoints: [String],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    downloadUrl: String,
    imageUrl: String,
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileSize: Number,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    tags: [String],
    relatedArticles: [String],
    relatedRoadmaps: [String],
  },
  { timestamps: true }
);

// Indexes
studyMaterialSchema.index({ subject: 1 });
studyMaterialSchema.index({ published: 1 });
studyMaterialSchema.index({ course: 1, branch: 1 });

// Normalize slug before saving
studyMaterialSchema.pre('save', async function(this: IStudyMaterial) {
  if (this.slug) {
    this.slug = normalizeSlug(this.slug);
  }
});

// Normalize slug before updating
studyMaterialSchema.pre('findOneAndUpdate', async function(this: any) {
  const update = this.getUpdate() as any;
  if (update && update.slug && typeof update.slug === 'string') {
    update.slug = normalizeSlug(update.slug);
  }
});

export default mongoose.models.StudyMaterial ||
  mongoose.model<IStudyMaterial>('StudyMaterial', studyMaterialSchema);
