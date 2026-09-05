import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useActiveSection } from '@/hooks/useScrollProgress'

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
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = useActiveSection(NAV_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (id: string) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-6'
        }`}
      >
        <nav
          aria-label="Primary"
          className={`mx-auto max-w-6xl px-5 flex items-center justify-between transition-all duration-300 rounded-lg ${
            scrolled ? 'bg-surface/80 backdrop-blur-md border border-border py-2.5' : 'bg-transparent py-1'
          }`}
        >
          <button
            onClick={() => handleNav('home')}
            className="font-display text-lg text-text-high"
            data-cursor="interactive"
            aria-label="Go to top"
          >
            Jopet Pallarcon <span className="text-teal">.</span>
          </button>

          <ul className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.slice(1).map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  data-cursor="interactive"
                  className={`relative px-3 py-2 text-sm transition-colors ${
                    active === item.id ? 'text-text-high' : 'text-text-mid hover:text-text-high'
                  }`}
                >
                  {item.label}
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-3 right-3 -bottom-0.5 h-px bg-teal"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="lg:hidden text-text-high"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            data-cursor="interactive"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-canvas/98 backdrop-blur-lg lg:hidden flex flex-col items-center justify-center gap-2"
          >
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
