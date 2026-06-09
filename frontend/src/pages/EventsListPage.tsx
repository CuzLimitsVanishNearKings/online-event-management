import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import EventFilters, { EventFilters as EventFiltersType } from '../components/events/EventFilters'
import EventGrid from '../components/events/EventGrid'
import { useEvents } from '../hooks/useEvents'
import { Search, Sparkles, X } from '../components/icons'
import { Button, Pagination } from '../components/ui'

const ITEMS_PER_PAGE = 9

type SortKey = 'newest' | 'title-asc'

const EventsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<EventFiltersType>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    date: searchParams.get('date') || ''
  })
  
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('newest')

  // Calculate API filters from UI state
  const apiFilters = useMemo(() => {
    const apiF: Record<string, any> = {
      search: filters.search,
      category: filters.category,
      city: filters.city
    }

    if (filters.date) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      if (filters.date === 'Today') {
        apiF.startDate = today.toISOString()
        apiF.endDate = new Date(today.getTime() + 86400000).toISOString()
      } else if (filters.date === 'Tomorrow') {
        const tom = new Date(today.getTime() + 86400000)
        apiF.startDate = tom.toISOString()
        apiF.endDate = new Date(tom.getTime() + 86400000).toISOString()
      } else if (filters.date === 'This Weekend') {
        const day = now.getDay()
        const sat = new Date(today.getTime() + (6 - day) * 86400000)
        const sun = new Date(sat.getTime() + 86400000)
        apiF.startDate = sat.toISOString()
        apiF.endDate = new Date(sun.getTime() + 86400000).toISOString() // end of sunday
      } else if (filters.date === 'Next Week') {
        const day = now.getDay()
        const nextMon = new Date(today.getTime() + (8 - day) * 86400000)
        const nextSun = new Date(nextMon.getTime() + 7 * 86400000)
        apiF.startDate = nextMon.toISOString()
        apiF.endDate = nextSun.toISOString()
      }
    }
    
    return apiF
  }, [filters])

  // Fetch from backend using the derived API filters
  const { events: allEvents, loading } = useEvents(apiFilters)

  // Sync URL when filters change
  const handleFiltersChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
    const params = new URLSearchParams()
    if (newFilters.category) params.set('category', newFilters.category)
    if (newFilters.city) params.set('city', newFilters.city)
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.date) params.set('date', newFilters.date)
    setSearchParams(params)
  }

  const clearFilters = () => handleFiltersChange({
    search: '', category: '', city: '', date: ''
  })

  // Apply sorting client-side since API doesn't support complex sorting yet
  const sorted = [...(allEvents || [])].sort((a: any, b: any) => {
    if (sortKey === 'title-asc') return (a.title ?? '').localeCompare(b.title ?? '')
    // newest first
    return new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE))
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const hasActive = !!(filters.search || filters.category || filters.city || filters.date)

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
