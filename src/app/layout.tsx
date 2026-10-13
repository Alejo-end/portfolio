import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./Providers";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Cursor } from "@/components/koivu/Cursor";
import { XpHud } from "@/components/koivu/XpHud";

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

// norns-style bitmap face, kept to small screen moments (404, counters).
const silkscreen = localFont({
  src: "./fonts/Silkscreen/Silkscreen-Regular.woff2",
  variable: "--font-pixel",
  weight: "400",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alejandro?",
    template: "%s — Alejandro?",
  },
  description:
    "Software engineer and UX designer from Panama, based in Helsinki. Electronics, experimental music, and instruments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${geistSans.variable} ${silkscreen.variable} antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteNav />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
          <XpHud />
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
