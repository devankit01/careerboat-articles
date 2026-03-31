import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';

export const metadata: Metadata = {
  metadataBase: new URL('https://articles.careerboat.ai'),
  title: 'Careerboat Blog',
  description: 'Careerboat blog powered by WordPress GraphQL',
icons: {
  icon: "/purple.svg",
  apple: "/apple-touch-icon.png",
}
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const timeStamp = 'V-0.2.04';
  const version = '(31-March-2026 23:00:00)';
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-gray-50 shadow-md bg-white backdrop-blur">
          <div className="mx-auto flex w-full items-center justify-between gap-3  py-1 md:py-3">
            <div className="flex items-center gap-2 px-3 md:px-12">
              <Link href="/" className="text-indigo-600 font-bold text-lg md:text-xl flex items-center gap-2">
                <img src="/yellow.svg" alt="Careerboat logo" className="h-12 pb-1.5" />
               <span className='hidden md:block'> Careerboat.ai</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 md:gap-5 px-3 md:px-8" >
              <a
                href="https://careerboat.ai"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#4f47e5] px-5  py-1.5 md:py-2.5 text-sm font-semibold text-white hover:bg-[#3e36c9]"
              >
                Explore
              </a>
              <a
                href="https://careerboat.ai/login"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#4f47e5] px-5 py-1.5 md:py-2.5 text-sm font-semibold text-white hover:bg-[#3e36c9]"
              >
                Get Started
              </a>
            </div>
          </div>
        </header>
        {children}

        <footer className="bg-[#050033] text-white px-6 md:px-16 pt-10 pb-0">
          <div className="flex flex-col md:flex-row justify-between gap-10 md:pe-10">

            {/* Left Section */}
            <div className="max-w-sm ">
              <p className="text-sm text-gray-300 leading-relaxed">
                Transforming how you build, track, and grow your career. Powered by AI.
              </p>
              <p className="mt-2 text-sm text-gray-300">careerboat.ai@gmail.com</p>

              <p className="mt-2 text-xs text-gray-300">All rights reserved © 2026 Careerboat.ai Pvt. Ltd.</p>


              {/* Social Icons */}
              <div className="flex gap-4 mt-4 text-lg">
                <span className="cursor-pointer hover:text-blue-500">
                  <Link href="https://www.linkedin.com/company/careerboat-ai/" target='blank' className=""> <FaLinkedinIn className="text-[#0A66C2] w-5 h-5 mx-auto" /></Link>
                </span>
                <span className="cursor-pointer hover:text-pink-400">
                  <Link href="https://www.instagram.com/careerboat.ai?igsh=MWsyZHl5a2djMTIwbQ==" target='blank' className=""> <FaInstagram className="text-[#E1306C] w-5 h-5 mx-auto" /></Link>
                </span>
                <span className="cursor-pointer hover:text-blue-400">
                  <Link href="https://x.com/careerboatai?s=21" target='blank' className=""> <FaXTwitter className=" w-5 h-5 mx-auto" /></Link>
                </span>

                <span className="cursor-pointer hover:text-blue-500">
                  <Link href="https://youtube.com/@careerboat-ai?si=oeKfNrfI3KoUYj61" target='blank' className="">  <FaYoutube className="text-red-500 w-5 h-5 mx-auto" /></Link>
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex gap-10 md:gap-20 flex-wrap">
              {/* Products */}
              <div className=''>
                <h3 className="font-semibold mb-3">Products</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="hover:text-white cursor-pointer text-sm">
                    <Link href="https://careerboat-dev.netlify.app/" className="text-sm" target='blank'>AI Career Counselor </Link>
                  </li>
                  <li className="hover:text-white cursor-pointer text-sm">
                    <Link href="https://careerboat-dev.netlify.app/" className="text-sm" target='blank'>Chrome Extension </Link>
                  </li>
                </ul>
              </div>
              <div className=''>
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="hover:text-white cursor-pointer text-sm">
                    <Link href="https://careerboat-dev.netlify.app/" className="text-sm" target='blank'>AI Resume Builder </Link>
                  </li>
                  <li className="hover:text-white cursor-pointer text-sm">
                    <Link href="https://careerboat-dev.netlify.app/" className="text-sm" target='blank'>AI Interview Prep </Link>
                  </li>
                  <li className="hover:text-white cursor-pointer text-sm">
                    <Link href="https://careerboat-dev.netlify.app/" className="text-sm" target='blank'>Job Tracker </Link>
                  </li>
                </ul>
              </div>
              {/* More About */}
              <div className=''>
                <h3 className="font-semibold mb-3">More About</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="hover:text-white cursor-pointer text-sm">
                    <Link
                      className="text-blueGray-600 hover:text-blueGray-800 font-normal block text-sm"
                      // href={`${articles}`} 
                      href={"/"}
                      target='blank'
                    >
                      Articles
                    </Link>
                  </li>
                  {/* <li className="hover:text-white cursor-pointer text-sm" >
                  <a href="/#contact" onClick={(e) => handleNav(e, 'contact')} className='text-sm'>Contact Us</a>

                </li> */}
                  <li className="hover:text-white cursor-pointer text-sm">
                    <Link href="https://careerboat-dev.netlify.app/about-us" className="text-sm" target='blank'>About Us</Link>

                  </li>
                  <li className="hover:text-white cursor-pointer text-sm">
                    <Link href="https://careerboat-dev.netlify.app/privacy-policy" className="text-sm" target='blank'>Privacy Policy</Link>
                  </li>
                  <li className="hover:text-white cursor-pointer text-sm">
                    <Link href="https://careerboat-dev.netlify.app/legal-service" className="text-sm" target='blank'>Terms of Service</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mt-10 mb-1 md:mb-3"></div>

          <div className="overflow-hidden h-[90%] relative">
            <div className="sticky translate-y-2 md:translate-y-3">
              <p className="text-5xl md:text-8xl font-bold bg-gradient-to-r from-[#2210e1] to-[#a37e44] bg-clip-text text-center text-transparent">
                Careerboat.
                <span className="font-ivy italic text-5xl md:text-8xl font-bold">
                  ai
                </span>
              </p>

            </div>
            <span className="hidden md:block absolute text-gray-500 text-[8px] bottom-0 right-0 md:text-[10px] float-end ">{version} {timeStamp}</span>

          </div>

        </footer>
      </body>
    </html>
  );
}
