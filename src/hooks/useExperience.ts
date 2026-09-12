import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { experience as fallbackExperience, type ExperienceEntry } from '@/data/experience'
import type { DbExperience } from '@/lib/types'

function toEntry(row: DbExperience): ExperienceEntry {
  return {
    id: row.id,
    date: row.date,
    position: row.position,
    company: row.company,
    responsibilities: row.responsibilities,
    tech: row.tech,
    achievements: row.achievements,
    placeholder: row.placeholder,
  }
}

/** Loads the timeline shown in the Experience section from Supabase, falling
 * back to the static bundled list if Supabase isn't configured, the table is
 * empty, or the request fails. Mirrors useProjects / useSiteContact. */
export function useExperience() {
  const [experience, setExperience] = useState<ExperienceEntry[]>(fallbackExperience)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (cancelled) return

      if (!error && data && data.length > 0) {
        setExperience((data as DbExperience[]).map(toEntry))
      }
      // On error or empty table, keep showing fallbackExperience.
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { experience, loading }
}
