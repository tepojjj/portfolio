import { lazy, Suspense } from 'react'
import { Mail, Phone, Link2 } from 'lucide-react'
import { Section, SectionHeading } from '@/components/shared/Section'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import { useSiteContact } from '@/hooks/useSiteContact'
import { ContactForm } from './ContactForm'

const ContactScene = lazy(() =>
  import('@/components/ThreeScene/scenes/ContactScene').then((m) => ({ default: m.ContactScene }))
)

function toHref(kind: 'email' | 'phone' | 'linkedin', value: string): string {
  if (kind === 'email') return `mailto:${value}`
  if (kind === 'phone') return `tel:${value.replace(/[^+\d]/g, '')}`
  return value.startsWith('http') ? value : `https://${value}`
}

export function Contact() {
  const { contact } = useSiteContact()

  const links = [
    { icon: Mail, label: 'Email', value: contact.email, href: toHref('email', contact.email) },
    { icon: Phone, label: 'Phone', value: contact.phone, href: toHref('phone', contact.phone) },
    { icon: Link2, label: 'LinkedIn', value: contact.linkedin, href: toHref('linkedin', contact.linkedin) },
  ]

  return (
    <Section id="contact" label="Contact" className="border-t border-border-soft relative overflow-hidden">
      <Suspense fallback={null}>
        <ContactScene />
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/10 via-canvas/40 to-canvas/75 pointer-events-none" />

      <div className="relative z-10">
        <SectionHeading
          index="07 / Contact"
          title="Let's build something that works."
          description="Have a project, a broken workflow, or a data mess to sort out? I'd like to hear about it."
        />

        <div className="grid md:grid-cols-5 gap-12">
          <RevealOnScroll direction="left" className="md:col-span-2">
            <div className="space-y-5">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  data-cursor="interactive"
                  className="flex items-center gap-4 group"
                >
                  <span className="w-10 h-10 flex items-center justify-center border border-border text-text-mid group-hover:border-teal group-hover:text-teal transition-colors shrink-0">
                    <link.icon size={16} />
                  </span>
                  <span>
                    <span className="block text-xs font-mono text-text-low">{link.label}</span>
                    <span className="block text-sm text-text-high group-hover:text-teal transition-colors">
                      {link.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="right" delay={0.1} className="md:col-span-3">
            <ContactForm />
          </RevealOnScroll>
        </div>
      </div>
    </Section>
  )
}
