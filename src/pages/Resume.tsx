import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSiteResume } from '@/hooks/useSiteResume'
import { useExperience } from '@/hooks/useExperience'
import { experienceToResumeItems } from '@/utils/experienceToResume'
import profileImg from '@/assets/profile.png'

/** Plain, single-column resume view — deliberately styled to read the same
 * way it would parse for an ATS: standard headings, no multi-column layout,
 * no tables or decorative graphics. Contact/summary/skills/education come
 * from the admin panel's Resume tab; Experience is synced live from the
 * Experience tab so it never has to be entered twice.
 *
 * The profile photo shown here is for this page only — it's left out of the
 * generated PDF on purpose, since photos are one of the things that commonly
 * cause applicant tracking systems to mis-parse or reject a resume. */
export function Resume() {
  const { resume } = useSiteResume()
  const { experience } = useExperience()
  const resumeExperience = experienceToResumeItems(experience)

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
          <div className="flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-text-high">{resume.full_name}</h1>
              {resume.title && <p className="mt-1 text-text-mid">{resume.title}</p>}
              {contactLine && <p className="mt-3 font-mono text-xs text-text-low">{contactLine}</p>}
            </div>
            <img
              src={profileImg}
              alt={resume.full_name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-border shrink-0"
            />
          </div>

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

          {resumeExperience.length > 0 && (
            <section className="mt-8">
              <h2 className="font-mono text-xs uppercase tracking-wider text-teal border-b border-border-soft pb-2 mb-3">
                Experience
              </h2>
              <div className="space-y-6">
                {resumeExperience.map((entry, index) => (
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
