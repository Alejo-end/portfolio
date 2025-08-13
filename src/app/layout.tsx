"use client";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./Providers";
import { Footer } from "@/components/Footer";
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
        <div className="flex flex-row md:gap-2 pb-5 pt-10 md:pt-16 pl-5">
          {usePathname() === "/" ? null : <Footer />}
        </div>
        {children}
        </Providers>
      </body>
    </html>
  );
}
