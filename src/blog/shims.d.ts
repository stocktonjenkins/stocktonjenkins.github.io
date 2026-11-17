// CRA pins TypeScript's moduleResolution to "node", which ignores package.json
// "exports" subpaths. Point the @blocknote/core subpaths (used by our code and
// by BlockNote's own typings) at their bundled .d.ts files.
declare module '@blocknote/core/locales' {
  export * from '@blocknote/core/types/src/i18n/index'
}
declare module '@blocknote/core/extensions' {
  export * from '@blocknote/core/types/src/extensions/index'
}
declare module '@blocknote/core/comments' {
  export * from '@blocknote/core/types/src/comments/index'
}
declare module '@shikijs/langs/*' {
  const lang: any
  export default lang
}
declare module '@shikijs/themes/*' {
  const theme: any
  export default theme
}
