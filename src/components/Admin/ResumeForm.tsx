import { useEffect, useState } from 'react'
import { Save, Download, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { emptyResumeDraft, type DbSiteResume, type ResumeDraft } from '@/lib/types'
import { generateResumePdf } from '@/utils/generateResumePdf'

const fieldClass =
  'w-full bg-surface-raised border border-border px-3 py-2.5 text-sm text-text-high outline-none focus:border-teal transition-colors'
const labelClass = 'block font-mono text-xs text-text-low mb-2'

// Editable rows keep bullets/details as a single textarea string; converted
// to arrays only when saving/generating the PDF.
interface ExperienceRow {
  position: string
  company: string
  date: string
  bulletsText: string
}
interface EducationRow {
  degree: string
  school: string
  date: string
  details: string
}

function toExperienceRows(experience: ResumeDraft['experience']): ExperienceRow[] {
  return experience.map((e) => ({
    position: e.position,
    company: e.company,
    date: e.date,
    bulletsText: e.bullets.join('\n'),
  }))
}

function fromExperienceRows(rows: ExperienceRow[]): ResumeDraft['experience'] {
  return rows.map((r) => ({
    position: r.position,
    company: r.company,
    date: r.date,
    bullets: r.bulletsText
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean),
  }))
}

export function ResumeForm() {
  const [draft, setDraft] = useState<ResumeDraft>(emptyResumeDraft)
  const [skillsInput, setSkillsInput] = useState('')
  const [experienceRows, setExperienceRows] = useState<ExperienceRow[]>([])
  const [educationRows, setEducationRows] = useState<EducationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error: fetchError } = await supabase
        .from('site_resume')
        .select('*')
        .eq('id', 1)
        .maybeSingle()

      if (cancelled) return

      if (fetchError) setError(fetchError.message)
      else if (data) {
        const row = data as DbSiteResume
        const nextDraft: ResumeDraft = {
          full_name: row.full_name,
          title: row.title,
          email: row.email,
          phone: row.phone,
          location: row.location,
          linkedin: row.linkedin,
          summary: row.summary,
          skills: row.skills,
          experience: row.experience,
          education: row.education,
        }
        setDraft(nextDraft)
        setSkillsInput(row.skills.join(', '))
        setExperienceRows(toExperienceRows(row.experience))
        setEducationRows(row.education)
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const set = <K extends keyof ResumeDraft>(key: K, value: ResumeDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setSaved(false)
  }

  const buildFinalDraft = (): ResumeDraft => ({
    ...draft,
    skills: skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    experience: fromExperienceRows(experienceRows),
    education: educationRows,
  })

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const finalDraft = buildFinalDraft()
    const { error: saveError } = await supabase.from('site_resume').upsert({ id: 1, ...finalDraft })
    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    setDraft(finalDraft)
    setSaved(true)
  }

  const handleDownloadPdf = () => {
    generateResumePdf(buildFinalDraft())
  }

  const addExperienceRow = () =>
    setExperienceRows((rows) => [...rows, { position: '', company: '', date: '', bulletsText: '' }])
  const updateExperienceRow = (index: number, patch: Partial<ExperienceRow>) =>
    setExperienceRows((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  const removeExperienceRow = (index: number) =>
    setExperienceRows((rows) => rows.filter((_, i) => i !== index))

  const addEducationRow = () =>
    setEducationRows((rows) => [...rows, { degree: '', school: '', date: '', details: '' }])
  const updateEducationRow = (index: number, patch: Partial<EducationRow>) =>
    setEducationRows((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  const removeEducationRow = (index: number) =>
    setEducationRows((rows) => rows.filter((_, i) => i !== index))

  if (loading) return <p className="text-text-mid text-sm">Loading…</p>

  return (
    <div className="bg-surface border border-border p-6 max-w-3xl space-y-8">
      <div>
        <p className="text-text-mid text-sm">
          Powers the "View Resume" page on the live site. Keep it plain — single column, standard
          headings, no tables or graphics — so it stays readable by applicant tracking systems.
        </p>
      </div>

      <div className="space-y-5">
        <p className="font-mono text-xs uppercase tracking-wider text-text-low">Header</p>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Full name</label>
            <input className={fieldClass} value={draft.full_name} onChange={(e) => set('full_name', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Title / headline</label>
            <input className={fieldClass} value={draft.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={fieldClass}
              value={draft.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={fieldClass} value={draft.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input className={fieldClass} value={draft.location} onChange={(e) => set('location', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input className={fieldClass} value={draft.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-text-low mb-3">Summary</p>
        <textarea
          rows={3}
          className={fieldClass}
          value={draft.summary}
          onChange={(e) => set('summary', e.target.value)}
        />
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-text-low mb-3">Skills (comma-separated)</p>
        <input
          className={fieldClass}
          placeholder="React, TypeScript, Python"
          value={skillsInput}
          onChange={(e) => {
            setSkillsInput(e.target.value)
            setSaved(false)
          }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-xs uppercase tracking-wider text-text-low">Experience</p>
          <button
            type="button"
            onClick={addExperienceRow}
            className="inline-flex items-center gap-1.5 text-xs text-teal hover:text-teal/80 transition-colors"
          >
            <Plus size={14} /> Add role
          </button>
        </div>
        <div className="space-y-4">
          {experienceRows.length === 0 && (
            <p className="text-text-low text-sm italic">No roles yet — add one above.</p>
          )}
          {experienceRows.map((row, index) => (
            <div key={index} className="border border-border-soft p-4 space-y-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeExperienceRow(index)}
                  className="text-text-low hover:text-status-remove transition-colors"
                  aria-label="Remove role"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  className={fieldClass}
                  placeholder="Position"
                  value={row.position}
                  onChange={(e) => {
                    updateExperienceRow(index, { position: e.target.value })
                    setSaved(false)
                  }}
                />
                <input
                  className={fieldClass}
                  placeholder="Company"
                  value={row.company}
                  onChange={(e) => {
                    updateExperienceRow(index, { company: e.target.value })
                    setSaved(false)
                  }}
                />
              </div>
              <input
                className={fieldClass}
                placeholder="Date (e.g. Present, 2022 - 2024)"
                value={row.date}
                onChange={(e) => {
                  updateExperienceRow(index, { date: e.target.value })
                  setSaved(false)
                }}
              />
              <textarea
                rows={4}
                className={fieldClass}
                placeholder="Bullets, one per line"
                value={row.bulletsText}
                onChange={(e) => {
                  updateExperienceRow(index, { bulletsText: e.target.value })
                  setSaved(false)
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-xs uppercase tracking-wider text-text-low">Education (optional)</p>
          <button
            type="button"
            onClick={addEducationRow}
            className="inline-flex items-center gap-1.5 text-xs text-teal hover:text-teal/80 transition-colors"
          >
            <Plus size={14} /> Add entry
          </button>
        </div>
        <div className="space-y-4">
          {educationRows.map((row, index) => (
            <div key={index} className="border border-border-soft p-4 space-y-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeEducationRow(index)}
                  className="text-text-low hover:text-status-remove transition-colors"
                  aria-label="Remove entry"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  className={fieldClass}
                  placeholder="Degree"
                  value={row.degree}
                  onChange={(e) => {
                    updateEducationRow(index, { degree: e.target.value })
                    setSaved(false)
                  }}
                />
                <input
                  className={fieldClass}
                  placeholder="School"
                  value={row.school}
                  onChange={(e) => {
                    updateEducationRow(index, { school: e.target.value })
                    setSaved(false)
                  }}
                />
              </div>
              <input
                className={fieldClass}
                placeholder="Date"
                value={row.date}
                onChange={(e) => {
                  updateEducationRow(index, { date: e.target.value })
                  setSaved(false)
                }}
              />
              <input
                className={fieldClass}
                placeholder="Details (optional)"
                value={row.details}
                onChange={(e) => {
                  updateEducationRow(index, { details: e.target.value })
                  setSaved(false)
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-status-remove text-sm">{error}</p>}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal text-canvas text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-60"
        >
          <Save size={15} />
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
        </button>
        <button
          onClick={handleDownloadPdf}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-sm text-text-mid hover:text-text-high hover:border-teal transition-colors"
        >
          <Download size={15} /> Download PDF
        </button>
      </div>
    </div>
  )
}
