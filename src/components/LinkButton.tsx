import type { ReactNode } from "react"

// An outbound link opens in a new tab. A download saves in place under its
// own file name; a new tab would only open and close again.
export function LinkButton({ href, icon, label, download }: { href: string; icon: ReactNode; label: string; download?: boolean }) {
  const target = download ? { download: true } : { target: "_blank", rel: "noopener noreferrer" }
  return (
    <a href={href} {...target} className="plain btn">
      {icon}
      {label}
    </a>
  )
}
