export interface SkillCategory {
  id: string
  title: string
  description: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Interfaces people who are not technical can actually use.',
    skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Three.js', 'HTML / CSS'],
  },
  {
    id: 'backend',
    title: 'Backend',
    description: 'APIs and services that broker access to operational data safely.',
    skills: ['Node.js', 'Express', 'REST APIs', 'OAuth', 'Google Apps Script'],
  },
  {
    id: 'data',
    title: 'Data Analytics',
    description: 'Turning exports and events into numbers people trust.',
    skills: ['Python', 'Pandas', 'SQL', 'Excel', 'Looker Studio', 'GA4'],
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'Removing the manual, repetitive steps between systems.',
    skills: ['Python Automation', 'Fuzzy Matching', 'API Automation', 'Workflow Automation'],
  },
  {
    id: 'ops-platforms',
    title: 'No-Code & Ops Platforms',
    description: 'Where retail and warehouse operations actually live day to day.',
    skills: ['Lark / Feishu Base', 'AppSheet', 'Teable'],
  },
]
