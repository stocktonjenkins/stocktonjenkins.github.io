import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  increment,
  setDoc,
  where,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from './firebase'
import { AiConfig, Post, Reference, Series } from './types'

const COL = 'posts'

function fromDoc(id: string, d: any): Post {
  return {
    id,
    title: d.title ?? '',
    subtitle: d.subtitle ?? '',
    slug: d.slug ?? '',
    coverUrl: d.coverUrl ?? '',
    tags: d.tags ?? [],
    content: d.content ?? '[]',
    references: (d.references ?? []) as Reference[],
    published: Boolean(d.published),
    publishedAt: d.publishedAt ?? null,
    createdAt: d.createdAt ?? 0,
    updatedAt: d.updatedAt ?? 0,
    readingMinutes: d.readingMinutes ?? 1,
    summary: d.summary ?? '',
    summaryAi: Boolean(d.summaryAi),
    views: d.views ?? 0,
    series: d.series || null,
    seriesOrder: typeof d.seriesOrder === 'number' ? d.seriesOrder : null,
  }
}

const byDateDesc = (a: Post, b: Post) =>
  (b.publishedAt ?? b.updatedAt) - (a.publishedAt ?? a.updatedAt)

/** Public: published posts only. The `published == true` filter is required by the rules. */
export async function listPublished(): Promise<Post[]> {
  const snap = await getDocs(query(collection(db(), COL), where('published', '==', true)))
  return snap.docs.map(d => fromDoc(d.id, d.data())).sort(byDateDesc)
}

export async function getPublishedBySlug(slug: string): Promise<Post | null> {
  const snap = await getDocs(
    query(collection(db(), COL), where('published', '==', true), where('slug', '==', slug), limit(1)),
  )
  return snap.empty ? null : fromDoc(snap.docs[0].id, snap.docs[0].data())
}

/** Admin: everything, drafts included. */
export async function listAll(): Promise<Post[]> {
  const snap = await getDocs(collection(db(), COL))
  return snap.docs.map(d => fromDoc(d.id, d.data())).sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function getPost(id: string): Promise<Post | null> {
  const snap = await getDoc(doc(db(), COL, id))
  return snap.exists() ? fromDoc(snap.id, snap.data()) : null
}

export async function createPost(): Promise<string> {
  const now = Date.now()
  const ref = await addDoc(collection(db(), COL), {
    title: '',
    subtitle: '',
    slug: '',
    coverUrl: '',
    tags: [],
    content: '[]',
    references: [],
    published: false,
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
    readingMinutes: 1,
    summary: '',
    summaryAi: false,
    series: null,
    seriesOrder: null,
  })
  return ref.id
}

export async function savePost(id: string, patch: Partial<Omit<Post, 'id'>>) {
  await updateDoc(doc(db(), COL, id), { ...patch, updatedAt: Date.now() })
}

export async function deletePost(id: string) {
  await deleteDoc(doc(db(), COL, id))
}

/** True if another post already uses this slug. */
export async function slugTaken(slug: string, exceptId: string): Promise<boolean> {
  const snap = await getDocs(query(collection(db(), COL), where('slug', '==', slug)))
  return snap.docs.some(d => d.id !== exceptId)
}

export async function uploadImage(postId: string, file: File): Promise<string> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const r = ref(storage(), `blog/${postId}/${Date.now()}-${safe}`)
  await uploadBytes(r, file, { contentType: file.type, cacheControl: 'public, max-age=31536000' })
  return getDownloadURL(r)
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function formatDate(ms: number | null): string {
  if (!ms) return ''
  return new Date(ms).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ─── View counting ───────────────────────────────────────────────────────────

const VIEW_TTL = 24 * 60 * 60 * 1000

/**
 * Adds one view, at most once per browser per post per day. The rules only let
 * a signed-out visitor add exactly 1 to `views` on a published post.
 */
export async function recordView(postId: string) {
  const key = `bl-viewed-${postId}`
  try {
    const last = Number(localStorage.getItem(key) || 0)
    if (Date.now() - last < VIEW_TTL) return
    localStorage.setItem(key, String(Date.now()))
  } catch {
    // Storage blocked (private mode etc.): count it anyway.
  }
  await updateDoc(doc(db(), COL, postId), { views: increment(1) })
}

// ─── Admin-only AI settings (rules restrict config/* to the admin) ──────────

export const DEFAULT_MODEL = 'gemini-flash-latest'

export async function getAiConfig(): Promise<AiConfig> {
  const snap = await getDoc(doc(db(), 'config', 'ai'))
  const d = snap.exists() ? snap.data() : {}
  return { geminiKey: d.geminiKey ?? '', model: d.model || DEFAULT_MODEL }
}

export async function saveAiConfig(cfg: Partial<AiConfig>) {
  await setDoc(doc(db(), 'config', 'ai'), cfg, { merge: true })
}

// ─── Series ──────────────────────────────────────────────────────────────────

const SERIES = 'series'

function seriesFromDoc(id: string, d: any): Series {
  return {
    id,
    slug: d.slug ?? id,
    title: d.title ?? '',
    description: d.description ?? '',
    status: d.status === 'complete' ? 'complete' : 'active',
    listed: Boolean(d.listed),
    createdAt: d.createdAt ?? 0,
    updatedAt: d.updatedAt ?? 0,
  }
}

/** Public: series with at least one published post. The `listed` filter is required by the rules. */
export async function listListedSeries(): Promise<Series[]> {
  const snap = await getDocs(query(collection(db(), SERIES), where('listed', '==', true)))
  return snap.docs.map(d => seriesFromDoc(d.id, d.data()))
}

/** Public lookup by id; null if missing or not (yet) public. */
export async function getListedSeries(id: string): Promise<Series | null> {
  try {
    const snap = await getDoc(doc(db(), SERIES, id))
    return snap.exists() ? seriesFromDoc(snap.id, snap.data()) : null
  } catch {
    return null // permission-denied for an unlisted series: treat as no series
  }
}

export async function getListedSeriesBySlug(slug: string): Promise<Series | null> {
  const snap = await getDocs(
    query(collection(db(), SERIES), where('listed', '==', true), where('slug', '==', slug), limit(1)),
  )
  return snap.empty ? null : seriesFromDoc(snap.docs[0].id, snap.docs[0].data())
}

/** Admin: every series, listed or not. */
export async function listAllSeries(): Promise<Series[]> {
  const snap = await getDocs(collection(db(), SERIES))
  return snap.docs.map(d => seriesFromDoc(d.id, d.data())).sort((a, b) => a.title.localeCompare(b.title))
}

export async function createSeries(title: string): Promise<Series> {
  const now = Date.now()
  const existing = new Set((await listAllSeries()).map(s => s.slug))
  const base = slugify(title) || 'series'
  let slug = base
  for (let i = 2; existing.has(slug); i++) slug = `${base}-${i}`
  const data = { slug, title, description: '', status: 'active', listed: false, createdAt: now, updatedAt: now }
  const r = await addDoc(collection(db(), SERIES), data)
  return seriesFromDoc(r.id, data)
}

export async function saveSeries(id: string, patch: Partial<Omit<Series, 'id' | 'listed'>>) {
  await updateDoc(doc(db(), SERIES, id), { ...patch, updatedAt: Date.now() })
}

export async function deleteSeries(id: string) {
  await deleteDoc(doc(db(), SERIES, id))
}

/**
 * Admin: makes a series public exactly when it has a published post. Call after
 * anything that can change that (publish, unpublish, delete, reassignment).
 */
export async function refreshSeriesListed(id: string | null | undefined) {
  if (!id) return
  const snap = await getDocs(query(collection(db(), COL), where('series', '==', id)))
  const listed = snap.docs.some(d => d.data().published === true)
  const s = await getDoc(doc(db(), SERIES, id))
  if (s.exists() && Boolean(s.data().listed) !== listed) await updateDoc(doc(db(), SERIES, id), { listed })
}
