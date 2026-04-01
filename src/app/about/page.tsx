import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - StudentTools | Free Educational Platform',
  description:
    'Discover StudentTools - Your ultimate companion for academic success with free calculators, converters, and educational resources for students worldwide.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Empowering Students Worldwide
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              StudentTools is your dedicated companion for academic excellence, providing intelligent, free solutions tailored for modern learners.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <p className="text-sm font-semibold">10+ Tools</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <p className="text-sm font-semibold">100% Free</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <p className="text-sm font-semibold">No Sign Up</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                We believe every student deserves access to reliable tools that simplify complex calculations and save precious study time.
              </p>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                StudentTools was created with a singular vision: to bridge the gap between academic challenges and practical solutions, making education more accessible, efficient, and enjoyable for students of all backgrounds.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our platform eliminates barriers to quality educational resources, ensuring that geography, financial status, or technical expertise never hold back a student's potential.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">5M+</div>
                  <p className="text-sm text-slate-600">Calculations</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">150+</div>
                  <p className="text-sm text-slate-600">Countries</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">10+</div>
                  <p className="text-sm text-slate-600">Tools</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-pink-600 mb-2">24/7</div>
                  <p className="text-sm text-slate-600">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">What We Offer</h2>
          <p className="text-center text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            A carefully curated collection of tools designed to solve real student challenges
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Academic Tools</h3>
              <p className="text-slate-600 mb-4">
                CGPA calculators, percentage converters, and grade calculators to master your academic performance.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>✓ CGPA Calculator</li>
                <li>✓ Grade Converter</li>
                <li>✓ Percentage Calculator</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Utility Tools</h3>
              <p className="text-slate-600 mb-4">
                Practical utilities for everyday tasks: password generation, age calculation, and image conversion.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>✓ Password Generator</li>
                <li>✓ Age Calculator</li>
                <li>✓ Image Converter</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Learning Resources</h3>
              <p className="text-slate-600 mb-4">
                Curated articles, study tips, and guides to enhance your learning experience and academic growth.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>✓ Educational Articles</li>
                <li>✓ Study Guides</li>
                <li>✓ Success Tips</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">Why Choose StudentTools?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
                  <span className="text-xl">⚡</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Lightning Fast</h3>
                <p className="text-slate-600">
                  Get instant results with optimized algorithms and zero latency. Your time is valuable.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                  <span className="text-xl">🎯</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Highly Accurate</h3>
                <p className="text-slate-600">
                  All calculations are verified by experts and tested across thousands of scenarios.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                  <span className="text-xl">📱</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Mobile Optimized</h3>
                <p className="text-slate-600">
                  Works seamlessly on all devices - phones, tablets, and desktops. Study anywhere, anytime.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-pink-100">
                  <span className="text-xl">🔒</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Privacy Protected</h3>
                <p className="text-slate-600">
                  We don't store personal data. Your calculations are private and secure, always.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-yellow-100">
                  <span className="text-xl">💰</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">100% Free</h3>
                <p className="text-slate-600">
                  All tools are completely free. No hidden costs, subscriptions, or surprise charges.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-100">
                  <span className="text-xl">🚀</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Always Evolving</h3>
                <p className="text-slate-600">
                  We regularly add new tools and features based on student feedback and needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Boost Your Productivity?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already using StudentTools to succeed in their academics.
          </p>
          <Link
            href="/tools"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Explore All Tools
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Get In Touch</h2>
          <p className="text-lg text-slate-600 mb-8">
            Have feedback, suggestions, or need help? We'd love to hear from you. Our team is committed to making StudentTools better every day.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Send us a Message
          </Link>
        </div>
      </section>
    </div>
  );
}
