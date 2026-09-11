import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useActiveSection } from '@/hooks/useScrollProgress'
import profileImg from '@/assets/profile.png'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]

const NAV_IDS = NAV_ITEMS.map((i) => i.id)

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = useActiveSection(NAV_IDS)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleNav = (id: string) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        aria-label="Primary"
        className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-72 flex-col bg-surface/90 backdrop-blur-md border-r border-border"
      >
        <div className="px-6 pt-8 pb-6 border-b border-border-soft">
          <button
            onClick={() => handleNav('home')}
            data-cursor="interactive"
            className="flex items-center gap-3 group w-full"
            aria-label="Go to top"
          >
            <span className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-teal transition-colors">
              <img
                src={profileImg}
                alt="Jopet Pallarcon"
                className="w-full h-full object-cover object-top"
              />
            </span>
            <span className="font-display text-lg text-text-high text-left leading-tight">
              Jopet Pallarcon <span className="text-teal">.</span>
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  data-cursor="interactive"
                  className={`relative w-full text-left px-4 py-3 text-sm rounded-md border transition-colors ${
                    active === item.id
                      ? 'text-text-high bg-teal-soft border-teal/40'
                      : 'text-text-mid border-transparent hover:text-text-high hover:bg-surface-raised hover:border-border'
                  }`}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-active-rail"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal rounded-full"
                    />
                  )}
                  <span className="pl-2">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-6 py-5 border-t border-border-soft">
          <p className="font-mono text-[11px] text-text-low">
            © {new Date().getFullYear()} Jopet Pallarcon
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-5 py-3">
          <button
            onClick={() => handleNav('home')}
            data-cursor="interactive"
            className="flex items-center gap-2.5"
            aria-label="Go to top"
          >
            <span className="w-9 h-9 shrink-0 rounded-full overflow-hidden ring-2 ring-border">
              <img
                src={profileImg}
                alt="Jopet Pallarcon"
                className="w-full h-full object-cover object-top"
              />
            </span>
            <span className="font-display text-base text-text-high">
              Jopet Pallarcon <span className="text-teal">.</span>
            </span>
          </button>

          <button
            className="text-text-high"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            data-cursor="interactive"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-canvas/98 backdrop-blur-lg lg:hidden flex flex-col items-center justify-center gap-2"
          >
            <span className="w-16 h-16 mb-4 rounded-full overflow-hidden ring-2 ring-teal/50">
              <img
                src={profileImg}
                alt="Jopet Pallarcon"
                className="w-full h-full object-cover object-top"
              />
            </span>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`font-display text-3xl py-3 transition-colors ${
                  active === item.id ? 'text-teal' : 'text-text-high'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
