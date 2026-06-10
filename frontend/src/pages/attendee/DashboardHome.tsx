import { motion } from 'framer-motion'
import { Ticket, CalendarDays, Compass, Activity, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui'
import { cn } from '@/utils/cn'
import { useAttendeeBookings } from '@/hooks/useAttendeeBookings'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
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

interface MappedTicket {
  id: string
  eventName: string
  date: string
  ticketType: string
  price: number
  qrCodeData: string
  status: 'upcoming' | 'past'
}

export default function DashboardHome() {
  const { user } = useAuthStore()
  const { data: tickets = [], isLoading: loading } = useAttendeeBookings()

  const upcomingEvents = tickets.filter(t => t.status === 'upcoming')
  const pastEventsCount = tickets.filter(t => t.status === 'past').length
  const totalSpent = tickets.reduce((acc, curr) => acc + curr.price, 0)

  const statCards = [
    {
      title: 'Upcoming Events',
      value: loading ? '-' : upcomingEvents.length.toString(),
      icon: CalendarDays,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'Events Attended',
      value: loading ? '-' : pastEventsCount.toString(),
      icon: Ticket,
      color: 'text-accent-dark',
      bg: 'bg-accent/10'
    },
    {
      title: 'Total Spent',
      value: loading ? '-' : `${totalSpent.toLocaleString()} FCFA`,
      icon: Activity,
      color: 'text-terracotta',
      bg: 'bg-terracotta/10'
    }
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">
            Welcome, {user?.name?.split(' ')[0] || 'Attendee'}
          </h1>
          <p className="text-text-muted mt-2 font-medium">
            Ready for your next experience? Here is your event summary.
          </p>
        </div>
        <Button onClick={() => window.location.href = '/events'} variant="primary" className="rounded-md gap-2 font-bold shadow-md shadow-primary/20">
          <Compass className="w-5 h-5" />
          Discover Events
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-border shadow-sm hover:shadow-card-hover transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className={cn('w-12 h-12 rounded-md flex items-center justify-center', stat.bg)}>
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-text-muted font-bold text-xs uppercase tracking-wider">{stat.title}</p>
              {loading ? (
                <div className="mt-2 h-8 w-24 bg-gray-100 rounded animate-pulse" />
              ) : (
                <h3 className="text-3xl font-display font-bold text-text-primary mt-1">{stat.value}</h3>
              )}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Next Event */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg border border-border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Your Next Event</h2>
            <p className="text-sm text-text-muted">Get your tickets ready</p>
          </div>
          <Link to="/attendee/tickets" className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
            All Tickets <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-6 bg-surface/30 border border-border rounded-md p-6">
            <div className="flex-1">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-3 inline-block">Confirmed</span>
              <h3 className="text-2xl font-bold text-text-primary mb-2">{upcomingEvents[0].eventName}</h3>
              <div className="space-y-2 mt-4 text-sm font-medium text-text-secondary">
                <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {upcomingEvents[0].date}</p>
                <p className="flex items-center gap-2"><Ticket className="w-4 h-4" /> {upcomingEvents[0].ticketType} Ticket</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md border border-border shadow-sm flex flex-col items-center justify-center min-w-[160px]">
              <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xs text-text-muted font-bold">QR CODE</span>
              </div>
              <p className="text-xs font-mono font-bold text-text-muted">{upcomingEvents[0].qrCodeData}</p>
            </div>
          </div>
        ) : (
          <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md bg-surface/30">
            <CalendarDays className="w-12 h-12 text-text-muted/30 mb-3" />
            <p className="text-text-muted font-bold">No upcoming events</p>
            <p className="text-sm text-text-muted/70 mt-1 mb-4">You haven't booked any tickets yet.</p>
            <Button onClick={() => window.location.href = '/events'} variant="outline" size="sm" className="rounded-md font-bold">
              Browse Events
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}