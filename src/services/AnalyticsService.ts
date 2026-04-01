import dbConnect from '@/lib/db/connect';
import ToolUsage from '@/models/ToolUsage';
import { IToolUsage } from '@/models/ToolUsage';

export class AnalyticsService {
  // Track tool usage
  static async trackToolUsage(data: Partial<IToolUsage>): Promise<IToolUsage> {
    await dbConnect();
    const usage = await ToolUsage.create(data);
    return usage;
  }

  // Get tool usage stats
  static async getToolStats(toolName?: string) {
    await dbConnect();

    const query = toolName ? { toolName } : {};
    const total = await ToolUsage.countDocuments(query);

    const stats = await ToolUsage.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$toolName',
          count: { $sum: 1 },
          lastUsed: { $max: '$createdAt' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return { total, stats };
  }

  // Get page view stats
  static async getPageViewStats(limit = 10) {
    await dbConnect();
    const PageView = require('@/models/PageView').default;

    const pageViews = await PageView.aggregate([
      {
        $group: {
          _id: '$pagePath',
          count: { $sum: 1 },
          title: { $first: '$pageTitle' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    return pageViews;
  }

  // Get analytics summary
  static async getAnalyticsSummary() {
    await dbConnect();
    const PageView = require('@/models/PageView').default;

    const toolUsageStats = await this.getToolStats();
    const pageViewStats = await this.getPageViewStats();

    const totalPageViews = await PageView.countDocuments();
    const totalToolUsage = await ToolUsage.countDocuments();

    return {
      totalPageViews,
      totalToolUsage,
      toolUsageStats,
      pageViewStats,
    };
  }
}
