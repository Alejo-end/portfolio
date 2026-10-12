const colors = ['bg-poppy', 'bg-sun', 'bg-lake', 'bg-moss', 'bg-berry']

// Five flat bands across the top of every page.
export function Stripes() {
    return (
        <div aria-hidden className="flex h-1.5">
            {colors.map((color) => (
                <span key={color} className={`flex-1 ${color}`} />
            ))}
        </div>
    )
}
