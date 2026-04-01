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
                  Featured
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
                <p className="text-blue-100">Difficulty</p>
                <p className="text-lg font-bold capitalize">{roadmap.difficulty}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {roadmap.topics && roadmap.topics.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Learning Topics</h2>
                <div className="space-y-4">
                  {roadmap.topics.map((topic: any, idx: number) => (
                    <div key={topic.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
                          <p className="text-gray-600 mb-4">{topic.description}</p>
                          <p className="text-sm text-gray-500">Duration: {topic.duration} hours</p>
                          {topic.subtopics && topic.subtopics.length > 0 && (
                            <ul className="mt-4 ml-4 space-y-2">
                              {topic.subtopics.map((subtopic: any) => (
                                <li key={subtopic.id} className="text-gray-600">
                                  <span className="font-medium">{subtopic.title}</span> - {subtopic.description}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  } catch {
    return notFound();
  }
}

export default RoadmapDetailPage;
