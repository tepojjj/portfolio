/** The `image` field on a project is either a real image URL (pasted into
 * the admin form) or one of the old placeholder slugs ("reconciliation",
 * "console", etc.) left over from before the field was wired up to actual
 * rendering. This tells the two apart so a project without a real image yet
 * still falls back cleanly to the abstract letter treatment. */
export function isImageUrl(value: string | null | undefined): value is string {
  const trimmed = value?.trim()
  if (!trimmed) return false
  return (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image')
  )
}
