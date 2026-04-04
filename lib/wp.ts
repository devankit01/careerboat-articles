export const WP_GRAPHQL_ENDPOINT = 'https://red-tiger-788578.hostingersite.com/graphql';
export const WP_SITE_URL = 'https://red-tiger-788578.hostingersite.com';

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

export type PostCard = {
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    } | null;
  } | null;
  author?: {
    node?: {
      name?: string | null;
    } | null;
  } | null;
};

export type PostDetail = {
  databaseId?: number | null;
  title: string;
  slug: string;
  date?: string | null;
  content?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    } | null;
  } | null;
  seo?: {
    title?: string | null;
    metaDesc?: string | null;
    canonical?: string | null;
    opengraphTitle?: string | null;
    opengraphDescription?: string | null;
    opengraphImage?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
  author?: {
    node?: {
      name?: string | null;
    } | null;
  } | null;
};

export type PostFaq = {
  question: string;
  answer: string;
};

export type PostTldr = {
  content: string;
};

async function wpFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',  'User-Agent': 'curl/8.5.0'},

    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`WP GraphQL request failed: ${response.status}`);
  }

  const result = (await response.json()) as GraphQLResponse<T>;
  if (result.errors?.length) {
    throw new Error(result.errors[0]?.message || 'Unknown GraphQL error');
  }

  if (!result.data) {
    throw new Error('No data from GraphQL');
  }

  return result.data;
}

export async function getRecentPosts(first: number = 100): Promise<PostCard[]> {
  try {
    const data = await wpFetch<{ posts?: { nodes?: PostCard[] } }>(
      `
      query GetRecentPosts($first: Int!) {
        posts(first: $first) {
          nodes {
            title
            slug
            excerpt
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
              }
            }
          }
        }
      }
    `,
      { first }
    );

    return data.posts?.nodes ?? [];
  } catch (error) {
    console.error('Failed to load recent posts from WP GraphQL:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  try {
    const data = await wpFetch<{ post?: PostDetail | null }>(
      `
        query GetPostBySlug($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            databaseId
            title
            slug
            date
            content
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            seo {
              title
              metaDesc
              canonical
              opengraphTitle
              opengraphDescription
              opengraphImage {
                sourceUrl
              }
            }
            author {
              node {
                name
              }
            }
          }
        }
      `,
      { slug }
    );

    return data.post ?? null;
  } catch (error) {
    console.error(`Failed to load post "${slug}" from WP GraphQL:`, error);
    return null;
  }
}

function normalizeFaqRows(rows: unknown): PostFaq[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => {
      const item = row as { question?: unknown; answer?: unknown };
      const question = typeof item.question === 'string' ? item.question.trim() : '';
      const answer = typeof item.answer === 'string' ? item.answer.trim() : '';
      return question && answer ? { question, answer } : null;
    })
    .filter((row): row is PostFaq => Boolean(row));
}

export async function getPostFaqsBySlug(slug: string): Promise<PostFaq[]> {
  const attempts: Array<{ query: string; pick: (data: unknown) => unknown }> = [
    {
      query: `
        query GetPostFaqsFromAcf($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            acf {
              faqs {
                question
                answer
              }
            }
          }
        }
      `,
      pick: (data) => (data as { post?: { acf?: { faqs?: unknown } } })?.post?.acf?.faqs
    },
    {
      query: `
        query GetPostFaqsFromFaqdata($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            faqdata {
              faqs {
                question
                answer
              }
            }
          }
        }
      `,
      pick: (data) => (data as { post?: { faqdata?: { faqs?: unknown } } })?.post?.faqdata?.faqs
    },
    {
      query: `
        query GetPostFaqsFromFaqData($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            faqData {
              faqs {
                question
                answer
              }
            }
          }
        }
      `,
      pick: (data) => (data as { post?: { faqData?: { faqs?: unknown } } })?.post?.faqData?.faqs
    }
  ];

  for (const attempt of attempts) {
    try {
      const data = await wpFetch<unknown>(attempt.query, { slug });
      const rows = attempt.pick(data);
      const faqs = normalizeFaqRows(rows);
      if (faqs.length > 0) return faqs;
    } catch {
      continue;
    }
  }

  return [];
}

function normalizeTldrContent(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export async function getPostTldrBySlug(slug: string): Promise<PostTldr | null> {
  const attempts: Array<{ query: string; pick: (data: unknown) => unknown }> = [
    {
      query: `
        query GetPostTldrFromAcf($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            acf {
              tldr {
                content
              }
            }
          }
        }
      `,
      pick: (data) => (data as { post?: { acf?: { tldr?: { content?: unknown } } } })?.post?.acf?.tldr?.content
    },
    {
      query: `
        query GetPostTldrFromTldr($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            tldr {
              content
            }
          }
        }
      `,
      pick: (data) => (data as { post?: { tldr?: { content?: unknown } } })?.post?.tldr?.content
    },
    {
      query: `
        query GetPostTldrFromTldrData($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            tldrData {
              content
            }
          }
        }
      `,
      pick: (data) => (data as { post?: { tldrData?: { content?: unknown } } })?.post?.tldrData?.content
    }
  ];

  for (const attempt of attempts) {
    try {
      const data = await wpFetch<unknown>(attempt.query, { slug });
      const content = normalizeTldrContent(attempt.pick(data));
      if (content) return { content };
    } catch {
      continue;
    }
  }

  return null;
}

export function decodeHtmlEntities(input: string) {
  const named: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    rsquo: "'",
    lsquo: "'",
    rdquo: '"',
    ldquo: '"',
    ndash: '-',
    mdash: '-',
    hellip: '...'
  };

  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity[0] === '#') {
      const isHex = entity[1]?.toLowerCase() === 'x';
      const value = parseInt(isHex ? entity.slice(2) : entity.slice(1), isHex ? 16 : 10);
      if (!Number.isNaN(value)) {
        try {
          return String.fromCodePoint(value);
        } catch {
          return match;
        }
      }
      return match;
    }

    const key = entity.toLowerCase();
    return named[key] ?? match;
  });
}

export function stripTags(input: string) {
  const noTags = input.replace(/<[^>]*>/g, ' ');
  return decodeHtmlEntities(noTags).replace(/\s+/g, ' ').trim();
}

export function extractH2(content: string): Array<{ id: string; text: string }> {
  const matches = [...content.matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi)];

  return matches.map((match, index) => {
    const attrs = match[1] ?? '';
    const inner = match[2] ?? '';
    const text = stripTags(inner || `Section ${index + 1}`);
    const existingIdMatch = attrs.match(/\sid=(["'])(.*?)\1/i);
    const existingId = existingIdMatch?.[2]?.trim();
    const base = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60);

    return {
      id: existingId || `${base || 'section'}-${index + 1}`,
      text
    };
  });
}

export function injectH2Ids(content: string, headings: Array<{ id: string; text: string }>) {
  let index = 0;
  return content.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_, attrs, inner) => {
    const id = headings[index]?.id ?? `section-${index + 1}`;
    index += 1;
    const hasId = /\sid=(["']).*?\1/i.test(attrs);
    if (hasId) {
      return `<h2${attrs}>${inner}</h2>`;
    }
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
}

export function injectAfterFirstParagraph(content: string, htmlBlock: string) {
  const firstParagraphCloseIndex = content.search(/<\/p>/i);
  if (firstParagraphCloseIndex === -1) {
    return `${htmlBlock}${content}`;
  }

  const insertAt = firstParagraphCloseIndex + 4;
  return `${content.slice(0, insertAt)}${htmlBlock}${content.slice(insertAt)}`;
}
