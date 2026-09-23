import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { Figtree } from "next/font/google";
import localFont from 'next/font/local';

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
});

const ivy = localFont({
  src: [
    {
      path: './fonts/IvyOraDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/IvyOraDisplay-RegularItalic.ttf',
      weight: '400',
      style: 'italic',
    }
  ],
  variable: '--font-ivy',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://articles.careerboat.ai'),
  title: {
    default: 'Career Blog & Career Advice | Careerboat',
    template: '%s'
  },
  description: 'Actionable writing on resumes, interviews, and role transitions from beginner to senior levels.',
  openGraph: {
    type: 'website',
    siteName: 'Careerboat Blog',
    locale: 'en_US'
  },
  icons: {
    icon: "/blog/yellow.svg",
    apple: "/blog/apple-touch-icon.png",
  }
};

import ToastProvider from '../components/helpers/ToastProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const timeStamp = 'V-0.2.21';
  const version = '(23-09-2026 14:40:00)';


  return (
    <html lang="en">
      <body className={`${figtree.variable} ${ivy.variable} font-sans`}>
        <ToastProvider />
        <header className="sticky top-0 z-10 border-b border-gray-50 shadow-md bg-white backdrop-blur">
          <div className="mx-auto flex w-full items-center justify-between gap-3  py-1 md:py-2">
            <div className="flex items-center gap-2 px-3 md:px-12">
              <Link href="/" className="text-indigo-600 cursor-pointer flex items-center gap-2">
                <img src="/blog/yellow.svg" alt="Careerboat logo" className="h-12 pb-2 block md:hidden" />
                <img src="/blog/mainLogo.svg" alt="Careerboat Logo" className="h-14 hidden md:block" />
              </Link>
            </div>
            <div className="flex items-center gap-2 md:gap-5 px-3 md:px-8 " >
              <a
                href="https://careerboat.ai"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#4f47e5] px-5 md:px-7  py-1.5 md:py-2.5 text-sm font-semibold text-white hover:bg-[#3e36c9]"
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

        <footer className="text-white px-6 md:px-12 pt-10 pb-0"
          style={{
            background: `
      radial-gradient(circle at 0% 0%, #e3e2f1 0%, transparent 30%),
      radial-gradient(circle at 0% 100%, #5a54c4 0%, transparent 40%),
      radial-gradient(circle at 100% 0%, #f2efe8 0%, transparent 30%),
      radial-gradient(circle at 100% 100%, #e0b85c 0%, transparent 40%),
      #e5e7eb
    ` }} >
          <div className=" mx-auto ">
            {/* Main Footer */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_2fr] gap-16 lg:gap-24 ">
              {/* LEFT / BRAND SECTION */}
              <div className="max-w-xl">
                <div className="relative h-[105px] md:h-[125px]">
                  <span className="absolute text-[#4f47e5]  left-0 bottom-10 md:bottom-6 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.05em] leading-none whitespace-nowrap">
                    Fresher got
                  </span>
                  <div className="absolute text-[#4f47e5]  left-[165px] md:left-[210px] lg:left-[235px] top-0">
                    <div className="text-3xl md:text-4xl font-ivy italic md:pl-5 lg:text-5xl font-bold tracking-[-0.01em] leading-none">
                      hired.
                    </div>
                    <div className="relative text-3xl font-ivy italic md:text-4xl lg:text-5xl font-semibold text-gray-400 tracking-[-0.05em] leading-none mt-1 w-fit">
                      ghosted
                      <span className="absolute left-0 right-0 top-[58%] md:h-[4px] bg-gray-600 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-800 leading-relaxed max-w-md md:mt-3">
                  Careerboat.ai is an AI career platform built for Indian students and freshers.
                  From building your resume to getting hired, it's your AI career coach in your pocket. Trusted by
                  <span className="text-[#4f47e5] font-bold"> 100K+ </span>users.
                </p>
                <p className="text-sm text-gray-800 leading-relaxed max-w-md mt-5 font-semibold">
                  Careerboat.ai Private Limited
                </p>
                {/* <p className="text-sm text-gray-800 leading-relaxed max-w-md font-semibold">
                  Lucknow, Uttar Pradesh, India
                </p> */}
                <p className="text-sm text-gray-800 leading-relaxed max-w-md  font-semibold">
                  Support: <span className="font-semibold text-sm">support@careerboat.ai</span>
                </p>
              </div>
              {/*   RIGHT NAVIGATION*/}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                {/* PRODUCT */}
                <div>
                  <h3 className="font-semibold text-md mb-3 text-black">
                    Quick links
                  </h3>
                  <ul className="space-y-3.5 text-gray-600 font-normal">
                    <li>
                      <a
                        href="/#howItWorks"
                        className="hover:text-[#4f47e5] transition-colors text-[14px] cursor-pointer"
                      // onClick={(e) => handleNav(e, 'howItWorks')}
                      >
                        How it Works
                      </a>
                    </li>
                    <li>
                      <Link
                        href="https://careerboat.ai/login"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                      >
                        Start for Free
                      </Link>
                    </li>
                  </ul>
                </div>


                {/* FEATURES */}
                <div>
                  <h3 className="font-semibold mb-3 text-md text-black">
                    Features
                  </h3>

                  <ul className="space-y-3.5 text-[14px] text-gray-600 font-normal">

                    <li>
                      <Link
                        href="https://careerboat.ai/resume-builder"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                        target='_blank'
                      >
                        AI Resume Builder
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="https://careerboat.ai/ai-interview-prep"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                        target='_blank'
                      >
                        AI Interview Prep
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://careerboat.ai/job-explore"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                        target='_blank'
                      >
                        Job Explorer
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://careerboat.ai/job-tracker"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                        target='_blank'
                      >
                        Job Tracker
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="https://careerboat.ai/auto-apply"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                        target='_blank'
                      >
                        AI Auto Apply
                      </Link>
                    </li>
                    {/* <li>
                      <a
                        onClick={(e) => handleNav(e, 'extensionCard')}
                        className="hover:text-[#4f47e5] transition-colors text-[14px] cursor-pointer"
                      >
                        AI Career Counselor
                      </a>
                    </li> */}

                    <li>
                      <Link
                        href="https://careerboat.ai/chrome-extension"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                        target='_blank'
                      >
                        Chrome Extension
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://careerboat.ai/referral-finder"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                        target='_blank'
                      >
                        Referral Finder
                      </Link>
                    </li>

                  </ul>
                </div>


                {/* COMPANY */}
                <div>
                  <h3 className="font-semibold mb-3 text-md text-black">
                    Company
                  </h3>

                  <ul className="space-y-3.5 text-[14px] text-gray-600 font-normal">

                    <li>
                      <Link
                        href="https://careerboat.ai/about-us"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                        target='_blank'
                      >
                        About Us
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="https://careerboat.ai/privacy-policy"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                        target='_blank'
                      >
                        Privacy Policy
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="https://careerboat.ai/legal-service"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                        target='_blank'
                      >
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>


                {/* SOCIAL */}
                <div>
                  <h3 className="font-semibold mb-3 text-md text-black">
                    Social
                  </h3>
                  <ul className="space-y-3.5 text-[14px] text-gray-600 font-normal ">
                    <li>
                      <a href="https://www.linkedin.com/company/careerboat-ai/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                      >
                        LinkedIn
                      </a>
                    </li>

                    <li>
                      <a href="https://www.instagram.com/careerboat.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                      >
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a href="https://x.com/careerboatai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#4f47e5] transition-colors text-[14px]"
                      >
                        X
                      </a>
                    </li>
                    <li>
                      <a href="https://youtube.com/@careerboat-ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#4f47e5] text-[14px] transition-colors"
                      >
                        YouTube
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>


            <div className=" mt-10 pt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              {/* <p className="text-xs text-gray-300">
            All rights reserved © {new Date().getFullYear()} Careerboat.ai Pvt. Ltd.
          </p>
          <p className="text-xs text-gray-300">
            Lucknow, Uttar Pradesh, India
          </p> */}

            </div>
            <div className="overflow-hidden h-[90%] relative">
              <div className="sticky translate-y-3 md:translate-y-5">
                <p className="text-5xl md:text-8xl font-bold bg-gradient-to-r from-[#2210e1] to-[#a37e44] bg-clip-text text-center text-transparent">
                  Careerboat.
                  <span className="font-ivy italic text-5xl md:text-8xl font-bold">
                    ai
                  </span>
                </p>
              </div>

              {/* Version */}
              <span className="hidden md:block absolute text-gray-500 text-[8px] bottom-0 right-0 md:text-[10px]">
                {version} {timeStamp}
              </span>
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}
