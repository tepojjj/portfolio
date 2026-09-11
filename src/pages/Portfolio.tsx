import { useEffect, useState } from 'react'
import { Loader } from '@/components/Loader/Loader'
import { CustomCursor } from '@/components/CustomCursor/CustomCursor'
import { Navbar } from '@/components/Navbar/Navbar'
import { Hero } from '@/components/Hero/Hero'
import { About } from '@/components/About/About'
import { Skills } from '@/components/Skills/Skills'
import { Projects } from '@/components/Projects/Projects'
import { Experience } from '@/components/Experience/Experience'
import { Analytics } from '@/components/Analytics/Analytics'
import { Services } from '@/components/Services/Services'
import { Contact } from '@/components/Contact/Contact'
import { Footer } from '@/components/Footer/Footer'

export function Portfolio() {
  const [loading, setLoading] = useState(true)

  // A small, professional easter egg for anyone technically curious enough to open devtools.
  useEffect(() => {
    console.log(
      '%cLooking under the hood?',
      'font-family: monospace; font-size: 14px; color: #3F6B46;'
    )
    console.log(
      '%cThis site is React + TypeScript + Three.js + GSAP. Let\'s talk: hello@jet-dev.com',
      'font-family: monospace; font-size: 12px; color: #9caab8;'
    )
  }, [])

  return (
    <>
      <Loader onDone={() => setLoading(false)} />
      {!loading && (
        <>
          <CustomCursor />
          <Navbar />
          <div className="lg:pl-72">
            <main className="pt-16 lg:pt-0">
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Experience />
              <Analytics />
              <Services />
              <Contact />
            </main>
            <Footer />
          </div>
        </>
      )}
    </>
  )
}
