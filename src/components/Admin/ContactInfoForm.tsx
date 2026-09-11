import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { emptyContactDraft, type ContactDraft, type DbSiteContact } from '@/lib/types'

const fieldClass =
  'w-full bg-surface-raised border border-border px-3 py-2.5 text-sm text-text-high outline-none focus:border-teal transition-colors'
const labelClass = 'block font-mono text-xs text-text-low mb-2'

export function ContactInfoForm() {
  const [draft, setDraft] = useState<ContactDraft>(emptyContactDraft)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error: fetchError } = await supabase
        .from('site_contact')
        .select('*')
        .eq('id', 1)
        .maybeSingle()

      if (cancelled) return

      if (fetchError) setError(fetchError.message)
      else if (data) {
        const row = data as DbSiteContact
        setDraft({ email: row.email, phone: row.phone, linkedin: row.linkedin })
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const set = <K extends keyof ContactDraft>(key: K, value: ContactDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const { error: saveError } = await supabase.from('site_contact').upsert({ id: 1, ...draft })
    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    setSaved(true)
  }

  if (loading) return <p className="text-text-mid text-sm">Loading…</p>

  return (
    <div className="bg-surface border border-border p-6 max-w-xl">
      <p className="text-text-mid text-sm mb-6">
        Powers the Email / Phone / LinkedIn cards in the Contact section on the live site.
      </p>

      <div className="space-y-5">
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={draft.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="hello@example.com"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            value={draft.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+63 900 000 0000"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>LinkedIn</label>
          <input
            type="text"
            value={draft.linkedin}
            onChange={(e) => set('linkedin', e.target.value)}
            placeholder="linkedin.com/in/username"
            className={fieldClass}
          />
        </div>
      </div>

      {error && <p className="text-status-remove text-sm mt-4">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 bg-teal text-canvas text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-60"
      >
        <Save size={15} />
        {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
      </button>
    </div>
  )
}
