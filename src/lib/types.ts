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
  preview_urls: string[] | null
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
  preview_urls: [],
  accent: 'teal',
  sort_order: 0,
}

/** Row shape as stored in the Supabase `experience` table. */
export interface DbExperience {
  id: string // uuid, primary key
  date: string
  position: string
  company: string
  responsibilities: string[]
  tech: string[]
  achievements: string[]
  placeholder: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

/** Fields the admin form edits. */
export type ExperienceDraft = Omit<DbExperience, 'id' | 'created_at' | 'updated_at'>

export const emptyExperienceDraft: ExperienceDraft = {
  date: '',
  position: '',
  company: '',
  responsibilities: [],
  tech: [],
  achievements: [],
  placeholder: false,
  sort_order: 0,
}

/** Row shape as stored in the Supabase `site_contact` table (single row, id = 1). */
export interface DbSiteContact {
  id: number
  email: string
  phone: string
  linkedin: string
  updated_at: string
}

/** Fields the admin form edits. */
export type ContactDraft = Omit<DbSiteContact, 'id' | 'updated_at'>

export const emptyContactDraft: ContactDraft = {
  email: '',
  phone: '',
  linkedin: '',
}

/** Row shape as stored in the Supabase `messages` table — one row per contact
 * form submission from a site visitor. */
export interface DbMessage {
  id: string // uuid, primary key
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

/** One role inside the resume's experience list. Kept as plain jsonb rather
 * than a separate table since the resume is a single self-contained document. */
export interface ResumeExperienceItem {
  position: string
  company: string
  date: string
  bullets: string[]
}

/** One entry inside the resume's education list. */
export interface ResumeEducationItem {
  degree: string
  school: string
  date: string
  details: string
}

/** Row shape as stored in the Supabase `site_resume` table (single row, id = 1).
 * Contact/summary/skills/education are self-contained here, but the experience
 * section is intentionally NOT stored on this row — it's synced live from the
 * `experience` table (the same one the Experience tab edits) so a role never
 * needs to be entered twice. See utils/experienceToResume.ts. */
export interface DbSiteResume {
  id: number
  full_name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  summary: string
  skills: string[]
  education: ResumeEducationItem[]
  updated_at: string
}

/** Fields the admin form edits. */
export type ResumeDraft = Omit<DbSiteResume, 'id' | 'updated_at'>

export const emptyResumeDraft: ResumeDraft = {
  full_name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  summary: '',
  skills: [],
  education: [],
}
