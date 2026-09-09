import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://poultrymanager.in').replace('http://', 'https://');
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/super-admin',
          '/super-admin/dashboard',
          '/super-admin/login'
        ],
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
