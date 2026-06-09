import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  PieChart as PieChartIcon,
  Filter,
  BarChart3,
  MousePointerClick,
  Users
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell
} from 'recharts'
import { Button } from '@/components/ui'
import { useMetrics } from '@/hooks/useMetrics'

const COLORS = ['#9CA763', '#D4A574', '#87A96B', '#E2725B']

// Skeleton helper
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gray-100 rounded animate-pulse ${className ?? ''}`} />
)

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d')
  const { data: metrics, isLoading } = useMetrics()

  // Filter revenue chart data by selected time range
  const revenueData = (() => {
    const raw = metrics?.revenueData ?? []
    if (timeRange === 'all') return raw
    const days = timeRange === '7d' ? 7 : 30
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
    return raw.filter(d => new Date(d.date).getTime() >= cutoff)
  })()

  // KPIs derived from real metrics
  const totalRevenue = metrics?.totalRevenue ?? 0
  const ticketsSold = metrics?.ticketsSold ?? 0
  const avgOrderValue = ticketsSold > 0 ? Math.round(totalRevenue / ticketsSold) : 0

  // Top events by revenue — from upcomingEvents list
  const topEvents = [...(metrics?.upcomingEvents ?? [])]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(e => ({ name: e.name.length > 22 ? e.name.slice(0, 22) + '…' : e.name, value: e.revenue }))

  // Ticket sales by event — same source, by sold count
  const salesByEvent = [...(metrics?.upcomingEvents ?? [])]
    .filter(e => e.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)
    .map(e => ({ name: e.name.length > 22 ? e.name.slice(0, 22) + '…' : e.name, value: e.sold }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Advanced Analytics</h1>
          <p className="text-text-muted mt-1 font-medium">Deep dive into your event performance, conversions, and audience insights.</p>
        </div>
        <div className="flex bg-surface rounded-lg p-1 w-fit">
          {(['7d', '30d', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                timeRange === r
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {r === 'all' ? 'ALL TIME' : r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Revenue',
            value: isLoading ? null : `${totalRevenue.toLocaleString()} FCFA`,
            desc: 'From confirmed bookings',
            icon: Activity
          },
          {
            label: 'Avg Order Value',
            value: isLoading ? null : `${avgOrderValue.toLocaleString()} FCFA`,
            desc: 'Revenue ÷ tickets sold',
            icon: MousePointerClick
          },
          {
            label: 'Tickets Sold',
            value: isLoading ? null : ticketsSold.toLocaleString(),
            desc: 'Across all events',
            icon: Users
          }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-border shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{kpi.label}</p>
              {kpi.value === null
                ? <Skeleton className="mt-2 h-8 w-32" />
                : <h3 className="text-2xl font-display font-bold text-text-primary mt-1">{kpi.value}</h3>
              }
              <p className="text-xs font-medium text-text-muted mt-1">{kpi.desc}</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-surface/50 flex items-center justify-center">
              <kpi.icon className="w-5 h-5 text-text-muted" />
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Over Time */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-text-primary">Revenue Over Time</h2>
          <p className="text-sm text-text-muted">Daily revenue from confirmed bookings</p>
        </div>
        <div className="h-64">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9CA763" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9CA763" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC4" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fill: '#8B7355', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8B7355', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ border: '1px solid #E8DCC4', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: any) => [`${Number(v).toLocaleString()} FCFA`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#9CA763" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-md bg-gray-50/30">
              <BarChart3 className="w-10 h-10 text-text-muted/40 mb-3" />
              <p className="font-bold text-text-primary">No revenue data yet</p>
              <p className="text-sm text-text-muted mt-1">Confirmed bookings will appear here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Events by Revenue */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-6 flex flex-col min-h-[380px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Top Events by Revenue</h2>
              <p className="text-sm text-text-muted">Your highest earning events</p>
            </div>
            <Button variant="outline" className="rounded-md px-3 py-2 border-border text-text-secondary">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 relative">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : topEvents.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEvents} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#E8DCC4" opacity={0.5} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#8B7355', fontSize: 12, fontWeight: 500 }} width={160} />
                  <Tooltip
                    cursor={{ fill: '#F1E8C7', opacity: 0.2 }}
                    formatter={(v: any) => [`${Number(v).toLocaleString()} FCFA`, 'Revenue']}
                  />
                  <Bar dataKey="value" fill="#9CA763" radius={[0, 4, 4, 0]} barSize={28}>
                    {topEvents.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gray-50/30 rounded-md border-2 border-dashed border-border/50">
                <BarChart3 className="w-10 h-10 text-text-muted/40 mb-3" />
                <p className="font-bold text-text-primary">No data yet</p>
                <p className="text-sm text-text-muted mt-1 max-w-xs">Revenue will appear once bookings are confirmed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Sales by Event */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-6 flex flex-col min-h-[380px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Ticket Sales by Event</h2>
              <p className="text-sm text-text-muted">Number of tickets sold per event</p>
            </div>
          </div>
          <div className="flex-1 relative">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : salesByEvent.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByEvent} layout="vertical" margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#E8DCC4" opacity={0.5} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#8B7355', fontSize: 12, fontWeight: 500 }} width={160} />
                  <Tooltip
                    cursor={{ fill: '#F1E8C7', opacity: 0.2 }}
                    formatter={(v: any) => [`${v} tickets`, 'Sold']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
                    {salesByEvent.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gray-50/30 rounded-md border-2 border-dashed border-border/50">
                <PieChartIcon className="w-10 h-10 text-text-muted/40 mb-3" />
                <p className="font-bold text-text-primary">No sales data yet</p>
                <p className="text-sm text-text-muted mt-1 max-w-xs">Ticket sales will appear here once bookings come in.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  )
}