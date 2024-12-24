"use client"
import React from "react";
import { Globe, Home, PersonStandingIcon, PlaneTakeoff } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";

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
