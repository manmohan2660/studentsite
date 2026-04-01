'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  articles: number;
  roadmaps: number;
  materials: number;
  users: number;
  views: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    articles: 0,
    roadmaps: 0,
    materials: 0,
    users: 0,
    views: 0,
  });

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
      return;
    }
    setToken(adminToken);
    fetchStats(adminToken);
  }, []);

  const fetchStats = async (authToken: string) => {
    try {
      const articlesRes = await fetch('/api/articles', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      const roadmapsRes = await fetch('/api/roadmaps', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      const materialsRes = await fetch('/api/materials', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const articles = await articlesRes.json();
      const roadmaps = await roadmapsRes.json();
      const materials = await materialsRes.json();

      // Handle different response formats
      const articleCount = articles.pagination?.total || articles.data?.length || 0;
      const roadmapCount = roadmaps.pagination?.total || roadmaps.data?.length || 0;
      const materialCount = materials.pagination?.total || materials.data?.length || 0;

      setStats({
        articles: articleCount,
        roadmaps: roadmapCount,
        materials: materialCount,
        users: 0,
        views: 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('adminToken');
      router.push('/admin');
    }
  };

  if (loading) return <div className="p-20 text-center text-lg">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 px-6 py-2 rounded hover:bg-red-700 font-semibold"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
        <Stat label="Articles" value={stats.articles} />
        <Stat label="Roadmaps" value={stats.roadmaps} />
        <Stat label="Materials" value={stats.materials} />
        <Stat label="Users" value={stats.users} />
        <Stat label="Views" value={stats.views} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card href="/admin/articles" title="Articles" />
        <Card href="/admin/roadmaps" title="Roadmaps" />
        <Card href="/admin/materials" title="Materials" />
      </div>
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-slate-800 p-6 rounded text-center">
      <p className="text-gray-400 text-sm">{label}</p>
      <h2 className="text-4xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Card({ href, title }: any) {
  return (
    <Link 
      href={href} 
      className="bg-slate-800 p-6 rounded hover:bg-slate-700 transition"
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-400 text-sm mt-1">Manage {title}</p>
    </Link>
  );
}