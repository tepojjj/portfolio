import { useCallback, useEffect, useState } from 'react'
import { LogOut, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { DbProject, ProjectDraft } from '@/lib/types'
import { ProjectForm } from './ProjectForm'

type ViewState = { mode: 'list' } | { mode: 'create' } | { mode: 'edit'; project: DbProject }

export function AdminDashboard() {
  const [projects, setProjects] = useState<DbProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<ViewState>({ mode: 'list' })

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
            <h1 className="font-display text-2xl md:text-3xl text-text-high">Projects admin</h1>
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

        {error && <p className="text-status-remove text-sm mb-4">{error}</p>}

        {view.mode === 'list' && (
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
                      {project.demo && (
                        <a
                          href={project.demo}
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

        {view.mode === 'create' && (
          <ProjectForm
            submitLabel="Create project"
            onCancel={() => setView({ mode: 'list' })}
            onSubmit={handleCreate}
          />
        )}

        {view.mode === 'edit' && (
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
