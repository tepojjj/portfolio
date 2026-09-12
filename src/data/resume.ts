import type { ResumeDraft } from '@/lib/types'

/** Shown until Supabase is configured/seeded, or if the `site_resume` row
 * can't be reached. Plain, single-column, ATS-friendly content — edit the
 * real version from the admin panel instead of this file once it's set up. */
export const fallbackResume: ResumeDraft = {
  full_name: 'Jopet Pallarcon',
  title: 'Web Developer / Data Analyst / Automation Enthusiast',
  email: 'hello@jet-dev.com',
  phone: '+63 900 000 0000',
  location: 'Philippines',
  linkedin: 'linkedin.com/in/jet-dev',
  summary:
    'Web developer and data analyst who builds automation systems that turn complex operations into simple, reliable products. Comfortable across the stack, from React front ends to backend APIs and spreadsheet-based automation.',
  skills: [
    'React',
    'TypeScript',
    'Python',
    'Node.js / Express',
    'Lark Base',
    'Google Apps Script',
    'Data Analysis',
    'Process Automation',
  ],
  experience: [
    {
      position: 'Web Developer & Operations Systems Lead',
      company: 'UBEST',
      date: 'Present',
      bullets: [
        'Manage inventory data, store data, and internal tooling across approximately 65 stores',
        'Build and maintain React web apps and backend APIs for warehouse and retail operations',
        'Design formulas and automation inside the Lark/Feishu Base ecosystem',
        'Reconcile inventory data between Lark Base and Excel master files',
        'Automated floor and zone assignment for approximately 62,000 product rows across 64 stores',
        'Replaced manual reconciliation and reporting workflows with self-serve tools',
      ],
    },
  ],
  education: [],
}
