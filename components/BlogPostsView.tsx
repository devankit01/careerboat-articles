'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import JsonLd from '@/components/JsonLd';
import LeadModal from '@/components/LeadModal';
import { buildHomeJsonLd } from '@/lib/schema';
import { PostCard, coverSrc, decodeHtmlEntities, imageAlt, stripTags } from '@/lib/wp';

const ITEMS_PER_PAGE = 9;

const CATEGORIES = [
  'All',
  'Resumes',
  'Interviews',
  'Networking',
  'Negotiation',
  'Leadership',
  'Productivity',
  'Career',
  'Other'
];

function getCategoryFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('resume') || lowerTitle.includes('cv')) return 'resumes';
  if (lowerTitle.includes('interview')) return 'interviews';
  if (
    lowerTitle.includes('network') ||
    lowerTitle.includes('linkedin') ||
    lowerTitle.includes('connection') ||
    lowerTitle.includes('referral')
  ) {
    return 'networking';
  }
  if (lowerTitle.includes('negotiat') || lowerTitle.includes('offer') || lowerTitle.includes('salary')) {
    return 'negotiation';
  }
  if (
    lowerTitle.includes('lead') ||
    lowerTitle.includes('manag') ||
    lowerTitle.includes('director') ||
    lowerTitle.includes('senior')
  ) {
    return 'leadership';
  }
  if (lowerTitle.includes('productiv') || lowerTitle.includes('time') || lowerTitle.includes('habit')) {
    return 'productivity';
  }
  if (lowerTitle.includes('career')) return 'career';
  return 'other';
}

function excerpt(input?: string | null) {
  if (!input) return 'Read this post from Careerboat.';
  const text = stripTags(input);
  return text.length > 110 ? `${text.slice(0, 110)}...` : text;
}

export default function BlogPostsView({ allPosts }: { allPosts: PostCard[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const pageParam = searchParams.get('page');
  const currentPage = parseInt(pageParam || '1', 10) || 1;

  const categoryParam = searchParams.get('category');
  const currentCategory = (categoryParam || 'all').toLowerCase();

  let filteredPosts = allPosts;
  if (currentCategory !== 'all') {
    filteredPosts = allPosts.filter((post) => getCategoryFromTitle(post.title) === currentCategory);
  }

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const posts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const prevPage = validPage > 1 ? validPage - 1 : null;
  const nextPage = validPage < totalPages ? validPage + 1 : null;

  const navigateTo = (params: URLSearchParams) => {
    const queryString = params.toString();
    const targetPath = queryString ? `/?${queryString}` : '/';
    startTransition(() => {
      router.push(targetPath);
    });
  };

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug === 'all') {
      params.delete('category');
    } else {
      params.set('category', categorySlug);
    }
    params.delete('page');
    navigateTo(params);
  };

  const handlePageClick = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    navigateTo(params);
  };

  const buildCategoryHref = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug === 'all') {
      params.delete('category');
    } else {
      params.set('category', categorySlug);
    }
    params.delete('page');
    const queryString = params.toString();
    return queryString ? `/?${queryString}` : '/';
  };

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    return queryString ? `/?${queryString}` : '/';
  };

  return (
    <>
      <section className="mx-auto w-[min(1120px,92vw)] py-16 text-center md:py-16">
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight md:text-6xl">
          Learn practical skills that move your career forward.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-clay">
          Actionable writing on resumes, interviews, and role transitions from beginner to senior levels.
        </p>
        <div className="mt-8 md:mt-16 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category) => {
            const categorySlug = category.toLowerCase();
            const isSelected = currentCategory === categorySlug;
            return (
              <Link
                key={category}
                href={buildCategoryHref(categorySlug)}
                prefetch={false}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(categorySlug);
                }}
                className={`rounded-full border px-4 py-1.5 min-w-20 text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? 'border-ember bg-ember text-white'
                    : 'border-line border-gray-700 bg-white text-clay hover:border-ember text-gray-800 hover:text-ember'
                }`}
              >
                {category}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-[min(1120px,92vw)] pb-20">
        <JsonLd data={buildHomeJsonLd(posts, validPage)} />
        {posts.length === 0 ? (
          <p className="rounded-xl border border-line bg-white p-4 text-clay">No posts found yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_28px_rgba(27,39,94,0.06)] transition hover:-translate-y-0.5"
              >
                <Link href={`/${post.slug}`} prefetch={false} className="relative block h-48 w-full bg-[#e7e5ff]">
                  <Image
                    src={coverSrc(post.featuredImage?.node?.sourceUrl) || '/logo.jpeg'}
                    alt={imageAlt(post.featuredImage?.node?.altText, post.title)}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 92vw, (max-width: 1024px) 45vw, 360px"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5 items-between justify-between">
                  <div>
                    <Link href={`/${post.slug}`} prefetch={false}>
                      <h3 className="text-xl font-semibold">{decodeHtmlEntities(post.title)}</h3>
                    </Link>
                    <p className="mt-2 text-clay">{excerpt(post.excerpt)}</p>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 border-t border-line py-2 px-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-clay break-words">
                      Author : {decodeHtmlEntities(post.author?.node?.name || 'Careerboat Team')}
                    </p>
                    <Link
                      href={`/${post.slug}`}
                      prefetch={false}
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
                href={buildPageHref(prevPage)}
                prefetch={false}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageClick(prevPage);
                }}
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
                    <span
                      key={`dots-${idx}`}
                      className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-sm text-clay select-none"
                    >
                      …
                    </span>
                  ) : (
                    <Link
                      key={item}
                      href={buildPageHref(item as number)}
                      prefetch={false}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageClick(item as number);
                      }}
                      className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md text-sm font-medium transition ${
                        validPage === item ? 'bg-ember text-white' : 'hover:bg-gray-100 text-clay'
                      }`}
                    >
                      {item}
                    </Link>
                  )
                );
              })()}
            </div>

            {nextPage ? (
              <Link
                href={buildPageHref(nextPage)}
                prefetch={false}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageClick(nextPage);
                }}
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

        <div className="mt-10 rounded-2xl border border-[#cfd3ff] bg-[#e9e8ff] p-6 text-center md:p-8">
          <p className="text-xs uppercase tracking-[0.16em] text-ember">Free Resource</p>
          <h3 className="mt-2 text-2xl font-bold md:text-3xl">Get your career growth checklist</h3>
          <p className="mx-auto mt-2 max-w-2xl text-clay">
            A practical step by step plan to improve your profile, interview prep, and role targeting.
          </p>
          <div className="mt-5 flex justify-center">
            <LeadModal
              buttonLabel="Get Free Career Checklist"
              className="rounded-lg bg-ember px-5 py-3 font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.22)] hover:bg-[#4338ca]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
