import { format, parseISO } from 'date-fns'
import { Calendar, MapPin, User, CheckCircle, Share2, Heart, Clock, Users } from '../icons'
import { cn } from '../../utils/cn'
import { getImageUrl } from '../../utils/image'
interface EventHeroProps {
  event: any
}

const EventHero = ({ event }: EventHeroProps) => {
  const eventIdNum = Number(event?.id)

  let formattedDate = ''
  try {
    if (event.date && event.date !== 'Invalid Date' && (event.date.includes(',') || isNaN(Date.parse(event.date)) && !event.date.includes('-') && !event.date.includes('T'))) {
      formattedDate = event.date
    } else {
      const parsed = parseISO(event.date)
      if (!isNaN(parsed.getTime())) {
        formattedDate = format(parsed, 'EEEE, MMMM dd, yyyy')
      } else {
        const nativeDate = new Date(event.date)
        if (!isNaN(nativeDate.getTime())) {
          formattedDate = format(nativeDate, 'EEEE, MMMM dd, yyyy')
        } else {
          formattedDate = event.date
        }
      }
    }
  } catch (e) {
    console.error('Error formatting date in EventHero:', e)
    formattedDate = event.date || 'TBD'
  }

  const imageUrl = getImageUrl(event.coverImage || event.image)
  const organizerName = event.organizerName || event.organizer || 'Event Organizer'
  const organizerLogo = event.organizerLogoUrl || event.organizerLogo

  return (
    <div className="space-y-10">
      {/* Hero Image Container */}
      <div className="relative aspect-[21/9] overflow-hidden rounded-md shadow-card">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 "
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#1E1B18] via-[#3A3530] to-[#5C534C] flex flex-col items-center justify-center p-8 text-center select-none relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[#EAE6DF] max-w-2xl drop-shadow-md z-10 leading-tight">
              {event.title}
            </h2>
            <span className="mt-4 px-4 py-1.5 bg-[#FFF]/10 border border-[#FFF]/20 text-[#FFF]/80 rounded-full text-xs font-bold uppercase tracking-widest z-10">
              Exclusive Experience
            </span>
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Floating Category Badge */}
        <div className="absolute top-6 left-6">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-primary rounded-full border border-primary/20 shadow-lg">
            {typeof event.category === 'object' ? (event.categoryName || event.category?.name || 'General') : (event.category || 'General')}
          </span>
        </div>

        <div className="absolute top-6 right-6 flex gap-3">
           <button className="p-3 bg-white/90 backdrop-blur-md rounded-lg shadow-lg hover:bg-white transition-all group">
              <Share2 className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
           </button>
        </div>

        {/* Event Title Over Image (Mobile Only/Contextual) */}
        <div className="absolute bottom-8 left-8 right-8 md:hidden">
           <h1 className="text-2xl font-display font-bold text-white tracking-tight">{event.title}</h1>
        </div>
      </div>

      {/* Main Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
        <div className="space-y-6">
          <h1 className="hidden md:block text-4xl lg:text-5xl font-display font-bold text-text-primary tracking-tight leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-x-10 gap-y-4 pt-4 border-t border-border/50">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                   <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                   <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Date</p>
                   <p className="text-sm font-bold text-text-primary">{formattedDate}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/5 flex items-center justify-center">
                   <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                   <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Time</p>
                   <p className="text-sm font-bold text-text-primary">{event.time || '19:00 PM'}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                   <MapPin className="w-5 h-5 text-text-secondary" />
                </div>
                <div>
                   <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Location</p>
                   <p className="text-sm font-bold text-text-primary">{event.location}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col justify-end space-y-6">
           <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-md border border-border/50">
              <div className="w-14 h-14 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden border border-border">
                 {organizerLogo ? (
                   <img src={organizerLogo} alt={organizerName} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-[#1E1B18] text-[#EAE6DF] font-display font-bold flex items-center justify-center text-lg uppercase select-none">
                     {organizerName.slice(0, 2)}
                   </div>
                 )}
              </div>
              <div>
                 <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Hosted by</p>
                 <p className="text-lg font-display font-bold text-text-primary">{organizerName}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-6 px-4">
              <div className="flex items-center gap-2">
                 <Users className="w-5 h-5 text-text-muted" />
                 <span className="text-sm font-bold text-text-primary">{event.currentAttendees || 0} / {event.capacity || 100} attending</span>
              </div>
              <div className="flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-green-500" />
                 <span className="text-sm font-bold text-text-primary">{(event.capacity || 100) - (event.currentAttendees || 0)} spots left</span>
              </div>
           </div>
        </div>
      </div>

      {/* About Section */}
      <div className="pt-10 border-t border-border/50">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-6">About this event</h2>
        <div className="prose prose-lg max-w-none prose-p:text-text-muted prose-headings:text-text-primary">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default EventHero

