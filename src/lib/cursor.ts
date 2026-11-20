'use client'

// Whether the site draws its own square cursor or leaves the system's alone.
// The choice is kept in this browser only.

const KEY = 'koivu-cursor'
const listeners = new Set<() => void>()

export const cursorOn = () => {
    try {
        return localStorage.getItem(KEY) !== 'off'
    } catch {
        return true
    }
}

export const serverCursorOn = () => true

export function setCursorOn(on: boolean) {
    try {
        if (on) localStorage.removeItem(KEY)
        else localStorage.setItem(KEY, 'off')
    } catch {}
    listeners.forEach((l) => l())
}

export const subscribeCursor = (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
}
