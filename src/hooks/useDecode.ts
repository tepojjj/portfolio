import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const GLYPHS = '01<>/_-=+*#'

/** Returns `text` as a string that "decodes" from random glyphs into the real
 * characters, left to right, each time `run` flips to true. Under reduced
 * motion it always returns the plain text. */
export function useDecode(text: string, run: boolean): string {
  const reduce = useReducedMotion()
  const [out, setOut] = useState(text)

  useEffect(() => {
    if (!run || reduce) {
      setOut(text)
      return
    }

    const start = performance.now()
    const duration = 300 + text.length * 22
    let timer = 0

    const step = () => {
      const progress = Math.min(1, (performance.now() - start) / duration)
      if (progress >= 1) {
        setOut(text)
        window.clearInterval(timer)
        return
      }
      const settled = Math.floor(progress * text.length)
      let next = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        next += i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setOut(next)
    }

    step()
    timer = window.setInterval(step, 34)
    return () => window.clearInterval(timer)
  }, [run, text, reduce])

  return out
}
