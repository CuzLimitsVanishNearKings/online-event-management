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
  ticketTypeId: number
  ticketTypeName: string
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
      itemCount: 0,
      subtotal: 0,
      total: 0,

      // Actions
      addItem: (itemData) => {
        const state = get()
        const existingItem = state.items.find(item => item.eventId === itemData.eventId)
        
        let newItems
        if (existingItem) {
          // Update quantity if item already exists
          newItems = state.items.map(item =>
            item.eventId === itemData.eventId
              ? {
                  ...item,
                  quantity: item.quantity + itemData.quantity,
                  totalPrice: (item.quantity + itemData.quantity) * item.price
                }
              : item
          )
        } else {
          // Add new item
          const newItem: CartItem = {
            ...itemData,
            id: `${itemData.eventId}-${Date.now()}`,
            totalPrice: itemData.quantity * itemData.price,
            addedAt: new Date().toISOString()
          }
          newItems = [...state.items, newItem]
        }

        const itemCount = newItems.reduce((acc, curr) => acc + curr.quantity, 0)
        const subtotal = newItems.reduce((acc, curr) => acc + curr.totalPrice, 0)

        set({ 
          items: newItems,
          itemCount,
          subtotal,
          total: subtotal
        })
      },

      removeItem: (itemId) => {
        const newItems = get().items.filter(item => item.id !== itemId)
        const itemCount = newItems.reduce((acc, curr) => acc + curr.quantity, 0)
        const subtotal = newItems.reduce((acc, curr) => acc + curr.totalPrice, 0)

        set({ 
          items: newItems,
          itemCount,
          subtotal,
          total: subtotal
        })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        
        const newItems = get().items.map(item =>
          item.id === itemId
            ? { ...item, quantity, totalPrice: quantity * item.price }
            : item
        )
        const itemCount = newItems.reduce((acc, curr) => acc + curr.quantity, 0)
        const subtotal = newItems.reduce((acc, curr) => acc + curr.totalPrice, 0)

        set({ 
          items: newItems,
          itemCount,
          subtotal,
          total: subtotal
        })
      },

      clearCart: () => {
        set({ 
          items: [],
          itemCount: 0,
          subtotal: 0,
          total: 0
        })
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
        itemCount: state.itemCount,
        subtotal: state.subtotal,
        total: state.total
      }),
    }
  )
)

// Selectors for optimized re-renders
export const useCartItems = () => useCartStore(state => state.items)
export const useCartItemCount = () => useCartStore(state => state.itemCount)
export const useCartTotal = () => useCartStore(state => state.total)
export const useCartIsOpen = () => useCartStore(state => state.isOpen)
