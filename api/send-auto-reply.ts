import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

// POST { name, email } -> sends an auto-reply through Gmail's SMTP, using
// your own Gmail account. Runs server-side only, so the app password never
// reaches the browser.
//
// Setup required in your Vercel project (Settings -> Environment Variables):
//   GMAIL_USER          - your full Gmail address, e.g. jopet@gmail.com
//   GMAIL_APP_PASSWORD  - a 16-character Google App Password (NOT your
//                          regular Gmail password). Requires 2-Step
//                          Verification turned on for the account, then:
//                          myaccount.google.com/apppasswords -> generate one
//                          for "Mail". Paste it with no spaces.
//
// No domain needed — this sends as your real Gmail address, which visitors
// can reply to directly.

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

function replyHtml(name: string) {
  return `
  <div style="font-family: -apple-system, Segoe UI, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
    <p>Hi ${escapeHtml(name)},</p>
    <p>Thanks so much for reaching out — I appreciate you taking the time to message me.</p>
    <p>A bit about what I do, in case it's useful for what you have in mind:</p>
    <ul style="padding-left: 20px; margin: 0 0 16px;">
      <li style="margin-bottom: 8px;"><strong>Web Development</strong> — React and TypeScript applications built for real operational use, not just demos.</li>
      <li style="margin-bottom: 8px;"><strong>Data Analytics</strong> — Turning scattered exports and event data into numbers people actually trust.</li>
      <li style="margin-bottom: 8px;"><strong>Dashboard Development</strong> — Looker Studio and custom React dashboards that answer the question, not just display data.</li>
      <li style="margin-bottom: 8px;"><strong>Automation</strong> — Scripted, scheduled workflows that remove repetitive manual steps between systems.</li>
    </ul>
    <p>I'll get back to you personally soon.</p>
    <p style="margin-top: 24px;">— Jopet Pallarcon</p>
  </div>`
}

function escapeHtml(s: string) {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return s.replace(/[&<>"']/g, (c) => map[c])
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return res.status(500).json({ error: 'GMAIL_USER / GMAIL_APP_PASSWORD is not configured' })
  }

  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing name or email' })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    })

    await transporter.sendMail({
      from: `"Jopet Pallarcon" <${GMAIL_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      html: replyHtml(name),
    })

    return res.status(200).json({ sent: true })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Gmail send failed:', err)
    return res.status(502).json({ error: 'Failed to send email' })
  }
}
