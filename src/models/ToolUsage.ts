import mongoose, { Schema, Document } from 'mongoose';

export interface IToolUsage extends Document {
  toolName: string;
  toolType: string;
  input: Record<string, any>;
  result: Record<string, any>;
  userAgent: string;
  ipAddress: string;
  createdAt: Date;
}

const ToolUsageSchema = new Schema<IToolUsage>(
  {
    toolName: {
      type: String,
      required: true,
      enum: [
        'CGPA Calculator',
        'Age Calculator',
        'Percentage Calculator',
        'Password Generator',
        'Image Size Converter',
      ],
    },
    toolType: {
      type: String,
      required: true,
    },
    input: {
      type: Schema.Types.Mixed,
      required: true,
    },
    result: {
      type: Schema.Types.Mixed,
      required: true,
    },
    userAgent: String,
    ipAddress: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ToolUsage ||
  mongoose.model<IToolUsage>('ToolUsage', ToolUsageSchema);
