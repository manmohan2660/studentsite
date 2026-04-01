import mongoose, { Schema, Document } from 'mongoose';

export interface IPageView extends Document {
  pagePath: string;
  pageTitle: string;
  referrer: string;
  userAgent: string;
  ipAddress: string;
  createdAt: Date;
}

const PageViewSchema = new Schema<IPageView>(
  {
    pagePath: {
      type: String,
      required: true,
    },
    pageTitle: String,
    referrer: String,
    userAgent: String,
    ipAddress: String,
  },
  {
    timestamps: true,
  }
);

// Index for querying
PageViewSchema.index({ pagePath: 1, createdAt: -1 });

export default mongoose.models.PageView ||
  mongoose.model<IPageView>('PageView', PageViewSchema);
