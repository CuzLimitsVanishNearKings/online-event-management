import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Ticket, 
  CalendarDays, 
  Eye, 
  Activity,
  MoreVertical,
  ArrowUpRight,
  Clock,
  MapPin,
  Users
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { Button } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { useMetrics } from '@/hooks/useMetrics'
import { cn } from '@/utils/cn'
import axiosClient from '@/api/axiosClient'
import { formatDate } from '@/utils/format'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
}

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-border rounded-xl shadow-card">
        <p className="text-sm font-semibold text-text-muted mb-2">{label}</p>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-1">Revenue</p>
            <p className="text-lg font-bold text-primary">{payload[0].value} FCFA</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-1">Tickets</p>
            <p className="text-lg font-bold text-text-primary">{payload[0].payload.tickets}</p>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function DashboardHome() {
  const { user } = useAuthStore()
  const { data: metrics, isLoading } = useMetrics()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [liveEvents, setLiveEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchLiveEvents = async () => {
      try {
        const response = await axiosClient.get('/events/organizer/my-events')
        setLiveEvents(response.data || [])
      } catch (err) {
        console.error('Failed to load live events for dashboard:', err)
      }
    }
    fetchLiveEvents()
  }, [])

  // Real or derived metrics based on the store
  const activeEventsCount = liveEvents.filter(e => e.status === 'PUBLISHED').length
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 font-medium text-text-muted">Loading your dashboard...</p>
      </div>
    )
  }

  // Handle case where metrics might be undefined if API failed entirely
  const safeMetrics = metrics || {
    totalRevenue: liveEvents.reduce((sum, e) => sum + (e.totalRevenue || 0), 0),
    ticketsSold: liveEvents.reduce((sum, e) => sum + (e.totalTicketsSold || 0), 0),
    activeEvents: activeEventsCount,
    pageViews: 0,
    revenueGrowth: 0,
    ticketGrowth: 0,
    eventsGrowth: 0,
    viewsGrowth: 0,
    revenueData: [], 
    recentActivities: [], 
    upcomingEvents: liveEvents.map(e => ({
      id: e.eventId,
      name: e.title,
      date: formatDate(e.startDateTime),
      status: e.status === 'PUBLISHED' ? 'Published' : e.status === 'DRAFT' ? 'Draft' : e.status === 'CANCELLED' ? 'Cancelled' : 'Past',
      sold: e.totalTicketsSold || 0,
      capacity: e.capacity,
      revenue: e.totalRevenue || 0
    }))
  }

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: `${safeMetrics.totalRevenue.toLocaleString()} FCFA`, 
      growth: 0, 
      icon: DollarSign,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    { 
      title: 'Tickets Sold', 
      value: safeMetrics.ticketsSold.toLocaleString(), 
      growth: 0, 
      icon: Ticket,
      color: 'text-accent-dark',
      bg: 'bg-accent/10'
    },
    { 
      title: 'Active Events', 
      value: safeMetrics.activeEvents.toLocaleString(), 
      growth: 0, 
      icon: CalendarDays,
      color: 'text-sage',
      bg: 'bg-sage/10'
    }
  ]

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Organizer'}
          </h1>
          <p className="text-text-muted mt-2 font-medium">
            Here's what's happening with your events today.
          </p>
        </div>
        <Button onClick={() => window.location.href = '/organizer/events/new'} variant="primary" className="rounded-xl gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="w-5 h-5" />
          Create New Event
        </Button>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-card-hover transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              {stat.growth !== 0 && (
                <div className={cn(
                  "flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-md",
                  stat.growth > 0 ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                )}>
                  {stat.growth > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {Math.abs(stat.growth)}%
                </div>
              )}
            </div>
            <div className="mt-6">
              <p className="text-text-muted font-bold text-xs uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-display font-bold text-text-primary mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {/* We removed the dummy revenue timeline and activity logs, keeping only supported features */}
      </div>

      {/* Active Events Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Upcoming Events</h2>
            <p className="text-sm text-text-muted">Manage your live and draft events</p>
          </div>
          <Link to="/organizer/events">
            <Button variant="outline" className="rounded-xl border-border hover:bg-surface font-bold text-sm">
              View All Events <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Event Details</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Status</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Sales Progress</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Revenue</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeMetrics.upcomingEvents.length > 0 ? (
                safeMetrics.upcomingEvents.map((event) => {
                  const percentSold = Math.round((event.sold / event.capacity) * 100)
                  return (
                    <tr key={event.id} className="group hover:bg-gray-50/50 transition-colors border-b border-border/50 last:border-0">
                      <td className="py-4 px-6">
                        <div className="font-bold text-text-primary">{event.name}</div>
                        <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {event.date}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn(
                          "px-3 py-1 text-xs font-bold rounded-full",
                          event.status === 'Published' ? "bg-green-100 text-green-700" :
                          event.status === 'Draft' ? "bg-gray-100 text-gray-700" :
                          event.status === 'Sold Out' ? "bg-accent/20 text-accent-dark" :
                          "bg-red-100 text-red-700"
                        )}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="w-full max-w-[200px]">
                          <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-text-primary">{event.sold} <span className="text-text-muted font-medium">/ {event.capacity}</span></span>
                            <span className={cn(
                              percentSold >= 90 ? "text-accent-dark" : "text-primary"
                            )}>{percentSold}%</span>
                          </div>
                          <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                percentSold >= 90 ? "bg-accent-dark" : "bg-primary"
                              )}
                              style={{ width: `${percentSold}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-text-primary">
                        {event.revenue.toLocaleString()} FCFA
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center">
                      <CalendarDays className="w-12 h-12 text-border mb-3" />
                      <p className="font-bold text-text-primary">No upcoming events</p>
                      <p className="text-sm mt-1 mb-4">You haven't created any events yet.</p>
                      <Button onClick={() => window.location.href = '/organizer/events/new'} variant="primary" size="sm" className="rounded-xl font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Create Event
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
