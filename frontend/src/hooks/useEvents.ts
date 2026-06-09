import { useState, useEffect } from 'react'
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
  totalPages: number
  totalElements: number
  refetch: (filters?: Record<string, any>) => void
}

export const useEvents = (
  initialFilters?: Record<string, any>,
  limit?: number,
  page: number = 0,
  size: number = 12
): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const fetchEvents = async (filters?: Record<string, any>) => {
    setLoading(true)
    setError(null)

    try {
      let endpoint = '/events'
      const params = new URLSearchParams()

      if (filters && Object.values(filters).some(v => v)) {
        // has active filters — use filter endpoint (returns plain list)
        endpoint = '/events/filter'
        if (filters.search) params.append('keyword', filters.search)
        if (filters.category) params.append('category', filters.category)
        if (filters.city) params.append('venue', filters.city)
        if (filters.startDate) params.append('startDate', filters.startDate)
        if (filters.endDate) params.append('endDate', filters.endDate)
      } else {
        // no filters — use paginated endpoint
        params.append('page', String(page))
        params.append('size', String(size))
      }

      const queryString = params.toString()
      if (queryString) endpoint += `?${queryString}`

      const response = await axiosClient.get(endpoint)
      const data = response.data

      // handle both paginated (Page object) and plain list responses
      const rawList = data.content ?? data

      setTotalPages(data.totalPages ?? 1)
      setTotalElements(data.totalElements ?? rawList.length)

      const transformedEvents: Event[] = rawList.map((event: any) => {
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

      setEvents(limit ? transformedEvents.slice(0, limit) : transformedEvents)
    } catch (err: any) {
      console.error('Failed to fetch events:', err)
      setError(err.response?.data?.message || 'Failed to fetch events')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents(initialFilters)
  }, [JSON.stringify(initialFilters), page, size])

  return {
    events,
    loading,
    error,
    totalPages,
    totalElements,
    refetch: fetchEvents
  }
}