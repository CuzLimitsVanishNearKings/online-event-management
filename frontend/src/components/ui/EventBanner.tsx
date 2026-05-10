import { useState, useEffect, useRef } from 'react'
import { Calendar, MapPin, Users, Clock } from '../icons'
import { format, parseISO } from 'date-fns'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  category: string
  price: number
  attendees?: number
  thumbnail?: string
}

interface EventBannerProps {
  events?: Event[]
  className?: string
}

const EventBanner = ({ events = [], className = '' }: EventBannerProps) => {
  const [isPaused, setIsPaused] = useState(false)
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Ensure we have enough events for seamless scrolling
  useEffect(() => {
    if (events.length > 0) {
      // Duplicate events to create seamless loop (need at least 3 copies for smooth animation)
      const duplicatedEvents = [...events, ...events, ...events, ...events]
      setAllEvents(duplicatedEvents)
    }
  }, [events])

  const formatEventDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, 'MMM d, yyyy')
    } catch {
      return dateString
    }
  }

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`
  }

  const EventItem = ({ event, index }: { event: Event; index: number }) => (
    <div className="flex-shrink-0 bg-white border border-border rounded-lg p-4 mx-2 hover:shadow-md transition-shadow duration-200 cursor-pointer min-w-[280px] max-w-[350px]">
      <div className="flex items-start space-x-3">
        {/* Event Thumbnail */}
        {event.thumbnail ? (
          <img 
            src={event.thumbnail} 
            alt={event.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        )}
        
        {/* Event Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm mb-1 truncate">
            {event.title}
          </h3>
          
          <div className="flex items-center space-x-3 text-xs text-text-muted mb-2">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatEventDate(event.date)}</span>
            </div>
            
            {event.time && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{event.time}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[100px]">{event.location}</span>
              </div>
              
              {event.attendees && (
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{event.attendees}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-primary">
                {formatPrice(event.price)}
              </span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                {event.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r from-surface/50 to-background/50 py-4 ${className}`}>
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10"></div>
      
      {/* Scrolling container */}
      <div 
        ref={scrollRef}
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className={`flex space-x-4 ${
            isPaused ? '' : 'animate-marquee'
          }`}
          style={{
            animationDuration: `${Math.max(15, allEvents.length * 1.5)}s`,
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {allEvents.map((event, index) => (
            <EventItem 
              key={`${event.id}-${index}`} 
              event={event} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventBanner
