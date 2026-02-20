import ShareButton from "@/app/ShareButton";
import Subscriber from "@/components/common/Subscriber";
import { Share2Icon } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

async function getArticle(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/client/articles/${slug}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.success) return null;
  return data.article;
}

async function getSiteBase() {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

function extractPlainText(content: any): string | undefined {
  if (!content) return undefined;
  if (typeof content === "string") {
    return content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (Array.isArray(content)) {
    return content
      .map((b) => (b?.type === "paragraph" && b.text ? String(b.text) : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (await getSiteBase());
  const url = `${siteUrl}/articles/${article.slug}`;
  const desc =
    article.header ||
    extractPlainText(article.content)?.slice(0, 160) ||
    undefined;
  const image = article.thumbnail || "/og-default.png";

  return {
    title: article.title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: desc,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: desc,
      images: [image],
    },
  };
}

function renderBlocks(blocks: any[]) {
  if (!Array.isArray(blocks)) return null;
  return blocks.map((b, i) => {
    switch (b?.type) {
      case "paragraph":
        return (
          <p key={i} className="text-lg text-red-500 leading-8">
            {b.text}
          </p>
        );
      case "image":
        // eslint-disable-next-line @next/next/no-img-element
        return (
          <div className="p-6 bg-red-300 m-4">
              <img
              key={i}
              src={b.url}
              alt={b.alt || ""}
              className=" max-w-xl h-auto mx-auto my-6 rounded shadow-sm bg-red-400 m-6"
            />
          </div>
        );
      case "video":
        return (
          <video key={i} controls className="w-full rounded">
            <source src={b.url} />
          </video>
        );
      default:
        return null;
    }
  });
}

export default async function ArticleBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (await getSiteBase());
  const url = `${siteUrl}/articles/${article.slug}`;
  const desc =
    article.header ||
    extractPlainText(article.content)?.slice(0, 160) ||
    undefined;
  const image = article.thumbnail || "/og-default.png";

  const tagsArray = Array.isArray(article.tags)
    ? (article.tags as any)
    : article.tags
      ? String(article.tags)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
      : [];

  const isHtml = typeof (article as any).content === "string";
  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 md:py-10 py-4">
        <h1 className="md:text-4xl text-2xl font-semibold mb-3">
          {article.title}
        </h1>
        {article.header ? (
          <p className="text-lg font-medium text-black mb-5">
            {article.header}
          </p>
        ) : null}
        <div className="flex justify-between items-center">
        <div className="text-sm text-black mb-6">
          By {article.admin.name} ·{" "}
          {new Date(article.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          </div>
          <div className=""><ShareButton url={url}/></div>
        </div>
        {article.thumbnail ? (
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full img mb-6 shadow-sm"
          />
        ) : null}
        {tagsArray.length ? (
          <div className="flex flex-wrap gap-x-2 gap-y-2 mb-7">
            {tagsArray.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="inline-flex text-[#4F47E5] font-semibold  py-0.5 text-xs"
              >
               {tag}
              </span>
            ))}
          </div>
        ) : null}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: desc,
              datePublished: article.createdAt,
              dateModified: article.updatedAt,
              author: {
                "@type": "Person",
                name: article.admin?.name || "Admin",
              },
              image: image,
              mainEntityOfPage: url,
            }),
          }}
        />

        <article className="article-content prose max-w-none space-y-5">
          {isHtml ? (
            <div
              dangerouslySetInnerHTML={{
                __html: (article as any).content as string,
              }}
            />
          ) : (
            renderBlocks(((article as any).content as any[]) || [])
          )}
        </article>
      </main>


      <Subscriber />
    </div>
  );
}
