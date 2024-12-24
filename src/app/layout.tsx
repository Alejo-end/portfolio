"use client";
import localFont from "next/font/local";
import "./globals.css";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Providers } from "./Providers";
import Image from "next/image";
import { Globe, Home, PersonStandingIcon, PlaneTakeoff } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const hostGrotesk = localFont({
  src: "./fonts/Host_Grotesk/HostGrotesk-VariableFont_wght.ttf",
  variable: "--font-host-grotesk",
  weight: "100 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-space-grotesk",
  weight: "100 900",
});


const poppinsMedium = localFont({
  src: "./fonts/Poppins/Poppins-Medium.ttf",
  variable: "--font-poppins-medium",
  weight: "400",
});

const poppinsRegular = localFont({
  src: "./fonts/Poppins/Poppins-Regular.ttf",
  variable: "--font-poppins-regular",
  weight: "600",
});

const poppinsLight = localFont({
  src: "./fonts/Poppins/Poppins-Light.ttf",
  variable: "--font-poppins-light",
  weight: "100",
}); 

const poppinsBold = localFont({
  src: "./fonts/Poppins/Poppins-Bold.ttf",
  variable: "--font-poppins-bold",
  weight: "800",
});



export function Footer() {
  return (
    <div className={`flex gap-2 ${usePathname() === "/" ? "justify-center" : "justify-end mr-4 md:mr-0 md:ml-5"} md:gap-6 flex-wrap font-[family-name:var(--font-poppins-bold)]`}>
      {usePathname() === "/" ? null : <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-xl sm:text-2xl md:text-3xl"
        href="/"
      >
        <Home className="w-6 h-6 sm:w-8 sm:h-8" />
        home
      </Link>}
      
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-xl sm:text-2xl md:text-3xl"
        href="/projects"
      >
        <PlaneTakeoff className="w-6 h-6 sm:w-8 sm:h-8" />
        projects
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-xl sm:text-2xl md:text-3xl"
        href="/experience"
      >
        <Globe className="w-6 h-6 sm:w-8 sm:h-8" />
        work xp
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-xl sm:text-2xl md:text-3xl"
        href="https://bento.me/alejoend"
        target="_blank"
        rel="noopener noreferrer"
      >
        <PersonStandingIcon className="w-6 h-6 sm:w-8 sm:h-8" />
        persona
      </Link>
    </div>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${hostGrotesk.variable} ${spaceGrotesk.variable} ${geistMono.variable} ${geistSans.variable} ${poppinsBold.variable} ${poppinsRegular.variable} ${poppinsMedium} ${poppinsLight.variable} antialiased`}
      >
        <Providers>
        <div className="flex flex-row md:gap-2 py-5 pl-5">
        <DarkModeToggle /> {/* Dark Mode Toggle */}
          {usePathname() === "/" ? null : <Footer />}
        </div>
        {children}
        </Providers>
      </body>
    </html>
  );
}
