import type { Metadata } from 'next';
import ContactForm from '@/components/common/ContactForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us - StudentTools',
  description: 'Get in touch with StudentTools. We\'d love to hear from you!',
};

export default function ContactPage() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Get In Touch</h1>
            <p className="text-xl text-blue-100">
              Have a question or feedback? We'd love to hear from you. Our team is here to help!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Email Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Email</h3>
              <p className="text-slate-600 mb-4">Reach out directly for any inquiries</p>
              <a
                href="mailto:manmohan2661@gmail.com"
                className="inline-block text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                manmohan2661@gmail.com
              </a>
            </div>

            {/* Response Time Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Response Time</h3>
              <p className="text-slate-600 mb-4">We respond as quickly as possible</p>
              <p className="text-green-700 font-semibold">24-48 hours</p>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Technical Issues</h3>
              <p className="text-slate-600 mb-4">Report bugs and technical problems</p>
              <a
                href="mailto:manmohan2661@gmail.com?subject=Technical Support"
                className="inline-block text-purple-600 font-semibold hover:text-purple-700 transition-colors"
              >
                Send Report
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Send us a Message</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                      <span className="text-lg">💬</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Quick Response</h3>
                    <p className="text-slate-600">We prioritize all customer inquiries</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100">
                      <span className="text-lg">✅</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Helpful Support</h3>
                    <p className="text-slate-600">Get solutions to your problems</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100">
                      <span className="text-lg">🤝</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Friendly Team</h3>
                    <p className="text-slate-600">Always here to assist you</p>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="bg-slate-50 p-6 rounded-lg border border-slate-200 open:bg-blue-50 open:border-blue-200 cursor-pointer">
              <summary className="font-semibold text-slate-900 text-lg flex justify-between items-center">
                How do I use the tools?
                <span className="text-blue-600">+</span>
              </summary>
              <p className="text-slate-600 mt-4">
                Simply navigate to our tools section, select the tool you need, enter your data, and get instant results. No signup required!
              </p>
            </details>

            <details className="bg-slate-50 p-6 rounded-lg border border-slate-200 open:bg-blue-50 open:border-blue-200 cursor-pointer">
              <summary className="font-semibold text-slate-900 text-lg flex justify-between items-center">
                Is StudentTools free?
                <span className="text-blue-600">+</span>
              </summary>
              <p className="text-slate-600 mt-4">
                Yes! All our tools are completely free to use. No hidden charges, subscriptions, or premium versions.
              </p>
            </details>

            <details className="bg-slate-50 p-6 rounded-lg border border-slate-200 open:bg-blue-50 open:border-blue-200 cursor-pointer">
              <summary className="font-semibold text-slate-900 text-lg flex justify-between items-center">
                Do you store my data?
                <span className="text-blue-600">+</span>
              </summary>
              <p className="text-slate-600 mt-4">
                No, we don't store any personal data or calculation results. Your privacy is our priority.
              </p>
            </details>

            <details className="bg-slate-50 p-6 rounded-lg border border-slate-200 open:bg-blue-50 open:border-blue-200 cursor-pointer">
              <summary className="font-semibold text-slate-900 text-lg flex justify-between items-center">
                Can I suggest a new tool?
                <span className="text-blue-600">+</span>
              </summary>
              <p className="text-slate-600 mt-4">
                Absolutely! We love suggestions. Use the contact form to share your ideas, and we'll review them.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
