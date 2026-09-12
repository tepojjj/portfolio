import { useState, type FormEvent } from 'react'
import type { ExperienceDraft } from '@/lib/types'
import { emptyExperienceDraft } from '@/lib/types'

interface ExperienceFormProps {
  initial?: ExperienceDraft
  submitLabel: string
  onCancel: () => void
  onSubmit: (draft: ExperienceDraft) => Promise<void>
}

const fieldClass =
  'w-full bg-surface-raised border border-border px-3 py-2.5 text-sm text-text-high outline-none focus:border-teal transition-colors'
const labelClass = 'block font-mono text-xs text-text-low mb-2'

export function ExperienceForm({ initial, submitLabel, onCancel, onSubmit }: ExperienceFormProps) {
  const [draft, setDraft] = useState<ExperienceDraft>(initial ?? emptyExperienceDraft)
  const [responsibilitiesInput, setResponsibilitiesInput] = useState(
    (initial?.responsibilities ?? []).join('\n')
  )
  const [techInput, setTechInput] = useState((initial?.tech ?? []).join(', '))
  const [achievementsInput, setAchievementsInput] = useState((initial?.achievements ?? []).join('\n'))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof ExperienceDraft>(key: K, value: ExperienceDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const finalDraft: ExperienceDraft = {
      ...draft,
      responsibilities: responsibilitiesInput
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      tech: techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      achievements: achievementsInput
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean),
    }

    if (!finalDraft.position.trim() || !finalDraft.company.trim()) {
      setError('Position and company are required.')
      return
    }

    setSaving(true)
    try {
      await onSubmit(finalDraft)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong saving this entry.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-border p-6 space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Position</label>
          <input
            required
            className={fieldClass}
            value={draft.position}
            onChange={(e) => set('position', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Company</label>
          <input
            required
            className={fieldClass}
            value={draft.company}
            onChange={(e) => set('company', e.target.value)}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Date label (e.g. "Present", "2022 - 2024")</label>
          <input className={fieldClass} value={draft.date} onChange={(e) => set('date', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Sort order (lower shows first)</label>
          <input
            type="number"
            className={fieldClass}
            value={draft.sort_order}
            onChange={(e) => set('sort_order', Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Responsibilities (one per line)</label>
        <textarea
          rows={4}
          className={fieldClass}
          value={responsibilitiesInput}
          onChange={(e) => setResponsibilitiesInput(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Achievements (one per line, optional)</label>
        <textarea
          rows={3}
          className={fieldClass}
          value={achievementsInput}
          onChange={(e) => setAchievementsInput(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Tech (comma-separated, optional)</label>
        <input
          className={fieldClass}
          placeholder="React, Python, Lark Base"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-text-mid">
        <input
          type="checkbox"
          checked={draft.placeholder}
          onChange={(e) => set('placeholder', e.target.checked)}
          className="accent-teal"
        />
        Placeholder entry (shows only the first responsibility line, italicized)
      </label>

      {error && <p className="text-status-remove text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-teal text-canvas text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-border text-sm text-text-mid hover:text-text-high hover:border-teal transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
