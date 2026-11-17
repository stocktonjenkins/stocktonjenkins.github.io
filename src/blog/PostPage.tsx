import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import PostView from './PostView'
import { firebaseConfigured } from './firebase'
import { getListedSeries, getPublishedBySlug, listPublished, recordView } from './posts'
import { seriesPosition, SeriesPosition } from './series'
import { SeriesBox, SeriesNav } from './SeriesParts'
import { useAuth } from './useAuth'
import { Post, Series } from './types'
import { Loading, Message } from './States'

export default function PostPage() {
  const { slug = '' } = useParams()
  const [post, setPost] = useState<Post | null | undefined>(undefined)
  const { loading: authLoading, isAdmin } = useAuth()
  const counted = useRef<string | null>(null)
  const [series, setSeries] = useState<{ series: Series; pos: SeriesPosition } | null>(null)

  // Series context. A private or missing series simply renders no series UI.
  useEffect(() => {
    setSeries(null)
    if (!post?.series) return
    let live = true
    Promise.all([getListedSeries(post.series), listPublished()])
      .then(([s, posts]) => {
        const pos = s && seriesPosition(posts, post)
        if (live && s && pos && pos.part > 0) setSeries({ series: s, pos })
      })
      .catch(e => console.warn('series not loaded', e))
    return () => {
      live = false
    }
  }, [post])

  // Count a view once auth is known (so the author's own visits are skipped).
  // The ref guards against StrictMode running the effect twice.
  useEffect(() => {
    if (!post || authLoading || isAdmin || counted.current === post.id) return
    counted.current = post.id
    recordView(post.id).catch(e => console.warn('view not counted', e))
  }, [post, authLoading, isAdmin])

  useEffect(() => {
    if (!firebaseConfigured) return setPost(null)
    setPost(undefined)
    getPublishedBySlug(slug)
      .then(setPost)
      .catch(e => {
        console.error(e)
        setPost(null)
      })
  }, [slug])

  return (
    <BlogLayout>
      {post === undefined ? (
        <Loading />
      ) : post === null ? (
        <Message title="Post not found">
          <Link to="/blog">← Back to all posts</Link>
        </Message>
      ) : (
        <>
          <PostView
            post={post}
            beforeArticle={series && <SeriesBox series={series.series} pos={series.pos} />}
          />
          {series && <SeriesNav series={series.series} pos={series.pos} />}
          <div className="bl-post-footer">
            <Link to="/blog">← All posts</Link>
            <a
              href="#top"
              onClick={e => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              Back to top ↑
            </a>
          </div>
        </>
      )}
    </BlogLayout>
  )
}
