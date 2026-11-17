import { docToText } from './text'
import { Post } from './types'

/**
 * Client-side keyword search over published posts: BM25 (TF with saturation,
 * smoothed IDF, length normalization) across weighted fields. The whole blog is
 * already loaded on /blog, so no server index is needed.
 */

const STOP = new Set(
  'a an and are as at be but by for from has have i if in into is it its me my of on or our so than that the their them then there these they this to was we were what when which who will with you your'.split(
    ' ',
  ),
)

const words = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

export function tokenize(s: string): string[] {
  return words(s).filter(t => t.length > 1 && !STOP.has(t))
}

/**
 * Query terms. The last word is still being typed, so it is kept even when it is
 * one letter or a stopword ("s", "the" on the way to "theory"): it prefix-matches.
 */
function queryTerms(q: string): string[] {
  const all = words(q)
  const typing = /[a-z0-9]$/i.test(q) ? all.pop() : undefined
  const terms = all.filter(t => t.length > 1 && !STOP.has(t))
  return typing ? [...terms, typing] : terms
}

/** True when the query has nothing searchable, so the page should show everything. */
export function isEmptyQuery(q: string): boolean {
  return queryTerms(q).length === 0
}

// Matches in the title or tags count more than matches in the body.
const FIELDS: { weight: number; get: (p: Post, body: string) => string }[] = [
  { weight: 4, get: p => p.title },
  { weight: 3, get: p => p.tags.join(' ') },
  { weight: 2, get: p => `${p.subtitle} ${p.summary}` },
  { weight: 1, get: (_, body) => body },
]

interface Doc {
  post: Post
  body: string
  tf: Map<string, number>
  len: number
}

export interface SearchIndex {
  docs: Doc[]
  df: Map<string, number>
  avgLen: number
  vocab: string[]
}

export function buildIndex(posts: Post[]): SearchIndex {
  const df = new Map<string, number>()
  const docs = posts.map(post => {
    const body = docToText(post.content)
    const tf = new Map<string, number>()
    let len = 0
    for (const f of FIELDS) {
      for (const t of tokenize(f.get(post, body))) {
        tf.set(t, (tf.get(t) ?? 0) + f.weight)
        len += f.weight
      }
    }
    tf.forEach((_, t) => df.set(t, (df.get(t) ?? 0) + 1))
    return { post, body, tf, len }
  })
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / Math.max(1, docs.length)
  return { docs, df, avgLen, vocab: Array.from(df.keys()) }
}

export interface Hit {
  post: Post
  score: number
  /** Body excerpt around the first match, split into plain and highlighted runs. */
  snippet: { text: string; hit: boolean }[]
}

const K1 = 1.2
const B = 0.75

/**
 * Every query term must match (AND). The last term also matches as a prefix,
 * so results update sensibly while typing. Returns posts by descending score.
 */
export function search(index: SearchIndex, query: string): Hit[] {
  const terms = queryTerms(query)
  if (terms.length === 0) return []
  const n = index.docs.length
  // Each query term expands to the index terms it stands for.
  const groups = terms.map((t, i) =>
    i === terms.length - 1 ? index.vocab.filter(v => v.startsWith(t)) : index.df.has(t) ? [t] : [],
  )
  // Smoothed IDF: stays positive even when a term is in every post (or there is one post).
  const idf = (t: string) => {
    const df = index.df.get(t) ?? 0
    return Math.log(1 + (n - df + 0.5) / (df + 0.5))
  }
  const hits: Hit[] = []
  for (const d of index.docs) {
    let score = 0
    let all = true
    for (const g of groups) {
      let best = 0
      for (const t of g) {
        const f = d.tf.get(t)
        if (!f) continue
        const s = (idf(t) * f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / index.avgLen))
        best = Math.max(best, s)
      }
      if (best === 0) {
        all = false
        break
      }
      score += best
    }
    if (all) hits.push({ post: d.post, score, snippet: snippet(d.body, groups.flat()) })
  }
  return hits.sort((a, b) => b.score - a.score)
}

function snippet(body: string, terms: string[], width = 200): { text: string; hit: boolean }[] {
  const flat = body.replace(/^#+ /gm, '').replace(/\s+/g, ' ').trim()
  if (!flat || terms.length === 0) return []
  const esc = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).sort((a, b) => b.length - a.length)
  const re = new RegExp(`\\b(${esc.join('|')})[a-z0-9]*`, 'gi')
  const first = re.exec(flat)
  if (!first) return []
  const start = Math.max(0, first.index - 60)
  let text = flat.slice(start, start + width)
  if (start > 0) text = '…' + text.replace(/^\S*\s/, '')
  if (start + width < flat.length) text = text.replace(/\s\S*$/, '') + '…'
  const out: { text: string; hit: boolean }[] = []
  let last = 0
  re.lastIndex = 0
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), hit: false })
    out.push({ text: m[0], hit: true })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ text: text.slice(last), hit: false })
  return out
}
