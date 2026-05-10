import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient'

interface Event {
  id: string
  title: string
  description?: string
  venue: string
  startDateTime: string
  endDateTime: string
  status: string
  capacity: number
  coverImage?: string
  createdAt: string
  category?: {
    id: number
    name: string
  }
  // UI-only fields derived from backend data
  date: string
  time: string
  location: string
  categoryName: string
  price?: number
  originalPrice?: number
  attendees?: number
  rating?: number
  reviewCount?: number
  isTrending?: boolean
  isFeatured?: boolean
  country?: string
  city?: string
  tags?: string[]
  images?: string[]
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
      const response = await axiosClient.get('/api/events')
      const data = response.data
      
      // Transform backend data to match our Event interface
      const transformedEvents: Event[] = data.map((event: any) => {
        const startDate = new Date(event.startDateTime)
        const endDate = new Date(event.endDateTime)
        
        return {
          id: event.eventId?.toString() || event.id?.toString(),
          title: event.title || 'Untitled Event',
          description: event.description,
          venue: event.venue || 'TBD',
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          status: event.status,
          capacity: event.capacity || 0,
          coverImage: event.coverImage,
          createdAt: event.createdAt,
          category: event.category,
          
          // UI-only derived fields
          date: startDate.toISOString().split('T')[0],
          time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          location: event.venue || 'TBD',
          categoryName: event.category?.name || 'General',
          price: event.price || 0,
          originalPrice: event.originalPrice,
          attendees: event.currentAttendees || 0,
          rating: event.rating,
          reviewCount: event.reviewCount,
          isTrending: event.isTrending,
          isFeatured: event.isFeatured,
          country: event.country,
          city: event.city,
          tags: event.tags,
          images: event.coverImage ? [event.coverImage] : [],
          thumbnail: event.coverImage
        }
      })

      setEvents(transformedEvents)
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
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
