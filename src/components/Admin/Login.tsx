import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { AdminNotice } from './AdminNotice'

export function AdminLogin() {
  const { session, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!isSupabaseConfigured) {
    return (
      <AdminNotice
        title="Supabase isn't configured yet"
        body="Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file, run the migration in supabase/migrations, create yourself a user under Authentication, then restart the dev server."
      />
    )
  }

  if (!loading && session) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (signInError) setError(signInError.message)
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center text-text-mid">
          <Lock size={16} />
          <span className="font-mono text-xs uppercase tracking-wider">Admin access</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border p-6 md:p-8 space-y-5">
          <div>
            <label htmlFor="email" className="block font-mono text-xs text-text-low mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-raised border border-border px-3 py-2.5 text-sm text-text-high outline-none focus:border-teal transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-mono text-xs text-text-low mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-raised border border-border px-3 py-2.5 text-sm text-text-high outline-none focus:border-teal transition-colors"
            />
          </div>

          {error && <p className="text-status-remove text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal text-canvas font-medium py-2.5 text-sm hover:bg-teal/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
