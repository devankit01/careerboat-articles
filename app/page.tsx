import { Suspense } from 'react';
import type { Metadata } from 'next';
import BlogPostsView from '@/components/BlogPostsView';
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/schema';
import { SITE_URL, getRecentPosts } from '@/lib/wp';
import Loading from './loading';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type HomePageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

function currentPageFrom(searchParams?: HomePageProps['searchParams']) {
  const pageParam = searchParams?.page;
  return parseInt(typeof pageParam === 'string' ? pageParam : Array.isArray(pageParam) ? pageParam[0] : '1', 10) || 1;
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const currentPage = currentPageFrom(searchParams);
  const isPaged = currentPage > 1;

  return {
    title: isPaged ? `Career Articles — Page ${currentPage} | Careerboat` : HOME_TITLE,
    description: HOME_DESCRIPTION,
    alternates: {
      canonical: isPaged ? `${SITE_URL}/?page=${currentPage}` : `${SITE_URL}/`
    },
    robots: isPaged ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      url: `${SITE_URL}/`,
      type: 'website',
      images: [{ url: '/logo.jpeg' }]
    }
  };
}

function PostsSkeleton() {
  return (
    <section className="mx-auto w-[min(1120px,92vw)] py-16">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Loading key={i} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const allPosts = await getRecentPosts(100);

  return (
    <main>
      <Suspense fallback={<PostsSkeleton />}>
        <BlogPostsView allPosts={allPosts} />
      </Suspense>
    </main>
  );
}

