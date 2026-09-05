/** Static, dependency-free hero visual for devices without WebGL support. */
export function Fallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div
        className="w-[70vmin] h-[70vmin] rounded-full opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--color-teal) 0%, transparent 65%)',
        }}
      />
      <svg viewBox="0 0 200 200" className="absolute w-[46vmin] h-[46vmin]">
        <polygon
          points="100,15 175,60 175,140 100,185 25,140 25,60"
          fill="none"
          stroke="var(--color-teal)"
          strokeWidth="1"
          opacity="0.7"
        />
        <polygon
          points="100,45 150,72 150,128 100,155 50,128 50,72"
          fill="none"
          stroke="var(--color-amber)"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}
