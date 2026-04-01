import type { Metadata } from 'next';
 import ResumeBuilder from '@/components/tools/resumebuilder';

export const metadata: Metadata = {
  title: 'AI Resume Builder - StudentTools',
  description:
    'Create professional resumes using 50+ modern templates. Free resume builder with real-time preview.',
};

export default function ResumeBuilderPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-5xl font-bold text-gray-900">
          Professional Resume Builder
        </h1>
        <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
          Build industry-ready resumes using modern templates. Designed for developers, designers and professionals.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <ResumeBuilder />
      </section>

    </div>
  );
}