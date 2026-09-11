import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { fallbackContact, type ContactInfo } from '@/data/contact'
import type { DbSiteContact } from '@/lib/types'

function toContactInfo(row: DbSiteContact): ContactInfo {
  return { email: row.email, phone: row.phone, linkedin: row.linkedin }
}

/** Loads contact info (email/phone/LinkedIn) from Supabase, falling back to
 * the static bundled defaults if Supabase isn't configured, the row is
 * missing, or the request fails. Mirrors useProjects. */
export function useSiteContact() {
  const [contact, setContact] = useState<ContactInfo>(fallbackContact)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('site_contact')
        .select('*')
        .eq('id', 1)
        .maybeSingle()

      if (cancelled) return

      if (!error && data) {
        setContact(toContactInfo(data as DbSiteContact))
      }
      // On error or missing row, keep showing fallbackContact.
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { contact, loading }
}
