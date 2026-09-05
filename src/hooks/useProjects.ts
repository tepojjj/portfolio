import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { fallbackProjects, type Project } from '@/data/projects'
import type { DbProject } from '@/lib/types'

function toProject(row: DbProject): Project {
  return {
    id: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    image: row.image,
    tech: row.tech,
    features: row.features,
    problem: row.problem,
    solution: row.solution,
    architecture: row.architecture,
    challenges: row.challenges,
    results: row.results,
    github: row.github ?? undefined,
    demo: row.demo ?? undefined,
    accent: row.accent,
  }
}

/** Loads the public project list from Supabase, falling back to the static
 * bundled list if Supabase isn't configured, the table is empty, or the
 * request fails. This keeps the portfolio section working even before the
 * admin panel has been set up. */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (cancelled) return

      if (!error && data && data.length > 0) {
        setProjects((data as DbProject[]).map(toProject))
      }
      // On error or empty table, keep showing fallbackProjects.
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { projects, loading }
}
