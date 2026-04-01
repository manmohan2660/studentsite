import dbConnect from '@/lib/db/connect';
import Article from '@/models/Article';
import { IArticle } from '@/models/Article';
import { normalizeSlug, generateSlug } from '@/lib/utils/slug';

export class ArticleService {
  // Create article
  static async createArticle(data: Partial<IArticle>): Promise<IArticle> {
    await dbConnect();

    // Generate or normalize slug
    if (!data.slug && data.title) {
      data.slug = generateSlug(data.title);
    } else if (data.slug) {
      data.slug = normalizeSlug(data.slug);
    }

    const article = await Article.create(data);
    return article;
  }

  // Get article by slug (with fallback to ID)
  static async getArticleBySlug(slugOrId: string): Promise<IArticle | null> {
    await dbConnect();
    
    // Normalize the slug for query
    const normalizedSlug = normalizeSlug(slugOrId);
    
    // Try by normalized slug first
    let article = await Article.findOne({ slug: normalizedSlug });
    
    // If not found and input looks like MongoDB ID, try by ID
    if (!article && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      article = await Article.findById(slugOrId);
    }
    
    // Last resort: try case-insensitive slug search
    if (!article) {
      article = await Article.findOne({
        slug: { $regex: `^${normalizedSlug}$`, $options: 'i' }
      });
    }

    if (article) {
      // Increment view count
      article.viewCount = (article.viewCount || 0) + 1;
      await article.save();
    }

    return article;
  }

  // Get all published articles
  static async getPublishedArticles(
    limit = 10,
    skip = 0
  ): Promise<{ articles: IArticle[]; total: number }> {
    await dbConnect();

    const total = await Article.countDocuments({ published: true });
    const articles = await Article.find({ published: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .skip(skip);

    return { articles, total };
  }

  // Get featured articles
  static async getFeaturedArticles(limit = 3): Promise<IArticle[]> {
    await dbConnect();
    const articles = await Article.find({ published: true, featured: true })
      .limit(limit)
      .sort({ publishedAt: -1 });

    return articles;
  }

  // Get all articles (admin)
  static async getAllArticles(limit = 20, skip = 0): Promise<IArticle[]> {
    await dbConnect();
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return articles;
  }

  // Update article
  static async updateArticle(
    idOrSlug: string,
    data: Partial<IArticle>
  ): Promise<IArticle | null> {
    await dbConnect();

    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    // Normalize slug in update data
    if (data.slug) {
      data.slug = normalizeSlug(data.slug);
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

    let article = await Article.findOneAndUpdate(query, data, {
      new: true,
      runValidators: true,
    });

    // If not found by slug, try case-insensitive search
    if (!article && !idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      const normalizedSlug = normalizeSlug(idOrSlug);
      article = await Article.findOneAndUpdate(
        { slug: { $regex: `^${normalizedSlug}$`, $options: 'i' } },
        data,
        { new: true, runValidators: true }
      );
    }

    return article;
  }

  // Delete article
  static async deleteArticle(idOrSlug: string): Promise<boolean> {
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
    
    let result = await Article.findOneAndDelete(query);
    
    // If not found by slug, try case-insensitive search
    if (!result && !idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      const normalizedSlug = normalizeSlug(idOrSlug);
      result = await Article.findOneAndDelete({
        slug: { $regex: `^${normalizedSlug}$`, $options: 'i' }
      });
    }
    
    return !!result;
  }

  // Search articles
  static async searchArticles(query: string): Promise<IArticle[]> {
    await dbConnect();
    const articles = await Article.find(
      { $text: { $search: query }, published: true },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    return articles;
  }
}
