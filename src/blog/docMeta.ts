import { useSyncExternalStore } from 'react'
import { Reference } from './types'

/**
 * Per-editor metadata that inline nodes (citations, footnotes) need to render
 * their numbers: e.g. a citation shows "[3]" because it's the third distinct
 * reference cited in the document. Kept outside React context so it works
 * regardless of how BlockNote mounts node views.
 */
export interface DocMeta {
  readOnly: boolean
  references: Reference[]
  /** Citation keys in first-appearance order. */
  citeOrder: string[]
  /** Footnotes in document order. */
  footnotes: { id: string; text: string }[]
}

interface Entry {
  meta: DocMeta
  listeners: Set<() => void>
}

const store = new WeakMap<object, Entry>()

function entry(editor: object): Entry {
  let e = store.get(editor)
  if (!e) {
    e = { meta: { readOnly: false, references: [], citeOrder: [], footnotes: [] }, listeners: new Set() }
    store.set(editor, e)
  }
  return e
}

export function setDocMeta(editor: object, patch: Partial<DocMeta>) {
  const e = entry(editor)
  e.meta = { ...e.meta, ...patch }
  e.listeners.forEach(l => l())
}

export function getDocMeta(editor: object): DocMeta {
  return entry(editor).meta
}

export function useDocMeta(editor: object): DocMeta {
  const e = entry(editor)
  return useSyncExternalStore(
    cb => {
      e.listeners.add(cb)
      return () => e.listeners.delete(cb)
    },
    () => e.meta,
  )
}

/** Walks a BlockNote document and recomputes citation/footnote ordering. */
export function scanDocument(blocks: any[]): Pick<DocMeta, 'citeOrder' | 'footnotes'> {
  const citeOrder: string[] = []
  const footnotes: { id: string; text: string }[] = []

  const visitInline = (items: any[] | undefined) => {
    if (!Array.isArray(items)) return
    for (const ic of items) {
      if (ic.type === 'citation') {
        const k = ic.props?.refKey
        if (k && !citeOrder.includes(k)) citeOrder.push(k)
      } else if (ic.type === 'footnote') {
        footnotes.push({ id: ic.props?.id ?? '', text: typeof ic.content === 'string' ? ic.content : '' })
      } else if (ic.type === 'link') {
        visitInline(ic.content)
      }
    }
  }

  const visitBlocks = (bs: any[]) => {
    for (const b of bs) {
      const c = b.content
      if (Array.isArray(c)) visitInline(c)
      else if (c && c.type === 'tableContent') {
        for (const row of c.rows ?? [])
          for (const cell of row.cells ?? []) visitInline(Array.isArray(cell) ? cell : cell?.content)
      }
      if (b.children?.length) visitBlocks(b.children)
    }
  }

  visitBlocks(blocks)
  return { citeOrder, footnotes }
}

/** Rough reading time from the document's text. */
export function readingMinutes(blocks: any[]): number {
  let words = 0
  const count = (s: string) => (words += s.split(/\s+/).filter(Boolean).length)
  const visitInline = (items: any) => {
    if (typeof items === 'string') return count(items)
    if (!Array.isArray(items)) return
    for (const ic of items) {
      if (ic.type === 'text') count(ic.text)
      else visitInline(ic.content)
    }
  }
  const visit = (bs: any[]) => {
    for (const b of bs) {
      if (Array.isArray(b.content) || typeof b.content === 'string') visitInline(b.content)
      else if (b.content?.type === 'tableContent')
        for (const r of b.content.rows ?? []) for (const cell of r.cells ?? []) visitInline(Array.isArray(cell) ? cell : cell?.content)
      if (b.children?.length) visit(b.children)
    }
  }
  visit(blocks)
  return Math.max(1, Math.round(words / 230))
}
