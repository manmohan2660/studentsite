import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  slug: string;
  description: string;
  course?: mongoose.Types.ObjectId; // Reference to course if it's course-specific
  examType?: string; // e.g., "UPSC", "SSC" if it's exam-specific
  icon?: string;
  color?: string;
  order: number; // Display order
  topics: string[]; // Topic names as strings
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
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
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    examType: {
      type: String,
      enum: ['upsc', 'ssc', 'banking', 'railway', 'gate', 'jee', null],
      default: null,
    },
    icon: String,
    color: String,
    order: {
      type: Number,
      default: 0,
    },
    topics: [String],
  },
  { timestamps: true }
);

// Indexes
subjectSchema.index({ slug: 1 });
subjectSchema.index({ course: 1 });
subjectSchema.index({ examType: 1 });

export default mongoose.models.Subject ||
  mongoose.model<ISubject>('Subject', subjectSchema);
