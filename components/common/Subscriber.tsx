"use client";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
export default function Subscriber() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setLoadings] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 3;

  const baseurl = process.env.NEXT_PUBLIC_NODE_URL || 'http://localhost:5000';
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/client/articles?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (data.success) {
          setArticles(data.articles);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [page]);

  const handleSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !firstName) {
      toast.error("Email & First Name are required went wrong");
      return;
    }
    const apiPayload = {
      email,
      firstName,
      lastName,
    };
    try {
      setLoading(true);
      const res = await fetch(`${baseurl}/api/article/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Subscription failed");
      }
      toast.success("Subscribed successfully");
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (error) {
      console.error("Subscription Error:", error);
      toast.error(`${error}`);

    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text: string, limit = 50) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };
  return (
    <div className="p-2 md:p-10">
      <div className="w-full p-4 md:p-10  flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border border-gray-200 shadow-md rounded-lg">
        {/* Left Content */}
        <div className="w-full md:w-[38%] flex gap-2 items-center flex-wrap">
          <div className="w-full ">
            <h2 className="text-xl font-bold pb-2 text-gray-900">
              Latest Articles For You....
            </h2>
          </div>
          <main className="flex w-full flex-wrap gap-2 md:gap-4">
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
                                         <a
                      href={`/articles/${article.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm font-semibold text-black min-w-full "
                    >
                    <article key={article.id}
                      // onClick={() => router.push(`/articles/${article.slug}`)}
                      className=" border border-gray-300 rounded-lg overflow-hidden flex w-full flex-wrap item-center p-4 
    cursor-pointer  transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:bg-[#4F47E5] hover:text-white bg-gray-100"
                    >                           

                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className=" h-15 w-15 object-cover"
                        />

                        <div className="flex flex-col p-4 flex-1 py-0">
                          <h2 className="text-lg font-semibold hover:text-white ">
                            {truncateText(article.title, 48)}
                          </h2>

                          {/* <p className="text-sm text-black mb-4 flex-1">
                          {truncateText(article.header, 122)}
                        </p> */}

                          {/* <div className="flex justify-between items-center text-sm">
                          <button className="mt-4 min-w-full py-2 bg-[#FFD153] rounded-lg   hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 ease-in-out" >
                            <a
                              href={`/articles/${article.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-sm font-semibold text-black min-w-full "
                            >
                              Read More →
                            </a>
                          </button>
                        </div> */}
                        </div> 
                         </article>
                        </a>
                   
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
        </div>
        <div className="w-full md:w-[22%] hidden md:block ">
          <img src="/blog.jpg" className="w-full object-cover" />
        </div>
        {/* Right Form */}
        <form
          onSubmit={handleSubscriber}
          className="w-full md:w-[30%] flex flex-col sm:flex-row gap-2 flex-wrap p-2 md:p-8  md:pt-2 rounded-lg border border-gray-300 bg-gray-100 ">

          <div className="w-full ">
            <h2 className="text-xl font-bold text-gray-900 py-2">
              Subscribe to get more updates.
            </h2>
          </div>
          <div className=" ">
            <div className="w-full ">
              <label className="text-sm font-bold">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="border w-full border-gray-400  rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2  focus:ring-black"
              />
            </div>
            <div className="flex gap-2 w-full pt-6 pb-3">
              <div>
                <label className="text-sm font-bold">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="border border-gray-400 rounded-md w-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="text-sm font-bold">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="border border-gray-400 rounded-md w-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div className="text-xs text-gray-700 text-center w-full py-4 gap-2 items-center flex"><input className="accent-indigo-600" type="checkbox" />By Subscribing you agree to our Privacy Policy</div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#4F47E5] w-full text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#4F47E5] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 ease-in-out"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </form>
      </div>
    </div>

  )

}
