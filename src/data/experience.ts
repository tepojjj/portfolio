export interface ExperienceEntry {
  id: string
  date: string
  position: string
  company: string
  responsibilities: string[]
  tech: string[]
  achievements: string[]
  placeholder?: boolean
}

// NOTE: only one role is populated with verified detail. Timelines read best
// with 2-4 entries — duplicate the placeholder entry below with your real
// earlier roles (or remove it if this is your only one) before publishing.
export const experience: ExperienceEntry[] = [
  {
    id: 'ubest-current',
    date: 'Present',
    position: 'Web Developer & Operations Systems Lead',
    company: 'UBEST',
    responsibilities: [
      'Manage inventory data, store data, and internal tooling across ~65 stores',
      'Build and maintain React web apps and backend APIs for warehouse and retail operations',
      'Design formulas and automation inside the Lark/Feishu Base ecosystem',
      'Reconcile inventory data between Lark Base and Excel master files',
    ],
    tech: ['React', 'Python', 'Lark Base', 'Google Apps Script', 'Express'],
    achievements: [
      'Automated floor/zone assignment for ~62,000 product rows across 64 stores',
      'Replaced manual reconciliation and reporting workflows with self-serve tools',
    ],
  },
  {
    id: 'add-your-role',
    date: 'Add dates',
    position: 'Add your earlier role',
    company: 'Add company name',
    responsibilities: ['Duplicate this entry for each earlier role and fill in real detail, or remove it if this is your first role.'],
    tech: [],
    achievements: [],
    placeholder: true,
  },
]
