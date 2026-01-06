"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Subscriber from "./common/Subscriber";
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
  const limit = 9;

  const router = useRouter();

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

  const truncateText = (text: string, limit = 50) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };


  return (
    <div className="bg-white min-h-screen md:py-10 py-4">
      <div className="md:max-w-6xl w-full mx-auto md:px-8 px-6">
        <div className="mb-8 md:mb-16 md:my-6">
          <h1 className="text-lg md:text-2xl  md:font-bold font-semibold text-gray-900 ">
            Read our Blogs
          </h1>
          <p className="md:text-md text-base text-gray-500 mb-4">
             Learn how to build resumes, crack interviews, and grow your career with AI support
          </p>
        </div>

        {/* <main className="space-y-4 mb-5"> */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">

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

            <>
              {


                articles.map((article: any) => (



                  <article
                    key={article.id}
                    onClick={() => router.push(`/articles/${article.slug}`)}
                    className="
    border border-gray-400 rounded-lg overflow-hidden flex flex-col 
    cursor-pointer
    transition-all duration-300 ease-in-out
    hover:shadow-2xl hover:-translate-y-1 hover:border-gray-400
  "
                  >
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-44 object-cover"
                    />

                    <div className="flex flex-col p-4 flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        {/* {article.title} */}
                        {truncateText(article.title, 48)}

                      </h2>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {Array.isArray(article.tags)
                          ? article.tags.map((tag: any, idx: any) => (
                            <span
                              key={idx}
                              className="text-[#006b6a] text-xs font-semibold"
                            >
                              {tag}
                            </span>
                          ))
                          : null}
                      </div>

                      <p className="text-sm text-black mb-4 flex-1">
                        {truncateText(article.header, 122)}

                      </p>

                      <div className="flex justify-between items-center text-sm">
                        <span>
                          {new Date(article.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>

                        <a
                          href={`/articles/${article.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#006b6a] font-medium hover:underline"
                        >
                          Read More →
                        </a>
                      </div>
                    </div>
                  </article>


                ))
              }

            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-black font-semibold text-base">
                No blogs found
              </p>
            </div>
          )}
        </main>



        {totalPages > 1 && !loading && (
          <div className="flex justify-center text-sm md:text-base items-center gap-4 flex-wrap py-10">
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
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === pageNum
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
      <Subscriber/>

    </div>
  );
}
