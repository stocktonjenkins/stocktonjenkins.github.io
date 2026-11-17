import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import '@blocknote/math-block/style.css'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import { syntaxHighlighter } from './highlighter'
import { dictionary, schema } from './schema'
import { scanDocument, setDocMeta, useDocMeta } from './docMeta'
import { formatAuthors } from './bibtex'
import { formatDate } from './posts'
import { Post, Reference } from './types'
import './blog.css'

/** Orders references: cited ones first (in citation order), then the rest. */
function orderedRefs(refs: Reference[], citeOrder: string[]): Reference[] {
  const cited = citeOrder.map(k => refs.find(r => r.key === k)).filter(Boolean) as Reference[]
  return [...cited, ...refs.filter(r => !citeOrder.includes(r.key))]
}

export function ReferenceList({ refs, citeOrder }: { refs: Reference[]; citeOrder: string[] }) {
  const list = orderedRefs(refs, citeOrder)
  if (list.length === 0) return null
  return (
    <section className="bl-endmatter">
      <h2>References</h2>
      <ol className="bl-refs">
        {list.map(r => (
          <li key={r.key} id={`ref-${r.key}`}>
            {r.authors.length > 0 && <span className="bl-ref-authors">{formatAuthors(r.authors)}. </span>}
            {r.url ? (
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="bl-ref-title">
                {r.title}
              </a>
            ) : (
              <span className="bl-ref-title">{r.title}</span>
            )}
            {r.venue && <span className="bl-ref-venue">. {r.venue}</span>}
            {r.year && <span>, {r.year}</span>}.
          </li>
        ))}
      </ol>
    </section>
  )
}

/**
 * Tufte-style sidenotes. On wide screens each note is absolutely positioned
 * level with its marker in the text (pushed down to avoid overlaps). On narrow
 * screens CSS hides this column and the numbered Notes list is used instead.
 */
function Sidenotes({ article, notes }: { article: HTMLElement | null; notes: { id: string; text: string }[] }) {
  const [tops, setTops] = useState<Record<string, number>>({})
  const noteEls = useRef<Record<string, HTMLDivElement | null>>({})

  useLayoutEffect(() => {
    if (!article) return
    const layout = () => {
      const base = article.getBoundingClientRect().top
      let floor = 0
      const next: Record<string, number> = {}
      for (const n of notes) {
        const marker = article.querySelector(`#fnref-${CSS.escape(n.id)}`)
        if (!marker) continue
        const top = Math.max(marker.getBoundingClientRect().top - base - 4, floor)
        next[n.id] = top
        floor = top + (noteEls.current[n.id]?.offsetHeight ?? 60) + 14
      }
      setTops(prev => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }
    // BlockNote mounts inline node views after first paint, and images/KaTeX
    // fonts shift layout later, so re-run on any of those.
    let frame = 0
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(layout)
    }
    schedule()
    const ro = new ResizeObserver(schedule)
    ro.observe(article)
    const mo = new MutationObserver(schedule)
    mo.observe(article, { childList: true, subtree: true })
    window.addEventListener('resize', schedule)
    article.addEventListener('load', schedule, true)
    document.fonts?.ready.then(schedule)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('resize', schedule)
      article.removeEventListener('load', schedule, true)
    }
  }, [article, notes])

  if (notes.length === 0) return null
  return (
    <aside className="bl-sidenotes" aria-hidden="true">
      {notes.map((n, i) => (
        <div
          key={n.id}
          id={`sn-${n.id}`}
          ref={el => {
            noteEls.current[n.id] = el
          }}
          className="bl-sidenote"
          style={{ top: tops[n.id] ?? 0, visibility: tops[n.id] === undefined ? 'hidden' : 'visible' }}
        >
          <span className="bl-sidenote-num">{i + 1}</span>
          {n.text}
        </div>
      ))}
    </aside>
  )
}

function ReadingProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return <div className="bl-progress" style={{ transform: `scaleX(${p})` }} />
}

export default function PostView({ post, draft }: { post: Post; draft?: boolean }) {
  const initialContent = useMemo(() => {
    try {
      const c = JSON.parse(post.content)
      return Array.isArray(c) && c.length > 0 ? c : undefined
    } catch {
      return undefined
    }
  }, [post.content])

  const editor = useCreateBlockNote(
    { schema, dictionary, initialContent, extensions: [syntaxHighlighter] },
    [post.id, post.content],
  )

  // Must be set before the first render of inline nodes.
  useMemo(() => {
    setDocMeta(editor, { readOnly: true, references: post.references, ...scanDocument(editor.document) })
  }, [editor, post.references])

  const meta = useDocMeta(editor)
  // State, not a ref: Sidenotes' layout effect must re-run once the element exists.
  const [article, setArticle] = useState<HTMLElement | null>(null)

  // On wide screens, clicking a note marker highlights its sidenote instead of jumping.
  const onArticleClick = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest('.bl-fn-ref a') as HTMLAnchorElement | null
    if (!a) return
    const id = a.closest('.bl-fn-ref')?.getAttribute('data-fn')
    const sn = id && document.getElementById(`sn-${id}`)
    if (sn && sn.offsetParent !== null) {
      e.preventDefault()
      sn.classList.remove('bl-flash')
      void sn.offsetWidth
      sn.classList.add('bl-flash')
    }
  }

  useEffect(() => {
    document.title = `${post.title || 'Untitled'} · Stockton Jenkins`
    return () => {
      document.title = 'Stockton Jenkins'
    }
  }, [post.title])

  return (
    <>
      <ReadingProgress />
      <header className="bl-post-header">
        {draft && <div className="bl-draft-banner">Draft preview — not visible to readers</div>}
        {post.tags.length > 0 && (
          <div className="bl-tags">
            {post.tags.map(t => (
              <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`} className="bl-tag">
                {t}
              </Link>
            ))}
          </div>
        )}
        <h1 className="bl-post-title">{post.title || 'Untitled'}</h1>
        {post.subtitle && <p className="bl-post-subtitle">{post.subtitle}</p>}
        <div className="bl-post-meta">
          <span>Stockton Jenkins</span>
          <span className="bl-dot">·</span>
          <time>{formatDate(post.publishedAt ?? post.updatedAt)}</time>
          <span className="bl-dot">·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
      </header>
      {post.coverUrl && (
        <figure className="bl-cover">
          <img src={post.coverUrl} alt="" />
        </figure>
      )}
      <article className="bl-article" ref={setArticle} onClick={onArticleClick}>
        <BlockNoteView editor={editor} editable={false} theme="light" className="bl-bn" />
        <Sidenotes article={article} notes={meta.footnotes} />
        {meta.footnotes.length > 0 && (
          <section className="bl-endmatter bl-notes">
            <h2>Notes</h2>
            <ol>
              {meta.footnotes.map(n => (
                <li key={n.id} id={`fn-${n.id}`}>
                  {n.text} <a href={`#fnref-${n.id}`} aria-label="Back to text">↩</a>
                </li>
              ))}
            </ol>
          </section>
        )}
        <ReferenceList refs={post.references} citeOrder={meta.citeOrder} />
      </article>
    </>
  )
}
