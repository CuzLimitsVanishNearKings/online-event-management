import { useState } from 'react'
import { Button } from '../ui'
import { formatCurrency } from '../../utils/format'
import { useCartStore } from '../../store/cartStore'
import { Minus, Plus, AlertCircle, ShieldCheck, Zap, Ticket } from '../icons'
import { cn } from '../../utils/cn'

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
      <div className="bg-gray-50 border border-border rounded-xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-text-muted" />
        </div>
        <h3 className="text-2xl font-display font-bold text-text-primary">Sold Out</h3>
        <p className="text-text-muted leading-relaxed">
          This experience is fully booked. Join the waitlist or browse similar events.
        </p>
        <Button variant="outline" className="w-full rounded-2xl">Browse Similar</Button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-border rounded-xl p-8 shadow-card space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-2xl font-display font-bold text-text-primary">Book Tickets</h3>
        <div className="flex items-center gap-2 text-text-muted">
           <Zap className="w-4 h-4 text-primary" />
           <p className="text-sm font-bold uppercase tracking-wider">{maxTickets} spots remaining</p>
        </div>
      </div>

      {/* Price & Quantity */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Price per guest</p>
              <p className="text-3xl font-display font-bold text-text-primary">
                 {event.price === 0 ? 'Free' : formatCurrency(event.price)}
              </p>
           </div>
           
           <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-2xl border border-border/50">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-primary/5 hover:text-primary hover:border-primary/20 disabled:opacity-50 transition-all shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="w-6 text-center font-bold text-lg text-text-primary">{quantity}</span>
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxTickets}
                className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-primary/5 hover:text-primary hover:border-primary/20 disabled:opacity-50 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

      {/* Summary */}
      <div className="pt-6 border-t border-border/50 space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-text-muted font-bold">Total Price</span>
          <span className="text-3xl font-display font-bold text-primary">
            {event.price === 0 ? 'Free' : formatCurrency(totalPrice)}
          </span>
        </div>
        
        <div className="space-y-3">
           <Button
             variant="primary"
             size="lg"
             onClick={handleAddToCart}
             className="w-full rounded-2xl py-7 text-lg font-bold shadow-xl shadow-primary/10"
             disabled={isInCart}
           >
             {isInCart 
               ? 'Already in Cart' 
               : event.price === 0 
                 ? 'Register Now' 
                 : 'Reserve My Spot'
             }
           </Button>
           <p className="text-center text-xs text-text-muted font-medium">
              Free cancellation up to 48 hours before
           </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="pt-6 border-t border-border/50 grid grid-cols-2 gap-4">
         <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Secure Payment</span>
         </div>
         <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Instant Access</span>
         </div>
      </div>
    </div>
  )
}

export default TicketSelector

