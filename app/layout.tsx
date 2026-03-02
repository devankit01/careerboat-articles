import "./globals.css";
import type { Metadata } from "next";
import { figtree } from "../lib/fonts";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Toaster } from "react-hot-toast";

// export const metadata: Metadata = {
//   metadataBase: new URL("https://careerboat.ai"),
//   title: {
//     default: "Careerboat.ai Articles",
//     template: "%s | Careerboat.ai Articles",
//   },
//   description: "Actionable career insights, articles, and resources.",
//   applicationName: "Careerboat.ai Articles",
//   icons: {
//     icon: "/Careerboat.png",
//     shortcut: "/Careerboat.png",
//     apple: "/Careerboat.png",
//   },
//   openGraph: {
//     type: "website",
//     siteName: "Careerboat.ai Articles",
//     title: "Careerboat.ai Articles",
//     description: "Actionable career insights, articles, and resources.",
//     images: [
//       {
//         url: "/og-default.png",
//         width: 1200,
//         height: 630,
//         alt: "Careerboat Articles",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Careerboat.ai Articles",
//     description: "Actionable career insights, articles, and resources.",
//     images: ["/og-default.png"],
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-snippet": -1,
//       "max-image-preview": "large",
//       "max-video-preview": -1,
//     },
//   },
// };


export const metadata: Metadata = {
  metadataBase: new URL("https://careerboat.ai"),

  title: {
    default: "Careerboat.ai Articles",
    template: "%s | Careerboat.ai Articles",
  },

  description: "Actionable career insights, articles, and resources.",

  keywords: [
    "career advice",
    "AI interview preparation",
    "resume tips",
    "job search 2026",
    "Careerboat.ai",
  ],

  category: "career",

  alternates: {
    canonical: "https://careerboat.ai",
  },

  applicationName: "Careerboat.ai Articles",

  themeColor: "#4F47E5",

  icons: {
    icon: "/Careerboat.png",
    shortcut: "/Careerboat.png",
    apple: "/Careerboat.png",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Careerboat.ai Articles",
    url: "https://careerboat.ai",
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

  authors: [{ name: "Careerboat Team" }],
  creator: "Careerboat.ai",
  publisher: "Careerboat.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en">
      <body className={figtree.className}>
        <Navbar />

        <main>{children}</main>

        <Toaster position="top-right" />

        <Footer />
      </body>
    </html>
  );
}
