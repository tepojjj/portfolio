export interface ContactInfo {
  email: string
  phone: string
  linkedin: string
}

/** Shown until Supabase is configured/seeded, or if the `site_contact`
 * table can't be reached. Placeholder — replace via the admin panel. */
export const fallbackContact: ContactInfo = {
  email: 'hello@jet-dev.com',
  phone: '+63 900 000 0000',
  linkedin: 'linkedin.com/in/jet-dev',
}
