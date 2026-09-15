import {
  SITE_URL,
  decodeHtmlEntities,
  publicMediaUrl,
  stripTags,
  type PostCard,
  type PostDetail,
  type PostFaq
} from '@/lib/wp';

export const HOME_TITLE = 'Career Articles & Career Advice | Careerboat';
export const HOME_DESCRIPTION =
  'Actionable writing on resumes, interviews, and role transitions from beginner to senior levels.';

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Careerboat',
    url: 'https://careerboat.ai',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.jpeg`
    },
    sameAs: [
      'https://www.linkedin.com/company/careerboat-ai/',
      'https://www.instagram.com/careerboat.ai',
      'https://x.com/careerboatai',
      'https://youtube.com/@careerboat-ai'
    ]
  };
}

function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: 'Careerboat Articles',
    description: HOME_DESCRIPTION,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en'
  };
}

export function buildHomeJsonLd(posts: PostCard[], page = 1) {
  const url = page > 1 ? `${SITE_URL}/?page=${page}` : `${SITE_URL}/`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(),
      website(),
      {
        '@type': ['CollectionPage', 'Blog'],
        '@id': `${url}#webpage`,
        url,
        name: page > 1 ? `Career Articles — Page ${page}` : HOME_TITLE,
        description: HOME_DESCRIPTION,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': ORG_ID },
        inLanguage: 'en',
        mainEntity: { '@id': `${url}#itemlist` }
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#itemlist`,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: posts.length,
        itemListElement: posts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_URL}/${post.slug}`,
          name: decodeHtmlEntities(post.title)
        }))
      }
    ]
  };
}

export function buildPostJsonLd(post: PostDetail, faqs: PostFaq[]) {
  const url = `${SITE_URL}/${post.slug}`;
  const headline = decodeHtmlEntities(post.title);
  const name = decodeHtmlEntities(post.seo?.title || post.title);
  const description = decodeHtmlEntities(
    post.seo?.metaDesc || stripTags(post.content || '').slice(0, 155)
  );
  const image = publicMediaUrl(post.seo?.opengraphImage?.sourceUrl || post.featuredImage?.node?.sourceUrl);
  const authorName = decodeHtmlEntities(post.author?.node?.name || 'Careerboat Team');
  const datePublished = post.date || undefined;
  const dateModified = post.modified || post.date || undefined;

  const graph: Record<string, unknown>[] = [
    organization(),
    website(),
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      headline,
      name,
      description,
      image: image ? [image] : undefined,
      datePublished,
      dateModified,
      author: {
        '@type': 'Person',
        name: authorName
      },
      publisher: { '@id': ORG_ID },
      url,
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID }
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name,
      description,
      isPartOf: { '@id': WEBSITE_ID },
      primaryImageOfPage: image ? { '@type': 'ImageObject', url: image } : undefined,
      datePublished,
      dateModified,
      breadcrumb: { '@id': `${url}#breadcrumb` }
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Articles', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: headline, item: url }
      ]
    }
  ];

  if (faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: decodeHtmlEntities(faq.question),
        acceptedAnswer: {
          '@type': 'Answer',
          text: stripTags(faq.answer)
        }
      }))
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}
