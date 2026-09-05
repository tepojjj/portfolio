import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True when the site has valid Supabase env vars configured. When false,
 * the public site quietly falls back to the static project list and the
 * admin routes show a "not configured" message instead of a login form. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Fall back to harmless placeholder values so createClient doesn't throw
// when env vars are missing (e.g. local dev before .env.local is set up).
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
