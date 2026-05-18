import { useState } from 'react'
import { Button } from '../ui'
import { 
  Search, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Star, 
  X,
  ChevronDown,
  Filter,
  Clock,
  Video
} from '../icons'
import { useCategories } from '../../hooks/useCategories'
import { Loader2 } from 'lucide-react'

export interface EventFilters {
  search: string
  category: string      // category NAME (to match categoryName on events)
  city: string
  minPrice: number
  maxPrice: number
  tags: string[]
  date?: string
  format?: string
}

interface EventFiltersProps {
  filters: EventFilters
  onFiltersChange: (filters: EventFilters) => void
  isOpen?: boolean
  onToggle?: () => void
}

const EventFilters = ({ 
  filters, 
  onFiltersChange, 
  onToggle 
}: EventFiltersProps) => {
  const { categories, loading: categoriesLoading } = useCategories()
  const [activeSection, setActiveSection] = useState<'search' | 'category' | 'location' | 'price' | 'date' | 'format' | null>(null)

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      city: '',
      minPrice: 0,
      maxPrice: 100000,
      tags: [],
      date: '',
      format: ''
    })
  }

  const hasActiveFilters = !!(filters.search || filters.category || filters.city || 
    filters.minPrice > 0 || filters.maxPrice < 100000 || filters.tags.length > 0 ||
    filters.date || filters.format)

  const activeFiltersCount = [
    filters.search,
    filters.category,
    filters.city,
    filters.minPrice > 0 ? 'price' : null,
    filters.maxPrice < 100000 ? 'price-max' : null,
    filters.date || null,
    filters.format || null,
    ...filters.tags
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
                    // Store the category NAME so it matches categoryName on events
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

        {/* ── Price ── */}
        <div className="p-4 border-b border-border/50">
          <button onClick={() => toggle('price')} className={sectionClass('price')}>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-4 h-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">Price Range</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeSection === 'price' ? 'rotate-180' : ''}`} />
          </button>
          {activeSection === 'price' && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={e => handleFilterChange('minPrice', Number(e.target.value))}
                  placeholder="Min"
                  min={0}
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
                <span className="text-text-muted">–</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={e => handleFilterChange('maxPrice', Number(e.target.value))}
                  placeholder="Max"
                  min={0}
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Free – 5k', min: 0, max: 5000 },
                  { label: '5k – 15k', min: 5000, max: 15000 },
                  { label: '15k – 50k', min: 15000, max: 50000 },
                  { label: '50k+', min: 50000, max: 1000000 },
                ].map(({ label, min, max }) => (
                  <button
                    key={label}
                    onClick={() => onFiltersChange({ ...filters, minPrice: min, maxPrice: max })}
                    className={`p-2 text-xs rounded-lg border transition-colors duration-200 ${
                      filters.minPrice === min && filters.maxPrice === max
                        ? 'border-primary bg-primary text-white'
                        : 'border-border/50 bg-surface/50 hover:border-primary'
                    }`}
                  >
                    {label} FCFA
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Date ── */}
        <div className="p-4 border-b border-border/50">
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

        {/* ── Format ── */}
        <div className="p-4">
          <button onClick={() => toggle('format')} className={sectionClass('format')}>
            <div className="flex items-center space-x-3">
              <Video className="w-4 h-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {filters.format ? `Format: ${filters.format}` : 'Format'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeSection === 'format' ? 'rotate-180' : ''}`} />
          </button>
          {activeSection === 'format' && (
            <div className="mt-3 space-y-1.5">
              {['Any Format', 'In Person', 'Online'].map(formatOption => {
                const value = formatOption === 'Any Format' ? '' : formatOption
                return (
                  <button
                    key={formatOption}
                    onClick={() => handleFilterChange('format', value)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 text-left ${
                      (filters.format === value || (!filters.format && value === ''))
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-border/50 bg-surface/50 hover:border-primary'
                    }`}
                  >
                    <span className="text-sm">{formatOption}</span>
                    {filters.format === value && value !== '' && <X className="w-3 h-3" />}
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

export default EventFilters
