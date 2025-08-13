"use client"
import React from "react";
import { Globe, Home, PersonStandingIcon, PlaneTakeoff } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DarkModeToggle } from "./DarkModeToggle";

export function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  
  if (isHomePage) {
    // Original full-width layout for home page - always show text
    return (
      <div className="flex gap-2 justify-center md:gap-6 flex-wrap font-[family-name:var(--font-poppins-bold)]">
        <Link
          className="flex items-center gap-1 md:gap-2 hover:underline hover:underline-offset-4 text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-200 group"
          href="/projects"
        >
          <PlaneTakeoff className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:text-blue-500" />
          <span>projects</span>
        </Link>
        <Link
          className="flex items-center gap-1 md:gap-2 hover:underline hover:underline-offset-4 text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-200 group"
          href="/experience"
        >
          <Globe className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[360deg] group-hover:text-green-500" />
          <span>work xp</span>
        </Link>
        <Link
          className="flex items-center gap-1 md:gap-2 hover:underline hover:underline-offset-4 text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-200 group"
          href="https://bento.me/alejoend"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PersonStandingIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-purple-500" />
          <span>persona</span>
        </Link>
        <DarkModeToggle />
      </div>
    );
  }
  
  // Fixed positioning for other pages - right side on mobile, left side on desktop
  return (
    <div className="fixed top-4 right-4 sm:left-4 sm:right-auto z-50 flex gap-2 justify-start md:gap-4 lg:gap-6 flex-wrap font-[family-name:var(--font-poppins-bold)] bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border/50">
      <Link
        className="flex items-center gap-1 md:gap-2 hover:underline hover:underline-offset-4 text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-200 group"
        href="/"
      >
        <Home className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:text-orange-500" />
        <span className="hidden sm:inline">home</span>
      </Link>
      
      <Link
        className="flex items-center gap-1 md:gap-2 hover:underline hover:underline-offset-4 text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-200 group"
        href="/projects"
      >
        <PlaneTakeoff className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:text-blue-500" />
        <span className="hidden sm:inline">projects</span>
      </Link>
      <Link
        className="flex items-center gap-1 md:gap-2 hover:underline hover:underline-offset-4 text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-200 group"
        href="/experience"
      >
        <Globe className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[360deg] group-hover:text-green-500" />
        <span className="hidden sm:inline">work xp</span>
      </Link>
      <Link
        className="flex items-center gap-1 md:gap-2 hover:underline hover:underline-offset-4 text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-200 group"
        href="https://bento.me/alejoend"
        target="_blank"
        rel="noopener noreferrer"
      >
        <PersonStandingIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-purple-500" />
        <span className="hidden sm:inline">persona</span>
      </Link>
      <DarkModeToggle />
    </div>
  );
}
