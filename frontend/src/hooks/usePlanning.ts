import { create } from 'zustand'
import axiosClient from '../api/axiosClient'

export interface PlannedEvent {
  planningId: number
  eventId: number
  eventTitle: string
  eventVenue: string
  eventStartDateTime: string
  coverImage: string
  savedAt: string
  isSaved: boolean
}

interface PlanningState {
  plannedEvents: PlannedEvent[]
  loading: boolean
  isOpen: boolean
  
  fetchPlanning: () => Promise<void>
  addEvent: (eventId: string | number) => Promise<void>
  removeEvent: (eventId: string | number) => Promise<void>
  
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const usePlanning = create<PlanningState>((set, get) => ({
  plannedEvents: [],
  loading: false,
  isOpen: false,

  fetchPlanning: async () => {
    set({ loading: true })
    try {
      const res = await axiosClient.get('/planning')
      set({ plannedEvents: res.data, loading: false })
    } catch (err) {
      console.error('Failed to fetch planning', err)
      set({ loading: false })
    }
  },

  addEvent: async (eventId) => {
    try {
      await axiosClient.post(`/planning/${eventId}`)
      get().fetchPlanning()
    } catch (err) {
      console.error('Failed to add to planning', err)
      throw err
    }
  },

  removeEvent: async (eventId) => {
    try {
      await axiosClient.delete(`/planning/${eventId}`)
      get().fetchPlanning()
    } catch (err) {
      console.error('Failed to remove from planning', err)
      throw err
    }
  },

  toggleCart: () => set({ isOpen: !get().isOpen }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}))
