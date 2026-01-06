import Link from "next/link";
import { inter } from "@/lib/fonts";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Eye, Pencil, Plus } from "lucide-react";
import DeleteArticleButton from "@/components/DeleteArticleButton";

async function getMyArticles() {
  const headersList = await headers();

  // ✅ Use NEXT_PUBLIC_BASE_URL first, fallback to VERCEL_URL, then localhost
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/admin/articles`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      cookie: headersList.get("cookie") || "",
    },
  });

  if (res.status === 401) {
    return { unauthorized: true as const, articles: [], total: 0 };
  }
  if (!res.ok) {
    return { unauthorized: false as const, articles: [], total: 0 };
  }

  const data = await res.json();

  return {
    unauthorized: false as const,
    articles: data.articles as Array<{
      id: string;
      slug: string;
      title: string;
      header?: string | null;
      thumbnail?: string | null;
      status: "Draft" | "Published";
      createdAt: string;
      updatedAt: string;
    }>,
    total: data.total as number,
  };
}

export default async function AdminDashboardPage() {
  const { articles, total, unauthorized } = await getMyArticles();

  if (unauthorized) {
    return redirect("/admin/signin");
  }

  return (
    <div className={`${inter.className} max-w-6xl mx-auto min-h-screen px-4 py-4`}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="md:text-2xl text-lg font-semibold">
          My Blogs ({total})
        </h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center text-sm md:text-base font-medium gap-2 bg-[#006b6a] text-white px-4 py-1.5 rounded-md"
        >
          <Plus className="h-4 w-4" />
          New Blog
        </Link>
      </div>

      {unauthorized ? (
        <div className="border rounded-lg p-6 text-sm">
          You are not signed in.
        </div>
      ) : articles.length === 0 ? (
        <div className="border rounded-lg p-6 text-sm text-gray-600">
          No articles yet. Create your first one.
        </div>
      ) : (
        <ul className="space-y-3">
          {articles.map((a) => (
            <li
              key={a.id}
              className="border rounded-md p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1">
                <div className="font-semibold text-base md:text-lg mb-2">
                  {a.title}
                </div>

                {a.header ? (
                  <div className="text-sm md:text-base font-medium text-gray-800 line-clamp-1">
                    {a.header}
                  </div>
                ) : null}

                <div className="text-xs md:text-sm mt-2 md:mt-3 text-gray-700 flex flex-wrap items-center gap-2">
                  <span className="text-black">
                    Updated {new Date(a.updatedAt).toLocaleString()}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                      a.status === "Published"
                        ? "border-green-600 text-green-700"
                        : "border-gray-500 text-gray-700"
                    }`}
                  >
                    {a.status || "Draft"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 md:mt-0 self-end md:self-auto">
                <Link
                  href={`/articles/${a.slug}`}
                  className="inline-flex items-center justify-center rounded-md border px-2.5 py-1.5 hover:bg-gray-50"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/articles/${a.slug}/edit`}
                  className="inline-flex items-center justify-center rounded-md border px-2.5 py-1.5 hover:bg-gray-50"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteArticleButton id={a.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
