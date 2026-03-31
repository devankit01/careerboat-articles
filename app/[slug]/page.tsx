import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LeadModal from '@/components/LeadModal';
import ShareMenu from '@/components/ShareMenu';
import TableOfContents from '@/components/TableOfContents';
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
  const canonical = `https://articles.careerboat.ai/${post.slug}`;
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
    },
    
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
      <div class="not-prose mb-6 rounded-2xl border border-[#cfd3ff] bg-[#e9e8ff] p-4 md:p-5">
        <h3 class="tldr-label">TL;DR</h3>
        <div class="tldr-prose prose-content mt-0">${tldr.content}</div>
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
  const shareUrl = encodeURIComponent(`https://articles.careerboat.ai/${post.slug}`);
  const shareText = encodeURIComponent(postTitle);

  return (
    <main className="mx-auto w-[min(1120px,92vw)] py-10 lg:py-12">
      <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_14px_34px_rgba(27,39,94,0.06)] md:p-10">
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">{postTitle}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 pb-4 text-sm text-clay">
          <span>Author : {authorName}</span>
          {date && <span>Published on : {date}</span>}
          <span>Read time : {readTime} min</span>
          <ShareMenu shareUrl={shareUrl} shareText={shareText} />
        </div>

        {post.featuredImage?.node?.sourceUrl ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-[#f8faff]">
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={decodeHtmlEntities(post.featuredImage.node.altText || postTitle)}
              className="h-[240px] w-full object-cover sm:h-[320px] lg:h-[420px]"
            />
          </div>
        ) : null}
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
          <div className="hidden rounded-2xl border border-line bg-white p-5 shadow-[0_12px_28px_rgba(27,39,94,0.06)] lg:block">
            <h3 className="text-lg font-bold">Table of Contents</h3>
            <TableOfContents headings={headings} />
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
        <section className="mt-12 rounded-2xl border border-line bg-[#e7eaee] px-5 py-8 shadow-[0_12px_28px_rgba(27,39,94,0.06)] md:mt-16 md:px-8 md:py-10">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-ember">Related Blogs</p>
              <h2 className="mt-1 text-2xl font-bold md:text-3xl">Keep reading</h2>
            </div>
            <Link href="/" className="text-sm font-semibold text-ember hover:underline">
              View all articles
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.slug}
                className="overflow-hidden rounded-[22px] border border-[#d6dbe3] bg-[#f8f7f5] shadow-[0_12px_26px_rgba(27,39,94,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(27,39,94,0.12)]"
              >
                <Link href={`/${relatedPost.slug}`} className="block">
                  <img
                    src={relatedPost.featuredImage?.node?.sourceUrl || '/logo.jpeg'}
                    alt={decodeHtmlEntities(relatedPost.featuredImage?.node?.altText || relatedPost.title)}
                    className="h-[200px] w-full bg-[#e7e5ff] object-cover md:h-[220px]"
                  />
                </Link>
                <div className="flex min-h-[215px] flex-col p-5 md:p-6">
                  <Link href={`/${relatedPost.slug}`}>
                    <h3 className="text-lg font-semibold leading-tight text-ink md:text-xl">
                      {decodeHtmlEntities(relatedPost.title)}
                    </h3>
                  </Link>
                  <p
                    className="mt-2 text-sm leading-6 text-clay md:text-base"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {excerpt(relatedPost.excerpt)}
                  </p>
                  <Link
                    href={`/${relatedPost.slug}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-butter px-4 py-2.5 text-sm font-semibold text-[#171717] shadow-[0_10px_18px_rgba(186,154,32,0.18)] transition hover:bg-[#ebbf32]"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
