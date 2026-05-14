import { motion } from 'framer-motion'
import { Heart, CalendarDays, MapPin, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { useAttendeeStore } from '@/store/attendeeStore'

export default function FavoritesView() {
  const { favorites, toggleFavorite } = useAttendeeStore()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Saved Events</h1>
          <p className="text-text-muted mt-1 font-medium">Events you've bookmarked for later.</p>
        </div>
        <Button onClick={() => window.location.href = '/events'} variant="primary" className="rounded-xl font-bold">
          Explore More
        </Button>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((event) => (
            <div key={event.id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 group flex flex-col">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.eventName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary/40 font-bold text-xl uppercase tracking-widest">{event.category}</span>
                  </div>
                )}
                <button 
                  onClick={() => toggleFavorite(event)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                  <Heart className="w-5 h-5 fill-terracotta text-terracotta" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-text-primary text-xs font-bold rounded-lg shadow-sm">
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-text-primary mb-3 line-clamp-2">{event.eventName}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <CalendarDays className="w-4 h-4" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium truncate">{event.location}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                  <span className="font-bold text-lg text-primary">{event.price} FCFA</span>
                  <Link to={`/event/${event.id}`} className="flex items-center gap-1 text-sm font-bold text-text-primary hover:text-primary transition-colors">
                    Get Tickets <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center text-center py-20 px-4">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-border" />
          </div>
          <h2 className="text-2xl font-display font-bold text-text-primary mb-2">No saved events yet</h2>
          <p className="text-text-muted max-w-md mx-auto mb-8 font-medium">
            Keep track of events you're interested in. Click the heart icon on any event to save it here.
          </p>
          <Button onClick={() => window.location.href = '/events'} variant="primary" className="rounded-xl px-8 font-bold shadow-md shadow-primary/20">
            Discover Events
          </Button>
        </div>
      )}
    </motion.div>
  )
}
