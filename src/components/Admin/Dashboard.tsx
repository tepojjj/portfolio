import { useCallback, useEffect, useState } from 'react'
import { LogOut, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { DbProject, ProjectDraft, DbExperience, ExperienceDraft } from '@/lib/types'
import { normalizeUrl } from '@/utils/url'
import { ProjectForm } from './ProjectForm'
import { ContactInfoForm } from './ContactInfoForm'
import { ExperienceForm } from './ExperienceForm'
import { ResumeForm } from './ResumeForm'
import { MessagesPanel } from './MessagesPanel'

type ViewState = { mode: 'list' } | { mode: 'create' } | { mode: 'edit'; project: DbProject }
type ExperienceViewState =
  | { mode: 'list' }
  | { mode: 'create' }
  | { mode: 'edit'; entry: DbExperience }
type Tab = 'projects' | 'experience' | 'resume' | 'messages' | 'contact'

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('projects')
  const [projects, setProjects] = useState<DbProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<ViewState>({ mode: 'list' })

  const [experienceEntries, setExperienceEntries] = useState<DbExperience[]>([])
  const [experienceLoading, setExperienceLoading] = useState(true)
  const [experienceError, setExperienceError] = useState<string | null>(null)
  const [experienceView, setExperienceView] = useState<ExperienceViewState>({ mode: 'list' })

  const [unreadMessages, setUnreadMessages] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (fetchError) setError(fetchError.message)
    else setProjects((data as DbProject[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const loadExperience = useCallback(async () => {
    setExperienceLoading(true)
    const { data, error: fetchError } = await supabase
      .from('experience')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (fetchError) setExperienceError(fetchError.message)
    else setExperienceEntries((data as DbExperience[]) ?? [])
    setExperienceLoading(false)
  }, [])

  useEffect(() => {
    loadExperience()
  }, [loadExperience])

  const loadUnreadCount = useCallback(async () => {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false)
    setUnreadMessages(count ?? 0)
  }, [])

  useEffect(() => {
    loadUnreadCount()
  }, [loadUnreadCount])

  const handleExperienceCreate = async (draft: ExperienceDraft) => {
    const { error: insertError } = await supabase.from('experience').insert(draft)
    if (insertError) throw new Error(insertError.message)
    setExperienceView({ mode: 'list' })
    await loadExperience()
  }

  const handleExperienceUpdate = async (id: string, draft: ExperienceDraft) => {
    const { error: updateError } = await supabase.from('experience').update(draft).eq('id', id)
    if (updateError) throw new Error(updateError.message)
    setExperienceView({ mode: 'list' })
    await loadExperience()
  }

  const handleExperienceDelete = async (entry: DbExperience) => {
    if (!confirm(`Delete "${entry.position}"? This can't be undone.`)) return
    const { error: deleteError } = await supabase.from('experience').delete().eq('id', entry.id)
    if (deleteError) {
      setExperienceError(deleteError.message)
      return
    }
    await loadExperience()
  }

  const handleCreate = async (draft: ProjectDraft) => {
    const { error: insertError } = await supabase.from('projects').insert(draft)
    if (insertError) throw new Error(insertError.message)
    setView({ mode: 'list' })
    await load()
  }

  const handleUpdate = async (id: string, draft: ProjectDraft) => {
    const { error: updateError } = await supabase.from('projects').update(draft).eq('id', id)
    if (updateError) throw new Error(updateError.message)
    setView({ mode: 'list' })
    await load()
  }

  const handleDelete = async (project: DbProject) => {
    if (!confirm(`Delete "${project.name}"? This can't be undone.`)) return
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', project.id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await load()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-canvas px-6 py-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-text-high">Site admin</h1>
            <p className="text-text-mid text-sm mt-1">
              Changes here show up on the live site the next time it's loaded.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm text-text-mid hover:text-text-high hover:border-teal transition-colors shrink-0"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>

        <div className="flex items-center gap-1 mb-8 border-b border-border-soft">
          {(
            [
              { id: 'projects', label: 'Projects' },
              { id: 'experience', label: 'Experience' },
              { id: 'resume', label: 'Resume' },
              { id: 'messages', label: 'Messages' },
              { id: 'contact', label: 'Contact info' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors inline-flex items-center gap-2 ${
                tab === t.id
                  ? 'text-text-high border-teal'
                  : 'text-text-mid border-transparent hover:text-text-high'
              }`}
            >
              {t.label}
              {t.id === 'messages' && unreadMessages > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-teal text-canvas text-[10px] font-medium">
                  {unreadMessages}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === 'projects' && error && <p className="text-status-remove text-sm mb-4">{error}</p>}
        {tab === 'experience' && experienceError && (
          <p className="text-status-remove text-sm mb-4">{experienceError}</p>
        )}

        {tab === 'contact' && <ContactInfoForm />}

        {tab === 'resume' && <ResumeForm onManageExperience={() => setTab('experience')} />}

        {tab === 'messages' && <MessagesPanel onChange={loadUnreadCount} />}

        {tab === 'experience' && experienceView.mode === 'list' && (
          <>
            <button
              onClick={() => setExperienceView({ mode: 'create' })}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-teal text-canvas text-sm font-medium hover:bg-teal/90 transition-colors"
            >
              <Plus size={16} /> Add role
            </button>

            {experienceLoading ? (
              <p className="text-text-mid text-sm">Loading…</p>
            ) : experienceEntries.length === 0 ? (
              <p className="text-text-mid text-sm">No timeline entries yet. Add your first one above.</p>
            ) : (
              <div className="space-y-3">
                {experienceEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-surface border border-border p-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-text-high font-medium truncate">{entry.position}</p>
                      <p className="text-text-low text-xs font-mono truncate">
                        {entry.company} · {entry.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setExperienceView({ mode: 'edit', entry })}
                        className="p-2 text-text-mid hover:text-teal transition-colors"
                        aria-label="Edit entry"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleExperienceDelete(entry)}
                        className="p-2 text-text-mid hover:text-status-remove transition-colors"
                        aria-label="Delete entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'experience' && experienceView.mode === 'create' && (
          <ExperienceForm
            submitLabel="Create entry"
            onCancel={() => setExperienceView({ mode: 'list' })}
            onSubmit={handleExperienceCreate}
          />
        )}

        {tab === 'experience' && experienceView.mode === 'edit' && (
          <ExperienceForm
            initial={experienceView.entry}
            submitLabel="Save changes"
            onCancel={() => setExperienceView({ mode: 'list' })}
            onSubmit={(draft) => handleExperienceUpdate(experienceView.entry.id, draft)}
          />
        )}

        {tab === 'projects' && view.mode === 'list' && (
          <>
            <button
              onClick={() => setView({ mode: 'create' })}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-teal text-canvas text-sm font-medium hover:bg-teal/90 transition-colors"
            >
              <Plus size={16} /> Add project
            </button>

            {loading ? (
              <p className="text-text-mid text-sm">Loading…</p>
            ) : projects.length === 0 ? (
              <p className="text-text-mid text-sm">No projects yet. Add your first one above.</p>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-surface border border-border p-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-text-high font-medium truncate">{project.name}</p>
                      <p className="text-text-low text-xs font-mono truncate">/{project.slug}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {normalizeUrl(project.demo) && (
                        <a
                          href={normalizeUrl(project.demo)!}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-text-mid hover:text-teal transition-colors"
                          aria-label="Open live demo"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <button
                        onClick={() => setView({ mode: 'edit', project })}
                        className="p-2 text-text-mid hover:text-teal transition-colors"
                        aria-label="Edit project"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(project)}
                        className="p-2 text-text-mid hover:text-status-remove transition-colors"
                        aria-label="Delete project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'projects' && view.mode === 'create' && (
          <ProjectForm
            submitLabel="Create project"
            onCancel={() => setView({ mode: 'list' })}
            onSubmit={handleCreate}
          />
        )}

        {tab === 'projects' && view.mode === 'edit' && (
          <ProjectForm
            initial={view.project}
            submitLabel="Save changes"
            onCancel={() => setView({ mode: 'list' })}
            onSubmit={(draft) => handleUpdate(view.project.id, draft)}
          />
        )}
      </div>
    </div>
  )
}
