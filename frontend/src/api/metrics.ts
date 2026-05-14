import axiosClient from './axiosClient'
import { ApiResponse } from '../types'

export interface RevenueDataPoint {
  date: string
  revenue: number
  tickets: number
}

export interface RecentActivity {
  id: string
  user: string
  action: string
  time: string
  eventName: string
}

export interface UpcomingEvent {
  id: string
  name: string
  date: string
  capacity: number
  sold: number
  status: 'Published' | 'Draft' | 'Sold Out' | 'Cancelled'
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
  recentActivities: RecentActivity[]
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

export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    const response = await axiosClient.get<ApiResponse<DashboardMetrics>>('/organizer/metrics')
    if (response.data && response.data.success && response.data.data) {
      return response.data.data
    }
    return defaultMetrics
  } catch (error) {
    // If the endpoint is not yet implemented on the backend, gracefully fallback to default zero-metrics
    // instead of crashing the dashboard.
    console.warn('Backend metrics endpoint not available yet. Falling back to default empty state.')
    return defaultMetrics
  }
}
