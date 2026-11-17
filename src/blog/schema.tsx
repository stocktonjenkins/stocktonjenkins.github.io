import { BlockNoteSchema, createCodeBlockSpec } from '@blocknote/core'
import * as coreLocales from '@blocknote/core/locales'
import { codeBlockOptions } from './highlighter'
import {
  createReactBlockSpec,
  createReactInlineContentSpec,
  PreviewPlaceholder,
  ReactCustomInlineContentRenderProps,
  SourceInlineContentWithPreview,
} from '@blocknote/react'
import {
  createReactInlineMathSpec,
  createReactMathBlockSpec,
  locales as mathLocales,
} from '@blocknote/math-block'
import { shortCite, formatAuthors } from './bibtex'
import { useDocMeta } from './docMeta'

// ─── Citation: inline "[n]" pointing at a post-level reference ───────────────

const citationConfig = {
  type: 'citation' as const,
  propSchema: { refKey: { default: '' } },
  content: 'none' as const,
}

const Citation = (props: ReactCustomInlineContentRenderProps<typeof citationConfig, any>) => {
  const meta = useDocMeta(props.editor)
  const key = props.inlineContent.props.refKey
  const ref = meta.references.find(r => r.key === key)
  const n = meta.citeOrder.indexOf(key) + 1
  const label = ref ? `[${n || '?'}]` : `[?]`
  const title = ref
    ? `${formatAuthors(ref.authors, 3)}${ref.year ? ` (${ref.year})` : ''}. ${ref.title}`
    : `Unknown reference "${key}"`
  if (meta.readOnly) {
    return (
      <a className="bl-cite" href={`#ref-${key}`} title={title}>
        {label}
      </a>
    )
  }
  return (
    <span className={`bl-cite bl-cite-edit${ref ? '' : ' bl-cite-missing'}`} title={title}>
      {ref ? `${label} ${shortCite(ref)}` : label}
    </span>
  )
}

export const createCitationSpec = () =>
  createReactInlineContentSpec(citationConfig, { render: Citation })

// ─── Footnote / sidenote: plain-text note edited in a popup ─────────────────

const footnoteConfig = {
  type: 'footnote' as const,
  propSchema: { id: { default: '' } },
  content: 'plain' as const,
}

const Footnote = (props: ReactCustomInlineContentRenderProps<typeof footnoteConfig, any>) => {
  const meta = useDocMeta(props.editor)
  const id = props.inlineContent.props.id
  const n = meta.footnotes.findIndex(f => f.id === id) + 1
  const source = String(props.inlineContent.content ?? '')

  if (meta.readOnly) {
    return (
      <sup className="bl-fn-ref" id={`fnref-${id}`} data-fn={id}>
        <a href={`#fn-${id}`}>{n || '*'}</a>
        <span ref={props.contentRef} style={{ display: 'none' }} />
      </sup>
    )
  }
  return (
    <SourceInlineContentWithPreview
      editor={props.editor}
      node={props.node}
      getPos={props.getPos}
      contentRef={props.contentRef}
      source={source}
      preview={<sup className="bl-fn-ref bl-fn-edit" title={source}>{n || '*'}</sup>}
      emptySourcePlaceholder={<PreviewPlaceholder text="Note" />}
      sourcePlaceholder="Write a sidenote…"
    />
  )
}

export const createFootnoteSpec = () =>
  createReactInlineContentSpec(footnoteConfig, {
    meta: { code: true, hasPreview: true },
    render: Footnote,
  })

// ─── Callout: a highlighted aside block (Notion-style) ───────────────────────

export const createCalloutSpec = createReactBlockSpec(
  {
    type: 'callout',
    propSchema: { emoji: { default: '💡' } },
    content: 'inline',
  },
  {
    render: props => (
      <div className="bl-callout">
        <span
          className="bl-callout-emoji"
          contentEditable={false}
          onClick={() => {
            if (!props.editor.isEditable) return
            const choices = ['💡', '⚠️', '📌', '🧪', '❓', '✅']
            const next = choices[(choices.indexOf(props.block.props.emoji) + 1) % choices.length]
            props.editor.updateBlock(props.block, { props: { emoji: next } })
          }}
        >
          {props.block.props.emoji}
        </span>
        <div className="bl-callout-body" ref={props.contentRef} />
      </div>
    ),
  },
)

// ─── Schema ──────────────────────────────────────────────────────────────────

export const schema = BlockNoteSchema.create().extend({
  blockSpecs: {
    codeBlock: createCodeBlockSpec(codeBlockOptions),
    mathBlock: createReactMathBlockSpec(),
    callout: createCalloutSpec(),
  },
  inlineContentSpecs: {
    math: createReactInlineMathSpec(),
    citation: createCitationSpec(),
    footnote: createFootnoteSpec(),
  },
})

export type BlogEditor = typeof schema.BlockNoteEditor

export const dictionary = { ...coreLocales.en, math: mathLocales.en }
