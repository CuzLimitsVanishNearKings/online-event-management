import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, CalendarDays, MapPin, Users, Ticket, MoreVertical, Eye, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils/cn'

type EventTab = 'all' | 'published' | 'draft' | 'past' | 'flagged'

export default function EventManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<EventTab>('all')

  // No mock data – will be populated from API
  const events: any[] = []

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || event.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Events</h1>
          <p className="text-text-muted mt-1 font-medium">Monitor all platform events, manage categories, and ensure quality.</p>
        </div>
        <Button variant="outline" className="rounded-xl border-border font-bold text-text-secondary bg-white gap-2">
          <ShieldAlert className="w-4 h-4" />
          Flagged Events
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex gap-2 bg-surface/50 p-1 rounded-lg overflow-x-auto">
            {(['all', 'published', 'draft', 'past', 'flagged'] as EventTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 text-sm font-bold capitalize rounded-md transition-all whitespace-nowrap',
                  activeTab === tab ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search events or organizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full md:w-72"
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
                      <span className={cn(
                        'px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider',
                        event.status === 'published' ? 'bg-green-100 text-green-700' :
                        event.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                        event.status === 'flagged' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      )}>{event.status}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted font-medium">
                      <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {event.date}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.location}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {event.sold} / {event.capacity}</span>
                      <span className="flex items-center gap-1.5"><Ticket className="w-4 h-4" /> by {event.organizer}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <Button variant="outline" className="rounded-xl px-4 py-2 border-border text-sm font-bold text-text-secondary gap-1.5">
                    <Eye className="w-4 h-4" /> View
                  </Button>
                  <button className="p-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-surface transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
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
                : "Once organizers publish events, they will appear here for moderation."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
