import type { Metadata, Viewport } from "next";
import { Great_Vibes, Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import { Providers } from "@/components/providers";
import { AppToaster } from "@/components/theme/app-toaster";
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
  title: {
    default: "SupraBase",
    template: "%s · SupraBase",
  },
  description:
    "Enterprise AI-powered learning platform for Full Stack and AI developers.",
  manifest: "/manifest.json",
  appleWebApp: {
    title: "SupraBase",
    capable: true,
    statusBarStyle: "black-translucent",
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
