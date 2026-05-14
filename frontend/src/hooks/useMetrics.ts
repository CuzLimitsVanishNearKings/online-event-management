import { useQuery } from '@tanstack/react-query'
import { fetchDashboardMetrics, DashboardMetrics } from '../api/metrics'
import { useAuthStore } from '../store/authStore'

export const useMetrics = () => {
  const { token, isAuthenticated } = useAuthStore()

  return useQuery<DashboardMetrics>({
    queryKey: ['organizer-metrics'],
    queryFn: fetchDashboardMetrics,
    enabled: !!token && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
