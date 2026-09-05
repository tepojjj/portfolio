import { useState, type FormEvent } from 'react'
import type { ProjectDraft } from '@/lib/types'
import { emptyDraft } from '@/lib/types'
import { slugify } from '@/utils/slugify'

interface ProjectFormProps {
  initial?: ProjectDraft
  submitLabel: string
  onCancel: () => void
  onSubmit: (draft: ProjectDraft) => Promise<void>
}

const fieldClass =
  'w-full bg-surface-raised border border-border px-3 py-2.5 text-sm text-text-high outline-none focus:border-teal transition-colors'
const labelClass = 'block font-mono text-xs text-text-low mb-2'

export function ProjectForm({ initial, submitLabel, onCancel, onSubmit }: ProjectFormProps) {
  const [draft, setDraft] = useState<ProjectDraft>(initial ?? emptyDraft)
  const [techInput, setTechInput] = useState((initial?.tech ?? []).join(', '))
  const [featuresInput, setFeaturesInput] = useState((initial?.features ?? []).join('\n'))
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const handleNameChange = (name: string) => {
    set('name', name)
    if (!slugTouched) set('slug', slugify(name))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const finalDraft: ProjectDraft = {
      ...draft,
      tech: techInput.split(',').map((t) => t.trim()).filter(Boolean),
      features: featuresInput.split('\n').map((f) => f.trim()).filter(Boolean),
      github: draft.github?.trim() || null,
      demo: draft.demo?.trim() || null,
    }

    if (!finalDraft.slug) {
      setError('Slug is required — it becomes the project URL fragment.')
      return
    }

    setSaving(true)
    try {
      await onSubmit(finalDraft)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong saving this project.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-border p-6 space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Name</label>
          <input
            required
            className={fieldClass}
            value={draft.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Slug (URL-safe id)</label>
          <input
            required
            className={fieldClass}
            value={draft.slug}
            onChange={(e) => {
              setSlugTouched(true)
              set('slug', slugify(e.target.value))
            }}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tagline</label>
        <input
          required
          className={fieldClass}
          value={draft.tagline}
          onChange={(e) => set('tagline', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Description (card summary)</label>
        <textarea
          required
          rows={2}
          className={fieldClass}
          value={draft.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Tech (comma-separated)</label>
          <input
            className={fieldClass}
            placeholder="React, Supabase, TypeScript"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Accent color</label>
          <select
            className={fieldClass}
            value={draft.accent}
            onChange={(e) => set('accent', e.target.value as ProjectDraft['accent'])}
          >
            <option value="teal">Teal</option>
            <option value="amber">Amber</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Features (one per line)</label>
        <textarea
          rows={4}
          className={fieldClass}
          value={featuresInput}
          onChange={(e) => setFeaturesInput(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Problem</label>
          <textarea
            rows={3}
            className={fieldClass}
            value={draft.problem}
            onChange={(e) => set('problem', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Solution</label>
          <textarea
            rows={3}
            className={fieldClass}
            value={draft.solution}
            onChange={(e) => set('solution', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Architecture</label>
          <textarea
            rows={3}
            className={fieldClass}
            value={draft.architecture}
            onChange={(e) => set('architecture', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Challenges</label>
          <textarea
            rows={3}
            className={fieldClass}
            value={draft.challenges}
            onChange={(e) => set('challenges', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Results</label>
        <textarea
          rows={2}
          className={fieldClass}
          value={draft.results}
          onChange={(e) => set('results', e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>GitHub URL (optional)</label>
          <input
            className={fieldClass}
            value={draft.github ?? ''}
            onChange={(e) => set('github', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Live demo URL (optional)</label>
          <input
            className={fieldClass}
            value={draft.demo ?? ''}
            onChange={(e) => set('demo', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Sort order</label>
          <input
            type="number"
            className={fieldClass}
            value={draft.sort_order}
            onChange={(e) => set('sort_order', Number(e.target.value))}
          />
        </div>
      </div>

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
