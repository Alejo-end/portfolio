'use client'

import Image, { type ImageProps } from 'next/image'

/**
 * next/image that comes up like a print in the developer: a picture that is
 * still on its way when the reader scrolls to it fades in once it arrives,
 * over the gray of its frame, instead of popping in.
 *
 * Pictures on the first screen are left alone, as are ones already loaded:
 * a fade there would only hold back the first paint (and the LCP with it).
 *
 * The marks are set on the element itself and not through React, so the fade
 * starts in the same frame as the load and a re-render cannot undo it.
 */
const waiting = (img: HTMLImageElement) => img.loading === 'lazy' && !img.complete && img.getBoundingClientRect().top > window.innerHeight

export function Picture({ alt, onLoad, onError, ...props }: ImageProps) {
    return (
        <Image
            {...props}
            alt={alt}
            ref={(img) => {
                if (img && waiting(img)) img.dataset.developing = ''
            }}
            onLoad={(e) => {
                const img = e.currentTarget
                if ('developing' in img.dataset) {
                    delete img.dataset.developing
                    img.dataset.developed = ''
                }
                onLoad?.(e)
            }}
            onError={(e) => {
                delete e.currentTarget.dataset.developing
                onError?.(e)
            }}
        />
    )
}
