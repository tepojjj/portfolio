export function AdminNotice({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-text-high mb-3">{title}</h1>
        {body && <p className="text-text-mid text-sm leading-relaxed">{body}</p>}
      </div>
    </div>
  )
}
