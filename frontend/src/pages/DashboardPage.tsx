import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Plus, 
  LogOut, 
  Building2, 
  Settings, 
  BarChart3, 
  LayoutDashboard,
  Search,
  Bell,
  MoreVertical,
  ArrowUpRight,
  Zap,
  Filter,
  Ticket,
  ChevronRight,
  Star
} from '../components/icons'
import { useAuthStore } from '../store/authStore'
import { cn } from '../utils/cn'
import React from 'react'
import { useEvents } from '../hooks/useEvents'

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { events, loading: eventsLoading } = useEvents()

  const isOrganizer = user?.role?.toLowerCase() === 'organizer' || user?.role?.toLowerCase() === 'admin'

  const totalRevenue = events.reduce((sum, e) => sum + ((e.price || 0) * (e.attendees || 0)), 0)
  const ticketsSold = events.reduce((sum, e) => sum + (e.attendees || 0), 0)
  const validRatings = events.filter(e => e.rating !== undefined && e.rating > 0)
  const avgRating = validRatings.length > 0 
    ? (validRatings.reduce((sum, e) => sum + (e.rating || 0), 0) / validRatings.length).toFixed(1)
    : "0.0"

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Loading Workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-text-primary hidden lg:flex flex-col sticky top-0 h-screen text-white/70">
         <div className="p-8">
            <Link to="/" className="flex items-center gap-2 group">
               <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                  <Zap className="w-5 h-5 text-white" />
               </div>
               <span className="text-2xl font-display font-bold text-white tracking-tight">Evento</span>
            </Link>
         </div>

         <div className="px-6 mb-8">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
               <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                     <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-white">Pro Account</p>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest">Active Membership</p>
                  </div>
               </div>
               <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors">
                  View Benefits
               </button>
            </div>
         </div>

         <nav className="flex-1 px-4 space-y-1">
            <SidebarItem icon={<LayoutDashboard />} label="Overview" active />
            <SidebarItem icon={<Calendar />} label="Events" />
            <SidebarItem icon={<Ticket />} label="Orders" />
            <SidebarItem icon={<Users />} label="Community" />
            <SidebarItem icon={<BarChart3 />} label="Analytics" />
            <SidebarItem icon={<Settings />} label="Preferences" />
         </nav>

         <div className="p-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:text-white hover:bg-white/5 transition-all font-bold text-sm"
            >
               <LogOut className="w-5 h-5" />
               Sign Out
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
         {/* Top Navbar */}
         <header className="h-16 md:h-20 bg-white border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
            <div className="flex items-center gap-3 md:gap-8 overflow-hidden">
               {/* Mobile Logo / Home link */}
               <Link to="/" className="lg:hidden flex items-center justify-center p-2 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <Zap className="w-5 h-5" />
               </Link>

               <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar flex-shrink-0">
                  <span className="px-4 md:px-6 py-1.5 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-lg bg-white text-primary shadow-sm whitespace-nowrap">
                    {isOrganizer ? 'Organizer Portal' : 'Attendee Portal'}
                  </span>
               </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6 flex-shrink-0">
               <div className="relative hidden md:block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="text" 
                    placeholder="Search workspace..." 
                    className="pl-12 pr-4 py-2.5 bg-gray-50 rounded-xl border-none text-sm w-64 focus:ring-2 focus:ring-primary/20"
                  />
               </div>
               <button className="p-2 text-text-muted hover:text-primary transition-colors relative hidden sm:block">
                  <Bell className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
               </button>
               <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-[1px]">
                  <div className="w-full h-full bg-white rounded-[11px] overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?u=${user?.email}`} alt="" />
                  </div>
               </div>
            </div>
         </header>

         <div className="p-4 md:p-8 space-y-6 md:space-y-10 overflow-y-auto max-w-7xl mx-auto w-full">
            {isOrganizer ? (
               <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
                     <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">Organizer Hub</h1>
                        <p className="text-sm md:text-base text-text-muted font-medium">Manage your events, analyze performance, and grow your audience.</p>
                     </div>
                     <Button 
                       variant="primary" 
                       size="lg" 
                       className="rounded-xl gap-2 px-6 md:px-8 w-full sm:w-auto"
                       onClick={() => navigate('/events/new')}
                     >
                        <Plus className="w-5 h-5" />
                        Create Event
                     </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} trend="Real-time" icon={<TrendingUp />} />
                     <StatCard label="Tickets Sold" value={ticketsSold.toString()} trend="Real-time" icon={<Ticket />} />
                     <StatCard label="Avg. Rating" value={avgRating} trend="Real-time" icon={<Star />} />
                  </div>

                  <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-card">
                     <div className="p-8 border-b border-border flex items-center justify-between bg-gray-50/30">
                        <div>
                           <h2 className="text-xl font-display font-bold text-text-primary">Your Events</h2>
                           <p className="text-xs text-text-muted font-medium mt-1">Manage and track your upcoming experiences.</p>
                        </div>
                        {events.length > 0 && <Button variant="outline" size="sm" className="rounded-xl">View All</Button>}
                     </div>
                     
                     {eventsLoading ? (
                        <div className="p-8 text-center py-20 flex justify-center">
                           <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                     ) : events.length === 0 ? (
                        <div className="p-8 text-center py-20">
                           <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
                              <Calendar className="w-8 h-8 text-text-muted" />
                           </div>
                           <h3 className="font-bold text-text-primary text-lg">No active events</h3>
                           <p className="text-text-muted text-sm max-w-xs mx-auto mb-8">Ready to host? Create your first event and start sharing experiences.</p>
                           <Button variant="primary" onClick={() => navigate('/events/new')}>Start Creating</Button>
                        </div>
                     ) : (
                        <div className="divide-y divide-border">
                           {events.slice(0, 5).map(event => (
                              <div key={event.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                       {event.thumbnail ? (
                                          <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
                                       ) : (
                                          <div className="w-full h-full flex items-center justify-center">
                                             <Calendar className="w-5 h-5 text-text-muted" />
                                          </div>
                                       )}
                                    </div>
                                    <div>
                                       <h3 className="font-bold text-text-primary">{event.title}</h3>
                                       <p className="text-xs text-text-muted">{event.date} • {event.location}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                       <p className="font-bold text-text-primary">{event.attendees || 0}</p>
                                       <p className="text-[10px] text-text-muted uppercase tracking-wider">Attendees</p>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                       <p className="font-bold text-text-primary">${(event.price || 0) * (event.attendees || 0)}</p>
                                       <p className="text-[10px] text-text-muted uppercase tracking-wider">Revenue</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-lg">Manage</Button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </>
            ) : (
               <>
                  <div className="space-y-1 mb-6 md:mb-8">
                     <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">My Experiences</h1>
                     <p className="text-sm md:text-base text-text-muted font-medium">View your tickets, saved events, and past memories.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div className="bg-white border border-border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center col-span-full py-20">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                           <Ticket className="w-8 h-8 text-text-muted" />
                        </div>
                        <h3 className="font-display font-bold text-text-primary text-xl mb-2">No tickets yet</h3>
                        <p className="text-sm text-text-muted mb-8 max-w-sm">You haven't purchased any tickets. Explore what's happening near you and start making memories.</p>
                        <Button variant="primary" onClick={() => navigate('/events')}>Browse Events</Button>
                     </div>
                  </div>
               </>
            )}
         </div>
      </main>
    </div>
  )
}

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
   <button className={cn(
      "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all",
      active 
         ? "bg-primary text-white shadow-lg shadow-primary/20" 
         : "text-white/50 hover:text-white hover:bg-white/5"
   )}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      {label}
   </button>
)

const StatCard = ({ label, value, trend, icon }: { label: string, value: string, trend: string, icon: React.ReactNode }) => (
   <div className="bg-white border border-border rounded-2xl p-6 shadow-card hover:border-primary/20 transition-all group">
      <div className="flex items-center justify-between mb-4">
         <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-text-primary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
         </div>
         <span className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-lg",
            trend.startsWith('+') ? "bg-green-50 text-green-600" : "bg-gray-50 text-text-muted"
         )}>{trend}</span>
      </div>
      <div>
         <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{label}</p>
         <p className="text-2xl font-display font-bold text-text-primary">{value}</p>
      </div>
   </div>
)

export default DashboardPage
