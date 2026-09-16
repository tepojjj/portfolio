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
      className="group relative bg-surface border border-border p-7 overflow-hidden"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      data-cursor="interactive"
    >
      {/* Background texture — mask so it tints with this card's accent color */}
      {background && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14] group-hover:opacity-[0.28] transition-opacity duration-500"
          style={{
            backgroundColor: accent,
            WebkitMaskImage: `url(${background})`,
            maskImage: `url(${background})`,
            WebkitMaskSize: 'cover',
            maskSize: 'cover',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        />
      )}

      {/* Glow on hover */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{ background: accent }}
      />

      <div className="relative">
        <div
          className="w-11 h-11 flex items-center justify-center border transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
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
