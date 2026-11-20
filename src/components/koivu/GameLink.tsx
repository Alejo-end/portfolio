'use client'

import type { ComponentProps } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/**
 * A link to the metro game. The game is the heaviest script on the site and
 * a link to it sits on every page, so it is not fetched ahead the way other
 * pages are: only once the pointer, a finger or the keyboard reaches the link.
 */
export function GameLink(props: Omit<ComponentProps<typeof Link>, 'href' | 'prefetch'>) {
    const router = useRouter()
    const warm = () => router.prefetch('/metro')
    return <Link href="/metro" prefetch={false} onPointerEnter={warm} onFocus={warm} {...props} />
}
