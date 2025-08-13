'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function DarkModeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-1 md:gap-2 hover:underline hover:underline-offset-4 text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-200 group font-[family-name:var(--font-poppins-bold)]"
        >
            {theme === 'dark' ? 
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-180 group-hover:text-yellow-500" /> : 
                <Moon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-blue-400" />
            }
            <span className="hidden sm:inline">theme</span>
        </button>
    )
}