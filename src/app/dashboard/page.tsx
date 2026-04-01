'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Roadmap {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
}

interface Article {
  _id: string;
  title: string;
  description: string;
  readTime?: number;
  tags: string[];
  featuredImage?: string;
}

interface Material {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  subject: string;
  imageUrl?: string;
  attachments?: Array<{ fileName: string; fileUrl: string; fileSize: number; uploadedAt: Date }>;
  published: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user from session/cookie (would be from authentication)
        const userResponse = await fetch('/api/auth/me');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        // Get featured roadmaps
        const roadmapResponse = await fetch('/api/roadmaps');
        if (roadmapResponse.ok) {
          const roadmapData = await roadmapResponse.json();
          const roadsToUse = Array.isArray(roadmapData) ? roadmapData : roadmapData.data || [];
          setRoadmaps(roadsToUse.slice(0, 4));
        }

        // Get recent articles
        const articleResponse = await fetch('/api/articles');
        if (articleResponse.ok) {
          const articleData = await articleResponse.json();
          const articlesToUse = Array.isArray(articleData) ? articleData : articleData.data || [];
          setArticles(articlesToUse.slice(0, 3));
        }

        // Get all materials
        const materialResponse = await fetch('/api/materials?limit=100');
        if (materialResponse.ok) {
          const materialData = await materialResponse.json();
          const materialsToUse = Array.isArray(materialData) ? materialData : materialData.data || [];
          setMaterials(materialsToUse);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user?.name || 'Student'}! 👋
              </h1>
              <p className="text-purple-200 mt-2">
                {user?.userType === 'college' && `${user?.course?.toUpperCase()} - ${user?.branch?.toUpperCase()}`}
                {user?.userType === 'govt-exam' && `Preparing for ${user?.examTarget?.toUpperCase()}`}
                {user?.userType === 'skill-learner' && `Learning ${user?.learningGoal?.split('-').join(' ').toUpperCase()}`}
              </p>
            </div>
            <Link
              href="/auth/logout"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white">
            <h3 className="text-sm font-medium text-purple-200 mb-2">Roadmaps Started</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-purple-300 text-sm mt-2">Complete a roadmap to start learning</p>
          </div>

          <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-lg p-6 text-white">
            <h3 className="text-sm font-medium text-pink-200 mb-2">Articles Read</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-pink-300 text-sm mt-2">Expand your knowledge with articles</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-600 to-blue-800 rounded-lg p-6 text-white">
            <h3 className="text-sm font-medium text-cyan-200 mb-2">Learning Streak</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-cyan-300 text-sm mt-2">Days in a row</p>
          </div>
        </div>

        {/* Recommended Roadmaps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recommended Learning Paths</h2>
            <Link href="/roadmaps" className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmaps.length > 0 ? (
              roadmaps.map((roadmap) => (
                <Link
                  key={roadmap._id}
                  href={`/roadmaps/${roadmap._id}`}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                        {roadmap.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{roadmap.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">{roadmap.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-1 text-xs bg-purple-600/30 text-purple-200 rounded">
                      {roadmap.difficulty}
                    </span>
                    <span className="text-purple-400 text-sm">Start →</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-slate-300">
                <p>No roadmaps available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
            <Link href="/articles" className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
              Read more →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.length > 0 ? (
              articles.map((article) => (
                <Link
                  key={article._id}
                  href={`/articles/${article._id}`}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden hover:border-purple-500 transition group"
                >
                  <div className="h-40 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-300 mb-4 line-clamp-2">{article.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-block px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-purple-400 text-sm font-semibold">Read article →</div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-slate-300">
                <p>No articles available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Study Materials Library */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Study Materials Library</h2>
            <Link href="/study-materials" className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
              View all materials →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {materials.length > 0 ? (
              materials.map((material) => (
                <div
                  key={material._id}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden hover:border-cyan-500 transition group"
                >
                  {/* Material Image or Icon */}
                  <div className="h-40 bg-gradient-to-br from-cyan-600 to-blue-600 relative overflow-hidden flex items-center justify-center">
                    {material.imageUrl ? (
                      <Image
                        src={material.imageUrl}
                        alt={material.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-white text-4xl">📚</div>
                    )}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition" />
                  </div>

                  {/* Material Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition mb-2 line-clamp-2">
                      {material.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3 uppercase tracking-wide">{material.category} • {material.subject}</p>
                    <p className="text-sm text-slate-300 mb-4 line-clamp-2">{material.description}</p>

                    {/* Attachments */}
                    {material.attachments && material.attachments.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-300 mb-2">Files ({material.attachments.length})</p>
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {material.attachments.map((attachment, idx) => (
                            <a
                              key={idx}
                              href={attachment.fileUrl}
                              download
                              className="flex items-center gap-2 p-2 bg-slate-700/50 hover:bg-slate-600 rounded text-xs text-slate-200 transition group/file"
                              title={attachment.fileName}
                            >
                              <span className="text-lg">
                                {attachment.fileName.endsWith('.pdf') && '📄'}
                                {attachment.fileName.endsWith('.zip') && '📦'}
                                {attachment.fileName.endsWith('.pptx') && '🎯'}
                                {attachment.fileName.endsWith('.ppt') && '🎯'}
                                {attachment.fileName.endsWith('.docx') && '📝'}
                                {attachment.fileName.endsWith('.doc') && '📝'}
                                {attachment.fileName.endsWith('.xlsx') && '📊'}
                                {attachment.fileName.endsWith('.xls') && '📊'}
                                {!attachment.fileName.match(/\.(pdf|zip|pptx|ppt|docx|doc|xlsx|xls)$/) && '📎'}
                              </span>
                              <div className="flex-1 truncate">
                                <div className="truncate group-hover/file:text-cyan-300">{attachment.fileName}</div>
                                <div className="text-xs text-slate-400">
                                  {(attachment.fileSize / 1024).toFixed(1)} KB
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <Link
                      href={`/study-materials/${material.slug}`}
                      className="inline-block w-full text-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold transition"
                    >
                      View Material
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-slate-300">
                <p className="mb-2">📚 No study materials available yet</p>
                <p className="text-sm text-slate-400">Check back soon for uploaded materials!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-4">Continue Learning</h3>
            <p className="text-slate-300 mb-6">
              Pick up where you left off and continue your learning journey with our interactive roadmaps.
            </p>
            <Link
              href="/roadmaps"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
            >
              Explore Roadmaps
            </Link>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-4">Study Materials</h3>
            <p className="text-slate-300 mb-6">
              Access comprehensive study notes, guides, and resources organized by subject and course.
            </p>
            <Link
              href="/study-materials"
              className="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition"
            >
              View Materials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
