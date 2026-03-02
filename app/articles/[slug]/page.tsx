import ShareButton from "@/app/ShareButton";
import Feedback from "@/components/common/feedback";
import Subscriber from "@/components/common/Subscriber";
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

function addIdsToHeadings(html: string) {
  return html.replace(
    /<h([2-3])([^>]*)>(.*?)<\/h\1>/gi,
    (match, level, attrs, text) => {
      const cleanText = text.replace(/<[^>]+>/g, "").trim();

      const slug = cleanText
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      return `<h${level} id="${slug}" ${attrs}>${text}</h${level}>`;
    }
  );
}

function extractHeadings(html: string) {
  // TL;DR find karo (h2, h3, p, strong me ho sakta hai)
  const tldrMatch = html.match(
    /<(h[2-3]|p|strong)[^>]*>\s*(tl;dr)\s*<\/(h[2-3]|p|strong)>/i
  );

  let contentAfterTldr = html;

  if (tldrMatch && tldrMatch.index !== undefined) {
    contentAfterTldr = html.slice(
      tldrMatch.index + tldrMatch[0].length
    );
  }
  const matches = [
    ...contentAfterTldr.matchAll(/<h([2-3])[^>]*>(.*?)<\/h\1>/gi),
  ];

  return matches.map((match) => {
    const text = match[2].replace(/<[^>]+>/g, "").trim();

    const slug = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    return {
      text,
      id: slug,
      level: Number(match[1]),
    };
  });
}

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }): Promise<Metadata> {
//   const { slug } = await params;
//   const article = await getArticle(slug);
//   // console.log(article);
//   if (!article) return {};
//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (await getSiteBase());
//   const url = `${siteUrl}/articles/${article.slug}`;
//   const desc = article.header || extractPlainText(article.content)?.slice(0, 160) || undefined;
//   const image = article.thumbnail || "/og-default.png";

//   return {
//     title: article.title,
//     description: desc,
//     alternates: { canonical: url },
//     openGraph: {
//       type: "article",
//       url,
//       title: article.title,
//       description: desc,
//       images: [{ url: image }],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: article.title,
//       description: desc,
//       images: [image],
//     },
//   };
// }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return {};

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || (await getSiteBase());

  const url = `${siteUrl}/articles/${article.slug}`;

  const desc =
    article.header ||
    extractPlainText(article.content)?.slice(0, 160) ||
    undefined;

  const image = article.thumbnail || "/og-default.png";

  return {
    title: article.title,
    description: desc,

    keywords: article.tags || [
      "career advice",
      "AI interview",
      "resume tips",
      "job search",
      "Careerboat",
    ],

    authors: [{ name: article.author || "Careerboat Team" }],
    creator: "Careerboat.ai",
    publisher: "Careerboat.ai",

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: desc,
      siteName: "Careerboat.ai Articles",

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],

      publishedTime: article.createdAt
  ? new Date(article.createdAt).toISOString()
  : undefined,
    modifiedTime: article.updatedAt
  ? new Date(article.updatedAt).toISOString()
  : undefined,

      authors: [article.author || "Careerboat Team"],
    },

    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: desc,
      images: [image],
      creator: "@careerboat", // if you have Twitter handle
    },

    robots: {
      index: true,
      follow: true,
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
  const desc = article.header || extractPlainText(article.content)?.slice(0, 160) || undefined;
  const image = article.thumbnail || "/og-default.png";

  console.log(article);

  // const tagsArray = Array.isArray(article.tags)
  //   ? (article.tags as any)
  //   : article.tags
  //     ? String(article.tags)
  //       .split(",")
  //       .map((t) => t.trim())
  //       .filter(Boolean)
  //     : [];
  function extractFAQs(html: string) {
    if (!html) return [];
    const faqs: { question: string; answer: string }[] = [];
    // Match each Q block
    const regex =
      /Q:\s*(.*?)<\/strong>\s*<br[^>]*>\s*<strong>\s*Ans\.?\s*<\/strong>\s*(.*?)<\/span>/gis;

    let match;

    while ((match = regex.exec(html)) !== null) {
      const question = match[1].replace(/<[^>]*>/g, "").trim();
      const answer = match[2].replace(/<[^>]*>/g, "").trim();

      faqs.push({ question, answer });
    }

    return faqs;
  }

  let faqs: { question: string; answer: string }[] = [];

  if (article.faqContent) {
    faqs = extractFAQs(article.faqContent);
  }

  function styleTldr(html: string) {
    return html.replace(
      /(<h[2-3][^>]*>[\s\S]*?tl;dr[\s\S]*?<\/h[2-3]>)([\s\S]*?)(?=<hr\b|$)/i,
      `
    <div class="bg-gray-100 p-6 mx-auto max-w-2xl h-auto text-sm rounded-xl my-6 border border-gray-200 shadow-md">
      $1
      $2
    </div>
    `
    );
  }

  const isHtml = typeof (article as any).content === "string";

  let processedHtml = "";
  let toc: { text: string; id: string; level: number }[] = [];
  if (isHtml && article.content) {
    let content = article.content as string;

    content = addIdsToHeadings(content);
    content = styleTldr(content);

    processedHtml = content;
    toc = extractHeadings(article.content as string);
  }
  return (
    <div className="bg-white min-h-screen">
      <div className="w-full">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-10 py-4" >
          <h1 className="md:text-4xl text-2xl font-semibold mb-3" >
            {article.title}
          </h1>
          {
            article.header ? (
              <p className="text-lg font-medium text-black mb-5" >
                {article.header}
              </p>
            ) : null
          }

          <div className="flex justify-between items-center" >
            <div className="text-sm text-black mb-6" >
              By {article.admin.name} ·{" "}
              {
                new Date(article.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              }
            </div>
            < div className="" > <ShareButton url={url} /></div >
          </div>
          {article.thumbnail ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full img shadow-sm bg-red-30"
            />
          ) : null
          }
          {/* {
            tagsArray.length ? (
              <div className="flex flex-wrap gap-x-2 gap-y-2 mb-7" >
                {
                  tagsArray.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex text-[#4F47E5] font-semibold  py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  ))
                }
              </div>
            ) : null
          } */}

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
        </main>
      </div>
      <div className="flex items-start p-2 md:p-6 max-w-7xl mx-auto flex-wrap  bg-red-0">
        <div className=" w-full md:w-[70%] p-2 md:p-6">
          <article className="article-content prose max-w-none space-y-5" >
            {
              isHtml ? (
                <div
                  dangerouslySetInnerHTML={{ __html: processedHtml }}
                />
              ) : (
                renderBlocks(((article as any).content as any[]) || [])
              )}
          </article>
        </div>
        <div className="w-full md:w-[30%] bg-red-00 p-2  flex justify-start flex-wrap sticky top-5 right-0 gap-4 md:gap-12 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm w-full  ">
            <h3 className="font-semibold bg-[#4F47E5] p-2 text-lg text-white rounded-t-xl">Table of Contents</h3>
            <div className="overflow-y-auto max-h-80 border border-gray-300 rounded-b-lg p-2">
              <ul className="space-y-2 text-sm p-3">
                {toc.map((item, index) => (
                  <li
                    key={index}
                    className={`${item.level === 3 ? " text-gray-600" : "font-medium"
                      }`}
                  >
                    <a
                      href={`#${item.id}`}
                      className="hover:text-indigo-600 transition-colors hover:underline font-bold text-md"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Feedback />
        </div>
      </div>

      {/*  Separate FAQ Section */}
      <div className="p-2 md:py-6 md:px-48 w-full">
        {/* {
          faqs.length > 0 && (
            <section className="" >
              <h2 className="text-xl md:text-3xl font-bold mb-6 text-center" > FAQs </h2>

              < div className="space-y-4" >
                {
                  faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group border border-gray-200 bg-gray-200 hover:bg-[#4F47E5] hover:text-white  rounded-lg p-4 bg-"
                    >
                      <summary className="cursor-pointer font-medium text-lg flex justify-between items-center hover:text-white" >
                        {faq.question}
                        < span className="ml-2 transition-transform group-open:rotate-180" >
                          ▼
                        </span>
                      </summary>

                      < p className="mt-3 hover:text-white leading-7" >
                        {faq.answer}
                      </p>
                    </details>
                  ))
                }
              </div>
            </section>
          )
        } */}

        {faqs.length > 0 && (
          <section className="">
            <h2 className="text-xl md:text-3xl font-bold mb-6 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group border border-gray-200 bg-gray-100 hover:bg-[#4F47E5] hover:text-white rounded-lg p-4 transition"
                >
                  <summary className="cursor-pointer font-semibold text-lg flex justify-between items-center">
                    {faq.question}
                    <span className="ml-2 transition-transform group-open:rotate-180 text-sm">
                      ▼
                    </span>
                  </summary>

                  <p className="mt-3 leading-7 group-hover:text-white">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
      <Subscriber />
    </div>
  );
}
