import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { fallbackResume } from '@/data/resume'
import type { DbSiteResume, ResumeDraft } from '@/lib/types'

function toResumeDraft(row: DbSiteResume): ResumeDraft {
  return {
    full_name: row.full_name,
    title: row.title,
    email: row.email,
    phone: row.phone,
    location: row.location,
    linkedin: row.linkedin,
    summary: row.summary,
    skills: row.skills,
    education: row.education,
  }
}

/** Loads the resume shown at /resume (and edited from the admin panel) from
 * Supabase, falling back to the static bundled copy if Supabase isn't
 * configured, the row is missing, or the request fails. Mirrors useSiteContact. */
export function useSiteResume() {
  const [resume, setResume] = useState<ResumeDraft>(fallbackResume)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('site_resume')
        .select('*')
        .eq('id', 1)
        .maybeSingle()

      if (cancelled) return

      if (!error && data) {
        setResume(toResumeDraft(data as DbSiteResume))
      }
      // On error or missing row, keep showing fallbackResume.
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { resume, loading }
}
