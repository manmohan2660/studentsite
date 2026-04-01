import StudyMaterial, { IStudyMaterial } from '@/models/StudyMaterial';
import dbConnect from '@/lib/db/connect';
import { normalizeSlug, generateSlug } from '@/lib/utils/slug';

export class StudyMaterialService {
  static async createMaterial(materialData: Partial<IStudyMaterial>): Promise<IStudyMaterial> {
    try {
      await dbConnect();
      
      // Generate or normalize slug
      if (!materialData.slug && materialData.title) {
        materialData.slug = generateSlug(materialData.title);
      } else if (materialData.slug) {
        materialData.slug = normalizeSlug(materialData.slug);
      }
      
      const material = new StudyMaterial(materialData);
      return await material.save();
    } catch (error: any) {
      throw new Error(`Failed to create study material: ${error.message}`);
    }
  }

  static async getMaterialBySlug(slug: string): Promise<IStudyMaterial | null> {
    try {
      await dbConnect();
      
      // Normalize the slug for query
      const normalizedSlug = normalizeSlug(slug);
      
      // Try by normalized slug first
      let material = await StudyMaterial.findOne({ slug: normalizedSlug })
        .populate('author', 'name email')
        .exec();
      
      // If not found and input looks like MongoDB ID, try by ID
      if (!material && slug.match(/^[0-9a-fA-F]{24}$/)) {
        material = await StudyMaterial.findById(slug)
          .populate('author', 'name email')
          .exec();
      }
      
      // Last resort: try case-insensitive slug search
      if (!material) {
        material = await StudyMaterial.findOne({
          slug: { $regex: `^${normalizedSlug}$`, $options: 'i' }
        })
          .populate('author', 'name email')
          .exec();
      }
      
      return material;
    } catch (error: any) {
      throw new Error(`Failed to fetch material: ${error.message}`);
    }
  }

  static async getMaterialById(id: string): Promise<IStudyMaterial | null> {
    try {
      await dbConnect();
      return await StudyMaterial.findById(id)
        .populate('author', 'name email')
        .exec();
    } catch (error: any) {
      throw new Error(`Failed to fetch material: ${error.message}`);
    }
  }

  static async getMaterialsBySubject(subject: string): Promise<IStudyMaterial[]> {
    try {
      await dbConnect();
      return await StudyMaterial.find({ subject, published: true })
        .populate('author', 'name email')
        .sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(`Failed to fetch materials: ${error.message}`);
    }
  }

  static async getMaterialsByCategory(category: string): Promise<IStudyMaterial[]> {
    try {
      await dbConnect();
      return await StudyMaterial.find({ category, published: true })
        .populate('author', 'name email')
        .sort({ viewCount: -1 });
    } catch (error: any) {
      throw new Error(`Failed to fetch materials: ${error.message}`);
    }
  }

  static async getMaterialsByBranch(course: string, branch: string): Promise<IStudyMaterial[]> {
    try {
      await dbConnect();
      return await StudyMaterial.find({ course, branch, published: true })
        .populate('author', 'name email')
        .sort({ viewCount: -1 });
    } catch (error: any) {
      throw new Error(`Failed to fetch materials: ${error.message}`);
    }
  }

  static async getMaterialsByExam(examType: string): Promise<IStudyMaterial[]> {
    try {
      await dbConnect();
      return await StudyMaterial.find({ examType, published: true })
        .populate('author', 'name email')
        .sort({ viewCount: -1 });
    } catch (error: any) {
      throw new Error(`Failed to fetch materials: ${error.message}`);
    }
  }

  static async getMaterialsBySkill(skillPath: string): Promise<IStudyMaterial[]> {
    try {
      await dbConnect();
      return await StudyMaterial.find({ skillPath, published: true })
        .populate('author', 'name email')
        .sort({ viewCount: -1 });
    } catch (error: any) {
      throw new Error(`Failed to fetch materials: ${error.message}`);
    }
  }

  static async searchMaterials(query: string): Promise<IStudyMaterial[]> {
    try {
      await dbConnect();
      return await StudyMaterial.find(
        {
          $text: { $search: query },
          published: true,
        },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(20);
    } catch (error: any) {
      throw new Error(`Failed to search materials: ${error.message}`);
    }
  }

  static async updateMaterial(idOrSlug: string, updates: Partial<IStudyMaterial>): Promise<IStudyMaterial | null> {
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
      
      let material = await StudyMaterial.findOneAndUpdate(
        query,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('author', 'name email');
      
      // If not found by slug, try case-insensitive search
      if (!material && !idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        const normalizedSlug = normalizeSlug(idOrSlug);
        material = await StudyMaterial.findOneAndUpdate(
          { slug: { $regex: `^${normalizedSlug}$`, $options: 'i' } },
          { ...updates, updatedAt: new Date() },
          { new: true, runValidators: true }
        ).populate('author', 'name email');
      }
      
      return material;
    } catch (error: any) {
      throw new Error(`Failed to update material: ${error.message}`);
    }
  }

  static async deleteMaterial(idOrSlug: string): Promise<boolean> {
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
      
      let result = await StudyMaterial.findOneAndDelete(query);
      
      // If not found by slug, try case-insensitive search
      if (!result && !idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        const normalizedSlug = normalizeSlug(idOrSlug);
        result = await StudyMaterial.findOneAndDelete({
          slug: { $regex: `^${normalizedSlug}$`, $options: 'i' }
        });
      }
      
      return !!result;
    } catch (error: any) {
      throw new Error(`Failed to delete material: ${error.message}`);
    }
  }

  static async incrementViewCount(id: string): Promise<void> {
    try {
      await dbConnect();
      await StudyMaterial.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    } catch (error: any) {
      throw new Error(`Failed to update view count: ${error.message}`);
    }
  }

  static async getMaterialStats(): Promise<any> {
    try {
      await dbConnect();
      const totalMaterials = await StudyMaterial.countDocuments({ published: true });
      const byCategory = await StudyMaterial.aggregate([
        { $match: { published: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);
      const totalViews = await StudyMaterial.aggregate([
        { $match: { published: true } },
        { $group: { _id: null, views: { $sum: '$viewCount' } } },
      ]);

      return {
        totalMaterials,
        totalViews: totalViews[0]?.views || 0,
        byCategory: Object.fromEntries(byCategory.map((item) => [item._id, item.count])),
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch material stats: ${error.message}`);
    }
  }

  static async getPublishedMaterials(
    limit = 10,
    skip = 0
  ): Promise<{ materials: IStudyMaterial[]; total: number }> {
    try {
      await dbConnect();
      const total = await StudyMaterial.countDocuments({ published: true });
      const materials = await StudyMaterial.find({ published: true })
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      return { materials, total };
    } catch (error: any) {
      throw new Error(`Failed to fetch published materials: ${error.message}`);
    }
  }
}
