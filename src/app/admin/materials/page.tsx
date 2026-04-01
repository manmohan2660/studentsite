'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Material {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  subject: string;
  content: string;
  imageUrl?: string;
  difficulty?: string;
  course?: string;
  branch?: string;
  examType?: string;
  skillPath?: string;
  downloadUrl?: string;
  tags?: string[];
  keyPoints?: string[];
  attachments?: Array<{ fileName: string; fileUrl: string; fileSize: number; uploadedAt: Date }>;
  published: boolean;
  createdAt: string;
}

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'notes',
    subject: '',
    content: '',
    imageUrl: '',
    difficulty: 'beginner',
    course: '',
    branch: '',
    examType: '',
    skillPath: '',
    downloadUrl: '',
    tags: '',
    keyPoints: '',
    published: false,
    attachments: [] as Array<{ fileName: string; fileUrl: string; fileSize: number }>,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
      return;
    }
    setToken(adminToken);
    fetchMaterials(adminToken);
  }, []);

  const fetchMaterials = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/materials?limit=100', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch materials');
      const data = await response.json();
      setMaterials(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const response = await fetch('/api/materials/upload-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Upload failed');
      }

      const data = await response.json();
      setFormData({ ...formData, imageUrl: data.data.imageUrl });
      setPreviewImage(data.data.imageUrl);
      setSuccess('Image uploaded successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'notes',
      subject: '',
      content: '',
      imageUrl: '',
      difficulty: 'beginner',
      course: '',
      branch: '',
      examType: '',
      skillPath: '',
      downloadUrl: '',
      tags: '',
      keyPoints: '',
      published: false,
      attachments: [],
    });
    setPreviewImage(null);
    setEditingId(null);
  };

  const handleEdit = (material: Material) => {
    setEditingId(material._id);
    setFormData({
      title: material.title,
      description: material.description,
      category: material.category,
      subject: material.subject,
      content: material.content,
      imageUrl: material.imageUrl || '',
      difficulty: material.difficulty || 'beginner',
      course: material.course || '',
      branch: material.branch || '',
      examType: material.examType || '',
      skillPath: material.skillPath || '',
      downloadUrl: material.downloadUrl || '',
      tags: material.tags?.join(', ') || '',
      keyPoints: material.keyPoints?.join(', ') || '',
      published: material.published,
      attachments: material.attachments?.map(a => ({ 
        fileName: a.fileName, 
        fileUrl: a.fileUrl, 
        fileSize: a.fileSize 
      })) || [],
    });
    setPreviewImage(material.imageUrl || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Upload failed');
      }

      const data = await response.json();
      const newAttachment = {
        fileName: data.data.fileName,
        fileUrl: data.data.fileUrl,
        fileSize: data.data.size,
      };
      
      setFormData({
        ...formData,
        attachments: [...formData.attachments, newAttachment],
      });
      setSuccess(`File "${data.data.fileName}" uploaded successfully`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setSaving(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      setSaving(false);
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      setSaving(false);
      return;
    }

    if (!formData.subject.trim()) {
      setError('Subject is required');
      setSaving(false);
      return;
    }

    if (!token) {
      setError('No authentication token');
      setSaving(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        keyPoints: formData.keyPoints.split(',').map(k => k.trim()).filter(k => k),
      };

      // For updates, use slug from the material; for new materials, POST without slug
      let url = '/api/materials';
      let method = 'POST';
      
      if (editingId) {
        const editingMaterial = materials.find(m => m._id === editingId);
        if (editingMaterial) {
          url = `/api/materials/${editingMaterial.slug}`;
          method = 'PUT';
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin');
        throw new Error('Session expired');
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Failed to ${editingId ? 'update' : 'upload'} material`);
      }

      setSuccess(`Material ${editingId ? 'updated' : 'uploaded'} successfully`);
      resetForm();
      setShowForm(false);
      await fetchMaterials(token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;

    if (!token) {
      setError('No authentication token');
      return;
    }

    try {
      const deletingMaterial = materials.find(m => m._id === id);
      if (!deletingMaterial) {
        setError('Material not found');
        return;
      }

      const response = await fetch(`/api/materials/${deletingMaterial.slug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin');
        throw new Error('Session expired');
      }

      if (!response.ok) throw new Error('Failed to delete material');

      setSuccess('Material deleted successfully');
      await fetchMaterials(token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <Link href="/admin/dashboard" className="text-blue-600 text-sm mb-2 block">← Back</Link>
            <h1 className="text-3xl font-bold">Manage Materials</h1>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            {showForm ? 'Cancel' : '+ Upload Material'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">{success}</div>}

        {showForm && (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Material' : 'Upload New Material'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="flex flex-col items-center gap-4">
                  {previewImage && (
                    <div className="relative w-full max-w-xs h-48">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-block">
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500">PNG, JPG, WebP (Max 5MB)</p>
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="Material title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  placeholder="Brief description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Classification */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="notes">Notes</option>
                    <option value="guide">Guide</option>
                    <option value="exercise">Exercise</option>
                    <option value="resource">Resource</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Course/Branch/Exam */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Course</label>
                  <input
                    type="text"
                    placeholder="e.g., BTech, MBA"
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Branch</label>
                  <input
                    type="text"
                    placeholder="e.g., CSE, ECE"
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Exam Type</label>
                  <input
                    type="text"
                    placeholder="e.g., UPSC, SSC"
                    value={formData.examType}
                    onChange={(e) => setFormData({...formData, examType: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Skill Path */}
              <div>
                <label className="block text-sm font-medium mb-2">Skill Path</label>
                <input
                  type="text"
                  placeholder="e.g., Web Dev, AI/ML"
                  value={formData.skillPath}
                  onChange={(e) => setFormData({...formData, skillPath: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <textarea
                  placeholder="Material content (HTML supported)"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  rows={8}
                  className="w-full px-4 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Download & Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Download URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/file.pdf"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({...formData, downloadUrl: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., calculus, mathematics, advanced"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Key Points (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Derivatives, Integration, Applications"
                  value={formData.keyPoints}
                  onChange={(e) => setFormData({...formData, keyPoints: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* File Attachments Section */}
              <div>
                <label className="block text-sm font-medium mb-2">File Attachments (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                  <div className="flex flex-col items-center gap-3">
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-block text-sm">
                        {uploading ? 'Uploading...' : '+ Add File'}
                      </span>
                      <input
                        type="file"
                        onChange={handleFileAttachmentUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 text-center">PDF, ZIP, PPT, DOC, images, videos, etc.</p>
                  </div>
                </div>

                {/* Attachments List */}
                {formData.attachments.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-sm">Attached Files:</h4>
                    <ul className="space-y-2">
                      {formData.attachments.map((att, idx) => (
                        <li key={idx} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-blue-600">
                              <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {att.fileName}
                              </a>
                            </p>
                            <p className="text-xs text-gray-500">
                              {(att.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="ml-2 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Publish */}
              <label className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                />
                <span className="font-medium">Publish Now</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full disabled:opacity-50 font-medium"
              >
                {saving ? 'Saving...' : editingId ? 'Update Material' : 'Upload Material'}
              </button>
            </form>
          </div>
        )}

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-sm">Image</th>
                  <th className="px-6 py-3 text-left font-semibold text-sm">Title</th>
                  <th className="px-6 py-3 text-left font-semibold text-sm">Subject</th>
                  <th className="px-6 py-3 text-left font-semibold text-sm">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-sm">Status</th>
                  <th className="px-6 py-3 text-right font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No materials yet. Click "Upload Material" to create one.
                    </td>
                  </tr>
                ) : (
                  materials.map((mat) => (
                    <tr key={mat._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-3">
                        {mat.imageUrl ? (
                          <div className="relative w-12 h-12">
                            <Image
                              src={mat.imageUrl}
                              alt={mat.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3 font-medium">{mat.title}</td>
                      <td className="px-6 py-3 text-sm">{mat.subject}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className="inline-block px-2 py-1 bg-gray-200 rounded text-xs">
                          {mat.category}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          mat.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {mat.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(mat)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(mat._id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
