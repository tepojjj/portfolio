import { lazy, Suspense } from 'react'
import { Code2, Link2, Mail, ArrowUp } from 'lucide-react'
import { useSiteContact } from '@/hooks/useSiteContact'

const FooterScene = lazy(() =>
  import('@/components/ThreeScene/scenes/FooterScene').then((m) => ({ default: m.FooterScene }))
)

const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]

export function Footer() {
  const { contact } = useSiteContact()

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const socials = [
    { icon: Code2, href: 'https://github.com/jet-dev', label: 'GitHub' },
    { icon: Link2, href: `https://${contact.linkedin.replace(/^https?:\/\//, '')}`, label: 'LinkedIn' },
    { icon: Mail, href: `mailto:${contact.email}`, label: 'Email' },
  ]

  return (
    <footer className="relative overflow-hidden border-t border-border-soft">
      <Suspense fallback={null}>
        <FooterScene />
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/60 via-canvas/80 to-canvas/95 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand + blurb */}
          <div className="md:col-span-5">
            <button
              onClick={() => scrollTo('home')}
              data-cursor="interactive"
              className="font-display text-2xl text-text-high"
            >
              Jopet Pallarcon<span className="text-teal">.</span>
            </button>
            <p className="mt-4 text-sm leading-relaxed text-text-mid max-w-sm">
              Web development, data analytics, and automation for real operations.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  data-cursor="interactive"
                  target={social.label === 'Email' ? undefined : '_blank'}
                  rel={social.label === 'Email' ? undefined : 'noreferrer'}
                  className="w-9 h-9 flex items-center justify-center border border-border text-text-mid hover:border-teal hover:text-teal transition-colors"
                >
                  <social.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-wider text-text-low mb-5">Navigate</p>
            <nav aria-label="Footer" className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  data-cursor="interactive"
                  className="text-left text-sm text-text-mid hover:text-teal transition-colors w-fit"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-wider text-text-low mb-5">Get in touch</p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href={`mailto:${contact.email}`}
                data-cursor="interactive"
                className="text-text-mid hover:text-teal transition-colors break-all w-fit"
              >
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone}`}
                data-cursor="interactive"
                className="text-text-mid hover:text-teal transition-colors w-fit"
              >
                {contact.phone}
              </a>
              <button
                onClick={() => scrollTo('contact')}
                data-cursor="interactive"
                className="mt-2 inline-flex w-fit items-center gap-2 px-4 py-2 border border-border text-xs text-text-mid hover:border-teal hover:text-teal transition-colors"
              >
                Send a message
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border-soft flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-text-low">
            © {new Date().getFullYear()} Jopet Pallarcon. All rights reserved.
          </p>
          <button
            onClick={() => scrollTo('home')}
            data-cursor="interactive"
            aria-label="Back to top"
            className="inline-flex items-center gap-2 text-xs text-text-mid hover:text-teal transition-colors"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}
