import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import { firebaseConfigured } from './firebase'
import { formatDate, listPublished } from './posts'
import { Post } from './types'
import { buildIndex, Hit, isEmptyQuery, search } from './search'
import { EmptyArt, NoResultsArt } from './Illustrations'
import { Loading, Message } from './States'

export default function BlogIndex() {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [error, setError] = useState('')
  const [params, setParams] = useSearchParams()
  const tag = params.get('tag')
  const q = params.get('q') ?? ''
  // Update one param without wiping the other (search and tag filter combine).
  const setParam = (key: 'q' | 'tag', value: string | null) =>
    setParams(
      prev => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: key === 'q' },
    )

  useEffect(() => {
    document.title = 'Blog · Stockton Jenkins'
    if (!firebaseConfigured) return setError('The blog backend is not configured yet.')
    listPublished()
      .then(setPosts)
      .catch(e => {
        console.error(e)
        setError('Could not load posts.')
      })
    return () => {
      document.title = 'Stockton Jenkins'
    }
  }, [])

  const allTags = useMemo(() => Array.from(new Set((posts ?? []).flatMap(p => p.tags))).sort(), [posts])
  const index = useMemo(() => buildIndex(posts ?? []), [posts])
  const byTag = (p: Post) => !tag || p.tags.includes(tag)
  const hits: Hit[] | null = !isEmptyQuery(q) ? search(index, q).filter(h => byTag(h.post)) : null
  const shown = hits ? hits.map(h => h.post) : (posts ?? []).filter(byTag)
  const filtering = Boolean(hits || tag)
  const [featured, ...rest] = filtering ? [undefined, ...shown] : shown

  return (
    <BlogLayout>
      <header className="bl-index-header">
        <h1 className="bl-eyebrow">Blog</h1>
        {(posts?.length ?? 0) > 0 && (
          <div className="bl-search">
            <input
              type="search"
              value={q}
              placeholder="Search posts…"
              aria-label="Search posts"
              onChange={e => setParam('q', e.target.value)}
            />
          </div>
        )}
        {allTags.length > 0 && (
          <div className="bl-tags bl-tag-filter">
            <button className={`bl-tag${!tag ? ' bl-tag-active' : ''}`} onClick={() => setParam('tag', null)}>
              all
            </button>
            {allTags.map(t => (
              <button
                key={t}
                className={`bl-tag${tag === t ? ' bl-tag-active' : ''}`}
                onClick={() => setParam('tag', tag === t ? null : t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </header>

      {error ? (
        <Message title={error} />
      ) : posts === null ? (
        <Loading />
      ) : shown.length === 0 ? (
        filtering ? (
          <Message title="No matching posts" art={<NoResultsArt />}>
            <span>
              Try fewer words, or{' '}
              <button className="bl-linklike" onClick={() => setParams({})}>
                clear the search
              </button>
              .
            </span>
          </Message>
        ) : (
          <Message title="Nothing here yet" art={<EmptyArt />}>The first post is on its way.</Message>
        )
      ) : (
        <div className="bl-index">
          {filtering && (
            <div className="bl-result-count">
              {shown.length} {shown.length === 1 ? 'post' : 'posts'}
              {q.trim() && <> matching “{q.trim()}”</>}
              {tag && <> tagged {tag}</>}
            </div>
          )}
          {featured && (
            <Link to={`/blog/${featured.slug}`} className={`bl-featured${featured.coverUrl ? '' : ' bl-featured-nocover'}`}>
              {featured.coverUrl && <img src={featured.coverUrl} alt="" />}
              <div className="bl-featured-text">
                <div className="bl-card-meta">
                  <span className="bl-latest">Latest</span>
                  <time>{formatDate(featured.publishedAt)}</time> · {featured.readingMinutes} min read
                </div>
                <h2>{featured.title}</h2>
                <Blurb post={featured} />
              </div>
            </Link>
          )}
          <ul className="bl-list">
            {(rest as Post[]).map(p => (
              <li key={p.id}>
                <Link to={`/blog/${p.slug}`} className="bl-list-item">
                  <time className="bl-list-date">{formatDate(p.publishedAt)}</time>
                  <div>
                    <h3>{p.title}</h3>
                    <Blurb post={p} />
                    {hits && <Snippet hit={hits.find(h => h.post.id === p.id)} />}
                    <div className="bl-list-tags">
                      {p.tags.map(t => (
                        <span key={t}>{t}</span>
                      ))}
                      <span>{p.readingMinutes} min</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </BlogLayout>
  )
}

/** Summary if there is one (marked when it is model-written), else the subtitle. */
function Blurb({ post }: { post: Post }) {
  if (post.summary)
    return (
      <p title={post.summaryAi ? 'Summary written by Gemini from the post' : undefined}>
        <span className="bl-tldr">TL;DR</span> {post.summary}
      </p>
    )
  return post.subtitle ? <p>{post.subtitle}</p> : null
}

function Snippet({ hit }: { hit?: Hit }) {
  if (!hit || hit.snippet.length === 0) return null
  return (
    <p className="bl-snippet">
      {hit.snippet.map((r, i) => (r.hit ? <mark key={i}>{r.text}</mark> : <React.Fragment key={i}>{r.text}</React.Fragment>))}
    </p>
  )
}
