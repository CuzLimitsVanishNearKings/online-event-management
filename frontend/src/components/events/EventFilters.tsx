import { useState } from 'react'
import { Button } from '../ui'
import { 
  Search, 
  MapPin, 
  Star, 
  X,
  ChevronDown,
  Filter,
  Clock
} from '../icons'
import { useCategories } from '../../hooks/useCategories'
import { Loader2 } from 'lucide-react'

export interface EventFilters {
  search: string
  category: string      
  city: string
  date?: string
}

interface EventFiltersProps {
  filters: EventFilters
  onFiltersChange: (filters: EventFilters) => void
  isOpen?: boolean
  onToggle?: () => void
}

const EventFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  onToggle 
}: EventFiltersProps) => {
  const { categories, loading: categoriesLoading } = useCategories()
  const [activeSection, setActiveSection] = useState<'search' | 'category' | 'location' | 'date' | null>(null)

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      city: '',
      date: ''
    })
  }

  const hasActiveFilters = !!(filters.search || filters.category || filters.city || filters.date)

  const activeFiltersCount = [
    filters.search,
    filters.category,
    filters.city,
    filters.date || null
  ].filter(Boolean).length

  const toggle = (section: typeof activeSection) =>
    setActiveSection(prev => prev === section ? null : section)

  const sectionClass = (section: typeof activeSection) =>
    `w-full flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 ${
      activeSection === section
        ? 'border-primary bg-primary/5'
        : 'border-border/50 bg-surface/50 hover:border-primary hover:bg-primary/5'
    }`

  return (
    <div className="bg-white border border-border/50 rounded-xl shadow-sm w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-text-primary">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Filter Content */}
      <div className="overflow-y-auto max-h-[calc(100vh-240px)]">

        {/* ── Search ── */}
        <div className="p-4 border-b border-border/50">
          <button onClick={() => toggle('search')} className={sectionClass('search')}>
            <div className="flex items-center space-x-3">
              <Search className="w-4 h-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {filters.search || 'Search events…'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeSection === 'search' ? 'rotate-180' : ''}`} />
          </button>
          {activeSection === 'search' && (
            <div className="mt-3">
              <input
                type="text"
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                placeholder="Search by title or venue…"
                autoFocus
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          )}
        </div>

        {/* ── Category ── */}
        <div className="p-4 border-b border-border/50">
          <button onClick={() => toggle('category')} className={sectionClass('category')}>
            <div className="flex items-center space-x-3">
              <Star className="w-4 h-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {filters.category || 'All Categories'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeSection === 'category' ? 'rotate-180' : ''}`} />
          </button>

          {activeSection === 'category' && (
            <div className="mt-3 space-y-1.5">
              {/* All option */}
              <button
                onClick={() => handleFilterChange('category', '')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors duration-200 text-left ${
                  !filters.category
                    ? 'border-primary bg-primary text-white'
                    : 'border-border/50 bg-surface/50 hover:border-primary'
                }`}
              >
                <span className="text-lg">🌐</span>
                <span className="text-sm font-medium">All Categories</span>
              </button>

              {categoriesLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleFilterChange('category', 
                      filters.category === category.name ? '' : category.name
                    )}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors duration-200 text-left ${
                      filters.category === category.name
                        ? 'border-primary bg-primary text-white'
                        : 'border-border/50 bg-surface/50 hover:border-primary hover:bg-surface/100'
                    }`}
                  >
                    <span className="text-lg">{category.icon || '📌'}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                    {filters.category === category.name && (
                      <X className="w-3 h-3 ml-auto" />
                    )}
                  </button>
                ))
              ) : (
                <p className="text-sm text-text-muted text-center py-2">No categories found</p>
              )}
            </div>
          )}
        </div>

        {/* ── Location ── */}
        <div className="p-4 border-b border-border/50">
          <button onClick={() => toggle('location')} className={sectionClass('location')}>
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {filters.city || 'Location'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeSection === 'location' ? 'rotate-180' : ''}`} />
          </button>
          {activeSection === 'location' && (
            <div className="mt-3">
              <input
                type="text"
                value={filters.city}
                onChange={e => handleFilterChange('city', e.target.value)}
                placeholder="Enter city or venue…"
                autoFocus
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          )}
        </div>

        {/* ── Date ── */}
        <div className="p-4 border-border/50">
          <button onClick={() => toggle('date')} className={sectionClass('date')}>
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {filters.date ? `Date: ${filters.date}` : 'Date'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeSection === 'date' ? 'rotate-180' : ''}`} />
          </button>
          {activeSection === 'date' && (
            <div className="mt-3 space-y-1.5">
              {['Any Date', 'Today', 'Tomorrow', 'This Weekend', 'Next Week'].map(dateOption => {
                const value = dateOption === 'Any Date' ? '' : dateOption
                return (
                  <button
                    key={dateOption}
                    onClick={() => handleFilterChange('date', value)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 text-left ${
                      (filters.date === value || (!filters.date && value === ''))
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-border/50 bg-surface/50 hover:border-primary'
                    }`}
                  >
                    <span className="text-sm">{dateOption}</span>
                    {filters.date === value && value !== '' && <X className="w-3 h-3" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default EventFiltersComponent
