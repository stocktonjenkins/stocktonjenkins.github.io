import { Reference } from './types'

/**
 * Minimal BibTeX parser: good enough for entries exported by Google Scholar,
 * arXiv, DBLP, Semantic Scholar and ACL Anthology. Handles nested braces and
 * quoted values; ignores @string/@comment/@preamble.
 */
export function parseBibtex(src: string): Reference[] {
  const out: Reference[] = []
  let i = 0
  while (i < src.length) {
    const at = src.indexOf('@', i)
    if (at < 0) break
    const open = src.slice(at).search(/[{(]/)
    if (open < 0) break
    const type = src.slice(at + 1, at + open).trim().toLowerCase()
    const start = at + open + 1
    const end = matchClose(src, at + open)
    i = end + 1
    if (['string', 'comment', 'preamble'].includes(type)) continue
    const body = src.slice(start, end)
    const comma = body.indexOf(',')
    if (comma < 0) continue
    const key = body.slice(0, comma).trim()
    const fields = parseFields(body.slice(comma + 1))
    out.push(toReference(key, type, fields))
  }
  return out
}

function matchClose(s: string, openIdx: number): number {
  const open = s[openIdx]
  const close = open === '{' ? '}' : ')'
  let depth = 0
  for (let j = openIdx; j < s.length; j++) {
    if (s[j] === open) depth++
    else if (s[j] === close && --depth === 0) return j
  }
  return s.length
}

function parseFields(body: string): Record<string, string> {
  const fields: Record<string, string> = {}
  let i = 0
  while (i < body.length) {
    const m = /^\s*,?\s*([A-Za-z][\w-]*)\s*=\s*/.exec(body.slice(i))
    if (!m) break
    i += m[0].length
    const name = m[1].toLowerCase()
    let value = ''
    if (body[i] === '{') {
      const end = matchClose(body, i)
      value = body.slice(i + 1, end)
      i = end + 1
    } else if (body[i] === '"') {
      let j = i + 1
      let depth = 0
      while (j < body.length && !(body[j] === '"' && depth === 0 && body[j - 1] !== '\\')) {
        if (body[j] === '{') depth++
        if (body[j] === '}') depth--
        j++
      }
      value = body.slice(i + 1, j)
      i = j + 1
    } else {
      const m2 = /^[^,}\s]+/.exec(body.slice(i))
      value = m2 ? m2[0] : ''
      i += value.length
    }
    fields[name] = clean(value)
  }
  return fields
}

const LATEX_ACCENTS: Record<string, string> = {
  "'": '́', '`': '̀', '^': '̂', '"': '̈', '~': '̃', c: '̧', '=': '̄',
}

const LATEX_LETTERS: Record<string, string> = {
  L: 'Ł', l: 'ł', O: 'Ø', o: 'ø', i: 'ı', ss: 'ß', ae: 'æ', AE: 'Æ', oe: 'œ', OE: 'Œ', aa: 'å', AA: 'Å',
}

function clean(v: string): string {
  return v
    .replace(/\\([`'^"~=c])\{?([A-Za-z])\}?/g, (_, a, ch) => (ch + (LATEX_ACCENTS[a] ?? '')).normalize('NFC'))
    .replace(/\\(ss|ae|AE|oe|OE|aa|AA|[LlOoi])(?![A-Za-z])\s*/g, (_, c) => LATEX_LETTERS[c])
    .replace(/\\&/g, '&')
    .replace(/\\textendash|--/g, '–')
    .replace(/\\[a-zA-Z]+\s*/g, '')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function toReference(key: string, type: string, f: Record<string, string>): Reference {
  const authors = (f.author || f.editor || '')
    .split(/\s+and\s+/i)
    .map(a => a.trim())
    .filter(Boolean)
    .map(a => {
      // "Last, First" -> "First Last"
      const [last, first] = a.split(',').map(s => s.trim())
      return first ? `${first} ${last}` : last
    })
  let url = f.url
  if (!url && f.doi) url = `https://doi.org/${f.doi}`
  if (!url && f.eprint && /arxiv/i.test(f.archiveprefix || f.journal || 'arxiv')) url = `https://arxiv.org/abs/${f.eprint}`
  const venue =
    f.booktitle ||
    f.journal ||
    (type === 'phdthesis' ? `PhD thesis, ${f.school}` : '') ||
    (type === 'techreport' && f.institution ? `${f.institution} technical report` : '') ||
    f.publisher ||
    f.institution ||
    f.organization ||
    f.howpublished
  return { key, title: f.title || key, authors, year: f.year, venue: venue || undefined, url: url || undefined }
}

/** "Vaswani, Shazeer, … & Polosukhin" style author list, truncated for long lists. */
export function formatAuthors(authors: string[], max = 6): string {
  if (authors.length === 0) return ''
  if (authors.length > max) return `${authors.slice(0, max - 1).join(', ')}, … ${authors[authors.length - 1]}`
  if (authors.length === 1) return authors[0]
  return `${authors.slice(0, -1).join(', ')} and ${authors[authors.length - 1]}`
}

/** Short label like "Vaswani et al., 2017" for tooltips and the cite picker. */
export function shortCite(r: Reference): string {
  const last = (n: string) => n.split(' ').pop() ?? n
  const who =
    r.authors.length === 0
      ? r.title
      : r.authors.length === 1
      ? last(r.authors[0])
      : r.authors.length === 2
      ? `${last(r.authors[0])} & ${last(r.authors[1])}`
      : `${last(r.authors[0])} et al.`
  return r.year ? `${who}, ${r.year}` : who
}
