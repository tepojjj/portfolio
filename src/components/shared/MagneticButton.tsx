import { useRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsTouchDevice } from '@/hooks/useMediaQuery'

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'
>

interface MagneticButtonProps extends NativeButtonProps {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
}

const base =
  'relative inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-sm transition-colors duration-200 cursor-pointer'
const variants = {
  primary: 'bg-teal text-canvas hover:bg-teal/90',
  ghost: 'border border-border text-text-high hover:border-teal hover:text-teal',
}

/** Button with a subtle magnetic pull toward the cursor — disabled on touch. */
export function MagneticButton({ children, variant = 'primary', className = '', ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const isTouch = useIsTouchDevice()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 })
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 })

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTouch || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`${base} ${variants[variant]} ${className}`}
      data-cursor="interactive"
      {...props}
    >
      {children}
    </motion.button>
  )
}
