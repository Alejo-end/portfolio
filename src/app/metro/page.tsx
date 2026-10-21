import type { Metadata } from 'next'
import type { Spec } from '@/app/types'
import { SpecList } from '@/components/SpecList'
import { NoTicket } from '@/components/metro/NoTicket'

export const metadata: Metadata = {
    title: 'No ticket',
    description: 'Sörnäinen to Rautatientori without a ticket, by metro, tram or bus. A pixel transit game.',
}

const notes: Spec[] = [
    { label: 'vests', value: 'navy jacket, light band, reader in hand' },
    { label: 'plain clothes', value: 'in pairs, no phone, lanyard at the collar' },
    { label: 'bus driver', value: 'checks the front door, cannot fine' },
    { label: 'penalty fare', value: '100 €' },
    { label: 'keys', value: 'space, 1 to 4' },
]

export default function Metro() {
    return (
        <main className="mx-auto max-w-4xl px-4 pb-28 pt-4">
            <h1 className="sr-only">No ticket</h1>
            <NoTicket />
            <section aria-labelledby="notes" className="mt-10 space-y-3">
                <h2 id="notes" className="label">
                    field notes
                </h2>
                <SpecList specs={notes} />
            </section>
        </main>
    )
}
