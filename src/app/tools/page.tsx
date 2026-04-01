'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import type { Metadata } from 'next';

const TOOLS_DATA = [
  {
    id: 'cgpa',
    name: 'CGPA Calculator',
    description: 'Calculate your GPA accurately from grades and credits. Perfect for tracking academic performance.',
    icon: '📊',
    category: 'Academic',
    popularity: 5,
    href: '/tools/cgpa-calculator',
    tags: ['grades', 'gpa', 'academic', 'calculator'],
  },
  {
    id: 'age',
    name: 'Age Calculator',
    description: 'Find your exact age in years, months, days, and weeks. Includes total days and weeks calculation.',
    icon: '🎂',
    category: 'Utility',
    popularity: 4,
    href: '/tools/age-calculator',
    tags: ['age', 'birthday', 'calculator', 'date'],
  },
  {
    id: 'password',
    name: 'Password Generator',
    description: 'Create strong, secure passwords with custom settings. Uppercase, lowercase, numbers, and symbols.',
    icon: '🔐',
    category: 'Security',
    popularity: 5,
    href: '/tools/password-generator',
    tags: ['password', 'security', 'generator', 'safe'],
  },
  {
    id: 'percentage',
    name: 'Percentage Calculator',
    description: 'Quick percentage calculations for math problems. Find percentage, value, and total.',
    icon: '📈',
    category: 'Academic',
    popularity: 4,
    href: '/tools/percentage-calculator',
    tags: ['percentage', 'math', 'calculator', 'academic'],
  },
  {
    id: 'image',
    name: 'Image Converter',
    description: 'Convert, resize, compress and optimize images instantly. Batch processing supported.',
    icon: '🖼️',
    category: 'Utility',
    popularity: 4,
    href: '/tools/image-converter',
    tags: ['image', 'converter', 'compress', 'resize'],
  },
  {
    id: 'resume',
    name: 'Resume Builder',
    description: 'Create professional resumes using 50+ modern templates. Real-time preview and industry-ready layouts.',
    icon: '📄',
    category: 'Utility',
    popularity: 5,
    href: '/tools/resume-builder',
    tags: ['resume', 'cv', 'builder', 'career', 'job'],
  },
];

const CATEGORIES = ['All', 'Academic', 'Utility', 'Security'];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name A-Z' },
];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const filteredAndSortedTools = useMemo(() => {
    let results = [...TOOLS_DATA];

    if (searchQuery.trim()) {
      results = results.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedCategory !== 'All') {
      results = results.filter(
        (tool) => tool.category === selectedCategory
      );
    }

    if (sortBy === 'popular') {
      results.sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === 'newest') {
      results.reverse();
    } else if (sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Free Tools for Every Student Need
          </h1>
          <p className="text-xl text-blue-100">
            Explore calculators, generators, converters, and builders designed to simplify your academic and professional journey.
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-wrap gap-3 mt-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedTools.map((tool) => (
            <Link key={tool.id} href={tool.href}>
              <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition cursor-pointer h-full">
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                <p className="text-slate-600">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}