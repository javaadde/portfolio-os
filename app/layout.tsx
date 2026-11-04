import type { Metadata, Viewport } from "next";
import font from "next/font/local";
import "./globals.css";
import content from "../data/portfolio.json";
import { OG_IMAGE } from "./lib/content/seo";
import { SITE_URL } from "./lib/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: content.profile.name,
    statusBarStyle: "black-translucent",
  },
  title: {
    default: content.site.title,
    template: `%s — ${content.profile.name}`,
  },
  description: content.site.description,
  applicationName: content.profile.name,
  authors: [{ name: content.profile.name, url: SITE_URL }],
  creator: content.profile.name,
  publisher: content.profile.name,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: content.profile.name,
    locale: "en_US",
    title: content.site.title,
    description: content.site.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: content.site.title,
    description: content.site.description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const sf = font({
  src: "../public/fonts/SF-Pro.woff2",
  weight: "1 1000",
  variable: "--font-sf",
});

const sfMono = font({
  src: "../public/fonts/SF-Mono.woff2",
  weight: "300 900",
  variable: "--font-sf-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sf.variable} ${sfMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
