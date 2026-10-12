// The soft lake-shore curve of an Aalto vase, used as a section edge.
// The shape fills with the text color, so set it with a text-* class.
export function Wave({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 1200 48" preserveAspectRatio="none" aria-hidden className={className}>
            <path
                d="M0 30 C 120 6, 210 44, 330 26 S 520 2, 640 22 S 820 46, 950 24 S 1120 8, 1200 20 V48 H0 Z"
                fill="currentColor"
            />
        </svg>
    )
}
