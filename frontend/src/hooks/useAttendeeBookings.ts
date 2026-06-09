import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import axiosClient from '../api/axiosClient'

export interface MappedTicket {
  id: string
  bookingId: number
  eventName: string
  location: string
  date: string
  time: string
  ticketType: string
  price: number
  qrCodeData: string
  status: 'upcoming' | 'past'
}

const fetchAttendeeBookings = async (): Promise<MappedTicket[]> => {
  const res = await axiosClient.get('/bookings/my-bookings-detailed')
  const detailedBookings: any[] = res.data

  const mappedTickets: MappedTicket[] = []

  detailedBookings.forEach((b) => {
    const startDate = new Date(b.eventStartDateTime)
    const isUpcoming = startDate.getTime() > Date.now() && b.status === 'CONFIRMED'

    const dateStr = startDate.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    })
    const timeStr = startDate.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    })

    if (b.issuedTickets && b.issuedTickets.length > 0) {
      b.issuedTickets.forEach((t: any) => {
        mappedTickets.push({
          id: `${b.bookingId}-${t.issuedTicketId}`,
          bookingId: b.bookingId,
          eventName: b.eventTitle,
          location: b.eventVenue,
          date: dateStr,
          time: timeStr,
          ticketType: t.ticketTypeName,
          price: Number(t.ticketTypePrice) || 0,
          qrCodeData: t.qrCode || `TICKET-${t.issuedTicketId}`,
          status: isUpcoming ? 'upcoming' : 'past'
        })
      })
    } else {
      mappedTickets.push({
        id: b.bookingId.toString(),
        bookingId: b.bookingId,
        eventName: b.eventTitle,
        location: b.eventVenue,
        date: dateStr,
        time: timeStr,
        ticketType: 'General Admission',
        price: Number(b.totalAmount) || 0,
        qrCodeData: `BOOKING-${b.bookingId}`,
        status: isUpcoming ? 'upcoming' : 'past'
      })
    }
  })

  return mappedTickets
}

export const useAttendeeBookings = () => {
  const { token, isAuthenticated } = useAuthStore()

  return useQuery<MappedTicket[]>({
    queryKey: ['attendee-bookings'],
    queryFn: fetchAttendeeBookings,
    enabled: !!token && isAuthenticated,
    staleTime: 5 * 60 * 1000,   // cache for 5 min — same as organizer
    placeholderData: (prev) => prev, // keep previous data visible during background refetch
  })
}