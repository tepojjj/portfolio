import { jsPDF } from 'jspdf'
import type { ResumeDraft, ResumeExperienceItem } from '@/lib/types'

const PAGE_WIDTH = 612 // US Letter, points
const PAGE_HEIGHT = 792
const MARGIN = 54
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

/**
 * Renders the resume as a plain, single-column PDF: standard fonts, no
 * tables/columns/text-boxes/graphics, and text-based (not image-based)
 * content throughout. That combination is what lets applicant tracking
 * systems parse a PDF resume reliably instead of dropping fields.
 */
export function generateResumePdf(resume: ResumeDraft, experience: ResumeExperienceItem[]): void {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  let y = MARGIN

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_HEIGHT - MARGIN) {
      doc.addPage()
      y = MARGIN
    }
  }

  const addWrapped = (text: string, size: number, style: 'normal' | 'bold' = 'normal', lineHeight = size * 1.35) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH) as string[]
    lines.forEach((line) => {
      ensureSpace(lineHeight)
      doc.text(line, MARGIN, y)
      y += lineHeight
    })
  }

  const addSectionHeading = (label: string) => {
    y += 8
    ensureSpace(24)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(label.toUpperCase(), MARGIN, y)
    y += 4
    doc.setDrawColor(60, 60, 60)
    doc.setLineWidth(0.75)
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
    y += 14
  }

  // Header: name, title, contact line
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(resume.full_name || 'Your Name', MARGIN, y)
  y += 22

  if (resume.title) {
    addWrapped(resume.title, 12, 'normal', 16)
    y += 2
  }

  const contactLine = [resume.email, resume.phone, resume.location, resume.linkedin]
    .filter(Boolean)
    .join('  |  ')
  if (contactLine) {
    addWrapped(contactLine, 10, 'normal', 14)
  }

  // Summary
  if (resume.summary) {
    addSectionHeading('Summary')
    addWrapped(resume.summary, 10.5, 'normal', 14)
  }

  // Skills — plain comma-separated line (not a table/grid) so ATS keyword
  // scanners can read every item.
  if (resume.skills.length > 0) {
    addSectionHeading('Skills')
    addWrapped(resume.skills.join(', '), 10.5, 'normal', 14)
  }

  // Experience — synced live from the Experience tab/table, not edited here.
  if (experience.length > 0) {
    addSectionHeading('Experience')
    experience.forEach((entry, index) => {
      ensureSpace(16)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text(entry.position || 'Role', MARGIN, y)
      const dateText = entry.date || ''
      if (dateText) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        const dateWidth = doc.getTextWidth(dateText)
        doc.text(dateText, PAGE_WIDTH - MARGIN - dateWidth, y)
      }
      y += 14

      if (entry.company) {
        addWrapped(entry.company, 10.5, 'normal', 14)
      }

      entry.bullets.forEach((bullet) => {
        if (!bullet.trim()) return
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10.5)
        const bulletLines = doc.splitTextToSize(bullet, CONTENT_WIDTH - 14) as string[]
        bulletLines.forEach((line, i) => {
          ensureSpace(14)
          doc.text(i === 0 ? `- ${line}` : `  ${line}`, MARGIN, y)
          y += 14
        })
      })

      if (index < experience.length - 1) y += 8
    })
  }

  // Education
  if (resume.education.length > 0) {
    addSectionHeading('Education')
    resume.education.forEach((entry, index) => {
      ensureSpace(16)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text(entry.degree || 'Degree', MARGIN, y)
      const dateText = entry.date || ''
      if (dateText) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        const dateWidth = doc.getTextWidth(dateText)
        doc.text(dateText, PAGE_WIDTH - MARGIN - dateWidth, y)
      }
      y += 14

      if (entry.school) addWrapped(entry.school, 10.5, 'normal', 14)
      if (entry.details) addWrapped(entry.details, 10.5, 'normal', 14)

      if (index < resume.education.length - 1) y += 8
    })
  }

  doc.setProperties({ title: `${resume.full_name || 'Resume'} - Resume` })

  const filename = `${(resume.full_name || 'resume').trim().toLowerCase().replace(/\s+/g, '-')}-resume.pdf`
  doc.save(filename)
}
