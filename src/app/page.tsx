import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LearnerHub - Engage, Learn, Grow Together',
  description:
    'Interactive learning platform with personalized roadmaps, study materials, expert articles, and productivity tools for students.',
};

async function HomePage() {
  let featuredRoadmaps: any[] = [];
  let featuredArticles: any[] = [];
  let featuredMaterials: any[] = [];

  try {
    const [r, a, m] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roadmaps?limit=3`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles?limit=3`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials?limit=3`, { cache: 'no-store' }),
    ]);

    if (r.ok) featuredRoadmaps = (await r.json()).data || [];
    if (a.ok) featuredArticles = (await a.json()).data || [];
    if (m.ok) featuredMaterials = (await m.json()).data || [];
  } catch {}

  return (
    <div className="min-h-screen bg-white">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 -z-10"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute -bottom-8 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    ✨ Welcome to LearnerHub
                  </span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Engage, Learn,<br />Grow Together
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Your personalized learning companion. Get curated roadmaps, expert guidance, and powerful tools to achieve your learning goals.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition transform duration-200"
                >
                  Start Learning Now
                </Link>
                <Link
                  href="/roadmaps"
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-200"
                >
                  Explore Roadmaps
                </Link>
              </div>

              <div className="flex gap-8 pt-6">
                <div>
                  <p className="text-3xl font-bold text-gray-900">10K+</p>
                  <p className="text-gray-600">Active Learners</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">500+</p>
                  <p className="text-gray-600">Learning Paths</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">1000+</p>
                  <p className="text-gray-600">Resources</p>
                </div>
              </div>
            </div>

            <div className="relative h-96 sm:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl opacity-10"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="text-6xl">📚</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAPS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Learning Roadmaps</h2>
            <p className="text-xl text-gray-600">Follow structured paths to master your skills</p>
          </div>

          {featuredRoadmaps.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredRoadmaps.map((r: any) => (
                <Link
                  key={r._id}
                  href={`/roadmaps/${r.slug}`}
                  className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                      🎯
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">{r.title}</h3>
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-700 transition">{r.description}</p>
                  <div className="mt-6 text-blue-600 font-semibold group-hover:translate-x-2 transition transform">
                    Learn More →
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Roadmaps coming soon...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/roadmaps"
              className="inline-block px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              View All Roadmaps
            </Link>
          </div>
        </div>
      </section>

      {/* ARTICLES SECTION */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Expert Articles</h2>
            <p className="text-xl text-gray-600">Learn from industry experts and experienced educators</p>
          </div>

          {featuredArticles.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredArticles.map((a: any) => (
                <Link
                  key={a._id}
                  href={`/articles/${a.slug}`}
                  className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition duration-300 overflow-hidden"
                >
                  <div className="mb-4 inline-block">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      {a.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{a.excerpt}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Read Article</span>
                    <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Articles coming soon...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/articles"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              Read All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* MATERIALS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Study Materials</h2>
            <p className="text-xl text-gray-600">Comprehensive resources for every subject</p>
          </div>

          {featuredMaterials.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredMaterials.map((m: any) => (
                <div
                  key={m._id}
                  className="flex flex-col p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-xl transition duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">📖</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                      {m.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{m.title}</h3>
                  <p className="text-gray-600 text-sm flex-grow">{m.description}</p>
                  <div className="mt-6 text-purple-600 font-semibold">
                    Explore →
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Study materials coming soon...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/study-materials"
              className="inline-block px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition"
            >
              Access All Materials
            </Link>
          </div>
        </div>
      </section>

      {/* TOOLS SECTION */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Productivity Tools</h2>
            <p className="text-xl text-gray-600">Essential utilities to boost your productivity</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Tool icon="🧮" title="CGPA Calculator" desc="Track your academic performance" />
            <Tool icon="⏰" title="Age Calculator" desc="Quick age calculations" />
            <Tool icon="🎲" title="Password Generator" desc="Secure password creation" />
            <Tool icon="📊" title="Percentage Calculator" desc="Percentage computations" />
            <Tool icon="🖼️" title="Image Converter" desc="Convert images easily" />
            <Tool icon="📝" title="More Tools" desc="Coming soon..." />
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tools"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              Explore All Tools
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of students already achieving their goals with LearnerHub
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:shadow-lg hover:scale-105 transition transform duration-200"
          >
            Start Your Journey Free
          </Link>
        </div>
      </section>
    </div>
  );
}

function Tool({ icon, title, desc }: any) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition duration-300 group">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
        {title}
      </h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

export default HomePage;