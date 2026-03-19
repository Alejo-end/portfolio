'use client'

import { useState } from 'react'

export function FabLabAd() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <a
      href="https://digital-fabrication-1baba0.gitlab.io/assignments/index.html"
      target="_blank"
      rel="noopener noreferrer"
      className="fab-shape"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '130px',
        height: '130px',
        background: 'linear-gradient(145deg, #1a0a00 0%, #2d1200 40%, #1f0d00 100%)',
        textDecoration: 'none',
        color: 'white',
        cursor: 'pointer',
        overflow: 'hidden',
        padding: '0.9rem',
        textAlign: 'center',
      }}
    >
      {/* Pulse ring */}
      <div className="fab-pulse-ring" />

      {/* Grid texture */}
      <div className="fab-grid" />

      {/* Scanline effect */}
      <div className="fab-scanline" />

      {/* Dismiss button */}
      <button
        className="fab-dismiss"
        onClick={(e) => {
          e.stopPropagation()
          setDismissed(true)
        }}
        title="Dismiss"
      >
        ✕
      </button>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        {/* Crosshair icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff9100"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ marginBottom: '6px', filter: 'drop-shadow(0 0 4px rgba(255,145,0,0.7))' }}
        >
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="3" x2="12" y2="7" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <line x1="3" y1="12" x2="7" y2="12" />
          <line x1="17" y1="12" x2="21" y2="12" />
          <circle cx="12" cy="12" r="2" fill="#ff9100" />
        </svg>

        <div className="fab-new-badge">new</div>

        <div
          className="fab-label"
          style={{ fontSize: '10px', fontWeight: 700, color: '#ff9100', textShadow: '0 0 8px rgba(255,145,0,0.6)' }}
        >
          Aalto
        </div>
        <div
          className="fab-label"
          style={{ fontSize: '8px', color: 'rgba(255,200,120,0.8)', marginTop: '2px' }}
        >
          Fab Lab ↗
        </div>
      </div>
    </a>
  )
}
