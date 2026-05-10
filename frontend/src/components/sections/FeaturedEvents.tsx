import EventCard from '../events/EventCard'
import { Link } from 'react-router-dom'
import { ArrowRight } from '../icons'

const FeaturedEvents = () => {
  const featuredEvents = [
    {
      id: '1', title: 'Summer Beats Festival 2024', date: '2024-07-15', startDateTime: '2024-07-15T18:00:00', endDateTime: '2024-07-15T23:00:00',
      location: 'Central Park', category: 'Music', categoryName: 'Music', price: 45, originalPrice: 65,
      thumbnail: 'https://picsum.photos/seed/music-fest-1/600/400', attendees: 1247, isTrending: true, isFeatured: true,
      city: 'New York', venue: 'Central Park Amphitheater', status: 'active', capacity: 2000, description: 'The biggest outdoor music festival of the summer.'
    },
    {
      id: '2', title: 'Startup Revolution Summit', date: '2024-08-22', startDateTime: '2024-08-22T09:00:00', endDateTime: '2024-08-22T18:00:00',
      location: 'Convention Center', category: 'Technology', categoryName: 'Tech', price: 125,
      thumbnail: 'https://picsum.photos/seed/tech-conf-1/600/400', attendees: 892, isFeatured: true,
      city: 'San Francisco', venue: 'Moscone Center', status: 'active', capacity: 1200, description: 'Connect with founders and investors.'
    },
    {
      id: '3', title: 'Wine & Dine Experience', date: '2024-06-30', startDateTime: '2024-06-30T19:30:00', endDateTime: '2024-06-30T22:30:00',
      location: 'Downtown Winery', category: 'Food & Drink', categoryName: 'Food & Drink', price: 75,
      thumbnail: 'https://picsum.photos/seed/food-wine-1/600/400', attendees: 156,
      city: 'Chicago', venue: 'River North Winery', status: 'active', capacity: 200, description: 'A curated food and wine pairing experience.'
    },
    {
      id: '4', title: 'Modern Art Showcase', date: '2024-07-08', startDateTime: '2024-07-08T14:00:00', endDateTime: '2024-07-08T20:00:00',
      location: 'Modern Art Museum', category: 'Arts', categoryName: 'Arts', price: 25,
      thumbnail: 'https://picsum.photos/seed/art-gallery-1/600/400', attendees: 423,
      city: 'Los Angeles', venue: 'LACMA', status: 'active', capacity: 500, description: 'Contemporary art from emerging artists.'
    },
    {
      id: '5', title: 'Connect & Grow Networking', date: '2024-09-12', startDateTime: '2024-09-12T17:00:00', endDateTime: '2024-09-12T21:00:00',
      location: 'Business Plaza', category: 'Business', categoryName: 'Business', price: 95, originalPrice: 120,
      thumbnail: 'https://picsum.photos/seed/business-summit-1/600/400', attendees: 678,
      city: 'Miami', venue: 'Miami Business District', status: 'active', capacity: 800, description: 'Professional networking for entrepreneurs.'
    },
    {
      id: '6', title: 'Zen Garden Retreat', date: '2024-08-05', startDateTime: '2024-08-05T06:00:00', endDateTime: '2024-08-05T12:00:00',
      location: 'Peaceful Gardens', category: 'Health & Wellness', categoryName: 'Wellness', price: 55,
      thumbnail: 'https://picsum.photos/seed/yoga-retreat-1/600/400', attendees: 89, isTrending: true,
      city: 'Boulder', venue: 'Boulder Zen Center', status: 'active', capacity: 100, description: 'A morning of yoga, meditation, and nature.'
    },
  ]

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary">
              Popular events near you
            </h2>
            <p className="text-sm text-text-muted mt-1">Discover what people are excited about</p>
          </div>
          <Link 
            to="/events" 
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            See more <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-6 text-center">
          <Link 
            to="/events" 
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
          >
            See all events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedEvents
