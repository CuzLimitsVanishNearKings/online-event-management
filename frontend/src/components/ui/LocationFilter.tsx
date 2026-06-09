import { useState, useEffect } from 'react'
import { Country, City, COUNTRIES } from '../../types'
import { useLocationStore } from '../../store/locationStore'
import { MapPin, ChevronDown, Search } from '../icons'

interface LocationFilterProps {
  className?: string
  showFlag?: boolean
  compact?: boolean
}

const LocationFilter = ({ className = '', showFlag = false, compact = false }: LocationFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'country' | 'city'>('country')
  const [searchTerm, setSearchTerm] = useState('')
  
  const { selectedCountry, selectedCity, setSelectedCountry, setSelectedCity } = useLocationStore()
  const availableCities = selectedCountry?.cities || []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.location-filter')) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset to country tab when country changes
  useEffect(() => {
    setActiveTab('country')
  }, [selectedCountry])

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    // Auto-select first city if available
    if (country.cities.length > 0) {
      setSelectedCity(country.cities[0])
    }
  }

  const handleCitySelect = (city: City) => {
    setSelectedCity(city)
  }

  const handleClearLocation = () => {
    setSelectedCountry(null)
    setSelectedCity(null)
    setIsOpen(false)
  }

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter cities based on search
  const filteredCities = availableCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.state?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Country flag emojis
  const getCountryFlag = (code: string): string => {
    const flagMap: { [key: string]: string } = {
      'US': '🇺🇸',
      'GB': '🇬🇧',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'NG': '🇳🇬',
      'KE': '🇰🇪',
      'ZA': '🇿🇦',
    }
    return flagMap[code] || '🌍'
  }

  const displayText = () => {
    if (!selectedCountry) return 'All Locations'
    if (!selectedCity) return selectedCountry.name
    return compact ? selectedCity.name : `${selectedCity.name}, ${selectedCountry.name}`
  }

  return (
    <div className={`location-filter relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-surface transition-colors duration-200 ${
          compact ? 'px-2 py-1 text-sm' : ''
        }`}
      >
        {selectedCountry && showFlag && (
          <span className="text-lg">{getCountryFlag(selectedCountry.code)}</span>
        )}
        <MapPin className="w-4 h-4 text-text-secondary" />
        <span className="font-medium text-text-primary truncate max-w-32">
          {displayText()}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-md shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('country')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'country' 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
              }`}
            >
              Country
            </button>
            <button
              onClick={() => setActiveTab('city')}
              disabled={!selectedCountry}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'city' 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' 
                  : selectedCountry
                    ? 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                    : 'text-text-muted cursor-not-allowed'
              }`}
            >
              City
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'country' ? 'countries' : 'cities'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-64">
            {activeTab === 'country' ? (
              <div>
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full flex items-center justify-between px-3 py-3 hover:bg-surface transition-colors duration-200 ${
                      selectedCountry?.code === country.code ? 'bg-primary/10 border-l-2 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {showFlag && (
                        <span className="text-lg">{getCountryFlag(country.code)}</span>
                      )}
                      <div className="text-left">
                        <div className="font-medium text-text-primary">
                          {country.name}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {country.cities.length} cities
                        </div>
                      </div>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <div className="text-xs text-primary">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="px-3 py-8 text-center text-text-secondary">
                    No countries found
                  </div>
                )}
              </div>
            ) : (
              <div>
                {selectedCountry ? (
                  <>
                    {filteredCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full flex items-center justify-between px-3 py-3 hover:bg-surface transition-colors duration-200 ${
                          selectedCity?.id === city.id ? 'bg-primary/10 border-l-2 border-primary' : ''
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-medium text-text-primary">
                            {city.name}
                          </div>
                          {city.state && (
                            <div className="text-xs text-text-secondary">
                              {city.state}
                            </div>
                          )}
                        </div>
                        {selectedCity?.id === city.id && (
                          <div className="text-xs text-primary">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                    {filteredCities.length === 0 && (
                      <div className="px-3 py-8 text-center text-text-secondary">
                        No cities found
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-3 py-8 text-center text-text-secondary">
                    Select a country first
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Clear button */}
          {(selectedCountry || selectedCity) && (
            <div className="p-3 border-t border-border">
              <button
                onClick={handleClearLocation}
                className="w-full px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors duration-200"
              >
                Clear location
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LocationFilter
