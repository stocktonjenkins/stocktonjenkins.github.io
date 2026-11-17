import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import '@blocknote/math-block/style.css'
import { combineByGroup, filterSuggestionItems, insertOrUpdateBlockForSlashMenu } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/mantine'
import {
  blockTypeSelectItems,
  DefaultReactSuggestionItem,
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from '@blocknote/react'
import { syntaxHighlighter } from './highlighter'
import { getMathBlockTypeSelectItems, getMathSlashMenuItems } from '@blocknote/math-block'
import { BlogEditor, dictionary, schema } from './schema'
import { readingMinutes, scanDocument, setDocMeta, useDocMeta } from './docMeta'
import { formatAuthors, parseBibtex, shortCite } from './bibtex'
import {
  createSeries,
  listAllSeries,
  refreshSeriesListed,
  DEFAULT_MODEL,
  deletePost,
  getAiConfig,
  listAll, saveAiConfig, savePost, slugify, slugTaken, uploadImage } from './posts'
import { generateSummary, generateTags } from './summarize'
import { docToText } from './text'
import { AiConfig, Post, Reference, Series } from './types'
import './blog.css'

type SaveState = 'saved' | 'saving' | 'dirty' | 'error'

const newId = () => Math.random().toString(36).slice(2, 10)

/** Debounced autosave that merges patches and can be flushed. */
function useAutosave(postId: string) {
  const pending = useRef<Partial<Post>>({})
  const timer = useRef<number | undefined>()
  const [state, setState] = useState<SaveState>('saved')

  const flush = useCallback(async () => {
    window.clearTimeout(timer.current)
    const patch = pending.current
    if (Object.keys(patch).length === 0) return
    pending.current = {}
    setState('saving')
    try {
      await savePost(postId, patch)
      setState(Object.keys(pending.current).length ? 'dirty' : 'saved')
    } catch (e) {
      console.error(e)
      pending.current = { ...patch, ...pending.current }
      setState('error')
    }
  }, [postId])

  const schedule = useCallback(
    (patch: Partial<Post>) => {
      pending.current = { ...pending.current, ...patch }
      setState('dirty')
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(flush, 900)
    },
    [flush],
  )

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (Object.keys(pending.current).length) {
        flush()
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', warn)
    return () => {
      window.removeEventListener('beforeunload', warn)
      flush()
    }
  }, [flush])

  return { schedule, flush, state }
}

function AutoTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const fit = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [])
  useEffect(fit, [props.value, fit])
  useEffect(() => {
    // Re-fit once web fonts load and whenever the width changes.
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [fit])
  return <textarea ref={ref} rows={1} {...props} />
}

// ─── Settings drawer ─────────────────────────────────────────────────────────

function SettingsPanel({
  post,
  onChange,
  onClose,
  onDelete,
  onGenerate,
  onSuggestTags,
  onSeriesChange,
  generating,
  genError,
}: {
  post: Post
  onChange: (p: Partial<Post>) => void
  onSeriesChange: (seriesId: string | null) => void
  onClose: () => void
  onDelete: () => void
  onGenerate: () => void
  onSuggestTags: () => void
  generating: boolean
  genError: string
}) {
  const [tags, setTags] = useState(post.tags.join(', '))
  // Tags can change from outside the input (Gemini suggestions): re-sync then.
  const parseTags = (s: string) =>
    s
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean)
  useEffect(() => {
    setTags(cur => (parseTags(cur).join(',') === post.tags.join(',') ? cur : post.tags.join(', ')))
  }, [post.tags])
  return (
    <div className="bl-drawer-backdrop" onClick={onClose}>
      <div className="bl-drawer" onClick={e => e.stopPropagation()}>
        <div className="bl-drawer-head">
          <h3>Post settings</h3>
          <button className="bl-btn bl-btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <label className="bl-field">
          <span>URL slug</span>
          <div className="bl-slug">
            <span>/blog/</span>
            <input
              value={post.slug}
              placeholder={slugify(post.title) || 'my-post'}
              onChange={e => onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
            />
          </div>
          <small>Leave empty to derive it from the title when you publish.</small>
        </label>
        <label className="bl-field">
          <span>Tags</span>
          <input
            value={tags}
            placeholder="agents, retrieval"
            onChange={e => {
              setTags(e.target.value)
              onChange({ tags: parseTags(e.target.value) })
            }}
          />
          <div className="bl-field-row">
            <button className="bl-btn bl-btn-sm" onClick={onSuggestTags} disabled={generating}>
              Suggest tags with Gemini
            </button>
          </div>
        </label>
        <SeriesField post={post} onChange={onChange} onSeriesChange={onSeriesChange} />
        <label className="bl-field">
          <span>
            Summary
            {post.summary && post.summaryAi && <em className="bl-ai-badge">AI</em>}
          </span>
          <textarea
            rows={4}
            value={post.summary}
            placeholder="Shown under the title in the post list. Generated on first publish if empty."
            onChange={e => onChange({ summary: e.target.value, summaryAi: false })}
          />
          <div className="bl-field-row">
            <button className="bl-btn bl-btn-sm" onClick={onGenerate} disabled={generating}>
              {generating ? 'Generating…' : post.summary ? 'Regenerate with Gemini' : 'Generate with Gemini'}
            </button>
          </div>
          {genError && <small className="bl-field-error">{genError}</small>}
        </label>
        <AiSettings />
        <div className="bl-field">
          <span>Danger zone</span>
          <button className="bl-btn bl-btn-danger" onClick={onDelete}>
            Delete post
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Series picker ───────────────────────────────────────────────────────────

function SeriesField({
  post,
  onChange,
  onSeriesChange,
}: {
  post: Post
  onChange: (p: Partial<Post>) => void
  onSeriesChange: (seriesId: string | null) => void
}) {
  const [list, setList] = useState<Series[] | null>(null)
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [err, setErr] = useState('')
  useEffect(() => {
    listAllSeries()
      .then(setList)
      .catch(e => setErr(e?.message ?? String(e)))
  }, [])
  // A series id that no longer exists (deleted series) reads as "none".
  const current = list && post.series && list.some(s => s.id === post.series) ? post.series : ''

  const create = async () => {
    const t = title.trim()
    if (!t) return
    try {
      const s = await createSeries(t)
      setList(l => [...(l ?? []), s].sort((a, b) => a.title.localeCompare(b.title)))
      setCreating(false)
      setTitle('')
      onSeriesChange(s.id)
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    }
  }

  return (
    <div className="bl-field">
      <span>Series</span>
      {list === null && !err ? (
        <small>Loading…</small>
      ) : creating ? (
        <div className="bl-field-row">
          <input
            autoFocus
            value={title}
            placeholder="Series title"
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') create()
              if (e.key === 'Escape') setCreating(false)
            }}
            style={{ flex: 1 }}
          />
          <button className="bl-btn bl-btn-sm" onClick={create} disabled={!title.trim()}>
            Create
          </button>
          <button className="bl-btn bl-btn-sm bl-btn-ghost" onClick={() => setCreating(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <select
          className="bl-select"
          value={current}
          onChange={e => {
            if (e.target.value === '__new') setCreating(true)
            else onSeriesChange(e.target.value || null)
          }}
        >
          <option value="">None</option>
          {(list ?? []).map(s => (
            <option key={s.id} value={s.id}>
              {s.title}
              {s.listed ? '' : ' (private)'}
            </option>
          ))}
          <option value="__new">＋ New series…</option>
        </select>
      )}
      {current && (
        <label className="bl-field-inline">
          Order
          <input
            type="number"
            min={1}
            value={post.seriesOrder ?? ''}
            placeholder="auto"
            onChange={e => onChange({ seriesOrder: e.target.value === '' ? null : Number(e.target.value) })}
          />
          <small>Leave on auto to order by publish date.</small>
        </label>
      )}
      {err && <small className="bl-field-error">{err}</small>}
      <small>A series stays private until one of its posts is published. Edit its description on the dashboard.</small>
    </div>
  )
}

// ─── Gemini settings (stored admin-only in Firestore, not in the bundle) ─────

function AiSettings() {
  const [cfg, setCfg] = useState<AiConfig | null>(null)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    getAiConfig()
      .then(setCfg)
      .catch(() => setCfg({ geminiKey: '', model: DEFAULT_MODEL }))
  }, [])
  if (!cfg) return null
  const save = async () => {
    await saveAiConfig({ geminiKey: cfg.geminiKey.trim(), model: cfg.model.trim() || DEFAULT_MODEL })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }
  return (
    <div className="bl-field">
      <span>Gemini</span>
      <input
        type="password"
        autoComplete="off"
        value={cfg.geminiKey}
        placeholder="API key from aistudio.google.com"
        onChange={e => setCfg({ ...cfg, geminiKey: e.target.value })}
      />
      <input
        value={cfg.model}
        placeholder={DEFAULT_MODEL}
        onChange={e => setCfg({ ...cfg, model: e.target.value })}
      />
      <div className="bl-field-row">
        <button className="bl-btn bl-btn-sm" onClick={save}>
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
      <small>Stored in Firestore where only you can read it. Shared by all posts.</small>
    </div>
  )
}

// ─── References panel ────────────────────────────────────────────────────────

function ReferencesPanel({
  refs,
  citeOrder,
  onChange,
}: {
  refs: Reference[]
  citeOrder: string[]
  onChange: (refs: Reference[]) => void
}) {
  const [bib, setBib] = useState('')
  const [msg, setMsg] = useState('')
  const add = () => {
    const parsed = parseBibtex(bib)
    if (parsed.length === 0) {
      setMsg('No BibTeX entries found. Paste entries like @article{key, title={…}, …}.')
      return
    }
    const byKey = new Map(refs.map(r => [r.key, r]))
    parsed.forEach(r => byKey.set(r.key, r))
    onChange(Array.from(byKey.values()))
    setBib('')
    setMsg(`Added ${parsed.length} reference${parsed.length > 1 ? 's' : ''}. Type @ in the text to cite.`)
  }
  return (
    <section className="bl-refpanel" id="references-panel">
      <h3>
        References <span className="bl-count">{refs.length}</span>
      </h3>
      <p className="bl-hint">
        Paste BibTeX from Google Scholar, arXiv, or DBLP. Cite inline by typing <kbd>@</kbd>. Readers see a
        numbered bibliography at the end of the post.
      </p>
      {refs.length > 0 && (
        <ul className="bl-reflist">
          {refs.map(r => {
            const n = citeOrder.indexOf(r.key) + 1
            return (
              <li key={r.key}>
                <span className="bl-refnum">{n ? `[${n}]` : '—'}</span>
                <div>
                  <div className="bl-reflist-title">{r.title}</div>
                  <div className="bl-reflist-meta">
                    {formatAuthors(r.authors, 3)}
                    {r.year ? ` · ${r.year}` : ''}
                    {r.venue ? ` · ${r.venue}` : ''} · <code>{r.key}</code>
                    {!n && ' · not cited yet'}
                  </div>
                </div>
                <button
                  className="bl-btn bl-btn-ghost bl-btn-sm"
                  onClick={() => onChange(refs.filter(x => x.key !== r.key))}
                  title="Remove reference"
                >
                  ✕
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <textarea
        className="bl-bibtex"
        value={bib}
        onChange={e => setBib(e.target.value)}
        placeholder={'@inproceedings{vaswani2017attention,\n  title={Attention is all you need},\n  author={Vaswani, Ashish and Shazeer, Noam and ...},\n  booktitle={NeurIPS},\n  year={2017}\n}'}
      />
      <div className="bl-row">
        <button className="bl-btn" onClick={add} disabled={!bib.trim()}>
          Add references
        </button>
        {msg && <span className="bl-hint">{msg}</span>}
      </div>
    </section>
  )
}

// ─── Editor ──────────────────────────────────────────────────────────────────

function insertFootnote(editor: BlogEditor) {
  editor.insertInlineContent([{ type: 'footnote', props: { id: newId() }, content: '' } as any, ' '])
}

export default function PostEditor({ initial }: { initial: Post }) {
  const navigate = useNavigate()
  const [post, setPost] = useState<Post>(initial)
  const [showSettings, setShowSettings] = useState(false)
  const [publishMsg, setPublishMsg] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')
  const { schedule, flush, state } = useAutosave(initial.id)
  const coverInput = useRef<HTMLInputElement>(null)

  const initialContent = useMemo(() => {
    try {
      const c = JSON.parse(initial.content)
      return Array.isArray(c) && c.length > 0 ? c : undefined
    } catch {
      return undefined
    }
  }, [initial.content])

  const editor = useCreateBlockNote({
    schema,
    dictionary,
    initialContent,
    extensions: [syntaxHighlighter],
    uploadFile: (file: File) => uploadImage(initial.id, file),
  })

  useMemo(() => {
    setDocMeta(editor, { readOnly: false, references: initial.references, ...scanDocument(editor.document) })
  }, [editor, initial.references])
  const meta = useDocMeta(editor)

  const update = (patch: Partial<Post>) => {
    setPost(p => ({ ...p, ...patch }))
    schedule(patch)
  }

  const onEditorChange = () => {
    const doc = editor.document
    setDocMeta(editor, scanDocument(doc))
    schedule({ content: JSON.stringify(doc), readingMinutes: readingMinutes(doc) })
  }

  const setReferences = (references: Reference[]) => {
    setDocMeta(editor, { references })
    update({ references })
  }

  useEffect(() => {
    document.title = `${post.title || 'Untitled'} · Editing`
    return () => {
      document.title = 'Stockton Jenkins'
    }
  }, [post.title])

  // ⌘S / Ctrl+S saves immediately.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        flush()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flush])

  /**
   * Fills in the summary and/or tags with Gemini. Returns true if anything was
   * written; errors are shown in Settings and never block the caller.
   */
  const aiFill = async (what: { summary?: boolean; tags?: boolean }): Promise<boolean> => {
    setGenerating(true)
    setGenError('')
    try {
      const cfg = await getAiConfig()
      const input = { title: post.title, subtitle: post.subtitle, text: docToText(JSON.stringify(editor.document)) }
      const vocab = what.tags
        ? Array.from(new Set((await listAll()).filter(p => p.id !== post.id).flatMap(p => p.tags))).sort()
        : []
      const [summary, tags] = await Promise.all([
        what.summary ? generateSummary(cfg, input) : Promise.resolve(null),
        what.tags ? generateTags(cfg, input, vocab) : Promise.resolve(null),
      ])
      update({
        ...(summary ? { summary, summaryAi: true } : {}),
        ...(tags && tags.length ? { tags } : {}),
      })
      return Boolean(summary || tags?.length)
    } catch (e: any) {
      setGenError(e?.message ?? String(e))
      return false
    } finally {
      setGenerating(false)
    }
  }

  const togglePublish = async () => {
    setPublishMsg('')
    if (post.published) {
      update({ published: false })
      await flush()
      await refreshSeriesListed(post.series).catch(console.warn)
      return
    }
    if (!post.title.trim()) {
      setPublishMsg('Add a title before publishing.')
      return
    }
    const slug = slugify(post.slug) || slugify(post.title)
    if (!slug) {
      setPublishMsg('Set a URL slug in Settings.')
      return
    }
    if (await slugTaken(slug, post.id)) {
      setPublishMsg(`Another post already uses /blog/${slug}. Change the slug in Settings.`)
      setShowSettings(true)
      return
    }
    update({ published: true, slug, publishedAt: post.publishedAt ?? Date.now() })
    await flush()
    await refreshSeriesListed(post.series).catch(console.warn)
    // Fill an empty summary and/or empty tags with Gemini; a failure never undoes the publish.
    const want = { summary: !post.summary.trim(), tags: post.tags.length === 0 }
    if (want.summary || want.tags) {
      const cfg = await getAiConfig().catch(() => null)
      if (cfg?.geminiKey && (await aiFill(want))) await flush()
    }
  }

  const onCover = async (f: File | undefined) => {
    if (!f) return
    const url = await uploadImage(post.id, f)
    update({ coverUrl: url })
  }

  const slashItems = async (query: string) => {
    const custom: DefaultReactSuggestionItem[] = [
      {
        title: 'Citation',
        subtext: 'Cite a reference from this post (or type @)',
        aliases: ['cite', 'reference', 'bib'],
        group: 'Research',
        icon: <span className="bl-menu-icon">[1]</span>,
        onItemClick: () => {
          ;(editor.getExtension('suggestionMenu') as any)?.openSuggestionMenu('@')
        },
      },
      {
        title: 'Sidenote',
        subtext: 'A footnote shown in the margin',
        aliases: ['footnote', 'note', 'margin'],
        group: 'Research',
        icon: <span className="bl-menu-icon">¹</span>,
        onItemClick: () => insertFootnote(editor),
      },
      {
        title: 'Callout',
        subtext: 'Highlighted aside with an icon',
        aliases: ['callout', 'aside', 'info', 'note'],
        group: 'Basic blocks',
        icon: <span className="bl-menu-icon">💡</span>,
        onItemClick: () => insertOrUpdateBlockForSlashMenu(editor, { type: 'callout' } as any),
      },
    ]
    const items = combineByGroup(
      getDefaultReactSlashMenuItems(editor),
      getMathSlashMenuItems(editor),
      custom,
    )
    return filterSuggestionItems(items, query)
  }

  const citeItems = async (query: string) => {
    const refs = meta.references
    const items: DefaultReactSuggestionItem[] = refs.map(r => ({
      title: shortCite(r),
      subtext: r.title,
      aliases: [r.key, r.title, ...r.authors],
      onItemClick: () => {
        editor.insertInlineContent([{ type: 'citation', props: { refKey: r.key } } as any, ' '])
      },
    }))
    items.push({
      title: 'Add a reference…',
      subtext: 'Paste BibTeX in the References panel below',
      aliases: ['add', 'new', 'bibtex'],
      onItemClick: () => document.getElementById('references-panel')?.scrollIntoView({ behavior: 'smooth' }),
    })
    return filterSuggestionItems(items, query)
  }

  const onDelete = async () => {
    if (!window.confirm(`Delete "${post.title || 'Untitled'}"? This can't be undone.`)) return
    await deletePost(post.id)
    await refreshSeriesListed(post.series).catch(console.warn)
    navigate('/write')
  }

  const saveLabel = { saved: 'Saved', saving: 'Saving…', dirty: 'Editing…', error: 'Save failed — retrying on next edit' }[state]

  return (
    <div className="bl-editor-page">
      <div className="bl-topbar">
        <Link to="/write" className="bl-crumb">
          ← All posts
        </Link>
        <span className={`bl-save bl-save-${state}`}>{saveLabel}</span>
        <div className="bl-topbar-actions">
          {publishMsg && <span className="bl-warn">{publishMsg}</span>}
          <button
            className="bl-btn bl-btn-ghost"
            onClick={async () => {
              await flush()
              navigate(`/write/${post.id}/preview`)
            }}
          >
            Preview
          </button>
          {post.published && (
            <a className="bl-btn bl-btn-ghost" href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
              View live ↗
            </a>
          )}
          <button className="bl-btn bl-btn-ghost" onClick={() => setShowSettings(true)}>
            Settings
          </button>
          <button className={`bl-btn ${post.published ? '' : 'bl-btn-primary'}`} onClick={togglePublish}>
            {post.published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {post.coverUrl ? (
        <div className="bl-editor-cover">
          <div className="bl-editor-cover-frame">
          <img src={post.coverUrl} alt="" />
          <div className="bl-editor-cover-actions">
            <button className="bl-btn bl-btn-sm" onClick={() => coverInput.current?.click()}>
              Change cover
            </button>
            <button className="bl-btn bl-btn-sm" onClick={() => update({ coverUrl: '' })}>
              Remove
            </button>
          </div>
          </div>
        </div>
      ) : null}
      <input
        ref={coverInput}
        type="file"
        accept="image/*"
        hidden
        onChange={e => onCover(e.target.files?.[0])}
      />

      <div className="bl-editor-doc">
        <div className="bl-editor-head">
          {!post.coverUrl && (
            <button className="bl-add-cover" onClick={() => coverInput.current?.click()}>
              ＋ Add cover
            </button>
          )}
          <AutoTextarea
            className="bl-title-input"
            placeholder="Untitled"
            value={post.title}
            onChange={e => update({ title: e.target.value.replace(/\n/g, '') })}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                ;(document.querySelector('.bl-subtitle-input') as HTMLElement)?.focus()
              }
            }}
          />
          <AutoTextarea
            className="bl-subtitle-input"
            placeholder="Add a subtitle…"
            value={post.subtitle}
            onChange={e => update({ subtitle: e.target.value.replace(/\n/g, '') })}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                editor.focus()
              }
            }}
          />
        </div>

        <div className="bl-editor-body">
          <BlockNoteView
            editor={editor}
            theme="light"
            onChange={onEditorChange}
            slashMenu={false}
            formattingToolbar={false}
            className="bl-bn"
          >
            <FormattingToolbarController
              formattingToolbar={() => (
                <FormattingToolbar
                  blockTypeSelectItems={[...blockTypeSelectItems(editor), ...getMathBlockTypeSelectItems(editor)]}
                />
              )}
            />
            <SuggestionMenuController triggerCharacter="/" getItems={slashItems} />
            <SuggestionMenuController triggerCharacter="@" getItems={citeItems} />
          </BlockNoteView>
        </div>

        <ReferencesPanel refs={meta.references} citeOrder={meta.citeOrder} onChange={setReferences} />
      </div>

      {showSettings && (
        <SettingsPanel
          post={post}
          onChange={update}
          onClose={() => setShowSettings(false)}
          onDelete={onDelete}
          onGenerate={async () => {
            if (await aiFill({ summary: true })) await flush()
          }}
          onSuggestTags={async () => {
            if (await aiFill({ tags: true })) await flush()
          }}
          onSeriesChange={async seriesId => {
            const prev = post.series
            update({ series: seriesId, seriesOrder: null }) // null, not undefined: must clear in Firestore
            await flush()
            await Promise.all([refreshSeriesListed(prev), refreshSeriesListed(seriesId)]).catch(console.warn)
          }}
          generating={generating}
          genError={genError}
        />
      )}
    </div>
  )
}
