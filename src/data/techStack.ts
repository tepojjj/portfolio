import type { ComponentType } from 'react'
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiHtml5,
  SiCss,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiTailwindcss,
  SiThreedotjs,
  SiPostgresql,
  SiMysql,
  SiSupabase,
  SiGooglesheets,
  SiLooker,
  SiGoogleanalytics,
  SiGoogleappsscript,
} from 'react-icons/si'
import { Database } from 'lucide-react'
import larkLogo from '@/assets/logos/lark.svg'
import shadowbotLogo from '@/assets/logos/shadowbot.svg'

/** A tech/tool badge shown in the marquee. Prefer `Icon` (an official brand
 * mark from react-icons/simple-icons) where one exists; fall back to a
 * bundled `image` asset for brands simple-icons doesn't carry (Lark,
 * ShadowBot), or to a generic lucide `Icon` for non-branded terms (SQL). */
export interface TechItem {
  name: string
  Icon?: ComponentType<{ size?: number | string; color?: string; className?: string }>
  image?: string
  color?: string
}

export interface TechCategory {
  id: string
  title: string
  items: TechItem[]
}

export const techStack: TechCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    items: [
      { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
      { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Python', Icon: SiPython, color: '#3776AB' },
      { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', Icon: SiCss, color: '#1572B6' },
      { name: 'SQL', Icon: Database, color: '#6EE7A0' },
    ],
  },
  {
    id: 'frameworks',
    title: 'Frameworks & Libraries',
    items: [
      { name: 'React', Icon: SiReact, color: '#61DAFB' },
      { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
      { name: 'Express', Icon: SiExpress, color: '#EAF5E4' },
      { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#38BDF8' },
      { name: 'Three.js', Icon: SiThreedotjs, color: '#EAF5E4' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases & Data Integration',
    items: [
      { name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1' },
      { name: 'Supabase', Icon: SiSupabase, color: '#3ECF8E' },
      { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
      { name: 'Google Sheets', Icon: SiGooglesheets, color: '#0F9D58' },
      { name: 'Looker Studio', Icon: SiLooker, color: '#4285F4' },
      { name: 'Google Analytics (GA4)', Icon: SiGoogleanalytics, color: '#E37400' },
    ],
  },
  {
    id: 'automation',
    title: 'Automation',
    items: [
      { name: 'Google Apps Script Integration', Icon: SiGoogleappsscript, color: '#4285F4' },
      { name: 'Lark Suite', image: larkLogo },
      { name: 'ShadowBot RPA', image: shadowbotLogo },
    ],
  },
]
