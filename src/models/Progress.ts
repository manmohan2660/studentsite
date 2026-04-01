import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  roadmapId: mongoose.Types.ObjectId;
  completedTopics: string[]; // Array of topic IDs
  startedAt: Date;
  completedAt?: Date;
  progress: number; // 0-100 percentage
  lastAccessedAt: Date;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
    },
    completedTopics: [String],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    notes: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
progressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });
progressSchema.index({ userId: 1, isActive: 1 });

export default mongoose.models.Progress ||
  mongoose.model<IProgress>('Progress', progressSchema);
