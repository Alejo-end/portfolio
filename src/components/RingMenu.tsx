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
        <div className="z-50 flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={toggleMenu}
                className="bg-secondary/50 shadow-lg rounded-lg dark:bg-secondary/50"
            >
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            {isOpen && (
                <div className="mt-2 bg-secondary/100 shadow-lg rounded-lg w-42 text-lg font-[family-name:var(--font-space-grotesk)] dark:bg-secondary/100">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isSelected = pathname === item.path;

                        return (
                            <Link
                                href={item.path}
                                key={index}
                                className={`flex items-center space-x-2 px-3 py-2 mb-2 rounded-lg transition-colors ${isSelected
                                        ? "border-4 border-black font-bold bg-secondary px-2 dark:border-white dark:bg-secondary"
                                        : "text-gray-900 hover:bg-gray dark:text-gray-100 dark:hover:bg-secondary/80"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-[family-name:var(--font-space-grotesk)]">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}