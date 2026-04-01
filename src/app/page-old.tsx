import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'StudentTools - Free Online Tools for Students',
  description:
    'A comprehensive platform offering free student tools including CGPA calculator, age calculator, password generator, and educational articles.',
  openGraph: {
    title: 'StudentTools - Free Online Tools for Students',
    description:
      'A comprehensive platform offering free student tools including CGPA calculator, age calculator, password generator, and educational articles.',
    type: 'website',
  },
};

async function HomePage() {
  // Safely fetch articles with fallback
  let articles: any[] = [];
  try {
    if (process.env.MONGODB_URI) {
      const { ArticleService } = await import('@/services/ArticleService');
      const result = await ArticleService.getPublishedArticles(3, 0);
      articles = result.articles;
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    articles = [];
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">StudentTools</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your all-in-one platform for free student tools and educational
            resources. Simplify your studies with our collection of calculators,
            generators, and converters.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/tools"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
            >
              Explore Tools
            </Link>
            <Link
              href="/articles"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10"
            >
              Read Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'CGPA Calculator',
                description: 'Calculate your CGPA easily',
                href: '/tools/cgpa-calculator',
                icon: '📊',
              },
              {
                title: 'Age Calculator',
                description: 'Find your exact age in days',
                href: '/tools/age-calculator',
                icon: '🎂',
              },
              {
                title: 'Password Generator',
                description: 'Generate secure passwords',
                href: '/tools/password-generator',
                icon: '🔐',
              },
              {
                title: 'Percentage Calculator',
                description: 'Calculate percentages instantly',
                href: '/tools/percentage-calculator',
                icon: '📈',
              },
              {
                title: 'Image Size Converter',
                description: 'Convert image dimensions',
                href: '/tools/image-converter',
                icon: '🖼️',
              },
            ].map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-600">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Latest Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article._id.toString()}
                href={`/articles/${article.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        Read →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/articles"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="mb-8 max-w-xl mx-auto">
            Access all our tools and resources completely free. No sign-up
            required to use our calculators and tools.
          </p>
          <Link
            href="/tools"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            Explore Tools Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
