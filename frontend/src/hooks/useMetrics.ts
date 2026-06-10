import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { fetchDashboardMetrics, DashboardMetrics } from '../api/metrics'
import { useAuthStore } from '../store/authStore'
import { useWebSocket } from './useWebSocket'

export const useMetrics = () => {
  const { token, isAuthenticated, user } = useAuthStore()
  const queryClient = useQueryClient()

  // When the backend broadcasts a stats update for this organizer,
  // invalidate the cache so the next render re-fetches fresh data.
  const handleStatsUpdate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['organizer-metrics'] })
  }, [queryClient])

  // user.id is the organizer's userId — matches what BookingServiceImpl
  // passes to broadcastOrganizerStats(organizerId, ...)
  const topic = user?.numericId ? `/topic/organizer/${user.numericId}/stats` : ''

  useWebSocket({
    topic,
    onMessage: handleStatsUpdate,
    enabled: !!token && isAuthenticated && !!topic,
  })

  return useQuery<DashboardMetrics>({
    queryKey: ['organizer-metrics'],
    queryFn: fetchDashboardMetrics,
    enabled: !!token && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}