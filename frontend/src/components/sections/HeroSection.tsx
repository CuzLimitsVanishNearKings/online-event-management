import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Search, MapPin } from '../icons'
import { cn } from '../../utils/cn'
import { useCategories } from '../../hooks/useCategories'

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const { categories } = useCategories()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.append('search', searchQuery)
    if (locationQuery) params.append('city', locationQuery)
    navigate(`/events?${params.toString()}`)
  }

  return (
    <section className="pt-20 pb-8 bg-background">
      <div className="container-custom">
        <div className={cn(
          "max-w-3xl mx-auto text-center space-y-6 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          {/* Headline */}
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold text-text-primary leading-tight relative z-10">
              Find your next experience
            </h1>
            <svg className="absolute -bottom-4 -right-8 w-16 h-16 text-primary opacity-60 -z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 80 C 40 50, 60 90, 90 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
              <circle cx="90" cy="20" r="4" fill="currentColor"/>
              <circle cx="10" cy="30" r="2" fill="currentColor"/>
              <circle cx="80" cy="80" r="3" fill="currentColor"/>
            </svg>
          </div>
          <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto">
            Discover the best events, conferences, workshops, and festivals happening near you.
          </p>

          {/* Search Bar — Eventbrite Style */}
          <form 
            onSubmit={handleSearch}
            className="bg-white border border-border rounded-md shadow-card flex flex-col sm:flex-row items-stretch mt-8"
          >
            <div className="flex-1 flex items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-border">
              <Search className="w-5 h-5 text-text-muted mr-3 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search events" 
                className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full placeholder:text-text-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3">
              <MapPin className="w-5 h-5 text-text-muted mr-3 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Location" 
                className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full placeholder:text-text-muted"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 bg-primary text-white font-semibold text-sm rounded-b-xl sm:rounded-bl-none sm:rounded-r-xl hover:bg-primary-dark transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick Category Links */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.length > 0 && categories.slice(0, 6).map((cat) => (
              <Link 
                key={cat.id} 
                to={`/events?category=${cat.id}`}
                className="px-3 py-1.5 text-xs font-medium text-text-secondary bg-white border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
