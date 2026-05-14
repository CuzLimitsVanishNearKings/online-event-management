import { create } from 'zustand'

interface AdminState {
  isLoading: boolean
  isSidebarCollapsed: boolean
  stats: {
    totalUsers: number
    totalOrganizers: number
    totalAttendees: number
    activeEvents: number
    ticketsSold: number
    revenue: number
    pendingApprovals: number
  } | null
  
  // Actions
  setLoading: (loading: boolean) => void
  toggleSidebar: () => void
  setStats: (stats: any) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  isLoading: true, // Default to true to show skeletons
  isSidebarCollapsed: false,
  stats: null,
  
  setLoading: (loading) => set({ isLoading: loading }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setStats: (stats) => set({ stats, isLoading: false }),
}))
