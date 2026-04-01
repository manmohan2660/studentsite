'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  viewCount: number;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  featured: boolean;
  published: boolean;
  fileUrl?: string;
  fileName?: string;
  featuredImage?: string; // New field for featured image
}

// Helper function to normalize slug (matches backend)
function normalizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') return '';
  
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens, underscores, and spaces
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(true); // Auto-generate slug from title
  const router = useRouter();

  const initialForm: FormData = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Education',
    tags: '',
    featured: false,
    published: false,
    fileUrl: '',
    fileName: '',
    featuredImage: '',
  };

  const [formData, setFormData] = useState<FormData>(initialForm);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Get token from localStorage
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
      return;
    }
    setToken(adminToken);
    fetchArticles(adminToken);
  }, []);

  const fetchArticles = async (authToken: string) => {
    try {
      const res = await fetch('/api/articles', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.status === 401) {
        setError('Admin session expired');
        localStorage.removeItem('adminToken');
        router.push('/admin');
        return;
      }

      const json = await res.json();
      // Handle both formats: {data: [...]} and raw array
      const articlesList = json?.data || (Array.isArray(json) ? json : json?.pagination?.data || []);
      setArticles(articlesList);
    } catch (err) {
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setShowForm(false);
    setAutoSlug(true); // Reset auto-slug setting
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Auto-generate slug from title if enabled and not editing
      if (name === 'title' && autoSlug && !editingId) {
        newData.slug = normalizeSlug(value);
      }

      return newData;
    });
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags.join(', '),
      featured: article.featured,
      published: article.published,
      fileUrl: (article as any).fileUrl || '',
      fileName: (article as any).fileName || '',
    });
    setEditingId(article._id);
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFormData({
        ...formData,
        fileUrl: data.data.fileUrl,
        fileName: data.data.fileName,
      });
      setSuccess('File uploaded successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only images (JPEG, PNG, WebP, GIF) are allowed for featured image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Featured image size must be less than 5MB');
      return;
    }

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
      setFormData({
        ...formData,
        featuredImage: data.data.imageUrl,
      });
      setSuccess('Featured image uploaded successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (!token) {
      setError('No authentication token');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      };

      const url = editingId
        ? `/api/articles/${editingId}`
        : '/api/articles';

      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin');
        throw new Error('Unauthorized - please login again');
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save');
      }

      setSuccess(editingId ? 'Updated successfully' : 'Created successfully');

      await fetchArticles(token);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete article?')) return;

    if (!token) {
      setError('No authentication token');
      return;
    }

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin');
        throw new Error('Unauthorized - please login again');
      }

      if (!res.ok) throw new Error('Failed to delete');

      setSuccess('Article deleted successfully');
      await fetchArticles(token);
    } catch (err: any) {
      setError(err.message || 'Failed to delete article');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Articles</h1>

        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'New Article'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded mb-10 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Article title"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => {
                    handleInputChange(e);
                    setAutoSlug(false); // Disable auto-slug when user manually edits
                  }}
                  placeholder="article-slug"
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: <code>/articles/{formData.slug || '...'}</code>
                </p>
              </div>
              {!editingId && (
                <button
                  type="button"
                  onClick={() => {
                    const newSlug = normalizeSlug(formData.title);
                    setFormData(prev => ({ ...prev, slug: newSlug }));
                    setAutoSlug(true);
                  }}
                  className="px-3 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm whitespace-nowrap"
                >
                  Auto-Generate
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Education</option>
              <option>Technology</option>
              <option>Career</option>
              <option>Study Tips</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Brief summary"
              className="border border-gray-300 p-2 w-full rounded h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Full article content"
              className="border border-gray-300 p-2 w-full rounded h-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="tag1, tag2, tag3"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Featured Image (Optional)</label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
              <div className="flex flex-col items-center gap-3">
                {formData.featuredImage && (
                  <div className="w-full">
                    <img
                      src={formData.featuredImage}
                      alt="Featured preview"
                      className="max-h-40 rounded border border-blue-300 mx-auto"
                    />
                    <p className="text-sm text-green-700 font-medium mt-2 text-center">✓ Featured image uploaded</p>
                  </div>
                )}
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded inline-block text-sm">
                    {uploading ? 'Uploading...' : 'Choose Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-600">Images only (JPEG, PNG, WebP, GIF). Max 5MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Attach File (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex flex-col items-center gap-3">
                {formData.fileName && (
                  <div className="text-sm bg-blue-50 p-2 rounded w-full">
                    <p className="text-blue-700 font-medium">✓ File attached: {formData.fileName}</p>
                    {formData.fileUrl && (
                      <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                        View file
                      </a>
                    )}
                  </div>
                )}
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded inline-block text-sm">
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">PDF, DOC, PPT, ZIP, images, etc. (Max 100MB)</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">Featured</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm">Published</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left font-semibold">Title</th>
              <th className="p-3 text-left font-semibold">Category</th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Views</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No articles yet. Create your first one!
                </td>
              </tr>
            ) : (
              articles.map(a => (
                <tr key={a._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{a.title}</td>
                  <td className="p-3">{a.category}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      a.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {a.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-3">{a.viewCount || 0}</td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
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
  );
}