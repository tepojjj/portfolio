import { Sun, Moon } from 'lucide-react'
import type { Theme } from '@/hooks/useTheme'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
  className?: string
}

export function ThemeToggle({ theme, onToggle, className = '' }: ThemeToggleProps) {
  const isLight = theme === 'light'
  return (
    <button
      onClick={onToggle}
      data-cursor="interactive"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={isLight}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-md border border-border text-text-mid hover:text-text-high hover:border-teal transition-colors ${className}`}
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
