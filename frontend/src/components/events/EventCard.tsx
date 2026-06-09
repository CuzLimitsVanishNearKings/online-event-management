import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { MapPin } from '../icons'
import { cn } from '../../utils/cn'
import { getImageUrl } from '../../utils/image'

interface EventCardProps {
  event: {
    id: string
    title: string
    description?: string
    venue: string
    startDateTime: string
    endDateTime: string
    status: string
    capacity: number
    coverImage?: string
    category?: { name: string }
    date: string
    location: string
    categoryName: string
    price?: number
    originalPrice?: number
    attendees?: number
    isTrending?: boolean
    isFeatured?: boolean
    city?: string
    country?: string
    thumbnail?: string
  }
}

const EventCard = ({ event }: EventCardProps) => {
  let formattedDate = ''
  try {
    if (event.date && event.date !== 'Invalid Date' && (event.date.includes(',') || isNaN(Date.parse(event.date)) && !event.date.includes('-') && !event.date.includes('T'))) {
      formattedDate = event.date
      if (event.time && event.time !== 'Invalid Date' && !event.date.includes('·') && !event.date.includes(':')) {
        formattedDate += ` · ${event.time}`
      }
    } else {
      const rawDate = event.startDateTime || event.date
      if (rawDate) {
        const parsed = parseISO(rawDate)
        if (!isNaN(parsed.getTime())) {
          formattedDate = format(parsed, 'EEE, MMM d · h:mm a')
        } else {
          const nativeDate = new Date(rawDate)
          if (!isNaN(nativeDate.getTime())) {
            formattedDate = format(nativeDate, 'EEE, MMM d · h:mm a')
          } else {
            formattedDate = rawDate
          }
        }
      } else {
        formattedDate = 'TBD'
      }
    }
  } catch (e) {
    console.error('Error formatting date in EventCard:', e)
    formattedDate = event.date || event.startDateTime || 'TBD'
  }
  
  const hasImage = !!(event.thumbnail || event.coverImage)
  const image = hasImage ? getImageUrl(event.thumbnail || event.coverImage) : ''
  const isFree = !event.price || event.price === 0

  return (
    <Link to={`/event/${event.id}`} className="group block">
      <div className="bg-white rounded-md border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-surface/30">
          {hasImage ? (
                  <img
                    src={image!}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <span className="font-display font-bold text-4xl text-primary/20 uppercase">
                {event.title ? event.title.charAt(0) : 'E'}
              </span>
            </div>
          )}


          {/* Badges */}
          {event.isFeatured && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-accent text-white text-[11px] font-semibold uppercase tracking-wide rounded-md">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Date */}
          <p className="text-sm font-semibold text-primary mb-1">
            {formattedDate}
          </p>

          {/* Title */}
          <h3 className="font-display font-bold text-base text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {/* Location */}
          <p className="text-sm text-text-muted mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.venue || event.city || 'Online Event'}</span>
          </p>

          {/* Price & Category */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <span className="text-sm font-semibold text-text-primary">
              {isFree ? 'Free' : `${event.price} FCFA`}
            </span>
            <span className="text-xs text-text-muted">
              {event.categoryName || 'General'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
