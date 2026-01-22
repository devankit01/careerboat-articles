"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [hasAdminToken, setHasAdminToken] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const allCookies = document.cookie;
      console.log(" All cookies:", allCookies);

      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
      console.log("Token cookie:", tokenCookie);
      setHasAdminToken(!!tokenCookie);
    };

    checkToken();
  }, []);

  return (
    <nav className="w-full bg-white border-b  border-gray-800 shadow-sm ">
      <div className="w-full mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex shrink-0 ">
            <a
              href="/"
              className="md:text-2xl text-lg text-[#006b6a] font-bold"
            >
              <img
                src="/LOGO.jpeg"
                alt="Logo"
                className="w-full h-16 object-cover"
              />
            </a>
          </div>

          <div className="flex items-center justify-end flex-wrap gap-2 md:space-x-4 ">
            {hasAdminToken ? (
              <Link
                href="/admin"
                className="md:text-sm text-xs md:px-6 font-bold px-4 py-1.5 rounded-md border border-[#006b6a] bg-white text-black cursor-pointer"
              >
                Dashboard
              </Link>
            ) : null}
            <a
              href="https://careerboat.ai/"
              className="md:text-sm text-xs md:px-6 px-4 py-1.5 font-bold cursor-pointer rounded-md border border-[#006b6a] bg-[#006b6a] text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 ease-in-out"
            >
              Explore
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
