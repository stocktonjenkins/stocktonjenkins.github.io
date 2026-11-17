import React from 'react'

/*
 * Small inline illustrations for empty states. Drawn with the blog's color
 * tokens so they match the theme; motion is in blog.css (.bl-art-*) and is
 * switched off for prefers-reduced-motion.
 */

const ink = 'var(--text)'
const faint = 'var(--border-med)'
const paper = 'var(--bg-alt)'
const accent = 'var(--accent)'

const Sparkle = ({ x, y, s = 1, delay = '0s' }: { x: number; y: number; s?: number; delay?: string }) => (
  // Position lives on the <g>: a CSS transform animation would override a transform attribute.
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      className="bl-art-twinkle"
      style={{ animationDelay: delay }}
      d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z"
      fill={accent}
    />
  </g>
)

/** A blank ruled page with a half-written first line and a pencil: "the first post is on its way". */
export function EmptyArt() {
  return (
    <svg className="bl-art" viewBox="0 0 240 180" width="240" height="180" aria-hidden="true">
      <ellipse cx="120" cy="166" rx="66" ry="6" fill="var(--border)" />
      <g transform="rotate(-4 120 92)">
        <path d="M62 28 a6 6 0 0 1 6 -6 H160 L178 40 V156 a6 6 0 0 1 -6 6 H68 a6 6 0 0 1 -6 -6 Z" fill={paper} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
        <path d="M160 22 V36 a4 4 0 0 0 4 4 H178" fill={faint} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
        {[70, 86, 102, 118, 134, 150].map(y => (
          <line key={y} x1="76" x2="164" y1={y} y2={y} stroke={faint} strokeWidth="1.5" strokeLinecap="round" />
        ))}
        <path
          className="bl-art-draw"
          d="M78 56 q6 -9 12 0 t12 0 t12 0 t12 0 t10 0"
          fill="none"
          stroke={ink}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect className="bl-art-blink" x="142" y="46" width="2.5" height="15" rx="1" fill={accent} />
      </g>
      <g className="bl-art-wobble" style={{ transformOrigin: '170px 128px' }}>
        <g transform="translate(170 128) rotate(38)">
          <rect x="-6" y="-52" width="12" height="44" rx="2" fill={accent} stroke={ink} strokeWidth="2" />
          <rect x="-6" y="-58" width="12" height="7" rx="1.5" fill="var(--text-muted)" stroke={ink} strokeWidth="2" />
          <path d="M-6 -8 L6 -8 L0 6 Z" fill="#ecd3ad" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <path d="M-2 1.3 L2 1.3 L0 6 Z" fill={ink} />
        </g>
      </g>
      <Sparkle x={46} y={44} />
      <Sparkle x={196} y={30} s={0.8} delay="0.6s" />
      <Sparkle x={204} y={76} s={0.55} delay="1.2s" />
    </svg>
  )
}

/** A magnifying glass sweeping over a row of pages and finding nothing. */
export function NoResultsArt() {
  return (
    <svg className="bl-art" viewBox="0 0 240 180" width="240" height="180" aria-hidden="true">
      <ellipse cx="120" cy="164" rx="88" ry="6" fill="var(--border)" />
      {[38, 98, 158].map((x, i) => (
        <g key={x} transform={`rotate(${[-5, 2, 6][i]} ${x + 22} 118)`}>
          <rect x={x} y="88" width="44" height="58" rx="5" fill={paper} stroke={faint} strokeWidth="2" />
          <line x1={x + 8} x2={x + 34} y1="102" y2="102" stroke={faint} strokeWidth="2" strokeLinecap="round" />
          <line x1={x + 8} x2={x + 28} y1="112" y2="112" stroke={faint} strokeWidth="2" strokeLinecap="round" />
          <line x1={x + 8} x2={x + 31} y1="122" y2="122" stroke={faint} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <g className="bl-art-sweep">
        <circle cx="120" cy="100" r="27" fill="rgba(255,255,255,0.45)" stroke={ink} strokeWidth="3.5" />
        <path d="M104 92 a17 17 0 0 1 12 -10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <line x1="140" y1="120" x2="160" y2="140" stroke={ink} strokeWidth="8" strokeLinecap="round" />
      </g>
      <text
        className="bl-art-bob"
        x="120"
        y="50"
        textAnchor="middle"
        fontSize="38"
        fill={accent}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ?
      </text>
      <Sparkle x={70} y={38} s={0.6} delay="0.3s" />
      <Sparkle x={172} y={44} s={0.75} delay="0.9s" />
    </svg>
  )
}
