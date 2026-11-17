import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import { firebaseConfigured } from './firebase'
import { formatDate, getListedSeriesBySlug, listPublished } from './posts'
import { seriesParts } from './series'
import { Post, Series } from './types'
import { Loading, Message } from './States'

/** /blog/series/:slug — one project's posts, in reading order. */
export default function SeriesPage() {
  const { slug = '' } = useParams()
  const [data, setData] = useState<{ series: Series; parts: Post[] } | null | undefined>(undefined)

  useEffect(() => {
    if (!firebaseConfigured) return setData(null)
    setData(undefined)
    Promise.all([getListedSeriesBySlug(slug), listPublished()])
      .then(([series, posts]) => setData(series ? { series, parts: seriesParts(posts, series.id) } : null))
      .catch(e => {
        console.error(e)
        setData(null)
      })
  }, [slug])

  useEffect(() => {
    if (!data) return
    document.title = `${data.series.title} · Stockton Jenkins`
    return () => {
      document.title = 'Stockton Jenkins'
    }
  }, [data])

  if (data === undefined)
    return (
      <BlogLayout>
        <Loading />
      </BlogLayout>
    )
  if (data === null || data.parts.length === 0)
    return (
      <BlogLayout>
        <Message title="Series not found">
          <Link to="/blog">← Back to all posts</Link>
        </Message>
      </BlogLayout>
    )

  const { series, parts } = data
  const first = parts[0]
  const last = parts[parts.length - 1]
  return (
    <BlogLayout>
      <header className="bl-index-header bl-series-header">
        <div className="bl-eyebrow">
          <Link to="/blog">Blog</Link> / Series
        </div>
        <h1>{series.title}</h1>
        {series.description && <p>{series.description}</p>}
        <div className="bl-card-meta">
          <span className={`bl-series-status bl-series-status-${series.status}`}>
            {series.status === 'active' ? 'Ongoing' : 'Complete'}
          </span>
          <span>
            {parts.length} {parts.length === 1 ? 'post' : 'posts'}
          </span>
          <span>·</span>
          <span>
            {formatDate(first.publishedAt)}
            {parts.length > 1 && <> – {formatDate(last.publishedAt)}</>}
          </span>
        </div>
      </header>
      <ol className="bl-index bl-series-list">
        {parts.map((p, i) => (
          <li key={p.id}>
            <Link to={`/blog/${p.slug}`} className="bl-list-item">
              <span className="bl-series-part">Part {i + 1}</span>
              <div>
                <h3>{p.title}</h3>
                {(p.summary || p.subtitle) && <p>{p.summary || p.subtitle}</p>}
                <div className="bl-list-tags">
                  <span>{formatDate(p.publishedAt)}</span>
                  <span>{p.readingMinutes} min</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </BlogLayout>
  )
}
