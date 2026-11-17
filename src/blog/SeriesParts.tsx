import React from 'react'
import { Link } from 'react-router-dom'
import { SeriesPosition } from './series'
import { Series } from './types'

/** "Part 2 of 4" box shown above a post that belongs to a public series. */
export function SeriesBox({ series, pos }: { series: Series; pos: SeriesPosition }) {
  const { parts, part } = pos
  const list = (
    <ol className="bl-series-parts">
      {parts.map((p, i) => (
        <li key={p.id} className={i + 1 === part ? 'bl-series-current' : ''}>
          {i + 1 === part ? (
            <span aria-current="page">{p.title}</span>
          ) : (
            <Link to={`/blog/${p.slug}`}>{p.title}</Link>
          )}
        </li>
      ))}
    </ol>
  )
  return (
    <aside className="bl-series-box" aria-label={`Series: ${series.title}`}>
      <div className="bl-series-eyebrow">
        Series · Part {part} of {parts.length}
        {series.status === 'active' && <span className="bl-series-active">ongoing</span>}
      </div>
      <Link to={`/blog/series/${series.slug}`} className="bl-series-name">
        {series.title}
      </Link>
      {parts.length <= 5 ? (
        list
      ) : (
        <details>
          <summary>All {parts.length} parts</summary>
          {list}
        </details>
      )}
    </aside>
  )
}

/** Previous / next links at the end of a post in a series. */
export function SeriesNav({ series, pos }: { series: Series; pos: SeriesPosition }) {
  if (!pos.prev && !pos.next) return null
  return (
    <nav className="bl-series-nav" aria-label={`More in ${series.title}`}>
      {pos.prev ? (
        <Link to={`/blog/${pos.prev.slug}`} className="bl-series-nav-prev">
          <span>← Part {pos.part - 1}</span>
          {pos.prev.title}
        </Link>
      ) : (
        <span />
      )}
      {pos.next ? (
        <Link to={`/blog/${pos.next.slug}`} className="bl-series-nav-next">
          <span>Part {pos.part + 1} →</span>
          {pos.next.title}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
