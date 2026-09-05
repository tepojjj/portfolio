export type Accent = 'teal' | 'amber'

/** Row shape as stored in the Supabase `projects` table. */
export interface DbProject {
  id: string // uuid, primary key
  slug: string
  name: string
  tagline: string
  description: string
  image: string
  tech: string[]
  features: string[]
  problem: string
  solution: string
  architecture: string
  challenges: string
  results: string
  github: string | null
  demo: string | null
  accent: Accent
  sort_order: number
  created_at: string
  updated_at: string
}

/** Fields the admin form edits. `slug` doubles as the public project id. */
export type ProjectDraft = Omit<DbProject, 'id' | 'created_at' | 'updated_at'>

export const emptyDraft: ProjectDraft = {
  slug: '',
  name: '',
  tagline: '',
  description: '',
  image: '',
  tech: [],
  features: [],
  problem: '',
  solution: '',
  architecture: '',
  challenges: '',
  results: '',
  github: '',
  demo: '',
  accent: 'teal',
  sort_order: 0,
}
