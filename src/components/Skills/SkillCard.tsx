import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { SkillCategory } from '@/data/skills'

interface SkillCardProps {
  category: SkillCategory
  icon: LucideIcon
  accent: string
  background?: string
}

export function SkillCard({ category, icon: Icon, accent, background }: SkillCardProps) {
  return (
    <motion.div
      className="group relative rounded-2xl border border-border bg-surface overflow-hidden"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      data-cursor="interactive"
    >
      {/* Photo banner, fading into the solid card below */}
      {background && (
        <div className="relative h-36 w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${background})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(21,48,31,0) 0%, rgba(21,48,31,0.55) 60%, #15301f 96%)',
            }}
          />
        </div>
      )}

      {/* Glow on hover */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{ background: accent }}
      />

      <div className={`relative px-7 pb-7 ${background ? '-mt-6' : 'pt-7'}`}>
        <div
          className="w-11 h-11 flex items-center justify-center rounded-lg border backdrop-blur-sm bg-surface/85 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
          style={{ borderColor: accent, color: accent }}
        >
          <Icon size={20} />
        </div>

        <h3 className="mt-5 font-display text-xl text-text-high">{category.title}</h3>
        <p className="mt-2 text-sm text-text-mid">{category.description}</p>

        <div className="mt-5 flex flex-wrap gap-1.5 max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-400 ease-out overflow-hidden">
          {category.skills.map((skill) => (
            <span
              key={skill}
              className="font-mono text-[11px] px-2 py-1 border border-border-soft text-text-mid"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
