import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Country, City } from '../types'

interface LocationState {
  // Location preferences
  selectedCountry: Country | null
  selectedCity: City | null
  
  // Actions
  setSelectedCountry: (country: Country | null) => void
  setSelectedCity: (city: City | null) => void
  updateLocation: (country: Country, city: City) => void
  clearLocation: () => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedCountry: null,
      selectedCity: null,

      // Actions
      setSelectedCountry: (country) => {
        set({ 
          selectedCountry: country,
          selectedCity: null // Reset city when country changes
        })
      },

      setSelectedCity: (city) => {
        set({ selectedCity: city })
      },



      updateLocation: (country, city) => {
        set({ 
          selectedCountry: country,
          selectedCity: city
        })
      },

      clearLocation: () => {
        set({ 
          selectedCountry: null,
          selectedCity: null
        })
      },
    }),
    {
      name: 'location-storage',
      partialize: (state) => ({
        selectedCountry: state.selectedCountry,
        selectedCity: state.selectedCity,
      }),
    }
  )
)

// Selector hooks for computed values
export const useAvailableCities = () => {
  return useLocationStore((state) => 
    state.selectedCountry?.cities || []
  )
}

export const useHasLocation = () => {
  return useLocationStore((state) => 
    !!(state.selectedCountry && state.selectedCity)
  )
}

export const useLocationDisplay = () => {
  return useLocationStore((state) => {
    const { selectedCountry, selectedCity } = state
    
    if (!selectedCountry || !selectedCity) {
      return 'All Locations'
    }
    
    return `${selectedCity.name}, ${selectedCountry.name}`
  })
}

export const useLocationFilter = () => {
  return useLocationStore((state) => {
    const { selectedCountry, selectedCity } = state
    
    return {
      country: selectedCountry?.code || '',
      city: selectedCity?.id || '',
      hasCountryFilter: !!selectedCountry,
      hasCityFilter: !!selectedCity,
    }
  })
}
