'use client'

import { useEffect } from 'react'

/**
 * Rows and tiles with the class "enter" rise into place as they scroll into
 * view. That is a CSS scroll timeline (globals.css) and needs no script,
 * except in browsers without scroll timelines, where this does the same with
 * an observer: it marks what is still below the screen and unmarks each one
 * as it arrives. Only what is below the screen is ever hidden, so a row is
 * never held back from the first paint.
 */
export function EnterFallback() {
    useEffect(() => {
        if (CSS.supports('animation-timeline: view()')) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const arrive = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue
                    entry.target.removeAttribute('data-below')
                    arrive.unobserve(entry.target)
                }
            },
            // The root reaches far above the screen, so a row that a jump (an
            // anchor, the End key) carried straight past still counts as arrived.
            { rootMargin: '100000px 0px -8% 0px' }
        )
        const adopt = (el: Element) => {
            if (el.hasAttribute('data-below') || el.getBoundingClientRect().top < window.innerHeight) return
            el.setAttribute('data-below', '')
            arrive.observe(el)
        }
        const scan = (root: ParentNode) => root.querySelectorAll('.enter').forEach(adopt)
        scan(document)

        // Rows that turn up later: another page, another filter.
        const added = new MutationObserver((records) => {
            for (const record of records) {
                for (const node of record.addedNodes) {
                    if (!(node instanceof Element)) continue
                    if (node.matches('.enter')) adopt(node)
                    scan(node)
                }
            }
        })
        added.observe(document.body, { childList: true, subtree: true })

        return () => {
            arrive.disconnect()
            added.disconnect()
            document.querySelectorAll('.enter[data-below]').forEach((el) => el.removeAttribute('data-below'))
        }
    }, [])

    return null
}
