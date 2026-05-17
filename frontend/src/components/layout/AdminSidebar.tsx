import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  Layers, 
  BookOpen, 
  Ticket, 
  CreditCard, 
  BarChart3, 
  Bell, 
  Settings, 
  UserCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { cn } from '@/utils/cn'

interface AdminSidebarProps {
  onMobileClose?: () => void
}

export default function AdminSidebar({ onMobileClose }: AdminSidebarProps = {}) {
  const { user, logout } = useAuthStore()
  const { isSidebarCollapsed, toggleSidebar } = useAdminStore()
  const location = useLocation()
  
  const navItems = [
    { group: "Core", items: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    ]},
    { group: "Management", items: [
      { path: '/admin/users', label: 'User Management', icon: Users },
      { path: '/admin/organizers/requests', label: 'Organizer Requests', icon: UserCheck },
      { path: '/admin/events', label: 'Event Management', icon: Calendar },
      { path: '/admin/categories', label: 'Categories', icon: Layers },
    ]},
    { group: "Transactions", items: [
      { path: '/admin/bookings', label: 'Bookings', icon: BookOpen },
      { path: '/admin/tickets', label: 'Tickets', icon: Ticket },
      { path: '/admin/payments', label: 'Payments', icon: CreditCard },
    ]},
    { group: "System", items: [
      { path: '/admin/notifications', label: 'Notifications', icon: Bell },
      { path: '/admin/settings', label: 'Settings', icon: Settings },
    ]}
  ]

  return (
    <aside 
      className={cn(
        "bg-white border-r border-border flex flex-col h-screen sticky top-0 shadow-sm transition-all duration-300 relative",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle (Desktop only) */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 bg-white border border-border rounded-full p-1 shadow-sm text-text-muted hover:text-text-primary hover:scale-110 transition-all z-50 hidden md:flex"
      >
        {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Mobile X Close Button */}
      <button 
        onClick={onMobileClose}
        className="absolute right-4 top-4 p-2 text-text-muted hover:text-text-primary md:hidden z-50"
      >
        <X className="w-6 h-6" />
      </button>

      <div className={cn("p-6 border-b border-border flex items-center", isSidebarCollapsed ? "justify-center px-0" : "justify-center")}>
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          {isSidebarCollapsed ? (
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center p-1.5">
              <img src="/04_evento-icon-white.svg" alt="Evento Icon" className="w-full h-full object-contain" />
            </div>
          ) : (
            <img src="/05_evento-horizontal.svg" alt="Evento" className="h-8 w-auto" />
          )}
        </Link>
      </div>

      <nav className={cn("flex-1 px-4 pb-4 space-y-6 overflow-y-auto custom-scrollbar", isSidebarCollapsed ? "mt-6" : "mt-4")}>
        {navItems.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!isSidebarCollapsed && (
              <p className="px-4 text-[10px] font-black uppercase tracking-widest text-text-muted/60 mb-2">
                {group.group}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onMobileClose?.()}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={cn(
                    "w-full flex items-center rounded-xl font-bold text-sm transition-all duration-200",
                    isSidebarCollapsed ? "justify-center py-3 px-0" : "gap-3 px-4 py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-text-muted")} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border bg-gray-50/50">
        <button 
          onClick={() => {
            onMobileClose?.()
            logout()
            setTimeout(() => {
              window.location.href = '/'
            }, 50)
          }}
          title={isSidebarCollapsed ? "Sign Out" : undefined}
          className={cn(
            "w-full flex items-center rounded-xl text-text-muted hover:text-error hover:bg-error/10 transition-colors font-bold text-sm group",
            isSidebarCollapsed ? "justify-center py-3 px-0" : "gap-3 px-4 py-3"
          )}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
          {!isSidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}

