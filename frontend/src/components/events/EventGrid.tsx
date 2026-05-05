import EventCard from './EventCard'
import { EventFilters } from './EventFilters'

interface EventGridProps {
  events: Event[]
  loading: boolean
  filters: EventFilters
}

interface Event {
  id: string
  title: string
  date: string
  location: string
  category: string
  price: number
  image?: string
}

// Loading Skeleton Component
const EventCardSkeleton = () => (
  <div className="bg-white border border-secondary rounded-xl overflow-hidden">
    {/* Image Skeleton */}
    <div className="aspect-video bg-gray-200 animate-pulse" />
    
    {/* Content Skeleton */}
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
      </div>
      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
    </div>
  </div>
)

// Empty State Component
const EmptyState = () => (
  <div className="text-center py-16">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-text-primary mb-2">No events found</h3>
    <p className="text-text-muted max-w-md mx-auto">
      Try adjusting your filters or search terms to find events that match your interests.
    </p>
  </div>
)

const EventGrid = ({ events, loading, filters }: EventGridProps) => {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      )
    }

    if (events.length === 0) {
      return <EmptyState />
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Events</h2>
          {!loading && events.length > 0 && (
            <p className="text-text-muted mt-1">
              {events.length} event{events.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        
        {/* Active Filters Display */}
        {(filters.search || filters.category || filters.city || filters.minPrice > 0 || filters.maxPrice < 500) && (
          <div className="flex items-center text-sm text-text-muted">
            <span>Filters applied</span>
          </div>
        )}
      </div>

      {/* Events Grid */}
      {renderContent()}
    </div>
  )
}

export default EventGrid
