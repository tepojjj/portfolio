import type { ExperienceEntry } from '@/data/experience'
import type { ResumeExperienceItem } from '@/lib/types'

/**
 * Converts Experience-section timeline entries into resume bullets, so the
 * resume's Experience section always mirrors whatever is in the Experience
 * tab/table instead of needing to be entered a second time.
 *
 * - Responsibilities and achievements are merged into one bullet list.
 * - Placeholder entries (the "Add your earlier role" filler row) are
 *   skipped — they're a prompt for the admin, not real resume content.
 */
export function experienceToResumeItems(entries: ExperienceEntry[]): ResumeExperienceItem[] {
  return entries
    .filter((entry) => !entry.placeholder)
    .map((entry) => ({
      position: entry.position,
      company: entry.company,
      date: entry.date,
      bullets: [...entry.responsibilities, ...entry.achievements],
    }))
}
