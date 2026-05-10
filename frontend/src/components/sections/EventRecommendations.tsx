import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLocationStore } from '../../store/locationStore'
import EventCard from '../events/EventCard'
import { ArrowRight } from '../icons'

const EventRecommendations = () => {
  const { selectedCountry, selectedCity } = useLocationStore()

  const recommendations = useMemo(() => {
    return [
      {
        id: 'rec-1', title: 'Sunset Yoga Session', date: '2024-06-25', startDateTime: '2024-06-25T18:30:00', endDateTime: '2024-06-25T20:00:00',
        location: 'Beachfront Park', categoryName: 'Wellness', price: 15,
        thumbnail: 'https://picsum.photos/seed/yoga-sunset-1/600/400', attendees: 45, isTrending: true,
        city: selectedCity?.name || 'Los Angeles', venue: 'Beachfront Park', status: 'active', capacity: 60,
      },
      {
        id: 'rec-2', title: 'Jazz Night Under Stars', date: '2024-06-28', startDateTime: '2024-06-28T20:00:00', endDateTime: '2024-06-28T23:00:00',
        location: 'Rooftop Lounge', categoryName: 'Music', price: 35, isFeatured: true,
        thumbnail: 'https://picsum.photos/seed/jazz-night-1/600/400', attendees: 128,
        city: selectedCity?.name || 'New York', venue: 'Skyline Rooftop Lounge', status: 'active', capacity: 150,
      },
      {
        id: 'rec-3', title: 'Food Truck Festival', date: '2024-07-01', startDateTime: '2024-07-01T11:00:00', endDateTime: '2024-07-01T18:00:00',
        location: 'City Square', categoryName: 'Food & Drink', price: 5, isTrending: true,
        thumbnail: 'https://picsum.photos/seed/food-truck-1/600/400', attendees: 892,
        city: selectedCity?.name || 'Chicago', venue: 'Downtown City Square', status: 'active', capacity: 1000,
      },
      {
        id: 'rec-4', title: 'Photography Workshop', date: '2024-07-05', startDateTime: '2024-07-05T10:00:00', endDateTime: '2024-07-05T14:00:00',
        location: 'Art District', categoryName: 'Education', price: 45,
        thumbnail: 'https://picsum.photos/seed/photo-workshop/600/400', attendees: 28,
        city: selectedCity?.name || 'Austin', venue: 'Creative Lab', status: 'active', capacity: 30,
      },
    ]
  }, [selectedCity])

  if (recommendations.length === 0) return null

  return (
    <section className="section-padding bg-white border-t border-border/50">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary">
              {selectedCity ? `Events in ${selectedCity.name}` : 'Recommended for you'}
            </h2>
            <p className="text-sm text-text-muted mt-1">Based on your interests and location</p>
          </div>
          <Link to="/events" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
            See more <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventRecommendations
