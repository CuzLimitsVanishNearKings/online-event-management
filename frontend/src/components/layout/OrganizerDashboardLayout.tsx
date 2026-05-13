import { Outlet, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import OrganizerSidebar from './OrganizerSidebar'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'

export default function OrganizerDashboardLayout() {
  const { user, isAuthenticated } = useAuthStore()
  const { isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Protect route
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const role = user?.role?.toLowerCase() || '';
  if (!isAuthenticated || (role !== 'organizer' && role !== 'role_organizer' && role !== 'admin' && role !== 'role_admin')) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:flex h-screen sticky top-0">
        <OrganizerSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div 
            className="fixed inset-0 bg-gray-900/50 transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-50">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            {/* Mobile sidebar container */}
            <div className="flex-1 h-0 overflow-y-auto bg-white flex w-full">
              <OrganizerSidebar />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
          <span className="font-bold text-gray-900">Organizer Portal</span>
          <button 
            className="p-2 -mr-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
