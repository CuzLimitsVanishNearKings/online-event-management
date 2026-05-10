import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import EventHero from '../components/events/EventHero'
import TicketSelector from '../components/events/TicketSelector'
import EventCard from '../components/events/EventCard'


import { useEvents } from '../hooks/useEvents'
import { Button } from '../components/ui'
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Share2, 
  Heart, 
  ChevronLeft,
  ExternalLink,
  Star,
  Info,
  ShieldCheck,
  Zap,
  ArrowRight
} from '../components/icons'
import { cn } from '../utils/cn'

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { events } = useEvents()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id && events.length > 0) {
      const foundEvent = events.find(e => e.id === id)
      setEvent(foundEvent || null)
      setLoading(false)
    }
    window.scrollTo(0, 0)
  }, [id, events])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Loading Experience...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Zap className="w-12 h-12 text-text-muted" />
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-4 tracking-tight">Experience not found</h1>
          <p className="text-text-muted mb-8 leading-relaxed">
            The event you're looking for might have moved or is no longer available.
          </p>
          <Link to="/events">
            <Button variant="primary" size="lg" className="rounded-2xl px-10">
              Explore other events
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      
      
      <main className="pt-24 pb-20">
        {/* Breadcrumb & Navigation */}
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <Link to="/events" className="group flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold text-sm uppercase tracking-wider">
               <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
               Back to Events
            </Link>
            
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest">
               <Link to="/" className="hover:text-primary transition-colors">Home</Link>
               <span>/</span>
               <Link to="/events" className="hover:text-primary transition-colors">Events</Link>
               <span>/</span>
               <span className="text-text-primary">{event.title}</span>
            </div>
          </div>
        </div>

        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Column: Event Content */}
            <div className="flex-1 space-y-12">
              <EventHero event={event} />
              
              {/* Additional Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 bg-gray-50 rounded-xl border border-border/50 space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                       <ShieldCheck className="w-6 h-6" />
                       <h3 className="font-display font-bold text-xl text-text-primary">Safety & Guidelines</h3>
                    </div>
                    <p className="text-text-muted leading-relaxed">
                       This event follows all local safety protocols. Please bring a valid ID and your digital ticket for entry.
                    </p>
                 </div>
                 <div className="p-8 bg-gray-50 rounded-xl border border-border/50 space-y-4">
                    <div className="flex items-center gap-3 text-accent">
                       <Info className="w-6 h-6" />
                       <h3 className="font-display font-bold text-xl text-text-primary">Refund Policy</h3>
                    </div>
                    <p className="text-text-muted leading-relaxed">
                       Full refunds are available up to 48 hours before the event start time. Service fees are non-refundable.
                    </p>
                 </div>
              </div>
            </div>

            {/* Right Column: Sticky Booking Sidebar */}
            <aside className="lg:w-96 flex-shrink-0">
              <div className="sticky top-28 space-y-8">
                <TicketSelector event={event} fullEvent={event} />
                
                {/* Location Map Placeholder/Action */}
                <div className="bg-[#FDFBF7] border border-border rounded-xl overflow-hidden p-6 space-y-6">
                   <div className="space-y-2">
                      <h3 className="font-display font-bold text-xl text-text-primary">Location</h3>
                      <p className="text-text-muted text-sm leading-relaxed">{event.location}</p>
                   </div>
                   <a 
                     href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="block group"
                   >
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 mb-4">
                         <img 
                           src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(event.location)}&zoom=15&size=400x200&scale=2&key=YOUR_API_KEY_HERE`} 
                           alt="Location Map"
                           className="w-full h-full object-cover transition-transform group-hover:scale-110"
                         />
                         {/* Fallback pattern if no API key */}
                         <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-primary/40" />
                         </div>
                      </div>
                      <Button variant="outline" className="w-full rounded-xl gap-2 font-bold uppercase tracking-widest text-xs py-5">
                         Get Directions <ExternalLink className="w-3 h-3" />
                      </Button>
                   </a>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Events Section */}
          <section className="mt-32 pt-20 border-t border-border/50">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
               <div>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary tracking-tight">
                    You might also <span className="text-primary italic">like</span>
                  </h2>
                  <p className="text-lg text-text-muted mt-4">Discover similar experiences happening soon</p>
               </div>
               <Link 
                 to="/events"
                 className="group flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
               >
                 View more <ArrowRight className="w-5 h-5" />
               </Link>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events
                  .filter(e => e.id !== id && e.category === event.category)
                  .slice(0, 3)
                  .map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
             </div>
          </section>
        </div>
      </main>

      
    </div>
  )
}

export default EventDetailPage

