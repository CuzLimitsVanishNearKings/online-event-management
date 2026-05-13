import { Link, useLocation } from 'react-router-dom'
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Receipt, 
  LineChart, 
  Settings 
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/utils/cn'

export default function OrganizerSidebar() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  
  // Extract first name
  const firstName = user?.name?.split(' ')[0] || 'Organizer'

  const navGroups = [
    {
      title: "Overview",
      items: [
        { path: '/organizer/dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: "Management",
      items: [
        { path: '/organizer/events', label: 'Events', icon: CalendarDays },
        { path: '/organizer/attendees', label: 'Attendees', icon: Users },
      ]
    },
    {
      title: "Insights",
      items: [
        { path: '/organizer/orders', label: 'Sales & Orders', icon: Receipt },
        { path: '/organizer/analytics', label: 'Analytics', icon: LineChart },
      ]
    },
    {
      title: "Configuration",
      items: [
        { path: '/organizer/profile', label: 'My Profile', icon: User },
        { path: '/organizer/settings', label: 'Settings', icon: Settings },
      ]
    }
  ]

  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col h-screen sticky top-0 shadow-sm">
      <div className="p-6 border-b border-border flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <img src="/05_evento-horizontal.svg" alt="Evento" className="h-8 w-auto" />
        </Link>
      </div>

      <div className="p-6 pb-2">
        <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Welcome,</p>
        <p className="text-xl font-display font-bold text-text-primary truncate mt-1">{firstName}</p>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-6 overflow-y-auto custom-scrollbar mt-4">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-4 text-xs font-bold uppercase tracking-wider text-text-muted/60 mb-2">
              {group.title}
            </p>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-text-muted")} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border bg-gray-50/50">
        <button 
          onClick={() => {
            logout()
            window.location.href = '/'
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-error hover:bg-error/10 transition-colors font-bold text-sm group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
