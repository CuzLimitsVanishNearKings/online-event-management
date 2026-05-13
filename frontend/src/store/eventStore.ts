import { create } from 'zustand'

export interface EventItem {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  price: number
  category: string
  status: 'published' | 'draft' | 'past'
  createdAt: string
}

interface EventStore {
  events: EventItem[]
  payoutConnected: boolean
  addEvent: (event: Omit<EventItem, 'id' | 'createdAt' | 'status'>) => void
  connectPayout: () => void
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  payoutConnected: false,
  
  addEvent: (eventData) => set((state) => ({
    events: [
      {
        ...eventData,
        id: Math.random().toString(36).substring(2, 9),
        status: 'published',
        createdAt: new Date().toISOString(),
      },
      ...state.events
    ]
  })),

  connectPayout: () => set({ payoutConnected: true }),
}))
