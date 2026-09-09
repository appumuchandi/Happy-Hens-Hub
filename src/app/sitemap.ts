import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://poultrymanager.in').replace('http://', 'https://');
  const isPricingEnabled = process.env.NEXT_PUBLIC_PRICING_PAGE !== 'OFF';
  const isTutorialsEnabled = process.env.NEXT_PUBLIC_TUTORIALS_PAGE !== 'OFF';
  
  const baseRoutes = [
    '',
    '/about',
    '/features',
    '/faq',
    '/get-started',
    '/privacy',
    '/terms',
  ];

  if (isPricingEnabled) {
    baseRoutes.push('/pricing');
  }

  if (isTutorialsEnabled) {
    baseRoutes.push('/tutorials');
  }

  const routes = baseRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
