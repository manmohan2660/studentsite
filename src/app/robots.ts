import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/.next'],
    },
    sitemap: 'https://studenttools.com/sitemap.xml',
  };
}
