type Status = 'keep' | 'watch' | 'reduce' | 'remove'

const styles: Record<Status, string> = {
  keep: 'text-status-keep border-status-keep/40 bg-status-keep/10',
  watch: 'text-status-watch border-status-watch/40 bg-status-watch/10',
  reduce: 'text-status-reduce border-status-reduce/40 bg-status-reduce/10',
  remove: 'text-status-remove border-status-remove/40 bg-status-remove/10',
}

/** Small status chip reusing the real Keep/Watch/Reduce/Remove inventory
 * taxonomy from the Inventory Health Dashboard project as a recurring visual motif. */
export function StatusTag({ status }: { status: Status }) {
  return (
    <span className={`font-mono text-[11px] px-2 py-1 border rounded-sm ${styles[status]}`}>
      {status}
    </span>
  )
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] px-2 py-1 border border-border text-text-mid rounded-sm">
      {children}
    </span>
  )
}
