import axiosClient from './axiosClient'

export interface RevenueDataPoint {
  date: string
  revenue: number
  tickets: number
}

export interface UpcomingEvent {
  id: string
  name: string
  date: string
  capacity: number
  sold: number
  status: 'Published' | 'Draft' | 'Sold Out' | 'Cancelled' | 'Past'
  revenue: number
}

export interface DashboardMetrics {
  totalRevenue: number
  ticketsSold: number
  activeEvents: number
  pageViews: number
  revenueGrowth: number
  ticketGrowth: number
  eventsGrowth: number
  viewsGrowth: number
  revenueData: RevenueDataPoint[]
  recentActivities: any[]
  upcomingEvents: UpcomingEvent[]
}

const defaultMetrics: DashboardMetrics = {
  totalRevenue: 0,
  ticketsSold: 0,
  activeEvents: 0,
  pageViews: 0,
  revenueGrowth: 0,
  ticketGrowth: 0,
  eventsGrowth: 0,
  viewsGrowth: 0,
  revenueData: [],
  recentActivities: [],
  upcomingEvents: []
}

/**
 * Derives organizer dashboard metrics from two existing backend endpoints:
 *  - GET /api/events/organizer/my-events   → event list with capacity, status, etc.
 *  - GET /api/bookings/organizer            → all bookings for this organizer's events
 *
 * This replaces the previous call to /api/organizer/metrics which does not exist
 * on the backend, causing the dashboard stats to always show zeroes.
 */
export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    const [eventsRes, bookingsRes] = await Promise.all([
      axiosClient.get('/events/organizer/my-events'),
      axiosClient.get('/bookings/organizer')
    ])

    const events: any[] = eventsRes.data || []
    const bookings: any[] = bookingsRes.data || []

    // ── Revenue & ticket totals ──────────────────────────────────────────────
    const totalRevenue = bookings
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0)

    const ticketsSold = bookings
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + (b.ticketCount || 0), 0)

    // ── Active events ────────────────────────────────────────────────────────
    const activeEvents = events.filter(e => e.status === 'PUBLISHED').length

    // ── Revenue per event (for the table) ───────────────────────────────────
    const revenueByEvent: Record<string, number> = {}
    const soldByEvent: Record<string, number> = {}

    bookings
      .filter(b => b.status === 'CONFIRMED')
      .forEach(b => {
        // bookings summary doesn't carry eventId directly; match by title as fallback
        // If your backend Summary DTO gets an eventId field later, swap this to b.eventId
        const key = b.eventTitle || ''
        revenueByEvent[key] = (revenueByEvent[key] || 0) + (Number(b.totalAmount) || 0)
        soldByEvent[key] = (soldByEvent[key] || 0) + (b.ticketCount || 0)
      })

    // ── Map events to UpcomingEvent shape ────────────────────────────────────
    const upcomingEvents: UpcomingEvent[] = events.map(e => {
      const rawStatus = e.status as string
      let status: UpcomingEvent['status'] = 'Draft'
      if (rawStatus === 'PUBLISHED') {
        const sold = soldByEvent[e.title] || 0
        status = sold >= (e.capacity || Infinity) ? 'Sold Out' : 'Published'
      } else if (rawStatus === 'CANCELLED') {
        status = 'Cancelled'
      } else if (rawStatus === 'PAST' || rawStatus === 'ENDED') {
        status = 'Past'
      }

      const startDate = new Date(e.startDateTime)
      return {
        id: e.eventId?.toString() || '',
        name: e.title || 'Untitled',
        date: startDate.toLocaleDateString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
        }),
        capacity: e.capacity || 0,
        sold: soldByEvent[e.title] || 0,
        status,
        revenue: revenueByEvent[e.title] || 0
      }
    })

    // ── Revenue chart data (last 30 days, grouped by day) ───────────────────
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    const byDay: Record<string, { revenue: number; tickets: number }> = {}

    bookings
      .filter(b => b.status === 'CONFIRMED' && new Date(b.bookingDate).getTime() >= thirtyDaysAgo)
      .forEach(b => {
        const day = new Date(b.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        if (!byDay[day]) byDay[day] = { revenue: 0, tickets: 0 }
        byDay[day].revenue += Number(b.totalAmount) || 0
        byDay[day].tickets += b.ticketCount || 0
      })

    const revenueData: RevenueDataPoint[] = Object.entries(byDay)
      .map(([date, v]) => ({ date, ...v }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return {
      ...defaultMetrics,
      totalRevenue,
      ticketsSold,
      activeEvents,
      upcomingEvents,
      revenueData
    }
  } catch (error) {
    console.warn('Failed to fetch organizer metrics:', error)
    return defaultMetrics
  }
}