import type { Metadata } from 'next'
import { NoTicket } from '@/components/metro/NoTicket'

export const metadata: Metadata = {
    title: 'No ticket',
    description: 'Sörnäinen to Rautatientori without a ticket. A pixel metro game.',
}

export default function Metro() {
    return (
        <main className="mx-auto max-w-4xl px-4 pb-28 pt-4">
            <h1 className="sr-only">No ticket</h1>
            <NoTicket />
        </main>
    )
}
