/** Users often type bare domains like "myapp.vercel.app" into URL fields.
 * Without a protocol, an <a href> treats that as a relative link on this
 * site (and silently fails) instead of opening it externally. Returns null
 * for empty/whitespace-only input so callers can hide the link entirely. */
export function normalizeUrl(url: string | null | undefined): string | null {
  const trimmed = url?.trim()
  if (!trimmed) return null
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}
