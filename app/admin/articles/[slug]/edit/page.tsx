import { inter } from "@/lib/fonts";
import AdminArticleForm, {
  type AdminArticle,
} from "@/components/AdminArticleForm";
import { headers } from "next/headers";

async function getArticleForAdmin(slug: string) {
  const h = await headers();
  const host = h.get("host");
  const cookie = h.get("cookie") || "";

  // Use full URL because this runs on the server
  const protocol = host?.includes("localhost") ? "http" : "https";
  const url = `${protocol}://${host}/api/admin/articles/by-slug/${slug}`;

  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include",
    headers: { cookie },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.success) return null;

  const a = data.article;
  const article: AdminArticle = {
    id: a.id,
    slug: a.slug,
    title: a.title,
    header: a.header,
    content: a.content,
    tags: a.tags,
    thumbnail: a.thumbnail,
    media: a.media,
    status: a.status,
  };

  return article;
}

export default async function EditAdminArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleForAdmin(slug);

  if (!article) {
    return (
      <div className={`${inter.className} max-w-3xl mx-auto px-4 py-8`}>
        <h1 className="text-2xl font-semibold mb-2">Edit Article</h1>
        <p className="text-sm text-gray-600">
          Article not found or you may not have access.
        </p>
      </div>
    );
  }

  return (
    <div className={`${inter.className} max-w-3xl mx-auto px-4 py-8`}>
      <AdminArticleForm mode="edit" initialArticle={article} />
    </div>
  );
}
