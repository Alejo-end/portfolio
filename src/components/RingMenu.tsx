"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Briefcase, User, Code, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "XP", icon: Code, path: "/experience" },
    { name: "Projects", icon: Briefcase, path: "/projects" },
    { name: "Persona", icon: User, path: "https://bento.me/alejoend" },
];

export default function RingMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="fixed top-16 left-5 z-50 flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={toggleMenu}
                className="bg-gray-100 shadow-lg rounded-lg dark:bg-gray-800"
            >
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-gray-100 shadow-lg rounded-lg w-52 text-lg font-[family-name:var(--font-porter-sans)] dark:bg-gray-800">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isSelected = pathname === item.path;

                        return (
                            <Link
                                href={item.path}
                                key={index}
                                className={`flex items-center space-x-2 px-3 py-2 mb-2 rounded-lg transition-colors ${isSelected
                                        ? "border-4 border-black font-bold bg-gray-300 px-2 dark:border-white dark:bg-gray-700"
                                        : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-porter-sans">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}