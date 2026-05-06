import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLocationStore } from '../../store/locationStore'
import EventCard from '../events/EventCard'
import { Sparkles, TrendingUp, MapPin, Clock } from 'lucide-react'

const EventRecommendations = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { selectedCountry, selectedCity } = useLocationStore()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400)
    return () => clearTimeout(timer)
  }, [])

  // Smart recommendations based on location and preferences
  const recommendations = useMemo(() => {
    const baseRecommendations = [
      {
        id: 'rec-1',
        title: 'Sunset Yoga Session',
        date: '2024-06-25',
        time: '18:30',
        location: 'Beachfront Park',
        category: 'Health & Wellness',
        price: 15,
        originalPrice: 25,
        images: [
          'https://picsum.photos/seed/yoga-sunset-1/400/225.jpg',
          'https://picsum.photos/seed/yoga-sunset-2/400/225.jpg'
        ],
        thumbnail: 'https://picsum.photos/seed/yoga-sunset-1/400/225.jpg',
        attendees: 45,
        rating: 4.9,
        reviewCount: 28,
        isTrending: true,
        country: selectedCountry?.code || 'US',
        city: selectedCity?.name || 'Los Angeles',
        venue: 'Beachfront Park',
        tags: ['wellness', 'sunset', 'outdoor', 'beginner-friendly'],
        capacity: 60,
        currentAttendees: 45,
        organizer: 'Wellness Collective',
        organizerId: 'org-wellness',
        createdAt: '2024-05-01',
        updatedAt: '2024-05-15'
      },
      {
        id: 'rec-2',
        title: 'Jazz Night Under Stars',
        date: '2024-06-28',
        time: '20:00',
        location: 'Rooftop Lounge',
        category: 'Music',
        price: 35,
        images: [
          'https://picsum.photos/seed/jazz-night-1/400/225.jpg',
          'https://picsum.photos/seed/jazz-night-2/400/225.jpg',
          'https://picsum.photos/seed/jazz-night-3/400/225.jpg'
        ],
        thumbnail: 'https://picsum.photos/seed/jazz-night-1/400/225.jpg',
        attendees: 128,
        rating: 4.8,
        reviewCount: 67,
        isFeatured: true,
        country: selectedCountry?.code || 'US',
        city: selectedCity?.name || 'New York',
        venue: 'Skyline Rooftop Lounge',
        tags: ['jazz', 'live-music', 'romantic', 'nightlife'],
        capacity: 150,
        currentAttendees: 128,
        organizer: 'NYC Jazz Society',
        organizerId: 'org-jazz',
        createdAt: '2024-04-15',
        updatedAt: '2024-05-10'
      },
      {
        id: 'rec-3',
        title: 'Food Truck Festival',
        date: '2024-07-01',
        time: '11:00',
        location: 'City Square',
        category: 'Food & Drink',
        price: 5,
        images: [
          'https://picsum.photos/seed/food-truck-1/400/225.jpg',
          'https://picsum.photos/seed/food-truck-2/400/225.jpg',
          'https://picsum.photos/seed/food-truck-3/400/225.jpg',
          'https://picsum.photos/seed/food-truck-4/400/225.jpg'
        ],
        thumbnail: 'https://picsum.photos/seed/food-truck-1/400/225.jpg',
        attendees: 892,
        rating: 4.7,
        reviewCount: 234,
        isTrending: true,
        country: selectedCountry?.code || 'US',
        city: selectedCity?.name || 'Chicago',
        venue: 'Downtown City Square',
        tags: ['food', 'festival', 'family-friendly', 'local'],
        capacity: 1000,
        currentAttendees: 892,
        organizer: 'Chicago Food Scene',
        organizerId: 'org-food',
        createdAt: '2024-05-05',
        updatedAt: '2024-05-20'
      }
    ]

    // Filter by location if selected
    if (selectedCountry && selectedCity) {
      return baseRecommendations.filter(event => 
        event.country === selectedCountry.code && event.city === selectedCity.name
      )
    }

    return baseRecommendations
  }, [selectedCountry, selectedCity])

  const getRecommendationReason = (event: any) => {
    const reasons = []
    
    if (event.isTrending) {
      reasons.push('Trending in your area')
    }
    
    if (event.isFeatured) {
      reasons.push('Editor\'s pick')
    }
    
    if (event.rating >= 4.8) {
      reasons.push('Highly rated')
    }
    
    if (event.price <= 20) {
      reasons.push('Great value')
    }
    
    if (event.attendees / event.capacity > 0.8) {
      reasons.push('Almost sold out')
    }
    
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-surface/10 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Animated Section Header */}
        <div 
          className={`text-center mb-12 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">picked for you</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-text-primary mb-4">
            <span className="block">Events you'll</span>
            <span className="block font-medium text-primary">probably love</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {selectedCountry && selectedCity 
              ? `Handpicked events happening in ${selectedCity.name}, ${selectedCountry.name}`
              : 'Popular events based on your preferences'
            }
          </p>
        </div>

        {/* Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((event, index) => (
            <div
              key={event.id}
              className={`transform transition-all duration-700 delay-${index * 100} ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
            >
              <div className="relative">
                {/* Recommendation Badge */}
                <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  {getRecommendationReason(event)}
                </div>
                
                <EventCard event={event} />
              </div>
            </div>
          ))}
        </div>

        {/* Smart Insights */}
        <div 
          className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Trending Now</h3>
            <p className="text-sm text-text-secondary">
              {recommendations.filter(e => e.isTrending).length} events are trending in your area
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Local Favorites</h3>
            <p className="text-sm text-text-secondary">
              Events near {selectedCity?.name || 'you'} with 4.5+ ratings
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-sage" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">This Week</h3>
            <p className="text-sm text-text-secondary">
              {recommendations.filter(e => {
                const eventDate = new Date(e.date)
                const weekFromNow = new Date()
                weekFromNow.setDate(weekFromNow.getDate() + 7)
                return eventDate <= weekFromNow
              }).length} events happening soon
            </p>
          </div>
        </div>

        {/* CTA */}
        <div 
          className={`mt-12 text-center transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="text-text-secondary mb-6">
            Want more personalized recommendations?
          </p>
          <Link to="/events">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
              Explore all events
              <TrendingUp className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default EventRecommendations
