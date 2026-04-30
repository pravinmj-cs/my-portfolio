import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pravinmj.hanmandev.com"),
  title: "Praveen M J | From Code to Creativity to Systems",
  description:
    "A cinematic portfolio for Praveen M J, backend engineer, technical lead, founder, and product architect building AI-native systems.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Praveen M J | Founder Portfolio",
    description:
      "Backend engineering, technical leadership, creative systems, and AI-native sustainability product architecture.",
    url: "https://pravinmj.hanmandev.com",
    siteName: "Praveen M J",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Praveen M J | From Code to Creativity to Systems",
    description:
      "A cinematic scroll journey through engineering depth, creative storytelling, and founder-grade product systems."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
