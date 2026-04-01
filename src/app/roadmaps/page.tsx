'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Roadmap {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  featured: boolean;
}

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [filtered, setFiltered] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { value: 'all', label: 'All Paths' },
    { value: 'semester', label: 'College Semester' },
    { value: 'govt-exam', label: 'Govt Exams' },
    { value: 'skill', label: 'Skill Development' },
  ];

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await fetch('/api/roadmaps?limit=50');
        if (response.ok) {
          const data = await response.json();
          setRoadmaps(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  useEffect(() => {
    let result = roadmaps;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((r) => r.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFiltered(result);
  }, [roadmaps, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Learning Roadmaps</h1>
          <p className="text-purple-200 text-lg">
            Choose your learning path and master new skills with our structured roadmaps
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search roadmaps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none mb-6"
          />

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
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

        {/* Roadmaps Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-300">Loading roadmaps...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((roadmap) => (
              <Link
                key={roadmap._id}
                href={`/roadmaps/${roadmap._id}`}
                className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 hover:border-purple-500 hover:bg-slate-800 transition h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition mb-2">
                      {roadmap.title}
                    </h3>
                    {roadmap.featured && (
                      <span className="inline-block px-2 py-1 text-xs bg-yellow-600/30 text-yellow-200 rounded mb-2">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-300 mb-4 flex-grow">{roadmap.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex gap-2">
                    <span className="inline-block px-3 py-1 text-xs bg-purple-600/30 text-purple-200 rounded">
                      {roadmap.category.split('-').join(' ')}
                    </span>
                    <span className="inline-block px-3 py-1 text-xs bg-pink-600/30 text-pink-200 rounded">
                      {roadmap.difficulty}
                    </span>
                  </div>
                  <span className="text-purple-400 group-hover:text-pink-400 transition font-semibold">
                    Start →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
            <p className="text-slate-300 text-lg">No roadmaps found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-lg p-8 text-center">
          <p className="text-slate-300">
            Showing <span className="text-white font-bold">{filtered.length}</span> of{' '}
            <span className="text-white font-bold">{roadmaps.length}</span> available roadmaps
          </p>
        </div>
      </div>
    </div>
  );
}
