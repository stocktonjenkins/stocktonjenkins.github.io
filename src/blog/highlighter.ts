import type { CodeBlockOptions } from '@blocknote/core'
import { SyntaxHighlightingExtension } from '@blocknote/core/extensions'
import { createBundledHighlighter } from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'

/*
 * Same idea as @blocknote/code-block, but loads Shiki's raw grammars
 * (@shikijs/langs) instead of the precompiled ones. The precompiled grammars
 * contain regex literals like /\p{space}/dgu that CRA's webpack parser rejects;
 * raw grammars are compiled to RegExp at runtime instead. Each language is its
 * own lazily loaded chunk.
 */
const langs: Record<string, () => Promise<any>> = {
  python: () => import('@shikijs/langs/python'),
  bash: () => import('@shikijs/langs/shellscript'),
  typescript: () => import('@shikijs/langs/typescript'),
  tsx: () => import('@shikijs/langs/tsx'),
  javascript: () => import('@shikijs/langs/javascript'),
  json: () => import('@shikijs/langs/json'),
  yaml: () => import('@shikijs/langs/yaml'),
  toml: () => import('@shikijs/langs/toml'),
  latex: () => import('@shikijs/langs/latex'),
  bibtex: () => import('@shikijs/langs/bibtex'),
  markdown: () => import('@shikijs/langs/markdown'),
  html: () => import('@shikijs/langs/html'),
  css: () => import('@shikijs/langs/css'),
  sql: () => import('@shikijs/langs/sql'),
  c: () => import('@shikijs/langs/c'),
  cpp: () => import('@shikijs/langs/cpp'),
  rust: () => import('@shikijs/langs/rust'),
  go: () => import('@shikijs/langs/go'),
  java: () => import('@shikijs/langs/java'),
  julia: () => import('@shikijs/langs/julia'),
  diff: () => import('@shikijs/langs/diff'),
  dockerfile: () => import('@shikijs/langs/docker'),
}

const createHighlighter = createBundledHighlighter<string, string>({
  langs,
  themes: {
    'github-dark': () => import('@shikijs/themes/github-dark'),
    'github-light': () => import('@shikijs/themes/github-light'),
  },
  engine: () => createJavaScriptRegexEngine({ forgiving: true }),
})

export const syntaxHighlighter = SyntaxHighlightingExtension({
  createHighlighter: () => createHighlighter({ themes: ['github-dark', 'github-light'], langs: [] }) as any,
})

const L = (name: string, ...aliases: string[]) => ({ name, aliases })

export const codeBlockOptions = {
  defaultLanguage: 'python',
  supportedLanguages: {
    text: L('Plain text', 'text', 'txt', 'plain'),
    python: L('Python', 'python', 'py'),
    bash: L('Shell', 'bash', 'sh', 'shell', 'zsh'),
    typescript: L('TypeScript', 'typescript', 'ts'),
    tsx: L('TSX', 'tsx'),
    javascript: L('JavaScript', 'javascript', 'js'),
    json: L('JSON', 'json'),
    yaml: L('YAML', 'yaml', 'yml'),
    toml: L('TOML', 'toml'),
    latex: L('LaTeX', 'latex', 'tex'),
    bibtex: L('BibTeX', 'bibtex', 'bib'),
    markdown: L('Markdown', 'markdown', 'md'),
    html: L('HTML', 'html'),
    css: L('CSS', 'css'),
    sql: L('SQL', 'sql'),
    c: L('C', 'c'),
    cpp: L('C++', 'cpp', 'c++'),
    rust: L('Rust', 'rust', 'rs'),
    go: L('Go', 'go'),
    java: L('Java', 'java'),
    julia: L('Julia', 'julia', 'jl'),
    diff: L('Diff', 'diff'),
    dockerfile: L('Dockerfile', 'dockerfile', 'docker'),
  },
} satisfies CodeBlockOptions
