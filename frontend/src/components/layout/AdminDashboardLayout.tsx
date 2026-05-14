import { Outlet, Navigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, Bell, Search, Globe } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminDashboardLayout() {
  const { user, isAuthenticated } = useAuthStore()
  const { isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Protect route
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Basic role check
  const role = Array.isArray(user?.role) 
    ? (user.role[0]?.authority || user.role[0] || '').toLowerCase()
    : String(user?.role || '').toLowerCase()
    
  const isAdmin = role.includes('admin')

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-surface flex font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] md:hidden flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative flex-1 flex flex-col max-w-[280px] w-full bg-white z-[70] shadow-2xl"
            >
              <AdminSidebar onMobileClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-primary"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-text-muted">
              <Link to="/" className="hover:text-primary transition-colors">
                <Globe className="w-4 h-4" />
              </Link>
              <span className="text-border">/</span>
              <span className="text-sm font-medium text-text-secondary">Admin Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex items-center bg-surface rounded-xl px-3 py-1.5 w-64 border border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <Search className="w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none text-sm ml-2 focus:outline-none w-full text-text-secondary"
              />
            </div>
            
            <button className="relative p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
            </button>

            <div className="h-8 w-[1px] bg-border hidden md:block" />

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-primary leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">System Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-surface custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

