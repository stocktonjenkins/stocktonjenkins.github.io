import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import PostView from './PostView'
import { firebaseConfigured } from './firebase'
import { getPublishedBySlug, recordView } from './posts'
import { useAuth } from './useAuth'
import { Post } from './types'
import { Loading, Message } from './States'

export default function PostPage() {
  const { slug = '' } = useParams()
  const [post, setPost] = useState<Post | null | undefined>(undefined)
  const { loading: authLoading, isAdmin } = useAuth()
  const counted = useRef<string | null>(null)

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
          <PostView post={post} />
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
