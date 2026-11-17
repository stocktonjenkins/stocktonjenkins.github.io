import { AiConfig } from './types'

const SYSTEM = `You write the preview blurb shown under a blog post's title in the post list of a
PhD student's research blog (LLM agents, search, retrieval).
Write 2–3 sentences, at most 60 words, plain prose, no markdown, no lists, no emoji.
Say what the post actually argues or shows, concretely. Write in first person, as the author.
Do not open with "This post", "In this post" or the title. Do not hype.`

type PostInput = { title: string; subtitle: string; text: string }

async function callGemini(cfg: AiConfig, system: string, user: string, schema?: object): Promise<string> {
  if (!cfg.geminiKey) throw new Error('Add a Gemini API key in Settings first.')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.model)}:generateContent`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': cfg.geminiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.4,
        ...(schema ? { responseMimeType: 'application/json', responseSchema: schema } : {}),
      },
    }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = json?.error?.message ?? `HTTP ${res.status}`
    if (res.status === 404) throw new Error(`Model "${cfg.model}" not found. ${msg}`)
    throw new Error(`Gemini: ${msg}`)
  }
  const text: string = (json?.candidates?.[0]?.content?.parts ?? [])
    .filter((p: any) => !p.thought)
    .map((p: any) => p.text ?? '')
    .join('')
    .trim()
  if (!text) throw new Error(`Gemini returned no text (${json?.candidates?.[0]?.finishReason ?? 'unknown reason'}).`)
  return text
}

function postPrompt(post: PostInput): string {
  const body = post.text.slice(0, 60000)
  if (body.trim().length < 40) throw new Error('Write a bit more first.')
  return `Title: ${post.title}\nSubtitle: ${post.subtitle}\n\n${body}`
}

/** A 2–3 sentence blurb for the post list. Throws with a readable message on failure. */
export async function generateSummary(cfg: AiConfig, post: PostInput): Promise<string> {
  return (await callGemini(cfg, SYSTEM, postPrompt(post))).replace(/\s+/g, ' ')
}

const TAGS_SYSTEM = `You pick topic tags for a post on a PhD student's research blog (LLM agents, search, retrieval).
Return 2 to 5 tags. Each tag is lowercase, 1 to 3 words joined by hyphens, about a topic a reader would
browse by (e.g. "retrieval", "search-agents", "reinforcement-learning"). Prefer tags from the existing
vocabulary when they fit; only invent a new tag when none fit. No generic tags like "research" or "ai".`

/** Topic tags, normalized and reusing the blog's existing tags where possible. */
export async function generateTags(cfg: AiConfig, post: PostInput, vocabulary: string[]): Promise<string[]> {
  const vocab = vocabulary.length ? `Existing vocabulary: ${vocabulary.join(', ')}\n\n` : ''
  const raw = await callGemini(cfg, TAGS_SYSTEM, vocab + postPrompt(post), {
    type: 'ARRAY',
    items: { type: 'STRING' },
  })
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Gemini returned tags in an unexpected format.')
  }
  if (!Array.isArray(parsed)) throw new Error('Gemini returned tags in an unexpected format.')
  const tags = parsed
    .map(t => String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
    .filter(Boolean)
  return Array.from(new Set(tags)).slice(0, 5)
}
