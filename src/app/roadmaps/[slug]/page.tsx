import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { RoadmapService } from '@/services/RoadmapService';

interface RoadmapDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RoadmapDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const roadmap = await RoadmapService.getRoadmapBySlug(slug);

    if (!roadmap) return { title: 'Roadmap Not Found' };

    return {
      title: `${roadmap.title} - StudentTools`,
      description: roadmap.description,
      openGraph: {
        title: roadmap.title,
        description: roadmap.description,
        type: 'article',
      },
    };
  } catch {
    return { title: 'Learning Roadmap' };
  }
}

async function RoadmapDetailPage({ params }: RoadmapDetailPageProps) {
  const { slug } = await params;

  try {
    const roadmap = await RoadmapService.getRoadmapBySlug(slug);

    if (!roadmap) {
      notFound();
    }

    // Get related articles
    const relatedArticles = await Promise.all(
      (roadmap.relatedArticles || []).slice(0, 3).map(async (articleId: any) => {
        try {
          return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleId}`, {
            next: { revalidate: 3600 },
          })
            .then((res) => res.json())
            .then((data) => data.data);
        } catch {
          return null;
        }
      })
    ).then((results) => results.filter(Boolean));

    const totalTopics = roadmap.topics?.length || 0;
    const totalDuration = roadmap.topics?.reduce((sum: number, topic: any) => sum + (topic.duration || 0), 0) || 0;

    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm">
            <Link href="/roadmaps" className="text-blue-600 hover:text-blue-700">
              Roadmaps
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{roadmap.title}</span>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-semibold">
                {roadmap.category}
              </span>
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-semibold">
                {roadmap.difficulty}
              </span>
              {roadmap.featured && (
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                  ⭐ Featured
                </span>
              )}
            </div>

            <h1 className="text-5xl font-bold mb-4 leading-tight">{roadmap.title}</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">{roadmap.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-blue-100">Topics</p>
                <p className="text-3xl font-bold">{totalTopics}</p>
              </div>
              <div>
                <p className="text-blue-100">Duration</p>
                <p className="text-3xl font-bold">{totalDuration} hrs</p>
              </div>
              <div>
                <p className="text-blue-100">Level</p>
                <p className="text-xl font-bold capitalize">{roadmap.difficulty}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Topics Section */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Learning Path</h2>

              {roadmap.topics && roadmap.topics.length > 0 ? (
                <div className="space-y-4">
                  {roadmap.topics.map((topic: any, index: number) => (
                    <TopicCard key={topic.id} topic={topic} index={index} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No topics available yet.</p>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sticky top-4">
                <h3 className="font-bold text-gray-900 mb-4">Roadmap Details</h3>

                {roadmap.prerequisites && roadmap.prerequisites.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Prerequisites</p>
                    <ul className="space-y-2">
                      {roadmap.prerequisites.map((prereq: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700">
                          ✓ {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {roadmap.createdBy && (
                  <div className="mb-6 pb-6 border-b border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">Created By</p>
                    <p className="font-semibold text-gray-900">
                      {typeof roadmap.createdBy === 'object' && 'name' in roadmap.createdBy
                        ? (roadmap.createdBy as any).name
                        : 'Admin'}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Last updated {new Date(roadmap.updatedAt || roadmap.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>

                {/* CTA Button */}
                <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
                  🚀 Start Learning
                </button>
              </div>
            </div>
          </div>

          {/* Related Content */}
          {relatedArticles.length > 0 && (
            <section className="mt-16 pt-12 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((article: any) => (
                  <Link
                    key={article._id}
                    href={`/articles/${article.slug}`}
                    className="group border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition"
                  >
                    <div className="text-sm text-blue-600 font-bold mb-2">{article.category}</div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">Ready to Master This Path?</h2>
            <p className="mb-6 text-blue-100">Get started today with structured learning and track your progress.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition">
                Enroll Now
              </button>
              <Link
                href="/roadmaps"
                className="px-8 py-3 bg-blue-500/30 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-500/50 transition"
              >
                Explore More Roadmaps
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading roadmap:', error);
    notFound();
  }
}

function TopicCard({ topic, index }: { topic: any; index: number }) {
  const subtopics = topic.subtopics || [];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">{topic.title}</h3>
            <p className="text-blue-100 text-sm">{topic.description}</p>
          </div>
          <div className="bg-white/30 px-3 py-1 rounded-full text-sm font-semibold">
            {topic.duration}h
          </div>
        </div>
      </div>

      {subtopics.length > 0 && (
        <div className="bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Subtopics:</p>
          <ul className="space-y-2">
            {subtopics.map((subtopic: any) => (
              <li key={subtopic.id} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  defaultChecked={subtopic.isCompleted}
                  className="mt-1"
                  onChange={() => {}}
                />
                <div>
                  <p className="font-medium text-gray-900">{subtopic.title}</p>
                  <p className="text-gray-600 text-xs">{subtopic.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RoadmapDetailPage;
