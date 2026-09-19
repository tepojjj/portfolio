import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Home,
  User,
  Layers,
  FolderGit2,
  History,
  LineChart,
  Briefcase,
  Mail,
} from 'lucide-react'
import { useActiveSection, useScrollProgress } from '@/hooks/useScrollProgress'
import profileImg from '@/assets/profile.png'

const NAV_GROUPS = [
  {
    label: 'Explore',
    items: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'about', label: 'About', icon: User },
      { id: 'skills', label: 'Skills', icon: Layers },
      { id: 'projects', label: 'Projects', icon: FolderGit2 },
      { id: 'experience', label: 'Experience', icon: History },
      { id: 'analytics', label: 'Analytics', icon: LineChart },
    ],
  },
  {
    label: 'Work with me',
    items: [
      { id: 'services', label: 'Services', icon: Briefcase },
      { id: 'contact', label: 'Contact', icon: Mail },
    ],
  },
]

const NAV_IDS = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id))

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = useActiveSection(NAV_IDS)
  const scrollProgress = useScrollProgress()

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
        className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-72 flex-col bg-surface/95 backdrop-blur-md border-r border-border"
      >
        {/* Scroll progress rail along the sidebar's outer edge */}
        <div className="absolute right-0 top-0 w-px h-full bg-border-soft">
          <div
            className="w-px bg-teal transition-[height] duration-150 ease-out"
            style={{ height: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>

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

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-4 mb-2 font-mono text-[11px] uppercase tracking-wider text-text-low">
                {group.label}
              </p>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNav(item.id)}
                      data-cursor="interactive"
                      className={`relative w-full flex items-center gap-3 text-left px-4 py-3 text-sm rounded-md border transition-colors ${
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
                      <item.icon size={16} className="shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-border-soft">
          <p className="font-mono text-[11px] text-text-low">
            © {new Date().getFullYear()} Jopet Pallarcon
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border">
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
        <div className="h-0.5 bg-border-soft">
          <div
            className="h-full bg-teal transition-[width] duration-150 ease-out"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-canvas/98 backdrop-blur-lg lg:hidden flex flex-col items-center justify-center gap-8 overflow-y-auto py-16"
          >
            <span className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-teal/50">
              <img
                src={profileImg}
                alt="Jopet Pallarcon"
                className="w-full h-full object-cover object-top"
              />
            </span>
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col items-center gap-2">
                <p className="font-mono text-[11px] uppercase tracking-wider text-text-low mb-1">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`inline-flex items-center gap-3 font-display text-2xl py-1.5 transition-colors ${
                      active === item.id ? 'text-teal' : 'text-text-high'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
