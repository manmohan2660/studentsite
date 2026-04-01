import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StudentTools - Free Online Tools for Students',
  description:
    'A comprehensive platform offering free student tools including CGPA calculator, age calculator, password generator, and educational articles.',
  keywords:
    'calculator, CGPA, student tools, password generator, age calculator',
  authors: [{ name: 'StudentTools' }],
  openGraph: {
    title: 'StudentTools - Free Online Tools for Students',
    description:
      'A comprehensive platform offering free student tools including CGPA calculator, age calculator, password generator, and educational articles.',
    type: 'website',
    url: 'https://studenttools.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
