import type { Metadata } from 'next';
import ImageConverter from '@/components/tools/ImageConverter';

export const metadata: Metadata = {
  title: 'All-in-One Image Tool - StudentTools',
  description:
    'Convert, compress, resize, rotate images instantly. Free online image tool with batch processing and zip download.',
};

export default function ImageConverterPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-5xl font-bold text-gray-900">
          All-in-One Image Tool
        </h1>
        <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
          Convert, resize, compress and optimize images instantly. No upload,
          no server, 100% privacy safe.
        </p>
      </section>

      {/* TOOL */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <ImageConverter />
      </section>

    </div>
  );
}