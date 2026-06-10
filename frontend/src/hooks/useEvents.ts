import { useState, useEffect, useRef } from 'react'
import axiosClient from '../api/axiosClient'

interface Category {
  categoryId: number
  name: string
}

interface Event {
  id: string
  title: string
  description?: string
  venue: string
  startDateTime: string
  endDateTime: string
  status: string
  coverImage?: string
  category?: Category
  organizerName?: string
  organizerLogoUrl?: string
  capacity?: number
  price?: number

  // UI-only derived fields
  date: string
  time: string
  location: string
  categoryName: string
  thumbnail?: string
}

interface UseEventsReturn {
  events: Event[]
  loading: boolean
  error: string | null
  refetch: (filters?: Record<string, any>) => void
}

export const useEvents = (initialFilters?: Record<string, any>): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async (filters?: Record<string, any>) => {
    setLoading(true)
    setError(null)

    try {
      let endpoint = '/events'
      const params = new URLSearchParams()
      
      if (filters) {
        endpoint = '/events/filter'
        if (filters.search) params.append('keyword', filters.search)
        if (filters.category) params.append('category', filters.category)
        if (filters.city) params.append('venue', filters.city)
        if (filters.startDate) params.append('startDate', filters.startDate)
        if (filters.endDate) params.append('endDate', filters.endDate)
      }
      
      const queryString = params.toString()
      if (queryString) {
        endpoint += `?${queryString}`
      }

      const response = await axiosClient.get(endpoint)
      const data = response.data
const eventList: any[] = Array.isArray(data) ? data : (data.content ?? [])
const transformedEvents: Event[] = eventList.map((event: any)  => {
        const startDate = new Date(event.startDateTime)

        return {
          id: event.eventId?.toString(),
          title: event.title || 'Untitled Event',
          venue: event.venue || 'TBD',
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          status: event.status,
          coverImage: event.coverImage,
          category: event.category,
          organizerName: event.organizerName,
          organizerLogoUrl: event.organizerLogoUrl,
          capacity: event.capacity || 0,
          price: event.minPrice || 0,

          // UI derived fields
          date: startDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          time: startDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          location: event.venue || 'TBD',
          categoryName: event.category?.name || 'General',
          thumbnail: event.coverImage
        }
      })

      setEvents(transformedEvents)
    } catch (err: any) {
      console.error('Failed to fetch events:', err)
      setError(err.response?.data?.message || 'Failed to fetch events')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  // Serialize filters once; compare with a ref to avoid firing the effect on every
  // render when the caller passes an inline object literal (new reference each time).
  const filtersKey = JSON.stringify(initialFilters ?? null)
  const prevFiltersKey = useRef<string>('')

  useEffect(() => {
    if (filtersKey === prevFiltersKey.current) return
    prevFiltersKey.current = filtersKey
    fetchEvents(initialFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey])

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  }
}