import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  Ticket, 
  Heart, 
  Settings,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/utils/cn'

interface AttendeeSidebarProps {
  onMobileClose?: () => void
}

export default function AttendeeSidebar({ onMobileClose }: AttendeeSidebarProps = {}) {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // Extract first name
  const firstName = user?.name?.split(' ')[0] || 'Attendee'

  const navGroups = [
    {
      title: "Overview",
      items: [
        { path: '/attendee/dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: "My Events",
      items: [
        { path: '/attendee/tickets', label: 'My Tickets', icon: Ticket },
        { path: '/attendee/calendar', label: 'Calendar', icon: CalendarDays },
        { path: '/attendee/favorites', label: 'Favorites', icon: Heart },
      ]
    },
    {
      title: "Configuration",
      items: [
        { path: '/attendee/profile', label: 'My Profile', icon: User },
        { path: '/attendee/settings', label: 'Settings', icon: Settings },
      ]
    }
  ]

  return (
    <aside 
      className={cn(
        "bg-white border-r border-border flex flex-col h-screen sticky top-0 shadow-sm transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle (Desktop only) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white border border-border rounded-full p-1 shadow-sm text-text-muted hover:text-text-primary hover:scale-110 transition-all z-50 hidden md:flex"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Mobile X Close Button (Inside sidebar on mobile) */}
      <button 
        onClick={onMobileClose}
        className="absolute right-4 top-4 p-2 text-text-muted hover:text-text-primary md:hidden z-50"
      >
        <X className="w-6 h-6" />
      </button>

      <div className={cn("p-6 border-b border-border flex items-center", isCollapsed ? "justify-center px-0" : "justify-center")}>
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          {isCollapsed ? (
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center p-1.5">
              <img src="/04_evento-icon-white.svg" alt="Evento Icon" className="w-full h-full object-contain" />
            </div>
          ) : (
            <img src="/05_evento-horizontal.svg" alt="Evento" className="h-8 w-auto" />
          )}
        </Link>
      </div>

      <div className={cn("p-6 pb-2", isCollapsed && "hidden")}>
        <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Welcome,</p>
        <p className="text-xl font-display font-bold text-text-primary truncate mt-1">{firstName}</p>
      </div>

      <nav className={cn("flex-1 px-4 pb-4 space-y-6 overflow-y-auto custom-scrollbar", isCollapsed ? "mt-6" : "mt-4")}>
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <p className="px-4 text-xs font-bold uppercase tracking-wider text-text-muted/60 mb-2">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onMobileClose?.()}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "w-full flex items-center rounded-xl font-bold text-sm transition-all duration-200",
                    isCollapsed ? "justify-center py-3 px-0" : "gap-3 px-4 py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-text-muted")} />
                  {!isCollapsed && <span>{item.label}</span>}
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
          title={isCollapsed ? "Sign Out" : undefined}
          className={cn(
            "w-full flex items-center rounded-xl text-text-muted hover:text-error hover:bg-error/10 transition-colors font-bold text-sm group",
            isCollapsed ? "justify-center py-3 px-0" : "gap-3 px-4 py-3"
          )}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
