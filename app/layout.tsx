import "./globals.css";
import type { Metadata } from "next";
import { roboto, inter } from "../lib/fonts";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://careerboat.ai"),
  title: {
    default: "Careerboat.ai Articles",
    template: "%s | Careerboat.ai Articles",
  },
  description: "Actionable career insights, articles, and resources.",
  applicationName: "Careerboat.ai Articles",
  icons: {
    icon: "/Careerboat.png",
    shortcut: "/Careerboat.png",
    apple: "/Careerboat.png",
  },
  openGraph: {
    type: "website",
    siteName: "Careerboat.ai Articles",
    title: "Careerboat.ai Articles",
    description: "Actionable career insights, articles, and resources.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Careerboat Articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careerboat.ai Articles",
    description: "Actionable career insights, articles, and resources.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <div className={inter.className}>
          <Navbar />
        </div>

        <main>{children}</main>

        <div className={inter.className}>
          <Footer />
        </div>
      </body>
    </html>
  );
}
