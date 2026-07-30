import type { Metadata, Viewport } from "next";
import { Great_Vibes, Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import { Providers } from "@/components/providers";
import { AppToaster } from "@/components/theme/app-toaster";
import { SITE } from "@/lib/site";
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
});

const certScript = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cert-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Suprabase",
    template: "%s · Suprabase",
  },
  description: SITE.shortDescription,
  applicationName: SITE.name,
  keywords: [
    "learn full stack development",
    "AI developer course",
    "coding practice platform",
    "AI mentor for developers",
    "developer certification",
    "Next.js course",
    "TypeScript certification",
    "system design learning path",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    title: "Suprabase",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: SITE.name,
    description: SITE.shortDescription,
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.shortDescription,
    images: ["/icons/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#18181b",
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
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          {children}
          <AppToaster />
        </Providers>
      </body>
    </html>
  );
}
