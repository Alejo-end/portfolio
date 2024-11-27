"use client";

import { usePathname } from "next/navigation"; // Next.js hook to get the current route
import Link from "next/link"; // Next.js link component
import { Home, Briefcase, User, Code } from "lucide-react"; // Import icons from lucide-react

// Define the menu items
const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "XP", icon: Code, path: "/experience" },
    { name: "Projects", icon: Briefcase, path: "/projects" },
    { name: "Persona", icon: User, path: "https://bento.me/alejoend" },
];

const RingMenu = () => {
    const pathname = usePathname(); // Get the current path in Next.js

    return (
        <div className={`fixed top-5 left-5 bg-gray-100 shadow-lg rounded-lg w-52 text-lg font-[family-name:var(--font-porter-sans)]`}>
            {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = pathname === item.path; // Compare current route with the item's path

                return (
                    <Link
                        href={item.path} // Use Next.js `Link` for navigation
                        key={index}
                        className={`flex items-center space-x-2 px-3 py-2 mb-2 rounded-lg transition-colors ${isSelected
                                ? "border-4 border-black font-bold bg-gray-300 px-2"
                                : "text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-porter-sans">{item.name}</span>
                    </Link>
                );
            })}
        </div>
    );
};

export default RingMenu;
