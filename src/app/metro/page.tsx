import type { Metadata } from 'next'
import type { Spec } from '@/app/types'
import { SpecList } from '@/components/SpecList'
import { NoTicket } from '@/components/metro/NoTicket'
import { SiteSpines } from '@/components/koivu/Spines'
import { PRICE, euro } from '@/components/metro/game'

export const metadata: Metadata = {
    title: 'No ticket',
    description: 'Sörnäinen to Rautatientori without a ticket, by metro, tram, bus or bike. A pixel transit game.',
}

const notes: Spec[] = [
    { label: 'vests', value: 'navy jacket, light band, reader in hand' },
    { label: 'plain clothes', value: 'in pairs, no phone, lanyard at the collar' },
    { label: 'bus driver', value: 'checks the front door, cannot fine' },
    { label: 'penalty fare', value: '100 €' },
    { label: 'real ticket', value: `${euro(PRICE)} in the app, after a login` },
    { label: 'busking', value: 'keys 1 2 3 on the line, coins pay for a ticket' },
    { label: 'jammed machine', value: 'hit it on green, three times' },
    { label: 'bike', value: 'hop, bell, brake. Two red lights and the police want a word' },
    { label: 'kurvi', value: 'kebab on the tab, free shots at the bar. Both cost minutes, both open options' },
    { label: 'kiosk', value: 'paper tickets by card, scratch cards. Three of a kind wins' },
    { label: 'laundromat', value: 'coins left in the drums, three looks. Mind the cat' },
    { label: 'sauna', value: 'löyly on hot stones only. Hold the heat, outlast the regulars. One of them drives a bus' },
    { label: 'the street', value: 'tap a place or a stop. Pocket the phone, pan with the arrows' },
    { label: 'scooter', value: 'swerve, throttle, watch the battery. The park is a slow zone' },
    { label: 'runs', value: 'night, easy from 21:00, rush hour, the long way to Kamppi, the way home at three, daily' },
    { label: 'keys', value: 'space, 1 to 9, arrows' },
]

export default function Metro() {
    return (
        <main className="pb-28">
            <h1 className="sr-only">No ticket</h1>
            <NoTicket
                top={
                    <div className="page pt-6 sm:pt-8">
                        <SiteSpines />
                    </div>
                }
            />
            <section aria-labelledby="notes" className="mx-auto mt-10 max-w-4xl space-y-3 px-4">
                <h2 id="notes" className="label">
                    field notes
                </h2>
                <SpecList specs={notes} />
                <p className="pt-6 text-xs text-muted-foreground">
                    Fiction. Fare dodging in Helsinki ends in a 100 € penalty fare, or worse with a fake ticket. The author pays: continuous
                    season ticket, billed monthly.
                </p>
            </section>
        </main>
    )
}
