import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./Providers";
import { SiteFooter } from "@/components/SiteFooter";
import { Cursor } from "@/components/koivu/Cursor";
import { SnakeButton } from "@/components/koivu/SnakeButton";
import { EnterFallback } from "@/components/EnterFallback";
import { siteUrl } from "@/lib/site";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// norns-style bitmap face, kept to small screen moments (404, counters, the
// games), so it is fetched when one of those shows and not ahead of every page.
const silkscreen = localFont({
  src: "./fonts/Silkscreen/Silkscreen-Regular.woff2",
  variable: "--font-pixel",
  weight: "400",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alejandro?",
    template: "%s · Alejandro?",
  },
  description:
    "Software engineer and UX designer from Panama, based in Helsinki. Electronics, experimental music, and instruments.",
};

// A phone's browser bars take the page's background, light or dark. The
// same two colors as PAPER in ThemeColor.tsx, which follows the footer switch.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // In-page jumps glide (globals.css); the attribute tells Next to keep a
    // change of page instant all the same.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${geistSans.variable} ${silkscreen.variable} antialiased`}
      >
        <Providers>
          <a href="#content" className="skip">
            Skip to content
          </a>
          <div className="flex min-h-screen flex-col">
            <div id="content" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </div>
            <SiteFooter />
          </div>
          <SnakeButton />
          <Cursor />
          <EnterFallback />
        </Providers>
        {/* Real-user Core Web Vitals, free on the Hobby plan. */}
        <SpeedInsights />
        {/* Page views without cookies, also free on Hobby. */}
        <Analytics />
      </body>
    </html>
  );
}
