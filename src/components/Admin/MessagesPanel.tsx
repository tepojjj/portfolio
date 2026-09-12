import { useCallback, useEffect, useState } from 'react'
import { Trash2, Mail, MailOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { DbMessage } from '@/lib/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

interface MessagesPanelProps {
  onChange?: () => void
}

export function MessagesPanel({ onChange }: MessagesPanelProps) {
  const [messages, setMessages] = useState<DbMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
      if (!updateError) {
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)))
        onChange?.()
      }
    }
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
      {unreadCount > 0 && (
        <p className="text-text-low text-xs font-mono mb-4">
          {unreadCount} unread message{unreadCount === 1 ? '' : 's'}
        </p>
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
                  <a
                    href={`mailto:${msg.email}?subject=${encodeURIComponent('Re: ' + (msg.subject || 'your message'))}`}
                    className="inline-block mt-3 text-sm text-teal hover:underline"
                  >
                    Reply by email →
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
