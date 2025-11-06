"use client";

import { useEffect, useState } from "react";

interface Admin {
  name: string;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  header: string;
  thumbnail: string;
  tags: string[];
  createdAt: string;
  admin: Admin;
}

interface ApiResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  articles: Article[];
}

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/client/articles?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (data.success) {
          setArticles(data.articles);
          setTotalPages(data.totalPages);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="bg-white min-h-screen md:py-10 py-4">
      <div className="md:max-w-5xl w-full mx-auto md:px-8 px-6">
        <div className="mb-8">
          <h1 className="md:text-3xl text-2xl md:font-bold font-semibold text-gray-900 mb-2.5">
            Latest Articles
          </h1>
          <p className="md:text-lg text-base text-black font-semibold mb-4">
            Articles for Careerboat.ai, learn and have fun
          </p>
        </div>

        <main className="space-y-4 mb-5">
          {loading ? (
            Array.from({ length: limit }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse border-t border-gray-200 py-6"
              >
                <div className="flex flex-col md:flex-row gap-14">
                  <div className="md:w-72 shrink-0">
                    <div className="w-full h-44 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="flex-1 flex flex-col space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex gap-2 mb-8">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-14"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : articles.length > 0 ? (
            articles.map((article: any) => (
              <article
                key={article.id}
                className="border-t border-gray-200 py-4"
              >
                <div className="flex flex-col md:flex-row md:gap-14 gap-6">
                  <div className="md:w-72 shrink-0">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-44 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {article.title}
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(article.tags)
                        ? article.tags.map((tag: any, idx: any) => (
                            <span
                              key={idx}
                              className="text-[#006b6a] py-1 rounded-full gap-3 md:text-sm text-xs font-semibold"
                            >
                              {tag}
                            </span>
                          ))
                        : article.tags
                        ? article.tags.split(",").map((tag: any, idx: any) => (
                            <span
                              key={idx}
                              className="text-[#006b6a] py-1 rounded-fullmd:text-sm text-xs font-semibold uppercase"
                            >
                              {tag.trim()}
                            </span>
                          ))
                        : null}
                    </div>

                    <p className="text-black text-base font-normal mb-4 flex-1">
                      {article.header}
                    </p>

                    <div className="flex justify-between items-center gap-4">
                      <div className="text-sm font-medium text-black">
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <a
                        href={`/articles/${article.slug}`}
                        className="inline-block text-[#006b6a] px-6 mb-1 rounded-base text-sm font-medium hover:underline"
                      >
                        Read More
                        <span className="ml-2 text-lg inline-block no-underline">
                          →
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-black font-semibold text-base">
                No articles found
              </p>
            </div>
          )}
        </main>

        {totalPages > 1 && !loading && (
          <div className="flex justify-center text-sm md:text-base items-center gap-4 flex-wrap">
            <button
              className="px-4 py-2 border border-gray-300 text-sm md:text-base rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - page) <= 1
              ) {
                return (
                  <button
                    key={pageNum}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === pageNum
                        ? "bg-[#006b6a] text-white "
                        : "border border-gray-300 text-sm md:text-base text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              } else if (Math.abs(pageNum - page) === 2) {
                return (
                  <span key={pageNum} className="text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm md:text-base font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
