import { create } from 'zustand'

export interface TicketItem {
  id: string
  eventId: string
  eventName: string
  date: string
  location: string
  ticketType: string
  price: number
  qrCodeData: string
  status: 'upcoming' | 'past' | 'cancelled'
  purchaseDate: string
}

export interface FavoriteItem {
  id: string
  eventName: string
  date: string
  location: string
  category: string
  price: number
  imageUrl?: string
}

interface AttendeeStore {
  tickets: TicketItem[]
  favorites: FavoriteItem[]
  bookTicket: (ticket: Omit<TicketItem, 'id' | 'qrCodeData' | 'purchaseDate' | 'status'>) => void
  toggleFavorite: (event: FavoriteItem) => void
}

export const useAttendeeStore = create<AttendeeStore>((set) => ({
  tickets: [],
  favorites: [],
  
  bookTicket: (ticketData) => set((state) => ({
    tickets: [
      {
        ...ticketData,
        id: Math.random().toString(36).substring(2, 9).toUpperCase(),
        qrCodeData: `TICKET-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        status: 'upcoming',
        purchaseDate: new Date().toISOString(),
      },
      ...state.tickets
    ]
  })),

  toggleFavorite: (event) => set((state) => {
    const isFavorite = state.favorites.some(f => f.id === event.id)
    if (isFavorite) {
      return { favorites: state.favorites.filter(f => f.id !== event.id) }
    } else {
      return { favorites: [event, ...state.favorites] }
    }
  }),
}))
