import React from 'react'
import './Logo.css'

/**
 * EcoScan Professional Logo
 * Features:
 * - Perfectly symmetric 3D-style triangular recycling arrows rotating clockwise
 * - Central static Earth globe with blue ocean and emerald continents
 * - Glowing neon green horizontal scan line sweeping vertically
 * - Concentric dashed tech HUD ring rotating counter-clockwise
 */
export default function Logo({ size = '64', animated = true, showText = false, className = '' }) {
  const id = 'ecoscan-logo'
  
  return (
    <div className={`logo-wrapper ${animated ? 'logo-animated' : ''} ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
      >
        <defs>
          {/* Main face gradient for arrows */}
          <linearGradient id={`${id}-arrow-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="55%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>

          {/* Highlight gradient for depth */}
          <linearGradient id={`${id}-highlight-grad`} x1="0%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>

          {/* Shadow gradient for depth */}
          <linearGradient id={`${id}-shadow-grad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#065f46" stopOpacity="0" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.5" />
          </linearGradient>

          {/* Gradient for the globe ocean */}
          <radialGradient id={`${id}-ocean-grad`} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </radialGradient>

          {/* Gradient for globe continents */}
          <linearGradient id={`${id}-land-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Spherical gloss gradient */}
          <radialGradient id={`${id}-globe-gloss`} cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
          </radialGradient>

          {/* Scanner beam gradient */}
          <linearGradient id={`${id}-scan-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>

          {/* Glow filter */}
          <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Triangular Arrow Template - positioned relative to rotation center (50, 46) */}
          <g id={`${id}-arrow`}>
            {/* Arm */}
            <path
              d="M 38,14 L 54,14 Q 72,14 78,30 L 74,38 Q 70,24 54,22 L 38,22 Z"
              fill={`url(#${id}-arrow-grad)`}
            />
            {/* Arrowhead */}
            <polygon
              points="76,20 88,34 64,40"
              fill={`url(#${id}-arrow-grad)`}
            />
            {/* Depth shadow */}
            <path
              d="M 38,14 L 54,14 Q 72,14 78,30 L 74,38 Q 70,24 54,22 L 38,22 Z"
              fill={`url(#${id}-shadow-grad)`}
            />
            {/* Surface highlight */}
            <path
              d="M 40,15 L 54,15 Q 68,15 75,28 L 72,30 Q 66,18 54,18 L 40,18 Z"
              fill={`url(#${id}-highlight-grad)`}
            />
          </g>
        </defs>

        {/* ── Outer Rotating Recycling Arrows ── */}
        <g className="logo-arrows" filter={`url(#${id}-glow)`}>
          {/* Arrow 1: Top (0 deg) */}
          <use href={`#${id}-arrow`} transform="rotate(0 50 46)" />
          {/* Arrow 2: Bottom Right (120 deg) */}
          <use href={`#${id}-arrow`} transform="rotate(120 50 46)" />
          {/* Arrow 3: Bottom Left (240 deg) */}
          <use href={`#${id}-arrow`} transform="rotate(240 50 46)" />
        </g>

        {/* ── Central Globe Area (Remains Stable) ── */}
        <g transform="translate(50, 46)">
          <g className="logo-globe-scaler">
            {/* Globe Ocean base */}
            <circle cx="0" cy="0" r="15" fill={`url(#${id}-ocean-grad)`} />

            {/* Continents (Stylized vector map) */}
            <g className="logo-continents">
              {/* North America */}
              <path 
                d="M -8.5,-5.5 C -10.5,-9.5 -5.5,-10.5 -1.5,-9.5 C 0.5,-8.5 0.5,-5.5 -1.5,-3.5 C -3.5,-1.5 -6.5,-1.5 -8.5,-5.5 Z" 
                fill={`url(#${id}-land-grad)`} 
              />
              {/* South America */}
              <path 
                d="M -5.5,-2.5 C -2.5,-1.5 -3.5,2.5 -4.5,5.5 C -5.5,8.5 -7.5,10.5 -9.5,9.5 C -10.5,7.5 -8.5,2.5 -5.5,-2.5 Z" 
                fill={`url(#${id}-land-grad)`} 
              />
              {/* Greenland */}
              <path 
                d="M -2.5,-11 C -1.5,-12 0.5,-12 -0.5,-10 C -1.5,-9 -2.5,-10 -2.5,-11 Z" 
                fill={`url(#${id}-land-grad)`} 
              />
              {/* Eurasia & Africa */}
              <path 
                d="M 1.5,-6.5 C 4.5,-8.5 8.5,-7.5 10.5,-4.5 C 8.5,-1.5 5.5,-2.5 3.5,-0.5 C 1.5,1.5 0.5,4.5 -0.5,6.5 C -1.5,8.5 -3.5,8.5 -2.5,4.5 C -1.5,0.5 -0.5,-3.5 1.5,-6.5 Z" 
                fill={`url(#${id}-land-grad)`} 
              />
              {/* Australia */}
              <path 
                d="M 6.5,3.5 C 8.5,2.5 10.5,4.5 8.5,6.5 C 6.5,7.5 5.5,5.5 6.5,3.5 Z" 
                fill={`url(#${id}-land-grad)`} 
              />
            </g>

            {/* 3D Gloss / Shadow Overlay */}
            <circle cx="0" cy="0" r="15" fill={`url(#${id}-globe-gloss)`} />
          </g>
        </g>

        {/* ── Tech Scanning HUD Overlay (Dashed rotating ring) ── */}
        <circle 
          cx="50" 
          cy="46" 
          r="18" 
          stroke="#34d399" 
          strokeWidth="0.75" 
          strokeDasharray="4 3" 
          className="logo-hud-ring" 
          opacity="0.65"
        />
        
        {/* Subtle crosshair notches on the HUD */}
        <g className="logo-hud-notches" opacity="0.4" stroke="#34d399" strokeWidth="0.5">
          <line x1="50" y1="25" x2="50" y2="26.5" />
          <line x1="50" y1="65.5" x2="50" y2="67" />
          <line x1="29" y1="46" x2="30.5" y2="46" />
          <line x1="69.5" y1="46" x2="71" y2="46" />
        </g>

        {/* ── Scanning Beam (Sweeps vertically across the globe) ── */}
        <g className="logo-scanner" clipPath="url(#globe-clip)">
          <line 
            x1="32" 
            y1="46" 
            x2="68" 
            y2="46" 
            stroke={`url(#${id}-scan-grad)`} 
            strokeWidth="2" 
            className="logo-scan-line"
            filter="drop-shadow(0 0 1.5px #10b981)"
          />
        </g>

        {/* Clip path to restrict scan line to the globe area */}
        <clipPath id="globe-clip">
          <circle cx="50" cy="46" r="15.5" />
        </clipPath>
      </svg>

      {showText && (
        <div className="logo-text">
          <div className="logo-title">EcoScan</div>
          <div className="logo-subtitle">Smart Waste Classification</div>
        </div>
      )}
    </div>
  )
}

export function AnimatedLogo({ className = '', size = 40 }) {
  return <Logo size={String(size)} animated={true} className={className} />
}

export function LogoIcon({ className = '', size = 32 }) {
  return <Logo size={String(size)} animated={false} className={className} />
}
