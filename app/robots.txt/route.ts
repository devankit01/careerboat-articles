import { SITE_URL } from '@/lib/wp';

export const dynamic = 'force-static';

export function GET() {
  const body = `User-agent: *
Allow: /

Host: careerboat.ai/blog
Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
