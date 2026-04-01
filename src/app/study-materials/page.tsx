'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Attachment {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
}

interface StudyMaterial {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  course?: string;
  difficulty?: string;
  imageUrl?: string;
  attachments?: Attachment[];
  viewCount: number;
  published: boolean;
  createdAt: string;
}

export default function StudyMaterialsPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [filtered, setFiltered] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const categories = [
    { value: 'all', label: 'All Types' },
    { value: 'notes', label: 'Study Notes' },
    { value: 'guide', label: 'Guides' },
    { value: 'exercise', label: 'Exercises' },
    { value: 'resource', label: 'Resources' },
  ];

  const subjects = [
    { value: 'all', label: 'All Subjects' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'programming', label: 'Programming' },
    { value: 'dsa', label: 'Data Structures' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
  ];

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/materials?limit=100');
        if (!response.ok) throw new Error('Failed to fetch materials');
        
        const data = await response.json();
        const materialsData = Array.isArray(data) ? data : data.data || [];
        setMaterials(materialsData.filter((m: StudyMaterial) => m.published));
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching materials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    let result = materials;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((m) => m.category === selectedCategory);
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      result = result.filter((m) => m.subject === selectedSubject);
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFiltered(result);
  }, [materials, selectedCategory, selectedSubject, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Study Materials</h1>
          <p className="text-purple-200 text-lg">
            Comprehensive notes, guides, and resources for your courses
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search materials by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none mb-6"
          />

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-medium">Material Type</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      selectedCategory === cat.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2 font-medium">Subject</label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((sub) => (
                  <button
                    key={sub.value}
                    onClick={() => setSelectedSubject(sub.value)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      selectedSubject === sub.value
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Materials List */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-300">Loading materials...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((material) => (
              <div
                key={material._id}
                className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden hover:border-cyan-500 transition"
              >
                {/* Material Image or Placeholder */}
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

                  <div className="flex gap-2 mb-3">
                    <span className="inline-block text-xs px-2 py-1 bg-purple-600/30 text-purple-200 rounded">
                      {material.category}
                    </span>
                    <span className="inline-block text-xs px-2 py-1 bg-pink-600/30 text-pink-200 rounded">
                      {material.subject}
                    </span>
                    {material.difficulty && (
                      <span className="inline-block text-xs px-2 py-1 bg-cyan-600/30 text-cyan-200 rounded">
                        {material.difficulty}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-300 mb-4 line-clamp-2">{material.description}</p>

                  {/* Download Files */}
                  {material.attachments && material.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-300 mb-2 uppercase">
                        📥 Files ({material.attachments.length})
                      </p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {material.attachments.map((attachment, idx) => {
                          const getFileIcon = (fileName: string) => {
                            if (fileName.endsWith('.pdf')) return '📄';
                            if (fileName.endsWith('.zip')) return '📦';
                            if (fileName.endsWith('.pptx') || fileName.endsWith('.ppt')) return '🎯';
                            if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return '📝';
                            if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) return '📊';
                            if (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.jpeg')) return '🖼️';
                            return '📎';
                          };

                          const fileSize = attachment.fileSize > 1024 * 1024 
                            ? (attachment.fileSize / (1024 * 1024)).toFixed(1) + ' MB'
                            : (attachment.fileSize / 1024).toFixed(1) + ' KB';

                          return (
                            <a
                              key={idx}
                              href={attachment.fileUrl}
                              download
                              className="flex items-center gap-2 p-2 bg-slate-700/50 hover:bg-slate-600 rounded text-xs text-slate-200 transition group/file"
                              title={attachment.fileName}
                            >
                              <span className="text-lg flex-shrink-0">{getFileIcon(attachment.fileName)}</span>
                              <div className="flex-1 min-w-0">
                                <div className="truncate font-medium group-hover/file:text-cyan-300">
                                  {attachment.fileName}
                                </div>
                                <div className="text-xs text-slate-400">{fileSize}</div>
                              </div>
                              <span className="flex-shrink-0 text-cyan-400">↓</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <Link
                    href={`/study-materials/${material.slug}`}
                    className="block w-full text-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
            <p className="text-slate-300 text-lg mb-4">📚 No materials found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubject('all');
                setSearchQuery('');
              }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white text-center">
            <p className="text-3xl font-bold">{materials.length}</p>
            <p className="text-purple-200 text-sm mt-2">Total Materials</p>
          </div>
          <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-lg p-6 text-white text-center">
            <p className="text-3xl font-bold">6</p>
            <p className="text-pink-200 text-sm mt-2">Subjects Covered</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-600 to-blue-800 rounded-lg p-6 text-white text-center">
            <p className="text-3xl font-bold">4</p>
            <p className="text-cyan-200 text-sm mt-2">Types Available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
