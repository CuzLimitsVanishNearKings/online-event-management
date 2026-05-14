import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import EventFilters, { EventFilters as EventFiltersType } from '../components/events/EventFilters'
import EventGrid from '../components/events/EventGrid'
import { useEvents } from '../hooks/useEvents'
import { Search, MapPin, Calendar, Filter, SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight, X, Sparkles } from '../components/icons'
import { Button } from '../components/ui'
import { cn } from '../utils/cn'

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <div className="flex items-center justify-center gap-3 mt-20 pb-20">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-2xl w-12 h-12 p-0 border-border hover:border-primary transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <div className="flex items-center gap-3">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-12 h-12 rounded-2xl text-sm font-bold transition-all",
              currentPage === page
                ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110"
                : "bg-white border border-border text-text-secondary hover:border-primary hover:text-primary"
            )}
          >
            {page}
          </button>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-2xl w-12 h-12 p-0 border-border hover:border-primary transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  )
}

const EventsListPage = () => {
  const { events: dynamicEvents, loading: eventsLoading } = useEvents()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<EventFiltersType>({
    search: '',
    category: '',
    city: '',
    minPrice: 0,
    maxPrice: 100000,
    tags: []
  })
  const [currentPage, setCurrentPage] = useState(1)
  
  const itemsPerPage = 9

  useEffect(() => {
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const search = searchParams.get('search')
    
    setFilters((prev: EventFiltersType) => ({ 
      ...prev, 
      category: category || '',
      city: city || '',
      search: search || ''
    }))
    window.scrollTo(0, 0)
  }, [searchParams])

  const filteredEvents = (dynamicEvents || []).filter((event: any) => {
    const matchesSearch = !filters.search || 
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.location.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesCategory = !filters.category || event.categoryName === filters.category
    const matchesCity = !filters.city || event.location.toLowerCase().includes(filters.city.toLowerCase())
    const matchesPrice = !event.price || (event.price >= filters.minPrice && event.price <= filters.maxPrice)
    
    return matchesSearch && matchesCategory && matchesCity && matchesPrice
  })

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

  const handleFiltersChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
    
    // Update URL params
    const params = new URLSearchParams()
    if (newFilters.category) params.set('category', newFilters.category)
    if (newFilters.city) params.set('city', newFilters.city)
    if (newFilters.search) params.set('search', newFilters.search)
    setSearchParams(params)
  }

  const clearFilters = () => {
    handleFiltersChange({
      search: '',
      category: '',
      city: '',
      minPrice: 0,
      maxPrice: 100000,
      tags: []
    })
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      
      
      {/* Page Header */}
      <div className="bg-white pt-40 pb-16 border-b border-border shadow-sm">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
               <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Explore the collection</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-display font-bold text-text-primary tracking-tight">
                  Discover <span className="text-gradient">Experiences</span>
               </h1>
               <p className="text-text-muted text-xl leading-relaxed">
                  Join thousands of events happening around you. From music festivals to workshops, find your next memory.
               </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
               {filters.category && (
                  <button 
                    onClick={() => handleFiltersChange({...filters, category: ''})}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-primary/20 transition-all"
                  >
                     Category: {filters.category}
                     <X className="w-3.5 h-3.5" />
                  </button>
               )}
               {filters.city && (
                  <button 
                    onClick={() => handleFiltersChange({...filters, city: ''})}
                    className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 text-accent border border-accent/20 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-accent/20 transition-all"
                  >
                     Location: {filters.city}
                     <X className="w-3.5 h-3.5" />
                  </button>
               )}
               {(filters.category || filters.city || filters.search) && (
                  <button 
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-5 py-2.5 text-text-muted hover:text-text-primary text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Clear All
                  </button>
               )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-28">
              <EventFilters 
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="mb-10 flex items-center justify-between">
               <p className="text-text-muted font-bold text-sm uppercase tracking-widest">
                  Showing <span className="text-text-primary">{filteredEvents.length}</span> results
               </p>
               <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Sort by:</span>
                  <select className="bg-transparent text-sm font-bold text-text-primary border-none focus:ring-0 cursor-pointer">
                     <option>Newest First</option>
                     <option>Price: Low to High</option>
                     <option>Price: High to Low</option>
                     <option>Most Popular</option>
                  </select>
               </div>
            </div>

            {filteredEvents.length === 0 && !eventsLoading ? (
               <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-border rounded-xl shadow-card px-8">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                     <Search className="w-10 h-10 text-text-muted" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-text-primary mb-4">No experiences found</h2>
                  <p className="text-text-muted max-w-md mx-auto mb-10 text-lg">
                     We couldn't find any events matching your current filters. Try broadening your search or exploring other categories.
                  </p>
                  <Button variant="primary" size="lg" className="rounded-2xl px-10 shadow-xl shadow-primary/20" onClick={clearFilters}>
                     Clear all filters
                  </Button>
               </div>
            ) : (
               <EventGrid 
                 events={paginatedEvents} 
                 loading={eventsLoading} 
                 filters={filters} 
                 onFiltersChange={handleFiltersChange}
               />
            )}
            
            {/* Pagination */}
            {!eventsLoading && filteredEvents.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                   setCurrentPage(page)
                   window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            )}
          </main>
        </div>
      </div>

      
    </div>
  )
}

export default EventsListPage


