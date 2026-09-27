import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || 'https://example.com';
  const categories = await prisma.portfolioCategory.findMany().catch(() => []);

  const staticRoutes = ['', '/about', '/portfolio', '/videos', '/services', '/contact'].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/portfolio/${c.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes];
}
