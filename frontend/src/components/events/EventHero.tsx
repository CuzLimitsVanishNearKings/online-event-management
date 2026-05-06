import { format, parseISO } from 'date-fns'
import { formatCurrency } from '@/utils/format'

interface EventHeroProps {
  event: {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    price: number
    capacity: number
    currentAttendees: number
    category: string
    image?: string
    organizer: string
  }
}

const EventHero = ({ event }: EventHeroProps) => {
  const formattedDate = format(parseISO(event.date), 'EEEE, MMMM dd, yyyy')
  const imageUrl = event.image || `https://picsum.photos/seed/${event.id}/1200/400.jpg`

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <div className="relative aspect-[3/1] overflow-hidden rounded-xl">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium text-text-primary rounded-full border border-secondary">
            {event.category}
          </span>
        </div>
      </div>

      {/* Event Title and Basic Info */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
          {event.title}
        </h1>

        {/* Key Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {/* Date & Time */}
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-primary flex-shrink-0 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary">{formattedDate}</p>
                <p className="text-text-muted">{event.time}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-primary flex-shrink-0 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary">{event.location}</p>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-primary flex-shrink-0 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary">{event.organizer}</p>
                <p className="text-text-muted">Event Organizer</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Price */}
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-primary flex-shrink-0 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {event.price === 0 ? 'Free' : formatCurrency(event.price)}
                </p>
                <p className="text-text-muted">per ticket</p>
              </div>
            </div>

            {/* Capacity */}
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-primary flex-shrink-0 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {event.currentAttendees} / {event.capacity}
                </p>
                <p className="text-text-muted">attending</p>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-primary flex-shrink-0 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {event.capacity - event.currentAttendees} spots left
                </p>
                <p className="text-text-muted">available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="prose prose-lg max-w-none">
        <h2 className="text-xl font-semibold text-text-primary mb-4">About this event</h2>
        <p className="text-text-muted leading-relaxed whitespace-pre-wrap">
          {event.description}
        </p>
      </div>
    </div>
  )
}

export default EventHero
