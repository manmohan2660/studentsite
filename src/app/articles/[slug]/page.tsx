import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleService } from '@/services/ArticleService';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await ArticleService.getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} - StudentTools`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt ? article.publishedAt.toISOString() : undefined,
    },
  };
}

async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await ArticleService.getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { articles: relatedArticles } = await ArticleService.getPublishedArticles(
    3,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <header className="mb-8">
          {/* Featured Image */}
          {article.featuredImage && (
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-96 object-cover rounded-lg mb-8 shadow-lg"
            />
          )}
          
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {article.category}
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span>{article.author}</span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{article.viewCount} views</span>
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="border-t border-gray-200 py-8">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex gap-2 flex-wrap">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.slice(0, 3).map((related) => (
                <Link
                  key={related._id.toString()}
                  href={`/articles/${related.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
                    <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-blue-600 transition">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ArticleDetailPage;
