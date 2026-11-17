import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as UWCrest } from '../uw-crest.svg'
import { signOutUser, useAuth } from './useAuth'
import './blog.css'

export default function BlogLayout({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  const { user, isAdmin } = useAuth()
  return (
    <div className="bl-root">
      <nav className="bl-nav">
        <div className={`bl-nav-inner${wide ? ' bl-nav-wide' : ''}`}>
          <Link to="/" className="bl-brand">
            <UWCrest className="bl-crest" />
            Stockton Jenkins
          </Link>
          <div className="bl-nav-links">
            <Link to="/">About</Link>
            <Link to="/blog">Blog</Link>
            {isAdmin && <Link to="/write">Write</Link>}
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="bl-footer">
        <span>© {new Date().getFullYear()} Stockton Jenkins</span>
        <span className="bl-footer-links">
          {/* Subtle author entry point: /write shows the Google sign-in when signed out. */}
          {user ? (
            <button className="bl-footer-quiet" onClick={() => signOutUser()}>
              Sign out
            </button>
          ) : (
            <Link to="/write" className="bl-footer-quiet">
              Sign in
            </Link>
          )}
          <Link to="/blog">All posts</Link>
        </span>
      </footer>
    </div>
  )
}
