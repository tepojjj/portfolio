import { useCallback, useEffect, useState } from 'react'
import { Trash2, Mail, MailOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { DbMessage } from '@/lib/types'
import { services } from '@/data/services'
import { useSiteContact } from '@/hooks/useSiteContact'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Highlight a focused subset of services in the reply pitch rather than the
// full list — a short, scannable pitch reads better in an email than all
// seven at once.
const PITCH_SERVICE_IDS = ['web-dev', 'data-analytics', 'automation', 'dashboards']

function buildReplyBody(msg: DbMessage) {
  const serviceLines = services
    .filter((s) => PITCH_SERVICE_IDS.includes(s.id))
    .map((s) => `- ${s.title}: ${s.description}`)
    .join('\n')

  return [
    `Hi ${msg.name},`,
    '',
    "Thanks so much for reaching out — I appreciate you taking the time to message me.",
    '',
    "A bit about what I do, in case it's useful for what you have in mind:",
    serviceLines,
    '',
    "For context: I recently automated floor/zone assignment for ~62,000 product rows across 64 stores, and replaced a fully manual reconciliation process with self-serve tools. If you're dealing with anything similarly repetitive, disconnected, or hard to keep in sync, that's exactly the kind of problem I enjoy solving.",
    '',
    "Happy to hop on a quick call or keep chatting over email, whichever's easier for you. Let me know a bit more about what you need and I'll share some thoughts on how I could help.",
    '',
    'Best,',
    'Jopet',
    '',
    '---',
    `On ${formatDate(msg.created_at)}, you wrote:`,
    msg.message,
  ].join('\n')
}

function gmailComposeUrl(msg: DbMessage, fromEmail: string) {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: msg.email,
    su: `Re: ${msg.subject || 'your message'}`,
    body: buildReplyBody(msg),
  })
  // authuser targets a specific signed-in Google account so the compose
  // window opens as fromEmail instead of whichever account happens to be
  // active in the current browser/profile — but only if fromEmail is
  // actually signed in there. If it isn't, Gmail will prompt to switch/sign
  // in rather than silently sending as the wrong address.
  if (fromEmail) params.set('authuser', fromEmail)
  return `https://mail.google.com/mail/?${params.toString()}`
}

function mailtoUrl(msg: DbMessage) {
  const params = new URLSearchParams({
    subject: `Re: ${msg.subject || 'your message'}`,
    body: buildReplyBody(msg),
  })
  return `mailto:${msg.email}?${params.toString()}`
}

interface MessagesPanelProps {
  onChange?: () => void
}

export function MessagesPanel({ onChange }: MessagesPanelProps) {
  const { contact } = useSiteContact()
  const [messages, setMessages] = useState<DbMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) setError(fetchError.message)
    else setMessages((data as DbMessage[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleOpen = async (msg: DbMessage) => {
    const opening = openId !== msg.id
    setOpenId(opening ? msg.id : null)
    if (opening && !msg.read) {
      const { error: updateError } = await supabase.from('messages').update({ read: true }).eq('id', msg.id)
      if (updateError) {
        // Previously failed silently — the message would open and look read,
        // but if this update didn't actually commit (e.g. a missing/broken
        // update RLS policy on the messages table), the unread badge would
        // stay stuck forever with no indication why. Surface it instead.
        setActionError(`Couldn't mark message as read: ${updateError.message}`)
        return
      }
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)))
      onChange?.()
    }
  }

  const handleMarkAllRead = async () => {
    const unreadIds = messages.filter((m) => !m.read).map((m) => m.id)
    if (unreadIds.length === 0) return
    const { error: updateError } = await supabase.from('messages').update({ read: true }).in('id', unreadIds)
    if (updateError) {
      setActionError(`Couldn't mark messages as read: ${updateError.message}`)
      return
    }
    setMessages((prev) => prev.map((m) => (unreadIds.includes(m.id) ? { ...m, read: true } : m)))
    onChange?.()
  }

  const handleDelete = async (msg: DbMessage) => {
    if (!confirm(`Delete the message from "${msg.name}"? This can't be undone.`)) return
    const { error: deleteError } = await supabase.from('messages').delete().eq('id', msg.id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    setMessages((prev) => prev.filter((m) => m.id !== msg.id))
    if (openId === msg.id) setOpenId(null)
    onChange?.()
  }

  const unreadCount = messages.filter((m) => !m.read).length

  if (loading) return <p className="text-text-mid text-sm">Loading…</p>
  if (error) return <p className="text-status-remove text-sm">{error}</p>

  if (messages.length === 0) {
    return <p className="text-text-mid text-sm">No messages yet. They'll show up here as visitors submit the contact form.</p>
  }

  return (
    <div>
      {actionError && (
        <p className="text-status-remove text-xs font-mono mb-4 border border-status-remove/40 bg-status-remove/10 px-3 py-2">
          {actionError}
        </p>
      )}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between gap-4 mb-4">
          <p className="text-text-low text-xs font-mono">
            {unreadCount} unread message{unreadCount === 1 ? '' : 's'}
          </p>
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-teal hover:underline shrink-0"
          >
            Mark all as read
          </button>
        </div>
      )}
      <div className="space-y-3">
        {messages.map((msg) => {
          const isOpen = openId === msg.id
          return (
            <div key={msg.id} className="bg-surface border border-border">
              <button
                onClick={() => toggleOpen(msg)}
                className="w-full text-left p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex items-start gap-3">
                  {msg.read ? (
                    <MailOpen size={16} className="text-text-low mt-0.5 shrink-0" />
                  ) : (
                    <Mail size={16} className="text-teal mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`truncate ${msg.read ? 'text-text-mid' : 'text-text-high font-medium'}`}>
                      {msg.subject || '(no subject)'}
                    </p>
                    <p className="text-text-low text-xs font-mono truncate">
                      {msg.name} · {msg.email} · {formatDate(msg.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(msg)
                    }}
                    className="p-2 text-text-mid hover:text-status-remove transition-colors cursor-pointer"
                    aria-label="Delete message"
                  >
                    <Trash2 size={16} />
                  </span>
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-border-soft">
                  <p className="text-sm text-text-mid whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                  <p className="mt-3 text-xs text-text-low">
                    Both reply options below are pre-filled with a greeting and a short pitch of your
                    services — review and tweak the wording before sending. "Reply in Gmail" opens as{' '}
                    {contact.email || 'your configured email'}, but only if you're signed into that
                    account in this browser — otherwise Gmail will ask you to switch or sign in.
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <a
                      href={gmailComposeUrl(msg, contact.email)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-sm text-teal hover:underline"
                    >
                      Reply in Gmail →
                    </a>
                    <a
                      href={mailtoUrl(msg)}
                      className="inline-flex items-center gap-1.5 text-xs text-text-low hover:text-text-mid transition-colors"
                    >
                      or use your default mail app
                    </a>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
