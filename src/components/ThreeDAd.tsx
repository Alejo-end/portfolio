'use client'

import { useState } from 'react'

export function ThreeDAd() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <a
      href="https://alejandro-three.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="fab-shape three-shape"
      aria-label="Visit my 3D & photogrammetry portfolio"
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '130px',
        height: '130px',
        background: 'linear-gradient(145deg, #001519 0%, #00222d 40%, #001015 100%)',
        textDecoration: 'none',
        color: 'white',
        cursor: 'pointer',
        overflow: 'hidden',
        padding: '0.9rem',
        textAlign: 'center',
      }}
    >
      {/* Pulse ring */}
      <div className="three-pulse-ring" />

      {/* Grid texture */}
      <div className="fab-grid" />

      {/* Scanline effect */}
      <div className="fab-scanline" />

      {/* Dismiss button */}
      <button
        className="fab-dismiss"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setDismissed(true)
        }}
        title="Dismiss"
      >
        ✕
      </button>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        {/* Spinning wireframe cube icon */}
        <svg
          className="three-cube"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginBottom: '6px', filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.7))' }}
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>

        <div className="fab-new-badge">3D · WebGL</div>

        <div
          className="fab-label"
          style={{ fontSize: '10px', fontWeight: 700, color: '#22d3ee', textShadow: '0 0 8px rgba(34,211,238,0.6)' }}
        >
          Three.js
        </div>
        <div
          className="fab-label"
          style={{ fontSize: '8px', color: 'rgba(150,230,240,0.85)', marginTop: '2px' }}
        >
          Photogrammetry ↗
        </div>
      </div>
    </a>
  )
}
