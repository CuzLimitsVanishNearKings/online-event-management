import { useState, useEffect } from 'react'
import { Button } from '../ui'
import { 
  Search, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Star, 
  X,
  ChevronDown,
  Filter,
  SlidersHorizontal
} from '../icons'

export interface EventFilters {
  search: string
  category: string
  city: string
  minPrice: number
  maxPrice: number
  tags: string[]
}

interface EventFiltersProps {
  filters: EventFilters
  onFiltersChange: (filters: EventFilters) => void
  isOpen?: boolean
  onToggle?: () => void
}

const categories = [
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'food', name: 'Food & Drink', icon: '🍽' },
  { id: 'arts', name: 'Arts & Culture', icon: '🎨' },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'social', name: 'Social', icon: '👥' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
]

const popularTags = [
  'Live Music', 'Festival', 'Food', 'Networking', 'Workshop',
  'Conference', 'Sports', 'Art', 'Technology', 'Comedy'
]

const EventFilters = ({ 
  filters, 
  onFiltersChange, 
  isOpen = false, 
  onToggle 
}: EventFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState<'search' | 'category' | 'location' | 'price' | null>(null)

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      city: '',
      minPrice: 0,
      maxPrice: 1000,
      tags: []
    })
  }

  const hasActiveFilters = filters.search || filters.category || filters.city || 
    filters.minPrice > 0 || filters.maxPrice < 1000 || filters.tags.length > 0

  const activeFiltersCount = [
    filters.search,
    filters.category,
    filters.city,
    filters.minPrice > 0 ? 'price' : null,
    filters.maxPrice < 1000 ? 'price' : null,
    ...filters.tags
  ].filter(Boolean).length

  return (
    <div className={`bg-white border border-border/50 rounded-xl shadow-sm ${isOpen ? 'w-80' : 'w-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-text-primary">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-text-secondary hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className="max-h-96 overflow-y-auto">
        {/* Search Section */}
        <div className="p-4 border-b border-border/50">
          <button
            onClick={() => setActiveSection(activeSection === 'search' ? null : 'search')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 ${
              activeSection === 'search'
                ? 'border-primary bg-primary/5'
                : 'border-border/50 bg-surface/50 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Search className="w-4 h-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {filters.search || 'Search events...'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
              activeSection === 'search' ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        {/* Category Section */}
        <div className="p-4 border-b border-border/50">
          <button
            onClick={() => setActiveSection(activeSection === 'category' ? null : 'category')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 ${
              activeSection === 'category'
                ? 'border-primary bg-primary/5'
                : 'border-border/50 bg-surface/50 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Star className="w-4 h-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {filters.category || 'Categories'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
              activeSection === 'category' ? 'rotate-180' : ''
            }`} />
          </button>
          
          {activeSection === 'category' && (
            <div className="mt-3 space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange('category', category.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors duration-200 text-left ${
                    filters.category === category.id
                      ? 'border-primary bg-primary text-white'
                      : 'border-border/50 bg-surface/50 hover:border-primary hover:bg-surface/100'
                  }`}
                >
                  <span className="text-lg mr-3">{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                  {filters.category === category.id && (
                    <div className="ml-auto">
                      <X className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="p-4 border-b border-border/50">
          <button
            onClick={() => setActiveSection(activeSection === 'location' ? null : 'location')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 ${
              activeSection === 'location'
                ? 'border-primary bg-primary/5'
                : 'border-border/50 bg-surface/50 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {filters.city || 'Location'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
              activeSection === 'location' ? 'rotate-180' : ''
            }`} />
          </button>
          
          {activeSection === 'location' && (
            <div className="mt-3">
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Enter city or location..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="p-4 border-b border-border/50">
          <button
            onClick={() => setActiveSection(activeSection === 'price' ? null : 'price')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 ${
              activeSection === 'price'
                ? 'border-primary bg-primary/5'
                : 'border-border/50 bg-surface/50 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <DollarSign className="w-4 h-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                Price Range
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
              activeSection === 'price' ? 'rotate-180' : ''
            }`} />
          </button>
          
          {activeSection === 'price' && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                  placeholder="Min"
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
                <span className="text-text-muted">-</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                  placeholder="Max"
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
              
              {/* Quick Price Ranges */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => {
                    handleFilterChange('minPrice', 0)
                    handleFilterChange('maxPrice', 50)
                  }}
                  className={`p-2 text-xs rounded-lg border transition-colors duration-200 ${
                    filters.minPrice === 0 && filters.maxPrice === 50
                      ? 'border-primary bg-primary text-white'
                      : 'border-border/50 bg-surface/50 hover:border-primary hover:bg-surface/100'
                  }`}
                >
                  Free - $50
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('minPrice', 50)
                    handleFilterChange('maxPrice', 100)
                  }}
                  className={`p-2 text-xs rounded-lg border transition-colors duration-200 ${
                    filters.minPrice === 50 && filters.maxPrice === 100
                      ? 'border-primary bg-primary text-white'
                      : 'border-border/50 bg-surface/50 hover:border-primary hover:bg-surface/100'
                  }`}
                >
                  $50 - $100
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('minPrice', 100)
                    handleFilterChange('maxPrice', 200)
                  }}
                  className={`p-2 text-xs rounded-lg border transition-colors duration-200 ${
                    filters.minPrice === 100 && filters.maxPrice === 200
                      ? 'border-primary bg-primary text-white'
                      : 'border-border/50 bg-surface/50 hover:border-primary hover:bg-surface/100'
                  }`}
                >
                  $100 - $200
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('minPrice', 200)
                    handleFilterChange('maxPrice', 1000)
                  }}
                  className={`p-2 text-xs rounded-lg border transition-colors duration-200 ${
                    filters.minPrice === 200 && filters.maxPrice === 1000
                      ? 'border-primary bg-primary text-white'
                      : 'border-border/50 bg-surface/50 hover:border-primary hover:bg-surface/100'
                  }`}
                >
                  $200+
                </button>
              </div>
            </div>
          )}
        </div>

              </div>

      {/* Apply Filters Button */}
      <div className="p-4 border-t border-border/50">
        <Button
          onClick={() => onToggle?.()}
          className="w-full bg-primary hover:bg-primary-dark text-white"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

export default EventFilters
