import type { LucideIcon } from 'lucide-react'
import {
  Warehouse,
  BarChart3,
  ScanSearch,
  ListChecks,
  RefreshCw,
  Boxes,
} from 'lucide-react'
import type { Project } from '@/data/projects'

/** True when `image` is an actual uploaded/linked image rather than the old
 * placeholder-key strings ('reconciliation', 'console', etc.) some fallback
 * data still carries. */
export function hasRealImage(image: string | undefined | null): image is string {
  if (!image) return false
  return (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('/') ||
    image.startsWith('data:')
  )
}

/** Ordered keyword -> icon rules, checked against the project's name, tagline,
 * and tech stack combined. First match wins, so put more specific rules first. */
const rules: Array<{ icon: LucideIcon; keywords: string[] }> = [
  { icon: Warehouse, keywords: ['warehouse', 'lark base api', 'label'] },
  { icon: BarChart3, keywords: ['analytics', 'looker', 'ga4', 'dashboard revenue', 'sql'] },
  { icon: ScanSearch, keywords: ['ocr', 'matching', 'import', 'fuzzy'] },
  { icon: RefreshCw, keywords: ['reconciliation', 'reconcile', 'sync'] },
  { icon: ListChecks, keywords: ['classifier', 'csv', 'keep', 'watch', 'reduce'] },
]

/** Falls back to a generic "project" icon when nothing more specific matches. */
export function getProjectIcon(project: Project): LucideIcon {
  const haystack = [project.name, project.tagline, ...(project.tech ?? [])]
    .join(' ')
    .toLowerCase()

  for (const rule of rules) {
    if (rule.keywords.some((k) => haystack.includes(k))) return rule.icon
  }
  return Boxes
}
