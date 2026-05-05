import { useParams } from 'react-router-dom'
import EventHero from '@/components/events/EventHero'
import TicketSelector from '@/components/events/TicketSelector'

// Mock event data
const mockEvents: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Summer Music Festival 2024',
    description: `Join us for an unforgettable summer music experience featuring top artists from around the world. This outdoor festival spans three days with multiple stages, food vendors, and art installations.

Experience the magic of live music under the stars with performances from:
- Headlining acts across multiple genres
- Local and international artists
- Interactive art experiences
- Gourmet food trucks and craft beverages
- Camping options available

Whether you're a music enthusiast or looking for a weekend getaway, this festival offers something for everyone. Bring your friends, family, and good vibes for a celebration of music and community.`,
    date: '2024-07-15',
    time: '2:00 PM - 11:00 PM',
    location: 'Central Park, New York, NY',
    price: 45,
    capacity: 5000,
    currentAttendees: 3421,
    category: 'Music',
    image: 'https://picsum.photos/seed/music-fest/1200/400.jpg',
    organizer: 'NYC Events Collective'
  },
  '2': {
    id: '2',
    title: 'Tech Startup Conference',
    description: `Connect with innovators, investors, and industry leaders at this premier startup conference. Learn about the latest trends in technology, network with potential partners, and gain insights from successful entrepreneurs.

Conference highlights:
- Keynote speeches from industry leaders
- Panel discussions on emerging technologies
- Startup pitch competitions with prize money
- Networking sessions with investors
- Workshops on growth strategies and funding
- Exhibition hall showcasing innovative products

Perfect for founders, developers, investors, and anyone interested in the startup ecosystem. Early bird tickets available!`,
    date: '2024-08-22',
    time: '9:00 AM - 6:00 PM',
    location: 'Convention Center, San Francisco, CA',
    price: 125,
    capacity: 1000,
    currentAttendees: 789,
    category: 'Technology',
    image: 'https://picsum.photos/seed/tech-conf/1200/400.jpg',
    organizer: 'Tech Innovations Inc.'
  },
  '3': {
    id: '3',
    title: 'Food & Wine Tasting Evening',
    description: `Indulge in an exquisite culinary journey featuring renowned chefs and sommeliers. This exclusive tasting event showcases the finest local and international cuisines paired with exceptional wines.

What to expect:
- Tasting stations from 20+ local restaurants
- Wine pairing sessions with expert sommeliers
- Live cooking demonstrations
- Meet-and-greet with celebrity chefs
- Silent auction for culinary experiences
- Live jazz entertainment

Whether you're a food connoisseur or simply enjoy good food and wine, this evening promises to delight your senses and expand your culinary horizons.`,
    date: '2024-06-30',
    time: '6:00 PM - 10:00 PM',
    location: 'Downtown Winery, Chicago, IL',
    price: 75,
    capacity: 200,
    currentAttendees: 167,
    category: 'Food & Drink',
    image: 'https://picsum.photos/seed/food-wine/1200/400.jpg',
    organizer: 'Chicago Culinary Society'
  }
}

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  
  // Get event data (in real app, this would be an API call)
  const event = id ? mockEvents[id] : null

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Event Not Found</h1>
          <p className="text-text-muted mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primarydark transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Event Details */}
          <div className="flex-1">
            <EventHero event={event} />
          </div>

          {/* Right: Ticket Selector (Sticky) */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <TicketSelector event={event} fullEvent={event} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage
