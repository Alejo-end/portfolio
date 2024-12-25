import Link from 'next/link'
import { ExternalLinkIcon } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function NavLink() {
    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/projects" aria-label="Visit my art portfolio">
                            <ExternalLinkIcon className="h-5 w-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Visit my art portfolio</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

