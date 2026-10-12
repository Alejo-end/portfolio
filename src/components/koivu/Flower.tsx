// A flat eight-petal flower, drawn for this site. Petals take the text color;
// pass `centerClassName` to color the middle.
export function Flower({ className = '', centerClassName = 'fill-background' }: { className?: string; centerClassName?: string }) {
    return (
        <svg viewBox="-50 -50 100 100" aria-hidden className={className}>
            {Array.from({ length: 8 }, (_, i) => (
                <ellipse key={i} cx="0" cy="-26" rx="13" ry="22" fill="currentColor" transform={`rotate(${i * 45})`} />
            ))}
            <circle r="15" className={centerClassName} />
        </svg>
    )
}
