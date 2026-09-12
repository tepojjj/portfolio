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
  education: [
    {
      degree: 'Add your degree',
      school: 'Add your school',
      date: 'Add dates',
      details: 'Add your field of study, honors, or relevant coursework — or remove this entry if not applicable.',
    },
  ],
}
