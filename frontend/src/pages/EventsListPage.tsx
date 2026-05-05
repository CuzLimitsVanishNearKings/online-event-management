import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventFilters, { EventFilters as EventFiltersType } from '@/components/events/EventFilters'
import EventGrid from '@/components/events/EventGrid'

// Mock data
const mockEvents = [
  {
    id: '1',
    title: 'Summer Music Festival 2024',
    date: '2024-07-15',
    location: 'Central Park, New York',
    category: 'Music',
    price: 45,
    image: 'https://picsum.photos/seed/music-fest/400/225.jpg'
  },
  {
    id: '2',
    title: 'Tech Startup Conference',
    date: '2024-08-22',
    location: 'Convention Center, San Francisco',
    category: 'Technology',
    price: 125,
    image: 'https://picsum.photos/seed/tech-conf/400/225.jpg'
  },
  {
    id: '3',
    title: 'Food & Wine Tasting Evening',
    date: '2024-06-30',
    location: 'Downtown Winery, Chicago',
    category: 'Food & Drink',
    price: 75,
    image: 'https://picsum.photos/seed/food-wine/400/225.jpg'
  },
  {
    id: '4',
    title: 'Art Gallery Opening',
    date: '2024-07-08',
    location: 'Modern Art Museum, Los Angeles',
    category: 'Arts',
    price: 25,
    image: 'https://picsum.photos/seed/art-gallery/400/225.jpg'
  },
  {
    id: '5',
    title: 'Business Networking Summit',
    date: '2024-09-12',
    location: 'Business Plaza, Miami',
    category: 'Business',
    price: 95,
    image: 'https://picsum.photos/seed/business-summit/400/225.jpg'
  },
  {
    id: '6',
    title: 'Wellness & Yoga Retreat',
    date: '2024-08-05',
    location: 'Peaceful Gardens, Boulder',
    category: 'Health & Wellness',
    price: 55,
    image: 'https://picsum.photos/seed/yoga-retreat/400/225.jpg'
  },
  {
    id: '7',
    title: 'Comedy Night Special',
    date: '2024-07-20',
    location: 'Laugh Factory, New York',
    category: 'Entertainment',
    price: 35,
    image: 'https://picsum.photos/seed/comedy-night/400/225.jpg'
  },
  {
    id: '8',
    title: 'Marathon Training Workshop',
    date: '2024-08-10',
    location: 'Sports Complex, Boston',
    category: 'Sports',
    price: 0,
    image: 'https://picsum.photos/seed/marathon/400/225.jpg'
  },
  {
    id: '9',
    title: 'Coding Bootcamp Info Session',
    date: '2024-07-25',
    location: 'Tech Hub, Seattle',
    category: 'Education',
    price: 0,
    image: 'https://picsum.photos/seed/coding-bootcamp/400/225.jpg'
  },
  {
    id: '10',
    title: 'Community BBQ Festival',
    date: '2024-08-15',
    location: 'City Park, Austin',
    category: 'Social',
    price: 15,
    image: 'https://picsum.photos/seed/bbq-fest/400/225.jpg'
  },
  {
    id: '11',
    title: 'Jazz Evening Concert',
    date: '2024-09-05',
    location: 'Blue Note, New York',
    category: 'Music',
    price: 65,
    image: 'https://picsum.photos/seed/jazz-concert/400/225.jpg'
  },
  {
    id: '12',
    title: 'Startup Pitch Night',
    date: '2024-07-18',
    location: 'Innovation Center, San Francisco',
    category: 'Business',
    price: 20,
    image: 'https://picsum.photos/seed/pitch-night/400/225.jpg'
  }
]

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm border border-secondary rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm border rounded-lg ${
            currentPage === page
              ? 'bg-primary text-white border-primary'
              : 'border-secondary hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm border border-secondary rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}

const EventsListPage = () => {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<EventFiltersType>({
    search: '',
    category: '',
    city: '',
    minPrice: 0,
    maxPrice: 500,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const itemsPerPage = 9

  // Set initial filters from URL params
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setFilters(prev => ({ ...prev, category }))
    }
  }, [searchParams])

  // Filter events based on current filters
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = !filters.search || 
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.location.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesCategory = !filters.category || event.category === filters.category
    
    const matchesCity = !filters.city || 
      event.location.toLowerCase().includes(filters.city.toLowerCase())
    
    const matchesPrice = event.price >= filters.minPrice && event.price <= filters.maxPrice
    
    return matchesSearch && matchesCategory && matchesCity && matchesPrice
  })

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  const handleFiltersChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setLoading(true)
    // Simulate API loading
    setTimeout(() => {
      setCurrentPage(page)
      setLoading(false)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <EventFilters onFiltersChange={handleFiltersChange} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <EventGrid events={paginatedEvents} loading={loading} filters={filters} />
            
            {/* Pagination */}
            {!loading && filteredEvents.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventsListPage
