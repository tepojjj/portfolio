import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
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
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useActiveSection, useScrollProgress } from '@/hooks/useScrollProgress'
import { useDecode } from '@/hooks/useDecode'
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

/** Sidebar background photo. Same circuit-board photo the page uses (Unsplash
 * license, hotlinked from their CDN), cropped tall and zoomed in on a
 * different area so the panel reads as its own surface. To use your own
 * image, drop it in src/assets, `import photo from '@/assets/your-image.jpg'`
 * and set SIDEBAR_PHOTO = photo. */
const SIDEBAR_PHOTO =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&crop=focalpoint&fp-x=0.3&fp-y=0.6&fp-z=1.6&w=720&h=1600&q=70'

/** Row geometry. The trace math below depends on these staying in sync with
 * the `h-11` rows and `gap-1` list spacing. */
const ROW = 44
const GAP = 4
const PITCH = ROW + GAP

type NodeStatus = 'passed' | 'active' | 'upcoming'

const CHIP_STYLES: Record<NodeStatus, string> = {
  upcoming:
    'border-border text-text-low group-hover:border-teal/60 group-hover:text-teal group-focus-visible:text-teal',
  passed:
    'border-teal/35 text-text-mid group-hover:border-teal group-hover:text-teal group-focus-visible:text-teal',
  active:
    'border-teal text-teal bg-[color-mix(in_srgb,var(--color-teal)_22%,var(--color-surface))] shadow-[0_0_16px_-2px_var(--color-teal)]',
}

interface NavItemProps {
  id: string
  label: string
  icon: LucideIcon
  index: string
  status: NodeStatus
  hovered: boolean
  expanded: boolean
  onSelect: (id: string) => void
  onEnter: (id: string, el: HTMLElement) => void
}

function NavItem({ id, label, icon: Icon, index, status, hovered, expanded, onSelect, onEnter }: NavItemProps) {
  const decoded = useDecode(label, hovered)

  return (
    <li>
      <button
        onClick={() => onSelect(id)}
        onPointerEnter={(e) => onEnter(id, e.currentTarget)}
        onFocus={(e) => onEnter(id, e.currentTarget)}
        data-cursor="interactive"
        aria-current={status === 'active' ? 'location' : undefined}
        title={expanded ? undefined : label}
        className={`group relative z-10 flex h-11 w-full items-center pl-3 pr-4 text-left text-sm transition-[gap] duration-300 ease-in-out ${
          expanded ? 'gap-4' : 'gap-0'
        }`}
      >
        {/* Node on the trace */}
        <span
          className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-[6px] border bg-surface transition-[color,border-color,box-shadow] duration-200 ${CHIP_STYLES[status]}`}
        >
          {status === 'active' && (
            <span aria-hidden className="nav-ping pointer-events-none absolute inset-0 rounded-[6px]" />
          )}
          <Icon size={16} />
        </span>

        {/* Real text holds the width (and the accessible name); the decoded
            overlay sits on top so the layout never jitters. Fades (and its
            flex space collapses) when the rail is closed. */}
        <span
          className={`relative min-w-0 shrink transition-[opacity,max-width] duration-200 ease-in-out group-hover:text-text-high ${
            status === 'active' ? 'font-medium text-text-high' : 'text-text-mid'
          } ${expanded ? 'max-w-[160px] opacity-100 delay-100' : 'max-w-0 opacity-0'}`}
        >
          <span className="whitespace-nowrap opacity-0">{label}</span>
          <span aria-hidden className="absolute inset-0 whitespace-nowrap">
            {decoded}
          </span>
        </span>

        {/* Matches the "01 / About" numbering on the page itself */}
        <span
          aria-hidden
          className={`ml-auto -translate-x-1 font-mono text-[10px] tabular-nums text-teal opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${
            expanded ? '' : 'hidden'
          }`}
        >
          {index}
        </span>
      </button>
    </li>
  )
}

interface ReticleState {
  y: number
  visible: boolean
  snap: boolean
  key: string
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = useActiveSection(NAV_IDS)
  const scrollProgress = useScrollProgress()
  const reduce = useReducedMotion()

  const asideRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [photoLoaded, setPhotoLoaded] = useState(false)
  const [reticle, setReticle] = useState<ReticleState>({ y: 0, visible: false, snap: true, key: '' })
  // Rail starts collapsed to icons-only and expands while the cursor is
  // over it. Keyboard users who tab in get the same expansion via focus.
  const [expanded, setExpanded] = useState(false)

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

  /** Pointer position feeds the grid spotlight. Written straight to CSS
   * variables so hovering never triggers a React render. */
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = asideRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const handleEnter = useCallback((id: string, el: HTMLElement) => {
    const wrap = wrapRef.current
    if (!wrap) return
    const y = el.getBoundingClientRect().top - wrap.getBoundingClientRect().top
    setHovered(id)
    // If the reticle was hidden, drop it on the row instead of gliding in
    // from wherever it last was.
    setReticle((prev) => ({ y, visible: true, snap: !prev.visible, key: id }))
  }, [])

  const handleLeave = useCallback(() => {
    setHovered(null)
    setReticle((prev) => ({ ...prev, visible: false }))
  }, [])

  const activeFlat = NAV_IDS.indexOf(active)

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        ref={asideRef}
        aria-label="Primary"
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setExpanded(true)}
        onPointerLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setExpanded(false)
        }}
        className={`nav-shell hidden lg:flex fixed inset-y-0 left-0 z-50 flex-col overflow-hidden bg-canvas border-r border-border transition-[width] duration-300 ease-in-out ${
          expanded ? 'w-72' : 'w-[84px]'
        }`}
      >
        {/* Photo, then a canvas-colored tint so text stays readable on it.
            Falls back to the plain canvas color if the image can't load. */}
        <img
          src={SIDEBAR_PHOTO}
          alt=""
          aria-hidden
          decoding="async"
          onLoad={() => setPhotoLoaded(true)}
          className={`nav-photo pointer-events-none absolute inset-0 h-full w-full object-cover ${
            photoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div aria-hidden className="nav-photo-tint pointer-events-none absolute inset-0" />

        {/* Pointer-tracked hover layers */}
        <div aria-hidden className="nav-grid pointer-events-none absolute inset-0" />
        <div aria-hidden className="nav-glow pointer-events-none absolute inset-0" />

        {/* Scroll progress rail along the sidebar's outer edge */}
        <div className="absolute right-0 top-0 w-px h-full bg-border-soft">
          <div
            className="w-px bg-teal transition-[height] duration-150 ease-out"
            style={{ height: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>

        <div
          className={`relative pt-8 pb-6 border-b border-border-soft transition-[padding] duration-300 ease-in-out ${
            expanded ? 'px-6' : 'px-[22px]'
          }`}
        >
          <button
            onClick={() => handleNav('home')}
            data-cursor="interactive"
            className={`group flex items-center w-full transition-[gap] duration-300 ease-in-out ${
              expanded ? 'gap-3' : 'gap-0'
            }`}
            aria-label="Go to top"
          >
            <span className="relative grid h-14 w-14 shrink-0 place-items-center">
              <svg
                aria-hidden
                viewBox="0 0 56 56"
                className="nav-ring absolute inset-0 h-full w-full text-teal/50 transition-colors group-hover:text-teal"
              >
                <circle
                  cx="28"
                  cy="28"
                  r="26.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeDasharray="2 5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="h-12 w-12 overflow-hidden rounded-full ring-1 ring-border transition-colors group-hover:ring-teal">
                <img
                  src={profileImg}
                  alt="Jopet Pallarcon"
                  className="h-full w-full object-cover object-top"
                />
              </span>
            </span>
            <span
              className={`overflow-hidden whitespace-nowrap font-display text-lg text-text-high text-left leading-tight transition-[opacity,max-width] duration-200 ease-in-out ${
                expanded ? 'max-w-[180px] opacity-100 delay-100' : 'max-w-0 opacity-0'
              }`}
            >
              Jopet Pallarcon <span className="text-teal">.</span>
            </span>
          </button>
        </div>

        <nav
          className={`relative flex-1 overflow-y-auto no-scrollbar py-6 transition-[padding] duration-300 ease-in-out ${
            expanded ? 'px-4' : 'px-[18px]'
          }`}
        >
          <div
            ref={wrapRef}
            className="relative"
            onPointerLeave={handleLeave}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) handleLeave()
            }}
          >
            {/* HUD reticle: one element that glides between rows and locks on */}
            <motion.div
              aria-hidden
              initial={false}
              animate={{ y: reticle.y, opacity: reticle.visible ? 1 : 0 }}
              transition={{
                y:
                  reduce || reticle.snap
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 520, damping: 40, mass: 0.6 },
                opacity: { duration: reduce ? 0 : 0.15 },
              }}
              className="pointer-events-none absolute inset-x-0 top-0 h-11 overflow-hidden"
            >
              <span className="absolute inset-0 bg-teal/[0.07]" />
              <span key={reticle.key} className="nav-scan absolute inset-y-0 left-0 w-16" />
              <span className="absolute left-0 top-0 h-2 w-2 border-l-[1.5px] border-t-[1.5px] border-teal" />
              <span className="absolute right-0 top-0 h-2 w-2 border-r-[1.5px] border-t-[1.5px] border-teal" />
              <span className="absolute bottom-0 left-0 h-2 w-2 border-b-[1.5px] border-l-[1.5px] border-teal" />
              <span className="absolute bottom-0 right-0 h-2 w-2 border-b-[1.5px] border-r-[1.5px] border-teal" />
            </motion.div>

            {NAV_GROUPS.map((group, gi) => {
              const count = group.items.length
              const groupStart = NAV_IDS.indexOf(group.items[0].id)
              const activeInGroup = activeFlat - groupStart
              // Rows of trace that are lit: up to the active node inside this
              // group, all of it if the active node is further down the page,
              // none if it hasn't been reached yet.
              const litRows =
                activeInGroup >= 0 && activeInGroup < count
                  ? activeInGroup
                  : activeInGroup >= count
                    ? count - 1
                    : 0

              return (
                <div key={group.label} className={gi > 0 ? 'mt-7' : ''}>
                  <p
                    className={`overflow-hidden whitespace-nowrap pl-3 font-mono text-[11px] text-text-mid transition-[opacity,max-height,margin-bottom] duration-200 ease-in-out ${
                      expanded ? 'max-h-6 mb-2 opacity-100 delay-100' : 'max-h-0 mb-0 opacity-0'
                    }`}
                  >
                    {group.label}
                  </p>

                  <div className="relative">
                    {/* Each group is its own bus: dotted trace behind the nodes */}
                    <span
                      aria-hidden
                      className="nav-trace pointer-events-none absolute left-7 top-[22px] w-px"
                      style={{ height: (count - 1) * PITCH }}
                    />
                    <motion.span
                      aria-hidden
                      initial={false}
                      animate={{ height: litRows * PITCH }}
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 24 }}
                      className="nav-trace-flow pointer-events-none absolute left-[27px] top-[22px] w-[2px]"
                    />

                    <ul className="relative flex flex-col" style={{ gap: GAP }}>
                      {group.items.map((item) => {
                        const flat = NAV_IDS.indexOf(item.id)
                        const status: NodeStatus =
                          flat === activeFlat ? 'active' : flat < activeFlat ? 'passed' : 'upcoming'
                        return (
                          <NavItem
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            icon={item.icon}
                            index={String(flat).padStart(2, '0')}
                            status={status}
                            hovered={hovered === item.id}
                            expanded={expanded}
                            onSelect={handleNav}
                            onEnter={handleEnter}
                          />
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )
            })}

            {/* Admin login: sits in the same icon column, right under Contact */}
            <div className="mt-7 border-t border-border-soft pt-4">
              <Link
                to="/admin"
                data-cursor="interactive"
                aria-label="Admin login"
                title={expanded ? undefined : 'Admin'}
                className={`group flex h-11 w-full items-center pl-3 pr-4 text-sm transition-[gap] duration-300 ease-in-out ${
                  expanded ? 'gap-4' : 'gap-0'
                }`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[6px] border border-teal/40 bg-surface text-teal transition-[border-color,box-shadow] duration-200 group-hover:border-teal group-hover:shadow-[0_0_16px_-2px_var(--color-teal)] group-focus-visible:border-teal">
                  <ShieldCheck size={16} />
                </span>
                <span
                  className={`whitespace-nowrap overflow-hidden text-text-mid transition-[opacity,max-width] duration-200 ease-in-out group-hover:text-text-high ${
                    expanded ? 'max-w-[160px] opacity-100 delay-100' : 'max-w-0 opacity-0'
                  }`}
                >
                  Admin
                </span>
              </Link>
            </div>
          </div>
        </nav>

        <div
          className={`relative py-5 border-t border-border-soft transition-[padding] duration-300 ease-in-out ${
            expanded ? 'px-6' : 'px-[22px]'
          }`}
        >
          <p
            className={`overflow-hidden whitespace-nowrap font-mono text-[11px] text-text-low transition-opacity duration-200 ease-in-out ${
              expanded ? 'opacity-100 delay-100' : 'opacity-0'
            }`}
          >
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
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-2 font-mono text-sm text-text-low hover:text-teal transition-colors"
            >
              <ShieldCheck size={16} />
              Admin
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
