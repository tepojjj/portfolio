import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AdminNotice } from './AdminNotice'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  if (!isSupabaseConfigured) {
    return (
      <AdminNotice
        title="Supabase isn't configured yet"
        body="Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file, run the migration in supabase/migrations, and restart the dev server."
      />
    )
  }

  if (loading) {
    return <AdminNotice title="Loading…" body="" />
  }

  if (!session) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
