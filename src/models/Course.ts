import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  slug: string;
  description: string;
  type: 'btech' | 'bsc' | 'ba' | 'bca' | 'mba' | 'mtech' | 'msc' | 'other';
  university?: string;
  duration: string; // e.g., "4 years"
  branches?: string[]; // e.g., ["CSE", "ECE", "Mechanical"]
  subjects?: mongoose.Types.ObjectId[];
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
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
    type: {
      type: String,
      enum: ['btech', 'bsc', 'ba', 'bca', 'mba', 'mtech', 'msc', 'other'],
      required: true,
    },
    university: String,
    duration: String,
    branches: [String],
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    icon: String,
    color: String,
  },
  { timestamps: true }
);

// Indexes
courseSchema.index({ slug: 1 });
courseSchema.index({ type: 1 });

export default mongoose.models.Course ||
  mongoose.model<ICourse>('Course', courseSchema);
