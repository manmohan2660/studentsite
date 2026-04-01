'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import type { Metadata } from 'next';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: string;
  viewCount: number;
}

const CATEGORIES = [
  'All',
  'Technology',
  'Education',
  'Tips',
  'Tutorial',
  'News',
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        setArticles(data.data || []);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredAndSortedArticles = useMemo(() => {
    let results = [...articles];

    // Filter by search
    if (searchQuery.trim()) {
      results = results.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      results = results.filter((article) => article.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'latest') {
      results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'oldest') {
      results.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    }

    return results;
  }, [articles, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Student Success Blog
            </h1>
            <p className="text-xl text-blue-100">
              Discover practical tips, strategies, and insights to help you excel academically and personally.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search articles by title, topic, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category and Sort */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-slate-600">
            Showing <span className="font-bold">{filteredAndSortedArticles.length}</span> of{' '}
            <span className="font-bold">{articles.length}</span> article
            {articles.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {!loading && filteredAndSortedArticles.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedArticles.map((article) => (
                  <Link key={article._id} href={`/articles/${article.slug}`}>
                    <div className="group bg-white rounded-xl border border-slate-200 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer h-full overflow-hidden flex flex-col">
                      {/* Image */}
                      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity"></div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Category & Read Time */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {article.category}
                          </span>
                          <span className="text-xs text-slate-600">
                            {article.viewCount} views
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                          {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-2">
                          {article.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-600">{article.author}</span>
                            <span className="text-xs text-slate-500">
                              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <span className="text-blue-600 font-semibold group-hover:text-blue-700">
                            Read →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* No Results */}
              {filteredAndSortedArticles.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No articles found</h3>
                  <p className="text-slate-600 mb-8">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </>
          ) : loading ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-xl text-slate-600">Loading articles...</p>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl text-slate-600">No articles published yet...</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl font-bold mb-6">Never Miss an Article</h2>
          <p className="text-xl text-blue-100 mb-10">
            Subscribe to our newsletter for weekly tips, strategies, and insights delivered to your inbox.
          </p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 rounded-lg text-slate-900 focus:outline-none"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
            Explore More Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/tools">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition text-center cursor-pointer">
                <div className="text-5xl mb-4">🛠️</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Student Tools</h3>
                <p className="text-slate-600">
                  Access our free calculators, generators, and converters.
                </p>
              </div>
            </Link>
            <Link href="/about">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-200 hover:shadow-lg transition text-center cursor-pointer">
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">About Us</h3>
                <p className="text-slate-600">
                  Learn about our mission to empower students worldwide.
                </p>
              </div>
            </Link>
            <Link href="/contact">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200 hover:shadow-lg transition text-center cursor-pointer">
                <div className="text-5xl mb-4">✉️</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Get In Touch</h3>
                <p className="text-slate-600">
                  Have questions or suggestions? Contact us today.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
