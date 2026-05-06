import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { Card, CardContent } from '../ui'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, MapPin, Calendar, Users, Star } from 'lucide-react'

interface EventCardProps {
  event: {
    id: string
    title: string
    date: string
    location: string
    category: string
    price: number
    originalPrice?: number
    images: string[]
    thumbnail?: string
    attendees?: number
    rating?: number
    reviewCount?: number
    isTrending?: boolean
    isFeatured?: boolean
    country?: string
    city?: string
    venue?: string
    tags?: string[]
  }
}

const EventCard = ({ event }: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  
  const formattedDate = format(parseISO(event.date), 'MMM dd, yyyy')
  const images = event.images.length > 0 ? event.images : [event.thumbnail || `https://picsum.photos/seed/${event.id}/400/225.jpg`]
  
  // Auto-rotate images on hover
  useEffect(() => {
    if (isHovered && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isHovered, images.length])

  const handleImagePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleImageNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const handleSaveEvent = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  const hasDiscount = event.originalPrice && event.originalPrice > event.price
  const discountPercentage = hasDiscount 
    ? Math.round(((event.originalPrice! - event.price) / event.originalPrice!) * 100)
    : 0

  return (
    <Link to={`/event/${event.id}`}>
      <Card 
        className={`group cursor-pointer transition-all duration-300 overflow-hidden ${
          isHovered ? 'shadow-xl shadow-primary/20 transform -translate-y-3' : 'shadow-md'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          {/* Enhanced Image Carousel */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={`${event.title} - Image ${currentImageIndex + 1}`}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 brightness-90' : 'scale-100 brightness-100'
              }`}
            />
            
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}></div>
            
            {/* Image navigation indicators */}
            {images.length > 1 && (
              <>
                {/* Navigation arrows */}
                <button
                  onClick={handleImagePrev}
                  className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 text-text-primary" />
                </button>
                <button
                  onClick={handleImageNext}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 text-text-primary" />
                </button>
                
                {/* Image dots indicator */}
                <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white w-3' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Top badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {/* Category Badge */}
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-text-primary rounded-full border border-secondary">
                {event.category}
              </span>
              
              {/* Featured/Trending Badges */}
              {event.isFeatured && (
                <span className="px-2 py-1 bg-accent text-white text-xs font-medium rounded-full">
                  Featured
                </span>
              )}
              {event.isTrending && (
                <span className="px-2 py-1 bg-terracotta text-white text-xs font-medium rounded-full flex items-center gap-1">
                  🔥 Trending
                </span>
              )}
            </div>

            {/* Save button */}
            <button
              onClick={handleSaveEvent}
              className={`absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full transition-all duration-300 ${
                isSaved ? 'text-red-500' : 'text-text-secondary hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* Rating Badge */}
            {event.rating && (
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-1 bg-black/70 backdrop-blur-sm text-xs font-medium text-white rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {event.rating}
                  {event.reviewCount && (
                    <span className="text-white/70">({event.reviewCount})</span>
                  )}
                </span>
              </div>
            )}

            {/* Attendees count on hover */}
            {event.attendees && isHovered && (
              <div className="absolute bottom-3 right-3">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-text-primary rounded-full flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {event.attendees} going
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Content */}
          <div className="p-5">
            {/* Title with hover effect */}
            <h3 className={`font-semibold text-text-primary text-lg mb-3 line-clamp-2 transition-colors duration-300 ${
              isHovered ? 'text-primary' : ''
            }`}>
              {event.title}
            </h3>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {event.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-surface/50 text-xs text-text-secondary rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {event.tags.length > 3 && (
                  <span className="px-2 py-1 bg-surface/50 text-xs text-text-secondary rounded-full">
                    +{event.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Date and Location with icons */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-text-secondary">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                {formattedDate}
              </div>
              <div className="flex items-center text-sm text-text-secondary">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                {event.venue || event.location}
                {event.city && event.country && (
                  <span className="text-text-muted ml-1">
                    • {event.city}, {event.country}
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Price and Action */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {hasDiscount && (
                    <span className="text-sm text-text-muted line-through">
                      ${event.originalPrice}
                    </span>
                  )}
                  <span className={`text-xl font-bold transition-colors duration-300 ${
                    isHovered ? 'text-primary' : 'text-primary'
                  }`}>
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </span>
                </div>
                {hasDiscount && (
                  <span className="text-xs text-green-600 font-medium">
                    Save {discountPercentage}%
                  </span>
                )}
                {event.attendees && !isHovered && (
                  <span className="text-xs text-text-secondary">
                    {event.attendees} attending
                  </span>
                )}
              </div>
              
              {/* Animated arrow */}
              <div className={`transform transition-all duration-300 ${
                isHovered ? 'translate-x-2 text-primary' : 'text-text-muted'
              }`}>
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default EventCard
