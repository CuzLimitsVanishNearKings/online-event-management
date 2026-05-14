import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, CalendarDays, MapPin, Users, Ticket, MoreVertical, Edit2, PauseCircle, Ban } from 'lucide-react'
import { Button } from '@/components/ui'
import { useEventStore, EventItem } from '@/store/eventStore'
import { format } from 'date-fns'

export default function EventsManageView() {
  const navigate = useNavigate()
  const { events } = useEventStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'past'>('all')
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Filter events dynamically
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || event.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Events</h1>
          <p className="text-text-muted mt-1 font-medium">Manage your event listings and track their status.</p>
        </div>
        <Button onClick={() => navigate('/organizer/events/new')} variant="primary" className="rounded-xl gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="w-5 h-5" />
          Create Event
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex gap-2 bg-surface/50 p-1 rounded-lg">
            {['all', 'published', 'draft', 'past'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 text-sm font-bold capitalize rounded-md transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-text-primary shadow-sm' 
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full md:w-64"
              />
            </div>
            <Button variant="outline" className="rounded-xl px-3 py-2 border-border text-text-secondary">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {filteredEvents.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                    <CalendarDays className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-text-primary text-lg">{event.title}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                        event.status === 'published' ? 'bg-green-100 text-green-700' :
                        event.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted font-medium">
                      <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {format(new Date(event.date), 'MMM do, yyyy')}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.location}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 0 / {event.capacity}</span>
                      <span className="flex items-center gap-1.5"><Ticket className="w-4 h-4" /> {event.price.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end md:self-auto relative">
                  <Button variant="outline" className="rounded-xl px-4 py-2 border-border text-sm font-bold text-text-secondary">
                    Manage
                  </Button>
                  <button 
                    onClick={() => setOpenDropdownId(openDropdownId === event.id ? null : event.id)}
                    className="p-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-surface transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {openDropdownId === event.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-lg z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-text-secondary hover:bg-primary/5 hover:text-primary transition-colors">
                           <Edit2 className="w-4 h-4" /> Edit Event
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-text-secondary hover:bg-amber-50 hover:text-amber-600 transition-colors">
                           <PauseCircle className="w-4 h-4" /> Pause Sales
                        </button>
                        <div className="border-t border-border my-1" />
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                           <Ban className="w-4 h-4" /> Cancel Event
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-2xl bg-surface/30">
            <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-2xl flex items-center justify-center mb-4">
              <CalendarDays className="w-8 h-8 text-text-muted/50" />
            </div>
            <h3 className="text-xl font-display font-bold text-text-primary">No events found</h3>
            <p className="text-text-muted mt-2 max-w-md">
              {searchQuery 
                ? `We couldn't find any events matching "${searchQuery}". Try adjusting your filters.` 
                : "You haven't created any events yet. Click the button below to get started."}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/organizer/events/new')} variant="primary" className="mt-6 rounded-xl font-bold">
                Create Your First Event
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
