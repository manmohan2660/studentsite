'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main content */}
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg">
                📚
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LearnerHub
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Engage, learn, and grow together. Your platform for personalized learning journeys.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase mb-6 tracking-wider">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/roadmaps" className="text-gray-400 hover:text-blue-400 transition duration-200 text-sm">
                  Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-400 hover:text-blue-400 transition duration-200 text-sm">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/study-materials" className="text-gray-400 hover:text-blue-400 transition duration-200 text-sm">
                  Study Materials
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-400 hover:text-blue-400 transition duration-200 text-sm">
                  Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase mb-6 tracking-wider">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-blue-400 transition duration-200 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition duration-200 text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition duration-200 text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase mb-6 tracking-wider">Community</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.linkedin.com/in/manmohan2660/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition duration-200 text-sm flex items-center gap-2"
                >
                  <span>LinkedIn</span>
                  <span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:manmohan2661@gmail.com"
                  className="text-gray-400 hover:text-blue-400 transition duration-200 text-sm"
                >
                  Email Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase mb-6 tracking-wider">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Stay updated with latest learning tips.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-700/50 text-white placeholder-gray-500 text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-r-lg hover:opacity-90 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} LearnerHub. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-200 text-sm transition">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-200 text-sm transition">
              Terms
            </Link>
            <a href="mailto:manmohan2661@gmail.com" className="text-gray-400 hover:text-gray-200 text-sm transition">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
