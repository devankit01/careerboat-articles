import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import LeadModal from '@/components/LeadModal';
import { decodeHtmlEntities, getRecentPosts, stripTags } from '@/lib/wp';
import Loading from './loading';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://articles.careerboat.ai/'
  }
};

function excerpt(input?: string | null) {
  if (!input) return 'Read this post from Careerboat.';
  const text = stripTags(input);
  return text.length > 110 ? `${text.slice(0, 110)}...` : text;
}

function PostsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Loading key={i} />
      ))}
    </div>
  );
}


function getCategoryFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('resume') || lowerTitle.includes('cv')) return 'resumes';
  if (lowerTitle.includes('interview')) return 'interviews';
  if (lowerTitle.includes('network') || lowerTitle.includes('linkedin') || lowerTitle.includes('connection') || lowerTitle.includes('referral')) return 'networking';
  if (lowerTitle.includes('negotiat') || lowerTitle.includes('offer') || lowerTitle.includes('salary')) return 'negotiation';
  if (lowerTitle.includes('lead') || lowerTitle.includes('manag') || lowerTitle.includes('director') || lowerTitle.includes('senior')) return 'leadership';
  if (lowerTitle.includes('productiv') || lowerTitle.includes('time') || lowerTitle.includes('habit')) return 'productivity';
  if (lowerTitle.includes('career')) return 'career';
  return 'other';
}

async function PostsGrid({ currentPage, currentCategory }: { currentPage: number; currentCategory: string }) {
  const itemsPerPage = 9;

  const allPosts = await getRecentPosts(100);

  let filteredPosts = allPosts;
  if (currentCategory !== 'all') {
    filteredPosts = allPosts.filter((post) => getCategoryFromTitle(post.title) === currentCategory);
  }

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const posts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <>
      {posts.length === 0 ? (
        <p className="rounded-xl border border-line bg-white p-4 text-clay">No posts found yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_28px_rgba(27,39,94,0.06)] transition hover:-translate-y-0.5">
              <Link href={`/${post.slug}`} className="block">
                <img
                  src={post.featuredImage?.node?.sourceUrl || '/logo.jpeg'}
                  alt={decodeHtmlEntities(post.featuredImage?.node?.altText || post.title)}
                  className="h-48 w-full bg-[#e7e5ff] object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col p-5 items-between justify-between">
                <div>
                  <Link href={`/${post.slug}`}>
                    <h3 className="text-xl font-semibold">{decodeHtmlEntities(post.title)}</h3>
                  </Link>
                  <p className="mt-2 text-clay">{excerpt(post.excerpt)}</p>
                </div>
                <div className="mt-5 flex flex-col gap-3 border-t border-line py-2 px-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-clay break-words">Author : {decodeHtmlEntities(post.author?.node?.name || 'Careerboat Team')}</p>
                  <Link
                    rel="canonical"
                    href={`/${post.slug}`}
                    className="w-fit rounded-md bg-ember px-3 py-1.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(79,70,229,0.2)] hover:bg-[#4338ca]"
                  >
                    Read Post
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {prevPage ? (
            <Link
              href={`/?page=${prevPage}`}
              className="rounded-md border border-indigo-600 bg-white px-3 py-2 text-sm font-medium text-indigo-600 transition sm:px-4"
            >
              Previous
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-md border border-line bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400 opacity-50 sm:px-4">
              Previous
            </span>
          )}

          <div className="flex items-center gap-1 sm:gap-2">
            {(() => {
              const pages: (number | 'dots')[] =
                totalPages <= 4
                  ? Array.from({ length: totalPages }, (_, i) => i + 1)
                  : [1, 2, 'dots', totalPages - 1, totalPages];

              return pages.map((item, idx) =>
                item === 'dots' ? (
                  <span key={`dots-${idx}`} className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-sm text-clay select-none">
                    …
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={`/?page=${item}`}
                    className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md text-sm font-medium transition ${currentPage === item ? 'bg-ember text-white' : 'hover:bg-gray-100 text-clay'}`}
                  >
                    {item}
                  </Link>
                )
              );
            })()}
          </div>

          {nextPage ? (
            <Link
              href={`/?page=${nextPage}`}
              className="rounded-md border border-indigo-600 bg-white px-3 py-2 text-sm font-medium text-indigo-600 transition sm:px-4"
            >
              Next
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-md border border-line bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400 opacity-50 sm:px-4">
              Next
            </span>
          )}
        </div>
      )}
    </>
  );
}

/* Page */

export default function HomePage(props: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const pageParam = props.searchParams?.page;
  const currentPage = parseInt(typeof pageParam === 'string' ? pageParam : Array.isArray(pageParam) ? pageParam[0] : '1', 10) || 1;
  const categoryParam = props.searchParams?.category;
  const currentCategory = typeof categoryParam === 'string' ? categoryParam : 'all';

  return (
    <main>
      <section className="mx-auto w-[min(1120px,92vw)] py-16 text-center md:py-16">
        <p className="text-xs uppercase tracking-[0.16em] text-ember">Career Growth</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Learn practical skills that move your career forward.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-clay">
          Actionable writing on resumes, interviews, and role transitions from beginner to senior levels.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['All', 'Resumes', 'Interviews', 'Networking', 'Negotiation', 'Leadership', 'Productivity', "Career", "other"].map((category) => {
            const categorySlug = category.toLowerCase();
            const isSelected = currentCategory === categorySlug;
            return (
              <Link
                key={category}
                href={categorySlug === 'all' ? '/' : `/?category=${categorySlug}`}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 ${isSelected
                  ? 'border-ember bg-ember text-white'
                  : 'border-line bg-white text-clay hover:border-ember hover:text-ember'
                  }`}
              >
                {category}
              </Link>
            );
          })}
        </div>
      </section>


      <section className="mx-auto w-[min(1120px,92vw)] pb-20">
        <Suspense fallback={<PostsGridSkeleton />}>
          <PostsGrid currentPage={currentPage} currentCategory={currentCategory} />
        </Suspense>

        <div className="mt-10 rounded-2xl border border-[#cfd3ff] bg-[#e9e8ff] p-6 text-center md:p-8">
          <p className="text-xs uppercase tracking-[0.16em] text-ember">Free Resource</p>
          <h3 className="mt-2 text-2xl font-bold md:text-3xl">Get your career growth checklist</h3>
          <p className="mx-auto mt-2 max-w-2xl text-clay">
            A practical step by step plan to improve your profile, interview prep, and role targeting.
          </p>
          <div className="mt-5 flex justify-center">
            <LeadModal buttonLabel="Get Free Career Checklist" className="rounded-lg bg-ember px-5 py-3 font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.22)] hover:bg-[#4338ca]" />
          </div>
        </div>
      </section>
    </main>
  );
}
