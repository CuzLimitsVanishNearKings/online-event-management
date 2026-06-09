import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, CalendarDays, MapPin, Ticket, Eye, ShieldAlert, Layers, AlertCircle } from 'lucide-react'
import { Button, Pagination } from '@/components/ui'
import { cn } from '@/utils/cn'
import axiosClient from '@/api/axiosClient'
import { usePagination } from '@/hooks/usePagination'
import { getImageUrl } from '@/utils/image'

type EventTab = 'all' | 'published' | 'draft' | 'past' | 'flagged'

interface EventSummary {
  eventId: number
  title: string
  venue: string
  startDateTime: string
  endDateTime: string
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED' | 'RESCHEDULED'
  coverImage?: string
  category: {
    categoryId: number
    name: string
  }
  organizerName: string
  organizerLogoUrl?: string
}

export default function EventManagement() {
  const navigate = useNavigate()
  
  const [events, setEvents] = useState<EventSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<EventTab>('all')

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosClient.get<EventSummary[]>('/events/admin/all')
      setEvents(res.data || [])
    } catch (err: any) {
      console.error('Failed to fetch admin events:', err)
      setError(err.response?.data?.message || 'Failed to load platform events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      (event.title || '').toLowerCase().includes(query) ||
      (event.organizerName || '').toLowerCase().includes(query)
      
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'published' && (event.status === 'PUBLISHED' || event.status === 'RESCHEDULED')) ||
      (activeTab === 'draft' && event.status === 'DRAFT') ||
      (activeTab === 'past' && event.status === 'COMPLETED') ||
      (activeTab === 'flagged' && event.status === 'CANCELLED')
      
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

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return isoStr
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Events</h1>
          <p className="text-text-muted mt-1 font-medium">Monitor all platform events, manage categories, and ensure quality.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setActiveTab('flagged')} 
          className={cn(
            'rounded-md border-border font-bold bg-white gap-2 transition-colors',
            activeTab === 'flagged' ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-50' : 'text-text-secondary'
          )}
        >
          <ShieldAlert className="w-4 h-4" />
          Flagged/Cancelled
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
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
                {tab === 'flagged' ? 'Cancelled' : tab}
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
                className="pl-9 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full md:w-72"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 space-y-6">
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-16 h-16 bg-gray-100 rounded-md" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-50 rounded w-1/2" />
              </div>
            </div>
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-16 h-16 bg-gray-100 rounded-md" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-100 rounded w-1/4" />
                <div className="h-4 bg-gray-50 rounded w-2/3" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600 font-bold flex flex-col items-center justify-center gap-3">
            <AlertCircle className="w-12 h-12" />
            <p>{error}</p>
            <Button variant="outline" onClick={fetchEvents} className="rounded-md border-red-200 mt-2 text-red-700 hover:bg-red-50">Retry</Button>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="p-4">
            <div className="divide-y divide-border">
              {paginatedData.map((event) => (
                <div key={event.eventId} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0 border border-primary/10">
                      {event.coverImage ? (
                        <img src={getImageUrl(event.coverImage)} alt={event.title} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <CalendarDays className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-text-primary text-lg">{event.title}</h3>
                        <span className={cn(
                          'px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider',
                          event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                          event.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' :
                          event.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          event.status === 'RESCHEDULED' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        )}>{event.status}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted font-medium mt-1.5">
                        <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-text-muted/65" /> {formatDate(event.startDateTime)}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-text-muted/65" /> {event.venue}</span>
                        <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-text-muted/65" /> {event.category?.name || 'Unclassified'}</span>
                        <span className="flex items-center gap-1.5"><Ticket className="w-4 h-4 text-text-muted/65" /> by {event.organizerName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/event/${event.eventId}`)}
                      className="rounded-md px-4 py-2 border-border text-sm font-bold text-text-secondary gap-1.5 hover:bg-gray-50 bg-white"
                    >
                      <Eye className="w-4 h-4" /> View
                    </Button>
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
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-lg bg-surface/30">
            <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-lg flex items-center justify-center mb-4">
              <CalendarDays className="w-8 h-8 text-text-muted/50" />
            </div>
            <h3 className="text-xl font-display font-bold text-text-primary">No events found</h3>
            <p className="text-text-muted mt-2 max-w-md">
              {searchQuery
                ? `We couldn't find any events matching "${searchQuery}". Try adjusting your filters.`
                : "Once organizers publish events, they will appear here for platform monitoring."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
