import Roadmap, { IRoadmap } from '@/models/Roadmap';
import dbConnect from '@/lib/db/connect';
import { normalizeSlug, generateSlug } from '@/lib/utils/slug';

export class RoadmapService {
  static async createRoadmap(roadmapData: Partial<IRoadmap>): Promise<IRoadmap> {
    try {
      await dbConnect();
      
      // Generate or normalize slug
      if (!roadmapData.slug && roadmapData.title) {
        roadmapData.slug = generateSlug(roadmapData.title);
      } else if (roadmapData.slug) {
        roadmapData.slug = normalizeSlug(roadmapData.slug);
      }
      
      const roadmap = new Roadmap(roadmapData);
      return await roadmap.save();
    } catch (error: any) {
      throw new Error(`Failed to create roadmap: ${error.message}`);
    }
  }

  static async getRoadmapBySlug(slug: string): Promise<IRoadmap | null> {
    try {
      await dbConnect();
      
      // Normalize the slug for query
      const normalizedSlug = normalizeSlug(slug);
      
      // Try by normalized slug first
      let roadmap = await Roadmap.findOne({ slug: normalizedSlug })
        .populate('createdBy', 'name email')
        .populate('relatedArticles')
        .populate('relatedTools');
      
      // If not found and input looks like MongoDB ID, try by ID
      if (!roadmap && slug.match(/^[0-9a-fA-F]{24}$/)) {
        roadmap = await Roadmap.findById(slug)
          .populate('createdBy', 'name email')
          .populate('relatedArticles')
          .populate('relatedTools');
      }
      
      // Last resort: try case-insensitive slug search
      if (!roadmap) {
        roadmap = await Roadmap.findOne({
          slug: { $regex: `^${normalizedSlug}$`, $options: 'i' }
        })
          .populate('createdBy', 'name email')
          .populate('relatedArticles')
          .populate('relatedTools');
      }
      
      return roadmap;
    } catch (error: any) {
      throw new Error(`Failed to fetch roadmap: ${error.message}`);
    }
  }

  static async getRoadmapById(id: string): Promise<IRoadmap | null> {
    try {
      await dbConnect();
      return await Roadmap.findById(id)
        .populate('createdBy', 'name email')
        .populate('relatedArticles')
        .populate('relatedTools');
    } catch (error: any) {
      throw new Error(`Failed to fetch roadmap: ${error.message}`);
    }
  }

  static async getRoadmapsByCategory(category: string): Promise<IRoadmap[]> {
    try {
      await dbConnect();
      return await Roadmap.find({ category, published: true })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(`Failed to fetch roadmaps: ${error.message}`);
    }
  }

  static async getFeaturedRoadmaps(limit: number = 6): Promise<IRoadmap[]> {
    try {
      await dbConnect();
      return await Roadmap.find({ published: true, featured: true })
        .populate('createdBy', 'name email')
        .limit(limit)
        .sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(`Failed to fetch featured roadmaps: ${error.message}`);
    }
  }

  static async getAllRoadmaps(filter: any = {}): Promise<IRoadmap[]> {
    try {
      await dbConnect();
      return await Roadmap.find({ published: true, ...filter })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(`Failed to fetch roadmaps: ${error.message}`);
    }
  }

  static async updateRoadmap(idOrSlug: string, updates: Partial<IRoadmap>): Promise<IRoadmap | null> {
    try {
      await dbConnect();
      
      // Normalize slug in update data
      if (updates.slug) {
        updates.slug = normalizeSlug(updates.slug);
      }
      
      // Try finding by ID first
      let query: any = {};
      if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        query = { _id: idOrSlug };
      } else {
        // Normalize slug for query
        const normalizedSlug = normalizeSlug(idOrSlug);
        query = { slug: normalizedSlug };
      }
      
      let roadmap = await Roadmap.findOneAndUpdate(
        query,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email');
      
      // If not found by slug, try case-insensitive search
      if (!roadmap && !idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        const normalizedSlug = normalizeSlug(idOrSlug);
        roadmap = await Roadmap.findOneAndUpdate(
          { slug: { $regex: `^${normalizedSlug}$`, $options: 'i' } },
          { ...updates, updatedAt: new Date() },
          { new: true, runValidators: true }
        ).populate('createdBy', 'name email');
      }
      
      return roadmap;
    } catch (error: any) {
      throw new Error(`Failed to update roadmap: ${error.message}`);
    }
  }

  static async deleteRoadmap(idOrSlug: string): Promise<boolean> {
    try {
      await dbConnect();
      // Try finding by ID first
      let query: any = {};
      if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        query = { _id: idOrSlug };
      } else {
        // Normalize slug for query
        const normalizedSlug = normalizeSlug(idOrSlug);
        query = { slug: normalizedSlug };
      }
      
      let result = await Roadmap.findOneAndDelete(query);
      
      // If not found by slug, try case-insensitive search
      if (!result && !idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        const normalizedSlug = normalizeSlug(idOrSlug);
        result = await Roadmap.findOneAndDelete({
          slug: { $regex: `^${normalizedSlug}$`, $options: 'i' }
        });
      }
      
      return !!result;
    } catch (error: any) {
      throw new Error(`Failed to delete roadmap: ${error.message}`);
    }
  }

  static async searchRoadmaps(query: string): Promise<IRoadmap[]> {
    try {
      await dbConnect();
      return await Roadmap.find(
        {
          $text: { $search: query },
          published: true,
        },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(10);
    } catch (error: any) {
      throw new Error(`Failed to search roadmaps: ${error.message}`);
    }
  }

  static async getRoadmapStats(): Promise<any> {
    try {
      await dbConnect();
      const totalRoadmaps = await Roadmap.countDocuments({ published: true });
      const byCategory = await Roadmap.aggregate([
        { $match: { published: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);
      const featured = await Roadmap.countDocuments({ published: true, featured: true });

      return {
        totalRoadmaps,
        featured,
        byCategory: Object.fromEntries(byCategory.map((item) => [item._id, item.count])),
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch roadmap stats: ${error.message}`);
    }
  }
}
