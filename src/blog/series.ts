import { Post } from './types'

/**
 * Pure helpers for series ordering. Numbering is derived from position among
 * the *published* posts, so drafts never leave gaps ("Part 1, Part 3").
 * A manual `seriesOrder` sorts first; posts without one follow by publish date.
 */

export function seriesSort(a: Post, b: Post): number {
  const ao = a.seriesOrder ?? Number.POSITIVE_INFINITY
  const bo = b.seriesOrder ?? Number.POSITIVE_INFINITY
  if (ao !== bo) return ao - bo
  return (a.publishedAt ?? a.createdAt) - (b.publishedAt ?? b.createdAt)
}

/** Published posts of a series, in reading order. */
export function seriesParts(posts: Post[], seriesId: string): Post[] {
  return posts.filter(p => p.published && p.series === seriesId).sort(seriesSort)
}

export interface SeriesPosition {
  parts: Post[]
  /** 1-based part number of `post`, or 0 if it is not a published part. */
  part: number
  prev: Post | null
  next: Post | null
}

export function seriesPosition(posts: Post[], post: Post): SeriesPosition | null {
  if (!post.series) return null
  const parts = seriesParts(posts, post.series)
  const i = parts.findIndex(p => p.id === post.id)
  return {
    parts,
    part: i + 1,
    prev: i > 0 ? parts[i - 1] : null,
    next: i >= 0 && i < parts.length - 1 ? parts[i + 1] : null,
  }
}
