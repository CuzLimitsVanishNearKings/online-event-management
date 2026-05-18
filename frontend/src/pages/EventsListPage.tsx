import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventFilters, { EventFilters as EventFiltersType } from '../components/events/EventFilters'
import EventGrid from '../components/events/EventGrid'
import { useEvents } from '../hooks/useEvents'
import { Search, Sparkles, X } from '../components/icons'
import { Button, Pagination } from '../components/ui'

const ITEMS_PER_PAGE = 9

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'title-asc'

const matchesDate = (eventDate: string, filter: string): boolean => {
  if (!filter) return true
  const now = new Date()
  const start = new Date(eventDate)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (filter === 'Today') {
    return start >= today && start < new Date(today.getTime() + 86400000)
  }
  if (filter === 'Tomorrow') {
    const tom = new Date(today.getTime() + 86400000)
    return start >= tom && start < new Date(tom.getTime() + 86400000)
  }
  if (filter === 'This Weekend') {
    const day = now.getDay()
    const sat = new Date(today.getTime() + (6 - day) * 86400000)
    const sun = new Date(sat.getTime() + 86400000)
    return start >= sat && start <= new Date(sun.getTime() + 86400000)
  }
  if (filter === 'Next Week') {
    const day = now.getDay()
    const nextMon = new Date(today.getTime() + (8 - day) * 86400000)
    const nextSun = new Date(nextMon.getTime() + 7 * 86400000)
    return start >= nextMon && start <= nextSun
  }
  return true
}

const EventsListPage = () => {
  const { events: allEvents, loading } = useEvents()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<EventFiltersType>({
    search: '',
    category: '',
    city: '',
    minPrice: 0,
    maxPrice: 100000,
    tags: [],
    date: '',
    format: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('newest')

  // Sync URL → filters on mount
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category') || '',
      city: searchParams.get('city') || '',
      search: searchParams.get('search') || ''
    }))
    window.scrollTo(0, 0)
  }, [])

  // Apply all filters
  const filtered = (allEvents || []).filter((event: any) => {
    const q = filters.search.toLowerCase()
    const matchSearch = !q || 
      event.title?.toLowerCase().includes(q) || 
      event.location?.toLowerCase().includes(q) ||
      event.categoryName?.toLowerCase().includes(q)

    const matchCategory = !filters.category || 
      event.categoryName?.toLowerCase() === filters.category.toLowerCase()

    const matchCity = !filters.city || 
      event.location?.toLowerCase().includes(filters.city.toLowerCase())

    const price = event.price ?? 0
    const matchPrice = price >= filters.minPrice && price <= filters.maxPrice

    const matchDate = matchesDate(event.startDateTime, filters.date || '')

    // Format filter: 'Online' events have 'online' in their venue
    const matchFormat = !filters.format || 
      (filters.format === 'Online' 
        ? event.location?.toLowerCase().includes('online')
        : !event.location?.toLowerCase().includes('online'))

    return matchSearch && matchCategory && matchCity && matchPrice && matchDate && matchFormat
  })

  // Apply sorting
  const sorted = [...filtered].sort((a: any, b: any) => {
    if (sortKey === 'price-asc') return (a.price ?? 0) - (b.price ?? 0)
    if (sortKey === 'price-desc') return (b.price ?? 0) - (a.price ?? 0)
    if (sortKey === 'title-asc') return (a.title ?? '').localeCompare(b.title ?? '')
    // newest first
    return new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE))
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleFiltersChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
    const params = new URLSearchParams()
    if (newFilters.category) params.set('category', newFilters.category)
    if (newFilters.city) params.set('city', newFilters.city)
    if (newFilters.search) params.set('search', newFilters.search)
    setSearchParams(params)
  }

  const clearFilters = () => handleFiltersChange({
    search: '', category: '', city: '', minPrice: 0, maxPrice: 100000, tags: [], date: '', format: ''
  })

  const hasActive = !!(filters.search || filters.category || filters.city || filters.date || filters.format ||
    filters.minPrice > 0 || filters.maxPrice < 100000)

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

            {/* Active filter chips */}
            <div className="flex flex-wrap gap-3">
              {filters.category && (
                <button
                  onClick={() => handleFiltersChange({ ...filters, category: '' })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-primary/20 transition-all"
                >
                  {filters.category} <X className="w-3.5 h-3.5" />
                </button>
              )}
              {filters.city && (
                <button
                  onClick={() => handleFiltersChange({ ...filters, city: '' })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 text-accent border border-accent/20 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-accent/20 transition-all"
                >
                  📍 {filters.city} <X className="w-3.5 h-3.5" />
                </button>
              )}
              {filters.search && (
                <button
                  onClick={() => handleFiltersChange({ ...filters, search: '' })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-green-100 transition-all"
                >
                  🔍 "{filters.search}" <X className="w-3.5 h-3.5" />
                </button>
              )}
              {filters.date && (
                <button
                  onClick={() => handleFiltersChange({ ...filters, date: '' })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-purple-100 transition-all"
                >
                  📅 {filters.date} <X className="w-3.5 h-3.5" />
                </button>
              )}
              {hasActive && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-5 py-2.5 text-text-muted hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-all"
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
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-28">
              <EventFilters filters={filters} onFiltersChange={handleFiltersChange} />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Result count + sort */}
            <div className="mb-10 flex items-center justify-between">
              <p className="text-text-muted font-bold text-sm uppercase tracking-widest">
                Showing <span className="text-text-primary">{sorted.length}</span> result{sorted.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Sort:</span>
                <select
                  value={sortKey}
                  onChange={e => { setSortKey(e.target.value as SortKey); setCurrentPage(1) }}
                  className="bg-white border border-border rounded-lg px-3 py-2 text-sm font-semibold text-text-primary focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">A – Z</option>
                </select>
              </div>
            </div>

            {sorted.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-border rounded-xl shadow-card px-8">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                  <Search className="w-10 h-10 text-text-muted" />
                </div>
                <h2 className="text-3xl font-display font-bold text-text-primary mb-4">No experiences found</h2>
                <p className="text-text-muted max-w-md mx-auto mb-10 text-lg">
                  We couldn't find any events matching your filters. Try broadening your search.
                </p>
                <Button variant="primary" size="lg" className="rounded-2xl px-10 shadow-xl shadow-primary/20" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <EventGrid
                events={paginated}
                loading={loading}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={page => {
                setCurrentPage(page)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="mt-16 pb-8"
            />
          </main>
        </div>
      </div>
    </div>
  )
}

export default EventsListPage
