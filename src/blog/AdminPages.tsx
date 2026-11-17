import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import BlogLayout from './BlogLayout'
import PostEditor from './PostEditor'
import PostView from './PostView'
import { ADMIN_UID, firebaseConfigured } from './firebase'
import { createPost, formatDate, getPost, listAll } from './posts'
import { Post } from './types'
import { signIn, signOutUser, useAuth } from './useAuth'
import { Loading, Message } from './States'

/** Renders children only for the admin account. The rules enforce this server-side too. */
function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  const [err, setErr] = useState('')

  if (!firebaseConfigured)
    return (
      <BlogLayout>
        <Message title="Blog backend not configured">
          Copy <code>.env.example</code> to <code>.env.local</code>, fill in your Firebase web config, and
          restart <code>npm start</code>. See <code>BLOG.md</code>.
        </Message>
      </BlogLayout>
    )
  if (loading) return <Loading />
  if (!user)
    return (
      <BlogLayout>
        <Message title="Sign in to write">
          <button
            className="bl-btn bl-btn-primary"
            onClick={() => signIn().catch(e => setErr(e.message))}
          >
            Sign in with Google
          </button>
          {err && <p className="bl-warn">{err}</p>}
        </Message>
      </BlogLayout>
    )
  if (!isAdmin)
    return (
      <BlogLayout>
        <Message title={ADMIN_UID ? 'This account cannot edit the blog' : 'One more setup step'}>
          {!ADMIN_UID && (
            <p>
              Set <code>REACT_APP_BLOG_ADMIN_UID</code> in <code>.env.local</code> and <code>ADMIN_UID</code> in{' '}
              <code>firestore.rules</code> and <code>storage.rules</code> to your UID:
            </p>
          )}
          <p>
            Signed in as {user.email} — UID <code className="bl-uid">{user.uid}</code>
          </p>
          <button className="bl-btn" onClick={() => signOutUser()}>
            Sign out
          </button>
        </Message>
      </BlogLayout>
    )
  return <>{children}</>
}

function Dashboard() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Write · Stockton Jenkins'
    listAll()
      .then(setPosts)
      .catch(e => setError(explain(e)))
  }, [])

  const newPost = async () => {
    setCreating(true)
    try {
      const id = await createPost()
      navigate(`/write/${id}`)
    } catch (e) {
      setError(explain(e))
      setCreating(false)
    }
  }

  return (
    <BlogLayout>
      <div className="bl-dash">
        <div className="bl-dash-head">
          <h1>Your posts</h1>
          <div className="bl-row">
            <button className="bl-btn bl-btn-ghost" onClick={() => signOutUser()}>
              Sign out
            </button>
            <button className="bl-btn bl-btn-primary" onClick={newPost} disabled={creating}>
              {creating ? 'Creating…' : '＋ New post'}
            </button>
          </div>
        </div>
        {error ? (
          <Message title="Couldn't reach the blog database">{error}</Message>
        ) : posts === null ? (
          <Loading />
        ) : posts.length === 0 ? (
          <Message title="No posts yet">Start your first one with “New post”.</Message>
        ) : (
          <ul className="bl-dash-list">
            {posts.map(p => (
              <li key={p.id}>
                <Link to={`/write/${p.id}`} className="bl-dash-item">
                  <span className={`bl-status ${p.published ? 'bl-status-pub' : ''}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="bl-dash-title">{p.title || 'Untitled'}</span>
                  <span className="bl-dash-date">
                    {p.published && <>{p.views.toLocaleString()} {p.views === 1 ? 'view' : 'views'} · </>}
                    Edited {formatDate(p.updatedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BlogLayout>
  )
}

function explain(e: any): string {
  const code = e?.code ?? ''
  if (code === 'permission-denied')
    return 'Permission denied. Check that firestore.rules is deployed with your UID in place of ADMIN_UID.'
  if (code === 'failed-precondition' || code === 'not-found')
    return 'Firestore is not set up for this project yet. Create the database in the Firebase console.'
  return e?.message ?? String(e)
}

function useLoadedPost() {
  const { id = '' } = useParams()
  const [post, setPost] = useState<Post | null | undefined>(undefined)
  useEffect(() => {
    setPost(undefined)
    getPost(id)
      .then(setPost)
      .catch(e => {
        console.error(explain(e))
        setPost(null)
      })
  }, [id])
  return post
}

function EditRoute() {
  const post = useLoadedPost()
  if (post === undefined) return <Loading />
  if (post === null)
    return (
      <BlogLayout>
        <Message title="Post not found">
          <Link to="/write">← All posts</Link>
        </Message>
      </BlogLayout>
    )
  return <PostEditor key={post.id} initial={post} />
}

function PreviewRoute() {
  const post = useLoadedPost()
  if (post === undefined) return <Loading />
  if (post === null) return <Message title="Post not found" />
  return (
    <BlogLayout>
      <PostView post={post} draft={!post.published} />
      <div className="bl-post-footer">
        <Link to={`/write/${post.id}`}>← Back to editing</Link>
      </div>
    </BlogLayout>
  )
}

export default function AdminPages() {
  return (
    <AdminGate>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path=":id" element={<EditRoute />} />
        <Route path=":id/preview" element={<PreviewRoute />} />
      </Routes>
    </AdminGate>
  )
}
