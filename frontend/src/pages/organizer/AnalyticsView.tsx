import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart as LineChartIcon, 
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
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Button } from '@/components/ui'
import { useMetrics } from '@/hooks/useMetrics'

const COLORS = ['#9CA763', '#D4A574', '#87A96B', '#E2725B']

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  
  // Real UI state based on time range (mocked data values will scale slightly for effect)
  const multiplier = timeRange === '7d' ? 0.3 : timeRange === '90d' ? 2.5 : timeRange === 'all' ? 4 : 1;

  const funnelData: any[] = []
  const geoData: any[] = []

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Advanced Analytics</h1>
          <p className="text-text-muted mt-1 font-medium">Deep dive into your event performance, conversions, and audience insights.</p>
        </div>
        <div className="flex bg-surface rounded-lg p-1 w-fit">
          {['7d', '30d', 'All Time'].map((range, idx) => {
            const rangeValue = idx === 0 ? '7d' : idx === 1 ? '30d' : 'all';
            return (
              <button
                key={range}
                onClick={() => setTimeRange(rangeValue as any)}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                  timeRange === rangeValue 
                    ? "bg-white text-text-primary shadow-sm" 
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {range.toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Conversion Rate', value: '0.0%', desc: 'Views to Purchases', icon: MousePointerClick },
          { label: 'Avg Order Value', value: '0 FCFA', desc: 'Per transaction', icon: Activity },
          { label: 'Cart Abandonment', value: '0.0%', desc: 'Dropped at checkout', icon: Users }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-2xl font-display font-bold text-text-primary mt-1">{kpi.value}</h3>
              <p className="text-xs font-medium text-text-muted mt-1">{kpi.desc}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface/50 flex items-center justify-center">
              <kpi.icon className="w-5 h-5 text-text-muted" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales Funnel Chart */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col min-h-[380px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Sales Funnel</h2>
              <p className="text-sm text-text-muted">Track where users drop off</p>
            </div>
            <Button variant="outline" className="rounded-xl px-3 py-2 border-border text-text-secondary">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            {funnelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8DCC4" opacity={0.5} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#8B7355', fontSize: 12, fontWeight: 500 }} />
                  <Tooltip cursor={{fill: '#F1E8C7', opacity: 0.2}} />
                  <Bar dataKey="value" fill="#9CA763" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gray-50/30 rounded-xl border-2 border-dashed border-border/50">
                <BarChart3 className="w-10 h-10 text-text-muted/40 mb-3" />
                <p className="font-bold text-text-primary">Funnel Data Unavailable</p>
                <p className="text-sm text-text-muted mt-1 max-w-xs">Publish your first event and drive traffic to see conversion insights.</p>
              </div>
            )}
          </div>
        </div>

        {/* Attendee Geolocalisation */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col min-h-[380px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Top Attendee Locations</h2>
              <p className="text-sm text-text-muted">Geolocalisation by ticket sales</p>
            </div>
          </div>
          
          <div className="flex-1 relative">
            {geoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geoData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8DCC4" opacity={0.5} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#8B7355', fontSize: 12, fontWeight: 500 }} width={120} />
                  <Tooltip 
                    cursor={{fill: '#F1E8C7', opacity: 0.2}} 
                    formatter={(value) => [`${value} attendees`, 'Sales']}
                  />
                  <Bar dataKey="value" fill="#D4A574" radius={[0, 4, 4, 0]} barSize={24}>
                    {geoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gray-50/30 rounded-xl border-2 border-dashed border-border/50">
                <PieChartIcon className="w-10 h-10 text-text-muted/40 mb-3" />
                <p className="font-bold text-text-primary">No Tracking Data</p>
                <p className="text-sm text-text-muted mt-1 max-w-xs">Location data is unavailable. Sell more tickets to unlock geographic insights.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  )
}
