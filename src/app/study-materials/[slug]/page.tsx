import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { StudyMaterialService } from '@/services/StudyMaterialService';

interface MaterialDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MaterialDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const material = await StudyMaterialService.getMaterialBySlug(slug);

    if (!material) return { title: 'Material Not Found' };

    return {
      title: `${material.title} - StudentTools`,
      description: material.description,
      keywords: material.tags?.join(', '),
      openGraph: {
        title: material.title,
        description: material.description,
        type: 'article',
      },
    };
  } catch {
    return { title: 'Study Material' };
  }
}

async function MaterialDetailPage({ params }: MaterialDetailPageProps) {
  const { slug } = await params;
  
  try {
    const material = await StudyMaterialService.getMaterialBySlug(slug);

    if (!material) {
      notFound();
    }

    // Increment view count
    await StudyMaterialService.incrementViewCount(material._id?.toString() || '');

    // Get related materials (same subject)
    const relatedMaterials = material.subject
      ? await StudyMaterialService.getMaterialsBySubject(material.subject)
      : [];

    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
            <Link href="/study-materials" className="text-blue-600 hover:text-blue-700">
              Study Materials
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{material.title}</span>
          </div>
        </nav>

        {/* Main Content */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {material.category}
              </span>
              {material.published && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ Published
                </span>
              )}
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">{material.title}</h1>

            <p className="text-xl text-gray-600 mb-8">{material.description}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200 text-sm text-gray-500">
              {material.author && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold">
                    {(typeof material.author === 'object' && 'name' in material.author)
                      ? (material.author as any).name?.[0] || 'A'
                      : 'A'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {typeof material.author === 'object' && 'name' in material.author
                        ? (material.author as any).name
                        : 'Author'}
                    </p>
                    <p className="text-gray-500">
                      {typeof material.author === 'object' && 'email' in material.author
                        ? (material.author as any).email
                        : ''}
                    </p>
                  </div>
                </div>
              )}
              <div>
                📅{' '}
                {new Date(material.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div>👁️ {material.viewCount || 0} views</div>
            </div>
          </div>

          {/* Material Details */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="md:col-span-2">
              {/* Material Content */}
              <div className="prose prose-lg max-w-none mb-12">
                <div
                  className="text-gray-800 leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-lg rounded-lg"
                  dangerouslySetInnerHTML={{ __html: material.content }}
                />
              </div>

              {/* Tags */}
              {material.tags && material.tags.length > 0 && (
                <div className="mb-12 pb-12 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {material.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              {/* Material Info Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
                <h3 className="font-bold text-gray-900 mb-4">Material Information</h3>

                {material.subject && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">Subject</p>
                    <p className="font-semibold text-gray-900">{material.subject}</p>
                  </div>
                )}

                {material.examType && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">Exam Type</p>
                    <p className="font-semibold text-gray-900">{material.examType}</p>
                  </div>
                )}

                {material.course && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">Course</p>
                    <p className="font-semibold text-gray-900">{material.course}</p>
                  </div>
                )}

                {material.branch && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600">Branch</p>
                    <p className="font-semibold text-gray-900">{material.branch}</p>
                  </div>
                )}

                {material.skillPath && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Skill Path</p>
                    <p className="font-semibold text-gray-900">{material.skillPath}</p>
                  </div>
                )}
              </div>

              {/* Download CTA */}
              <button className="w-full mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
                📥 Download Material
              </button>
            </div>
          </div>

          {/* Related Materials */}
          {relatedMaterials.length > 1 && (
            <section className="mb-12 pt-12 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">More from {material.subject}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedMaterials
                  .filter((m: any) => m._id?.toString() !== material._id?.toString())
                  .slice(0, 3)
                  .map((relatedMaterial: any) => (
                    <Link
                      key={relatedMaterial._id}
                      href={`/study-materials/${relatedMaterial.slug}`}
                      className="group border border-gray-200 rounded-lg p-6 hover:border-green-500 hover:shadow-lg transition"
                    >
                      <div className="text-sm text-green-600 font-bold mb-2">{relatedMaterial.category}</div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 mb-3 line-clamp-2">
                        {relatedMaterial.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{relatedMaterial.description}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <span>👁️ {relatedMaterial.viewCount} views</span>
                        <span>→</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="bg-green-50 border border-green-200 rounded-lg p-8 text-center mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Master This Topic?</h2>
            <p className="text-gray-600 mb-6">Use our structured roadmaps and connect your learning with other materials.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/roadmaps"
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
              >
                Find Relevant Roadmaps
              </Link>
              <Link
                href="/articles"
                className="px-6 py-2 border border-green-600 text-green-600 font-bold rounded-lg hover:bg-green-50 transition"
              >
                Read Related Articles
              </Link>
            </div>
          </section>
        </article>
      </div>
    );
  } catch (error) {
    console.error('Error loading material:', error);
    notFound();
  }
}

export default MaterialDetailPage;
