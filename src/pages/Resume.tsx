import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSiteResume } from '@/hooks/useSiteResume'

/** Plain, single-column resume view — deliberately styled to read the same
 * way it would parse for an ATS: standard headings, no multi-column layout,
 * no tables or decorative graphics. Content comes from the admin panel. */
export function Resume() {
  const { resume } = useSiteResume()

  const contactLine = [resume.email, resume.phone, resume.location, resume.linkedin]
    .filter(Boolean)
    .join('  ·  ')

  return (
    <div className="min-h-screen bg-canvas px-6 py-10 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-text-mid hover:text-teal transition-colors"
          >
            <ArrowLeft size={16} /> Back to site
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-border text-sm text-text-mid hover:text-text-high hover:border-teal transition-colors"
          >
            Print / Save as PDF
          </button>
        </div>

        <div className="bg-surface border border-border p-8 md:p-12">
          <h1 className="font-display text-3xl md:text-4xl text-text-high">{resume.full_name}</h1>
          {resume.title && <p className="mt-1 text-text-mid">{resume.title}</p>}
          {contactLine && <p className="mt-3 font-mono text-xs text-text-low">{contactLine}</p>}

          {resume.summary && (
            <section className="mt-8">
              <h2 className="font-mono text-xs uppercase tracking-wider text-teal border-b border-border-soft pb-2 mb-3">
                Summary
              </h2>
              <p className="text-sm text-text-mid leading-relaxed">{resume.summary}</p>
            </section>
          )}

          {resume.skills.length > 0 && (
            <section className="mt-8">
              <h2 className="font-mono text-xs uppercase tracking-wider text-teal border-b border-border-soft pb-2 mb-3">
                Skills
              </h2>
              <p className="text-sm text-text-mid leading-relaxed">{resume.skills.join(', ')}</p>
            </section>
          )}

          {resume.experience.length > 0 && (
            <section className="mt-8">
              <h2 className="font-mono text-xs uppercase tracking-wider text-teal border-b border-border-soft pb-2 mb-3">
                Experience
              </h2>
              <div className="space-y-6">
                {resume.experience.map((entry, index) => (
                  <div key={index}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="text-text-high font-medium">{entry.position}</h3>
                      <span className="font-mono text-xs text-text-low">{entry.date}</span>
                    </div>
                    {entry.company && <p className="text-sm text-text-mid">{entry.company}</p>}
                    {entry.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {entry.bullets.map((bullet, i) => (
                          <li key={i} className="text-sm text-text-mid flex gap-2">
                            <span className="text-text-low">-</span> {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.education.length > 0 && (
            <section className="mt-8">
              <h2 className="font-mono text-xs uppercase tracking-wider text-teal border-b border-border-soft pb-2 mb-3">
                Education
              </h2>
              <div className="space-y-4">
                {resume.education.map((entry, index) => (
                  <div key={index}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="text-text-high font-medium">{entry.degree}</h3>
                      <span className="font-mono text-xs text-text-low">{entry.date}</span>
                    </div>
                    {entry.school && <p className="text-sm text-text-mid">{entry.school}</p>}
                    {entry.details && <p className="text-sm text-text-mid mt-1">{entry.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
