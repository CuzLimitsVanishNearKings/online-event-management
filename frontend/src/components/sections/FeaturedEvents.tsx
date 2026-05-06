import EventCard from '../events/EventCard'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const FeaturedEvents = () => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const featuredEvents = [
    {
      id: '1',
      title: 'Summer Beats Festival 2024',
      date: '2024-07-15',
      time: '18:00',
      location: 'Central Park Amphitheater',
      category: 'Music',
      price: 45,
      originalPrice: 65,
      images: [
        'https://picsum.photos/seed/music-fest-1/400/225.jpg',
        'https://picsum.photos/seed/music-fest-2/400/225.jpg',
        'https://picsum.photos/seed/music-fest-3/400/225.jpg',
        'https://picsum.photos/seed/music-fest-4/400/225.jpg'
      ],
      thumbnail: 'https://picsum.photos/seed/music-fest-1/400/225.jpg',
      attendees: 1247,
      rating: 4.8,
      reviewCount: 342,
      isTrending: true,
      isFeatured: true,
      country: 'US',
      city: 'New York',
      venue: 'Central Park Amphitheater',
      tags: ['outdoor', 'live-music', 'festival', 'summer'],
      capacity: 2000,
      currentAttendees: 1247,
      organizer: 'NYC Events Collective',
      organizerId: 'org1',
      createdAt: '2024-01-15',
      updatedAt: '2024-05-01'
    },
    {
      id: '2',
      title: 'Startup Revolution Summit',
      date: '2024-08-22',
      time: '09:00',
      location: 'Convention Center',
      category: 'Technology',
      price: 125,
      originalPrice: 175,
      images: [
        'https://picsum.photos/seed/tech-conf-1/400/225.jpg',
        'https://picsum.photos/seed/tech-conf-2/400/225.jpg',
        'https://picsum.photos/seed/tech-conf-3/400/225.jpg'
      ],
      thumbnail: 'https://picsum.photos/seed/tech-conf-1/400/225.jpg',
      attendees: 892,
      rating: 4.9,
      reviewCount: 128,
      isFeatured: true,
      country: 'US',
      city: 'San Francisco',
      venue: 'Moscone Convention Center',
      tags: ['networking', 'innovation', 'startups', 'tech'],
      capacity: 1200,
      currentAttendees: 892,
      organizer: 'TechVentures Inc',
      organizerId: 'org2',
      createdAt: '2024-02-01',
      updatedAt: '2024-05-10'
    },
    {
      id: '3',
      title: 'Wine & Dine Experience',
      date: '2024-06-30',
      time: '19:30',
      location: 'Downtown Winery',
      category: 'Food & Drink',
      price: 75,
      images: [
        'https://picsum.photos/seed/food-wine-1/400/225.jpg',
        'https://picsum.photos/seed/food-wine-2/400/225.jpg',
        'https://picsum.photos/seed/food-wine-3/400/225.jpg'
      ],
      thumbnail: 'https://picsum.photos/seed/food-wine-1/400/225.jpg',
      attendees: 156,
      rating: 4.7,
      reviewCount: 89,
      country: 'US',
      city: 'Chicago',
      venue: 'River North Winery',
      tags: ['wine-tasting', 'fine-dining', 'romantic', 'culinary'],
      capacity: 200,
      currentAttendees: 156,
      organizer: 'Chicago Culinary Club',
      organizerId: 'org3',
      createdAt: '2024-03-15',
      updatedAt: '2024-05-05'
    },
    {
      id: '4',
      title: 'Modern Art Showcase',
      date: '2024-07-08',
      time: '14:00',
      location: 'Modern Art Museum',
      category: 'Arts',
      price: 25,
      images: [
        'https://picsum.photos/seed/art-gallery-1/400/225.jpg',
        'https://picsum.photos/seed/art-gallery-2/400/225.jpg',
        'https://picsum.photos/seed/art-gallery-3/400/225.jpg',
        'https://picsum.photos/seed/art-gallery-4/400/225.jpg',
        'https://picsum.photos/seed/art-gallery-5/400/225.jpg'
      ],
      thumbnail: 'https://picsum.photos/seed/art-gallery-1/400/225.jpg',
      attendees: 423,
      rating: 4.6,
      reviewCount: 167,
      country: 'US',
      city: 'Los Angeles',
      venue: 'LACMA',
      tags: ['contemporary-art', 'exhibition', 'culture', 'museum'],
      capacity: 500,
      currentAttendees: 423,
      organizer: 'LA Arts Foundation',
      organizerId: 'org4',
      createdAt: '2024-04-01',
      updatedAt: '2024-05-08'
    },
    {
      id: '5',
      title: 'Connect & Grow Network',
      date: '2024-09-12',
      time: '17:00',
      location: 'Business Plaza',
      category: 'Business',
      price: 95,
      originalPrice: 120,
      images: [
        'https://picsum.photos/seed/business-summit-1/400/225.jpg',
        'https://picsum.photos/seed/business-summit-2/400/225.jpg',
        'https://picsum.photos/seed/business-summit-3/400/225.jpg'
      ],
      thumbnail: 'https://picsum.photos/seed/business-summit-1/400/225.jpg',
      attendees: 678,
      rating: 4.5,
      reviewCount: 234,
      country: 'US',
      city: 'Miami',
      venue: 'Miami Business District',
      tags: ['networking', 'professional', 'business', 'growth'],
      capacity: 800,
      currentAttendees: 678,
      organizer: 'Miami Business Alliance',
      organizerId: 'org5',
      createdAt: '2024-02-15',
      updatedAt: '2024-05-12'
    },
    {
      id: '6',
      title: 'Zen Garden Retreat',
      date: '2024-08-05',
      time: '06:00',
      location: 'Peaceful Gardens',
      category: 'Health & Wellness',
      price: 55,
      images: [
        'https://picsum.photos/seed/yoga-retreat-1/400/225.jpg',
        'https://picsum.photos/seed/yoga-retreat-2/400/225.jpg',
        'https://picsum.photos/seed/yoga-retreat-3/400/225.jpg',
        'https://picsum.photos/seed/yoga-retreat-4/400/225.jpg'
      ],
      thumbnail: 'https://picsum.photos/seed/yoga-retreat-1/400/225.jpg',
      attendees: 89,
      rating: 4.9,
      reviewCount: 45,
      isTrending: true,
      country: 'US',
      city: 'Boulder',
      venue: 'Boulder Zen Center',
      tags: ['wellness', 'yoga', 'meditation', 'nature'],
      capacity: 100,
      currentAttendees: 89,
      organizer: 'Colorado Wellness Collective',
      organizerId: 'org6',
      createdAt: '2024-03-01',
      updatedAt: '2024-05-11'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-surface/30">
      <div className="max-w-7xl mx-auto">
        {/* Animated Section Header */}
        <div 
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary">trending now</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-text-primary mb-6">
            <span className="block">Events worth</span>
            <span className="block font-medium text-primary">talking about</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-light">
            Handpicked experiences that people actually love. No boring stuff, we promise.
          </p>
        </div>

        {/* Animated Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event, index) => (
            <div
              key={event.id}
              className={`transform transition-all duration-700 delay-${index * 100} ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
            >
              <EventCard key={event.id} event={event} />
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div 
          className={`mt-20 text-center transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-light text-text-primary mb-4">
              Ready to find your next adventure?
            </h3>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of people discovering amazing events every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events">
                <button className="group inline-flex items-center px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
                  Explore all events
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
              <Link to="/register">
                <button className="px-8 py-4 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105">
                  Start creating
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedEvents
