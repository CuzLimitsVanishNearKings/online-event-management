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
  refetch: () => void
}

export const useEvents = (): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)

    try {
      // ✅ correct URL — axiosClient baseURL is already 'http://localhost:8082/api'
      const response = await axiosClient.get('/events')
      const data = response.data

      const transformedEvents: Event[] = data.map((event: any) => {
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

  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  }
}