import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'

// Blog code (Firebase, the editor) is split out so the homepage stays light.
const BlogIndex = lazy(() => import('./blog/BlogIndex'))
const PostPage = lazy(() => import('./blog/PostPage'))
const AdminPages = lazy(() => import('./blog/AdminPages'))

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<PostPage />} />
          <Route path="/write/*" element={<AdminPages />} />
          <Route path="*" element={<App />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
)

reportWebVitals()
