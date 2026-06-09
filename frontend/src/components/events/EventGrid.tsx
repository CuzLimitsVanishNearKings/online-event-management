import { useState } from 'react'
import EventCard from './EventCard'
import { EventFilters } from './EventFilters'
import { Search, Filter, ArrowUpDown, LayoutGrid, List } from '../icons'
import { Button } from '../ui'
import { cn } from '../../utils/cn'

interface EventGridProps {
  events: any[]
  loading: boolean
  filters: EventFilters
  onFiltersChange?: (filters: EventFilters) => void
}

const EventCardSkeleton = () => (
  <div className="bg-white border border-border rounded-md overflow-hidden animate-pulse">
    <div className="aspect-[16/10] bg-gray-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      <div className="h-5 bg-gray-100 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
      <div className="pt-3 border-t border-border/50">
        <div className="h-4 bg-gray-100 rounded w-1/4" />
      </div>
    </div>
  </div>
)

const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-md border border-dashed border-border">
    <div className="w-14 h-14 bg-white border border-border rounded-md flex items-center justify-center mb-4">
      <Search className="w-6 h-6 text-text-muted" />
    </div>
    <h3 className="font-display font-bold text-lg text-text-primary mb-1">No events found</h3>
    <p className="text-sm text-text-muted max-w-sm mb-6">
      Try adjusting your filters or search to find what you're looking for.
    </p>
    <Button variant="primary" size="sm" onClick={onClear}>
      Clear Filters
    </Button>
  </div>
)

const EventGrid = ({ events, loading, filters, onFiltersChange }: EventGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'price' | 'popularity'>('relevance')

  const sortedEvents = [...events].sort((a, b) => {
    switch (sortBy) {
      case 'date': return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'price': return a.price - b.price
      case 'popularity': return (b.attendees || 0) - (a.attendees || 0)
      default: return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-text-muted">
          {loading ? 'Loading...' : `${events.length} events`}
        </p>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn("p-2 transition-colors", viewMode === 'grid' ? "bg-gray-100 text-text-primary" : "text-text-muted hover:text-text-primary")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn("p-2 transition-colors", viewMode === 'list' ? "bg-gray-100 text-text-primary" : "text-text-muted hover:text-text-primary")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none p-0 text-sm font-medium text-text-primary focus:ring-0 cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="price">Price</option>
              <option value="popularity">Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      ) : events.length === 0 ? (
        <EmptyState onClear={() => onFiltersChange?.({ ...filters, search: '', category: '', city: '', minPrice: 0, maxPrice: 500 })} />
      ) : (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {sortedEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  )
}

export default EventGrid
