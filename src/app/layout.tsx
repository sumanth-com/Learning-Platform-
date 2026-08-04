import type { Metadata, Viewport } from "next";
import { Great_Vibes, Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { Providers } from "@/components/providers";
import { AppToaster } from "@/components/theme/app-toaster";
import { SITE } from "@/lib/site";
import { SEO_KEYWORDS } from "@/lib/seo";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const display = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
  preload: false,
});

const certScript = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cert-script",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      "Suprabase — AI Learning Platform for Full Stack & Software Engineering",
    template: "%s · Suprabase",
  },
  description: SITE.shortDescription,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "education",
  keywords: [...SEO_KEYWORDS],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  appleWebApp: {
    title: "Suprabase",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title:
      "Suprabase — AI Learning Platform for Full Stack & Software Engineering",
    description: SITE.shortDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — Full Stack & AI Engineering Learning Platform`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Suprabase — AI Learning Platform for Full Stack & Software Engineering",
    description: SITE.shortDescription,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${certScript.variable} dark`}
    >
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AnalyticsScripts />
        <Providers>
          {children}
          <AppToaster />
        </Providers>
      </body>
    </html>
  );
}
