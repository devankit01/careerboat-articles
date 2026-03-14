import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://aricles.careerboat.ai'),
  title: 'Careerboat Blog',
  description: 'Careerboat blog powered by WordPress GraphQL'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-[#ded7cd] bg-[#fffcf8]/90 backdrop-blur">
          <div className="mx-auto flex w-[min(1120px,92vw)] items-center justify-between gap-3 py-3">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Careerboat logo" className="h-11 w-auto max-w-[180px] object-contain" />
            </Link>
            <a
              href="https://careerboat.ai"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-[#4f47e5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3e36c9]"
            >
              Explore
            </a>
          </div>
        </header>
        {children}
        <footer className="border-t border-[#ded7cd] bg-[#fffcf8]">
          <div className="mx-auto flex w-[min(1120px,92vw)] flex-col items-center justify-between gap-4 py-5 md:flex-row">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <img src="/logo.jpeg" alt="Careerboat logo" className="h-10 w-auto max-w-[160px] object-contain" />
            </Link>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-clay md:justify-end">
              <Link href="/about-us" className="hover:text-ink">
                About Us
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-ink">
                Terms &amp; Conditions
              </Link>
              <Link href="/privacy-policy" className="hover:text-ink">
                Privacy Policy
              </Link>
              <Link href="/contact-us" className="hover:text-ink">
                Contact Us
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
