import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LeadModal from '@/components/LeadModal';
import { decodeHtmlEntities, extractH2, getPostBySlug, getPostFaqsBySlug, getPostTldrBySlug, getRecentPosts, injectAfterFirstParagraph, injectH2Ids, stripTags } from '@/lib/wp';

type PostPageProps = {
  params: { slug: string };
};

function excerpt(input?: string | null) {
  if (!input) return 'Read this post from Careerboat.';
  const text = stripTags(input);
  return text.length > 80 ? `${text.slice(0, 80)}...` : text;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Post not found | Careerboat'
    };
  }

  const title = decodeHtmlEntities(post.seo?.title || post.title);
  const description = decodeHtmlEntities(post.seo?.metaDesc || stripTags(post.content || '').slice(0, 155));
  const ogTitle = decodeHtmlEntities(post.seo?.opengraphTitle || title);
  const ogDescription = decodeHtmlEntities(post.seo?.opengraphDescription || description);
  const canonical = `https://aricles.careerboat.ai/${post.slug}`;
  const ogImage = post.seo?.opengraphImage?.sourceUrl;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      type: 'article',
      images: ogImage ? [{ url: ogImage }] : undefined
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined
    }
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const [post, faqs, tldr, recentPosts] = await Promise.all([
    getPostBySlug(params.slug),
    getPostFaqsBySlug(params.slug),
    getPostTldrBySlug(params.slug),
    getRecentPosts()
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = recentPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, 3);

  const rawContent = post.content ?? '<p>No content available.</p>';
  const headings = extractH2(rawContent);
  const contentWithIds = injectH2Ids(rawContent, headings);
  const tldrBlock = tldr?.content
    ? `
      <div class="not-prose mt-6 mb-6 rounded-2xl border border-[#cfd3ff] bg-[#e9e8ff] p-4 md:p-5">
        <p class="text-xs uppercase tracking-[0.16em] text-[#4f46e5]">TLDR</p>
        <div class="prose-content mt-2">${tldr.content}</div>
      </div>
    `
    : '';
  const contentWithExtras = tldrBlock ? injectAfterFirstParagraph(contentWithIds, tldrBlock) : contentWithIds;

  const date = post.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;
  const authorName = decodeHtmlEntities(post.author?.node?.name || 'Careerboat Team');
  const postTitle = decodeHtmlEntities(post.title);
  const wordCount = stripTags(rawContent).split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 220));
  const shareUrl = encodeURIComponent(`https://aricles.careerboat.ai/${post.slug}`);
  const shareText = encodeURIComponent(postTitle);

  return (
    <main className="mx-auto w-[min(1120px,92vw)] py-10 lg:py-12">
      <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_14px_34px_rgba(27,39,94,0.06)] md:p-10">
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">{postTitle}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 pb-4 text-sm text-clay">
          <span>Author : {authorName}</span>
          {date && <span>Published on : {date}</span>}
          <span>Read time : {readTime} min</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-ink">Share:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on Facebook"
              className="rounded-md border border-line bg-[#f8faff] px-2 py-1 text-xs hover:bg-[#eef2ff]"
            >
              FB
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on LinkedIn"
              className="rounded-md border border-line bg-[#f8faff] px-2 py-1 text-xs hover:bg-[#eef2ff]"
            >
              IN
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on X"
              className="rounded-md border border-line bg-[#f8faff] px-2 py-1 text-xs hover:bg-[#eef2ff]"
            >
              X
            </a>
          </div>
        </div>
      </section>

      <section className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_290px]">
        <div className="min-w-0 space-y-8">
          <article className="rounded-2xl border border-line bg-white p-5 shadow-[0_12px_28px_rgba(27,39,94,0.06)] md:p-7">
            <div className="prose-content" dangerouslySetInnerHTML={{ __html: contentWithExtras }} />

            {faqs.length > 0 ? (
              <div className="mt-10 rounded-2xl border border-line bg-[#f8faff] p-5 md:p-7">
                <h2 className="text-2xl font-bold">FAQs</h2>
                <div className="mt-5 space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={`${faq.question}-${index}`} className="group rounded-xl border border-line bg-white p-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-lg font-semibold">
                        <span>{decodeHtmlEntities(faq.question)}</span>
                        <span className="text-ember transition group-open:rotate-45">+</span>
                      </summary>
                      <div className="prose-content mt-3" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </details>
                  ))}
                </div>
              </div>
            ) : null}
          </article>

        </div>

        <aside className="flex h-fit flex-col gap-6 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_12px_28px_rgba(27,39,94,0.06)]">
            <h3 className="text-lg font-bold">Table of Contents</h3>

            {headings.length === 0 ? (
              <p className="mt-3 text-sm text-clay">No H2 sections found.</p>
            ) : (
              <nav className="mt-3 flex flex-col gap-2 border-l-2 border-[#cfd3ff] pl-3">
                {headings.map((heading) => (
                  <a key={heading.id} href={`#${heading.id}`} className="text-sm text-clay hover:text-ember">
                    {heading.text}
                  </a>
                ))}
              </nav>
            )}
          </div>

          <div className="rounded-xl border border-[#ead797] bg-[#fff8dc] p-4 shadow-[0_12px_28px_rgba(27,39,94,0.06)]">
            <h4 className="text-base font-bold">Need a clear plan?</h4>
            <p className="mt-1 text-sm text-clay">Get our checklist for the next 30 days of focused growth.</p>
            <div className="mt-3">
              <LeadModal
                buttonLabel="Get Checklist"
                className="w-full rounded-lg bg-butter px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_10px_24px_rgba(242,204,89,0.28)] hover:bg-[#ebbf32]"
              />
            </div>
          </div>
        </aside>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="relative left-1/2 right-1/2 mt-12 w-screen -translate-x-1/2 bg-[#e7eaee] py-8 md:mt-16 md:py-10">
          <div className="mx-auto w-[min(1600px,calc(100vw-2rem))]">
            <div className="mb-6 flex flex-col gap-2 px-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-ember">Related Blogs</p>
                <h2 className="mt-1 text-2xl font-bold md:text-3xl">Keep reading</h2>
              </div>
              <Link href="/" className="text-sm font-semibold text-ember hover:underline">
                View all articles
              </Link>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.slug}
                  className="overflow-hidden rounded-[24px] border border-[#d6dbe3] bg-[#f8f7f5] shadow-[0_12px_26px_rgba(27,39,94,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(27,39,94,0.12)]"
                >
                  <Link href={`/${relatedPost.slug}`} className="block">
                    <img
                      src={relatedPost.featuredImage?.node?.sourceUrl || '/logo.jpeg'}
                      alt={decodeHtmlEntities(relatedPost.featuredImage?.node?.altText || relatedPost.title)}
                      className="h-[230px] w-full bg-[#e7e5ff] object-cover md:h-[265px]"
                    />
                  </Link>
                  <div className="flex min-h-[245px] flex-col p-6">
                    <Link href={`/${relatedPost.slug}`}>
                      <h3 className="text-[clamp(1.5rem,1.3rem+0.4vw,2rem)] font-semibold leading-[1.25] text-ink">
                        {decodeHtmlEntities(relatedPost.title)}
                      </h3>
                    </Link>
                    <p className="mt-4 text-lg leading-8 text-clay">{excerpt(relatedPost.excerpt)}</p>
                    <Link
                      href={`/${relatedPost.slug}`}
                      className="mt-auto inline-flex w-full items-center justify-center rounded-[14px] bg-butter px-6 py-4 text-xl font-semibold text-[#171717] shadow-[0_10px_18px_rgba(186,154,32,0.18)] transition hover:bg-[#ebbf32]"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
