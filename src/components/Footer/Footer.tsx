import { lazy, Suspense } from 'react'
import { Code2, Link2, Mail, ArrowUp } from 'lucide-react'

const FooterScene = lazy(() =>
  import('@/components/ThreeScene/scenes/FooterScene').then((m) => ({ default: m.FooterScene }))
)

const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

const socials = [
  { icon: Code2, href: 'https://github.com/jet-dev', label: 'GitHub' },
  { icon: Link2, href: 'https://linkedin.com/in/jet-dev', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@jet-dev.com', label: 'Email' },
]

export function Footer() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="relative overflow-hidden border-t border-border-soft px-6 md:px-10 py-14">
      <Suspense fallback={null}>
        <FooterScene />
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/60 via-canvas/80 to-canvas/95 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          <div>
            <div className="font-display text-xl text-text-high">
              Jopet Pallarcon<span className="text-teal">.</span>
            </div>
            <p className="mt-2 text-sm text-text-mid max-w-xs">
              Web development, data analytics, and automation for real operations.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                data-cursor="interactive"
                className="text-sm text-text-mid hover:text-teal transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                data-cursor="interactive"
                className="w-9 h-9 flex items-center justify-center border border-border text-text-mid hover:border-teal hover:text-teal transition-colors"
              >
                <social.icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border-soft flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-text-low">© {new Date().getFullYear()} Jopet Pallarcon. All rights reserved.</p>
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
