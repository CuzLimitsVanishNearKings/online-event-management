import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface CartItem {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  eventImage?: string
  quantity: number
  price: number
  totalPrice: number
  addedAt: string
}

export interface CartSummary {
  itemCount: number
  subtotal: number
  tax: number
  total: number
}

// Store State
interface CartState {
  // State
  items: CartItem[]
  isOpen: boolean
  
  // Computed
  itemCount: number
  subtotal: number
  total: number
  
  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice' | 'addedAt'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  
  // Helper methods
  getItem: (itemId: string) => CartItem | undefined
  getItemsByEventId: (eventId: string) => CartItem[]
  hasItem: (eventId: string) => boolean
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial State
      items: [],
      isOpen: false,
      
      // Computed getters
      get itemCount() {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      get subtotal() {
        return get().items.reduce((total, item) => total + item.totalPrice, 0)
      },
      
      get total() {
        return get().subtotal // Add tax if needed in the future
      },

      // Actions
      addItem: (itemData) => {
        const state = get()
        const existingItem = state.items.find(item => item.eventId === itemData.eventId)
        
        if (existingItem) {
          // Update quantity if item already exists
          const updatedItems = state.items.map(item =>
            item.eventId === itemData.eventId
              ? {
                  ...item,
                  quantity: item.quantity + itemData.quantity,
                  totalPrice: (item.quantity + itemData.quantity) * item.price
                }
              : item
          )
          set({ items: updatedItems })
        } else {
          // Add new item
          const newItem: CartItem = {
            ...itemData,
            id: `${itemData.eventId}-${Date.now()}`,
            totalPrice: itemData.quantity * itemData.price,
            addedAt: new Date().toISOString()
          }
          set({ items: [...state.items, newItem] })
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter(item => item.id !== itemId) })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        
        const updatedItems = get().items.map(item =>
          item.id === itemId
            ? { ...item, quantity, totalPrice: quantity * item.price }
            : item
        )
        set({ items: updatedItems })
      },

      clearCart: () => {
        set({ items: [] })
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      // Helper methods
      getItem: (itemId) => {
        return get().items.find(item => item.id === itemId)
      },

      getItemsByEventId: (eventId) => {
        return get().items.filter(item => item.eventId === eventId)
      },

      hasItem: (eventId) => {
        return get().items.some(item => item.eventId === eventId)
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
)

// Selectors for optimized re-renders
export const useCartItems = () => useCartStore(state => state.items)
export const useCartItemCount = () => useCartStore(state => state.itemCount)
export const useCartTotal = () => useCartStore(state => state.total)
export const useCartIsOpen = () => useCartStore(state => state.isOpen)
