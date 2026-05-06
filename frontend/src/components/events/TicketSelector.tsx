import { useState } from 'react'
import { Button } from '@/components/ui'
import { formatCurrency } from '@/utils/format'
import { useCartStore } from '@/store/cartStore'

interface TicketSelectorProps {
  event: {
    id: string
    title: string
    price: number
    capacity: number
    currentAttendees: number
  }
  fullEvent?: {
    date: string
    location: string
    image?: string
  }
}

const TicketSelector = ({ event, fullEvent }: TicketSelectorProps) => {
  const [quantity, setQuantity] = useState(1)
  const { addItem, hasItem } = useCartStore()
  const maxTickets = Math.min(10, event.capacity - event.currentAttendees)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxTickets) {
      setQuantity(newQuantity)
    }
  }

  const totalPrice = event.price * quantity
  const isSoldOut = event.capacity - event.currentAttendees === 0
  const isInCart = hasItem(event.id)

  const handleAddToCart = () => {
    addItem({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: fullEvent?.date || '',
      eventLocation: fullEvent?.location || '',
      eventImage: fullEvent?.image || '',
      quantity,
      price: event.price
    })
  }

  if (isSoldOut) {
    return (
      <div className="bg-white border border-secondary rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Sold Out</h3>
        <p className="text-text-muted">
          This event is fully booked. Check back later for cancellations.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-secondary rounded-xl p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Get Your Tickets
        </h3>
        <p className="text-text-muted text-sm">
          {maxTickets} ticket{maxTickets !== 1 ? 's' : ''} remaining
        </p>
      </div>

      {/* Price Display */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-text-muted">Price per ticket</span>
          <span className="text-xl font-bold text-text-primary">
            {event.price === 0 ? 'Free' : formatCurrency(event.price)}
          </span>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Quantity
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-lg border border-secondary flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <div className="w-16 text-center">
            <span className="text-lg font-semibold text-text-primary">{quantity}</span>
          </div>
          
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= maxTickets}
            className="w-10 h-10 rounded-lg border border-secondary flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        {maxTickets < 10 && (
          <p className="text-xs text-text-muted">
            Maximum {maxTickets} ticket{maxTickets !== 1 ? 's' : ''} per order
          </p>
        )}
      </div>

      {/* Total Price */}
      <div className="border-t border-secondary pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-semibold text-text-primary">Total</span>
          <span className="text-2xl font-bold text-primary">
            {event.price === 0 ? 'Free' : formatCurrency(totalPrice)}
          </span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={handleAddToCart}
        className="w-full"
        disabled={isInCart}
      >
        {isInCart 
          ? 'Already in Cart' 
          : event.price === 0 
            ? 'Register for Free' 
            : 'Add to Cart'
        }
      </Button>

      {/* Event Info */}
      <div className="border-t border-secondary pt-4">
        <div className="space-y-2 text-sm text-text-muted">
          <p>
            <strong>Event:</strong> {event.title}
          </p>
          <p>
            <strong>Availability:</strong> {maxTickets} spot{maxTickets !== 1 ? 's' : ''} left
          </p>
        </div>
      </div>
    </div>
  )
}

export default TicketSelector
