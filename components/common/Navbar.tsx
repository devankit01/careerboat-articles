"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [hasAdminToken, setHasAdminToken] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const allCookies = document.cookie;
      console.log("🍪 All cookies:", allCookies);

      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
      console.log("Token cookie:", tokenCookie);
      setHasAdminToken(!!tokenCookie);
    };

    checkToken();
  }, []);

  return (
    <nav className="w-full bg-white">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <a
              href="/"
              className="md:text-2xl text-lg text-[#006b6a] font-bold"
            >
              Careerboat.ai
            </a>
          </div>

          <div className="flex items-center md:space-x-4 space-x-2">
            {hasAdminToken ? (
              <Link
                href="/admin"
                className="md:text-sm text-xs md:px-6 font-bold px-4 py-1.5 rounded-md border border-[#006b6a] bg-white text-black cursor-pointer"
              >
                Dashboard
              </Link>
            ) : null}
            <a
              href="https://careerloop-dev.netlify.app/student"
              className="md:text-sm text-xs md:px-6 px-4 py-1.5 font-bold cursor-pointer rounded-md border border-[#006b6a] bg-[#006b6a] text-white"
            >
              Explore
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
