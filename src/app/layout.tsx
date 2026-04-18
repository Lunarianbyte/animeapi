import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Lunarianime API",
    template: "%s • Lunarianime API",
  },
  description: "Anime unofficial API, fast, simple, and free to use.",
  keywords: ["anime api", "Anime apis", "anime streaming api"],
  authors: [{ name: "Lunarianbyte" }],
  creator: "Lunarianbyte",
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
  openGraph: {
    title: "Lunarianime API",
    description: "Anime unofficial API service",
    url: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
    siteName: "Lunarianime API",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lunarianime API",
    description: "Anime unofficial API service",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
  }
