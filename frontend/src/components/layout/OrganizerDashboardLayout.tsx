import { Outlet, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import OrganizerSidebar from './OrganizerSidebar'
import { useAuthStore } from '@/store/authStore'

export default function OrganizerDashboardLayout() {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const token = localStorage.getItem('token')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />
  }

  if (isAuthenticated && user?.role !== 'organizer') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="sticky top-0 hidden h-screen md:flex">
        <OrganizerSidebar />
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative flex-1 flex flex-col max-w-[280px] w-full bg-white z-50 shadow-2xl"
            >
              <div className="flex flex-1 w-full h-0 overflow-y-auto bg-white">
                <OrganizerSidebar onMobileClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 md:hidden">
          <span className="font-bold text-gray-900">Organizer Portal</span>
          <button
            className="p-2 -mr-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="w-full p-4 mx-auto max-w-7xl md:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}