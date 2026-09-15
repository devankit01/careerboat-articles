import type { MetadataRoute } from 'next';
import { SITE_URL, getSitemapPosts } from '@/lib/wp';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSitemapPosts().catch(() => []);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/${post.slug}`,
      lastModified: post.modified ? new Date(post.modified) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  ];
}
