import { useState, type FormEvent } from 'react'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

const initialState: FormState = { name: '', email: '', subject: '', message: '' }

function validate(values: FormState) {
  const errors: Partial<FormState> = {}
  if (!values.name.trim()) errors.name = 'Name is required.'
  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.subject.trim()) errors.subject = 'Subject is required.'
  if (!values.message.trim()) {
    errors.message = 'Message is required.'
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.'
  }
  return errors
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [errorDetail, setErrorDetail] = useState<string | null>(null)

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('submitting')
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured for this site yet.')
      }
      const { error: insertError } = await supabase.from('messages').insert({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      })
      if (insertError) throw new Error(insertError.message)

      // Fire the auto-reply. Intentionally not awaited into the try/catch
      // above — the message is already saved in Supabase either way, so an
      // email failure (e.g. Resend not configured yet) shouldn't block the
      // visitor from seeing their message went through.
      fetch('/api/send-auto-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: values.name.trim(), email: values.email.trim() }),
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Auto-reply failed to send:', err)
      })

      setStatus('success')
      setValues(initialState)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Contact form submit failed:', err)
      setErrorDetail(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-status-keep/40 bg-status-keep/5 p-8 flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="text-status-keep" size={28} />
        <p className="font-display text-lg text-text-high">Message sent.</p>
        <p className="text-sm text-text-mid">Thanks for reaching out. I'll get back to you soon.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm text-teal hover:underline"
          data-cursor="interactive"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Name"
          name="name"
          value={values.name}
          onChange={handleChange('name')}
          error={errors.name}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
        />
      </div>
      <Field
        label="Subject"
        name="subject"
        value={values.subject}
        onChange={handleChange('subject')}
        error={errors.subject}
      />
      <Field
        label="Message"
        name="message"
        as="textarea"
        rows={5}
        value={values.message}
        onChange={handleChange('message')}
        error={errors.message}
      />

      {status === 'error' && (
        <div className="flex items-center gap-2 text-status-remove text-sm">
          <AlertCircle size={16} />
          {errorDetail
            ? `Couldn't send your message: ${errorDetail}`
            : 'Something went wrong sending your message. Please try again.'}
        </div>
      )}

      <MagneticButton type="submit" variant="primary" disabled={status === 'submitting'} className="w-full sm:w-auto">
        {status === 'submitting' ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending...
          </>
        ) : (
          'Send Message'
        )}
      </MagneticButton>
    </form>
  )
}

interface FieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  type?: string
  as?: 'input' | 'textarea'
  rows?: number
}

function Field({ label, name, value, onChange, error, type = 'text', as = 'input', rows }: FieldProps) {
  const commonProps = {
    id: name,
    name,
    value,
    onChange,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${name}-error` : undefined,
    className: `w-full bg-surface border px-4 py-3 text-sm text-text-high placeholder:text-text-low focus:outline-none transition-colors ${
      error ? 'border-status-remove' : 'border-border focus:border-teal'
    }`,
  }

  return (
    <div>
      <label htmlFor={name} className="block text-xs font-mono text-text-low mb-2">
        {label.toUpperCase()}
      </label>
      {as === 'textarea' ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input {...commonProps} type={type} />
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-status-remove">
          {error}
        </p>
      )}
    </div>
  )
}
