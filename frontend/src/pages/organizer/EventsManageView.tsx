import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, CalendarDays, MapPin, Users, Ticket, MoreVertical, Ban, AlertCircle } from 'lucide-react'
import { Button, Pagination } from '@/components/ui'
import axiosClient from '@/api/axiosClient'
import { formatDate } from '@/utils/format'
import { usePagination } from '@/hooks/usePagination'

interface OrganizerEvent {
  eventId: number
  title: string
  venue: string
  startDateTime: string
  endDateTime: string
  capacity: number
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED' | 'RESCHEDULED'
  coverImage: string
  totalTicketsSold: number
  totalTicketsRemaining: number
  totalRevenue: number
}

export default function EventsManageView() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<OrganizerEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'cancelled'>('all')
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axiosClient.get<OrganizerEvent[]>('/events/organizer/my-events')
        setEvents(response.data || [])
      } catch (err: any) {
        console.error('Failed to fetch organizer events:', err)
        setError(err.response?.data?.message || 'Failed to fetch your events from the server.')
      } finally {
        setLoading(false)
      }
    }
    fetchOrganizerEvents()
  }, [])

  // Action: Cancel Event via API
  const handleCancelEvent = async (eventId: number) => {
    try {
      setError(null)
      await axiosClient.patch(`/events/${eventId}/cancel`)
      // Update local state cleanly
      setEvents(prev => prev.map(e => e.eventId === eventId ? { ...e, status: 'CANCELLED' } : e))
      setOpenDropdownId(null)
    } catch (err: any) {
      console.error('Failed to cancel event:', err)
      setError(err.response?.data?.message || 'Failed to cancel the event. Only published/rescheduled events can be cancelled.')
    }
  }

  // Filter events dynamically
  const filteredEvents = events.filter((event) => {
    const titleVal = event.title || ''
    const venueVal = event.venue || ''
    const matchesSearch = titleVal.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          venueVal.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Status enum returned in uppercase from backend (e.g. 'PUBLISHED', 'DRAFT')
    const matchesTab = activeTab === 'all' || (event.status && event.status.toLowerCase() === activeTab.toLowerCase())
    return matchesSearch && matchesTab
  })

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToNextPage,
    goToPreviousPage,
    startIndex,
    endIndex,
    totalItems
  } = usePagination(filteredEvents, 10)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Events</h1>
          <p className="text-text-muted mt-1 font-medium">Manage your event listings and track their sales live.</p>
        </div>
        <Button onClick={() => navigate('/organizer/events/new')} variant="primary" className="rounded-xl gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="w-5 h-5" />
          Create Event
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex gap-2 bg-surface/50 p-1 rounded-lg">
            {['all', 'published', 'draft', 'cancelled'].map((tab) => (
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-semibold text-text-muted text-sm">Fetching your event catalog...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="p-4">
            <div className="divide-y divide-border">
              {paginatedData.map((event) => (
                <div key={event.eventId} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20 overflow-hidden shadow-sm">
                      {event.coverImage ? (
                        <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <CalendarDays className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-text-primary text-lg">{event.title}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                          event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                          event.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' :
                          event.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted font-medium">
                        <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {formatDate(event.startDateTime)}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.venue}</span>
                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {event.totalTicketsSold} / {event.capacity} Sold</span>
                        <span className="flex items-center gap-1.5"><Ticket className="w-4 h-4" /> Rev: {event.totalRevenue.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end md:self-auto relative">
                    <Button onClick={() => navigate(`/event/${event.eventId}`)} variant="outline" className="rounded-xl px-4 py-2 border-border text-sm font-bold text-text-secondary">
                      View
                    </Button>
                    
                    {(event.status === 'PUBLISHED' || event.status === 'RESCHEDULED') && (
                      <>
                        <button 
                          onClick={() => setOpenDropdownId(openDropdownId === event.eventId ? null : event.eventId)}
                          className="p-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-surface transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {openDropdownId === event.eventId && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-lg z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                              <button 
                                onClick={() => handleCancelEvent(event.eventId)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                              >
                                 <Ban className="w-4 h-4" /> Cancel Event
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={goToNextPage}
              onPrevious={goToPreviousPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
            />
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
