import { lazy, Suspense } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Section, SectionHeading } from '@/components/shared/Section'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import { useInView } from '@/hooks/useInView'
import { salesTrend, inventoryStatus, revenueByChannel, forecast, kpis } from '@/data/analytics'

const AnalyticsScene = lazy(() =>
  import('@/components/ThreeScene/scenes/AnalyticsScene').then((m) => ({ default: m.AnalyticsScene }))
)

const tooltipStyle = {
  background: '#161d26',
  border: '1px solid #232d3a',
  borderRadius: 0,
  fontSize: 12,
  color: '#edf1f5',
}

function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })
  return (
    <div ref={ref} className="bg-surface border border-border p-6">
      <p className="font-mono text-xs text-text-low mb-4">{title}</p>
      <div className="h-56">{inView ? children : null}</div>
    </div>
  )
}

export function Analytics() {
  return (
    <Section id="analytics" label="Analytics" className="border-t border-border-soft relative overflow-hidden">
      <Suspense fallback={null}>
        <AnalyticsScene />
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/20 via-canvas/60 to-canvas/85 pointer-events-none" />

      <div className="relative z-10">
      <SectionHeading
        index="05 / Analytics"
        title="Sample data, real reporting patterns."
        description="Illustrative figures, shaped the way an actual retail dashboard would be, not decorative."
      />

      <RevealOnScroll>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mb-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-surface p-5">
              <div className="font-display text-2xl md:text-3xl text-text-high">{kpi.value}</div>
              <div className="mt-1 text-xs text-text-mid">{kpi.label}</div>
              <div className="mt-0.5 font-mono text-[10px] text-text-low">{kpi.delta}</div>
            </div>
          ))}
        </div>
      </RevealOnScroll>

      <div className="grid md:grid-cols-2 gap-6">
        <RevealOnScroll>
          <ChartPanel title="MONTHLY SALES">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6B9071" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6B9071" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1a222c" vertical={false} />
                <XAxis dataKey="month" stroke="#5c6875" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#5c6875" fontSize={11} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₱${Number(v).toLocaleString()}`, 'Sales']} />
                <Area type="monotone" dataKey="sales" stroke="#6B9071" strokeWidth={2} fill="url(#salesFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          <ChartPanel title="INVENTORY STATUS BREAKDOWN">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryStatus}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {inventoryStatus.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [Number(v).toLocaleString(), String(n)]} />
                <Legend
                  verticalAlign="bottom"
                  height={24}
                  formatter={(v) => <span style={{ color: '#9caab8', fontSize: 12 }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>
        </RevealOnScroll>

        <RevealOnScroll delay={0.04}>
          <ChartPanel title="REVENUE BY CHANNEL">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByChannel} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid stroke="#1a222c" horizontal={false} />
                <XAxis type="number" stroke="#5c6875" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis dataKey="channel" type="category" stroke="#9caab8" fontSize={12} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₱${Number(v).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#AEC3B0" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </RevealOnScroll>

        <RevealOnScroll delay={0.12}>
          <ChartPanel title="Q4 FORECAST (PROJECTED)">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast}>
                <CartesianGrid stroke="#1a222c" vertical={false} />
                <XAxis dataKey="month" stroke="#5c6875" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#5c6875" fontSize={11} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => (v ? [`₱${Number(v).toLocaleString()}`, ''] : ['—', ''])} />
                <Line type="monotone" dataKey="actual" stroke="#6B9071" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
                <Line type="monotone" dataKey="forecast" stroke="#AEC3B0" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>
        </RevealOnScroll>
      </div>
      </div>
    </Section>
  )
}
