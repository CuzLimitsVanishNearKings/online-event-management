import { useState } from 'react'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'

interface EventFiltersProps {
  onFiltersChange: (filters: EventFilters) => void
}

export interface EventFilters {
  search: string
  category: string
  city: string
  minPrice: number
  maxPrice: number
}

const EventFilters = ({ onFiltersChange }: EventFiltersProps) => {
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    category: '',
    city: '',
    minPrice: 0,
    maxPrice: 500,
  })

  const categories = [
    'All',
    'Music',
    'Sports',
    'Technology',
    'Business',
    'Arts',
    'Food & Drink',
    'Education',
    'Entertainment',
    'Health & Wellness',
    'Social',
  ]

  const cities = [
    'All Cities',
    'New York',
    'Los Angeles',
    'Chicago',
    'San Francisco',
    'Miami',
    'Boston',
    'Seattle',
    'Denver',
    'Austin',
  ]

  const handleFilterChange = (key: keyof EventFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: '',
      city: '',
      minPrice: 0,
      maxPrice: 500,
    }
    setFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  return (
    <div className="bg-white border border-secondary rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Search Events
        </label>
        <Input
          placeholder="Search by name or description..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-secondary rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category} value={category === 'All' ? '' : category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          City
        </label>
        <select
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          className="w-full px-3 py-2 border border-secondary rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {cities.map((city) => (
            <option key={city} value={city === 'All Cities' ? '' : city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Price Range
        </label>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-text-muted w-8">$</span>
            <Input
              type="number"
              placeholder="Min"
              min="0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-text-muted w-8">$</span>
            <Input
              type="number"
              placeholder="Max"
              min="0"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 500)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventFilters
