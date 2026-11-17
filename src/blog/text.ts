/**
 * Plain text from a stored BlockNote document (the JSON in `Post.content`),
 * without loading the editor. Used for search and as the LLM's input.
 * Walks inline content, links, tables, code, sidenotes and nested children.
 */

type Json = any

function inlineText(content: Json): string {
  if (content == null) return ''
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) {
    // Table content: { type: 'tableContent', rows: [{ cells: [...] }] }
    if (content.type === 'tableContent') {
      return (content.rows ?? [])
        .map((r: Json) => (r.cells ?? []).map((c: Json) => inlineText(c?.content ?? c)).join(' | '))
        .join('\n')
    }
    return ''
  }
  return content
    .map((n: Json) => {
      if (typeof n === 'string') return n
      switch (n?.type) {
        case 'text':
          return n.text ?? ''
        case 'link':
          return inlineText(n.content)
        case 'footnote':
          // Sidenote text reads as an aside in the flow.
          return ` (${inlineText(n.content)})`
        case 'math':
          return inlineText(n.content)
        case 'citation':
          return ''
        default:
          return inlineText(n?.content)
      }
    })
    .join('')
}

function blockText(b: Json, out: string[]) {
  const t = inlineText(b?.content).trim()
  if (t) out.push(b?.type === 'heading' ? `${'#'.repeat(b.props?.level ?? 2)} ${t}` : t)
  for (const c of b?.children ?? []) blockText(c, out)
}

/** One line per block; headings keep a leading "#" so structure survives. */
export function docToText(contentJson: string): string {
  let blocks: Json
  try {
    blocks = JSON.parse(contentJson)
  } catch {
    return ''
  }
  if (!Array.isArray(blocks)) return ''
  const out: string[] = []
  for (const b of blocks) blockText(b, out)
  return out.join('\n')
}
