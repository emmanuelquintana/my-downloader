import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LoadingProvider } from "@/context/loading-context";
import { LoadingSpinner } from "@/components/loading-spinner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DynamicBackground } from "@/components/dynamic-background";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/json-ld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Video Downloader | Download & Convert Videos",
    template: "%s | Video Downloader",
  },
  description: "The best free tool to download videos from YouTube, TikTok, X (Twitter) and convert them to MP3 or MP4. Fast, secure, and no installation required.",
  keywords: [
    "video downloader",
    "youtube downloader",
    "tiktok downloader",
    "mp3 converter",
    "audio converter",
    "youtube to mp3",
    "video merger",
    "audio merger",
    "free video downloader",
  ],
  authors: [
    {
      name: "Antigravity",
      url: "https://github.com/antigravity",
    },
  ],
  creator: "Antigravity",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    title: "Video Downloader | Download & Convert Videos",
    description: "Download videos from your favorite platforms and convert audio easily. Fast, secure, and free.",
    siteName: "Video Downloader",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Video Downloader Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Downloader | Download & Convert Videos",
    description: "Download videos from your favorite platforms and convert audio easily.",
    images: ["/og-image.jpg"],
    creator: "@antigravity",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider>
            <LoadingSpinner />
            <div className="relative flex min-h-screen flex-col">
              <DynamicBackground />
              <SiteHeader />
              <div className="flex-1 z-10">{children}</div>
              <SiteFooter />
              <Toaster />
            </div>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
