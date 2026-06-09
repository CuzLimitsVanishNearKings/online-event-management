import { useState, useEffect } from 'react'
import { Button } from '../ui'
import { formatCurrency } from '../../utils/format'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, AlertCircle, ShieldCheck, Zap, Ticket } from '../icons'
import { cn } from '../../utils/cn'

interface TicketSelectorProps {
  event: {
    id: string
    title: string
    venue: string
    startDateTime: string
    coverImage?: string
    ticketTypes?: any[]
    date?: string
  }
  fullEvent?: any
}

const TicketSelector = ({ event, fullEvent }: TicketSelectorProps) => {
  const navigate = useNavigate()
  
  const ticketTypes = event.ticketTypes || []

  const [selectedTicketType, setSelectedTicketType] = useState<any>(ticketTypes[0] || null)
  const [quantity, setQuantity] = useState(1)

  // Synchronize when event ticket types change
  useEffect(() => {
    if (event.ticketTypes && event.ticketTypes.length > 0) {
      setSelectedTicketType(event.ticketTypes[0])
    }
  }, [event.ticketTypes])

  if (ticketTypes.length === 0 || !selectedTicketType) {
    return (
      <div className="bg-gray-50 border border-border rounded-xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto border-2 border-dashed border-border">
          <Ticket className="w-8 h-8 text-text-muted/50" />
        </div>
        <h3 className="text-xl font-display font-bold text-text-primary">Tickets Unavailable</h3>
        <p className="text-sm text-text-muted leading-relaxed">
          The organizer has not configured any ticket tiers or seating arrangements for this event yet. Check back soon!
        </p>
      </div>
    )
  }

  const maxTickets = Math.min(10, selectedTicketType.quantityRemaining || 100)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxTickets) {
      setQuantity(newQuantity)
    }
  }

  const totalPrice = selectedTicketType.price * quantity
  const isSoldOut = selectedTicketType.quantityRemaining === 0

  const handleReserveNow = () => {
    navigate('/checkout', {
      state: {
        singleItemCheckout: {
          id: `${event.id}-single`,
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date || '',
          eventLocation: event.venue || '',
          eventImage: event.coverImage || '',
          quantity,
          price: selectedTicketType.price,
          totalPrice: totalPrice,
          ticketTypeId: selectedTicketType.ticketTypeId,
          ticketTypeName: selectedTicketType.name
        }
      }
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
          The selected ticket category is fully booked. Join the waitlist or browse similar events.
        </p>
        <Button variant="outline" className="w-full rounded-2xl font-bold">Browse Similar</Button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-border rounded-xl p-6 md:p-8 shadow-card space-y-6 md:space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-2xl font-display font-bold text-text-primary">Book Tickets</h3>
        <div className="flex items-center gap-2 text-text-muted">
           <Zap className="w-4 h-4 text-primary animate-pulse" />
           <p className="text-sm font-bold uppercase tracking-wider">{selectedTicketType.quantityRemaining || 0} spots remaining</p>
        </div>
      </div>

      {/* Ticket Selection List - Only show if there are multiple ticket types */}
      {ticketTypes.length > 1 && (
        <div className="space-y-4">
          <label className="text-xs font-bold text-text-muted uppercase tracking-widest block">Select Ticket Type</label>
          
          <div className="flex flex-col gap-3">
            {ticketTypes.map((tier: any) => {
              const isSelected = selectedTicketType?.ticketTypeId === tier.ticketTypeId;
              
              return (
                <button
                  key={tier.ticketTypeId}
                  type="button"
                  onClick={() => {
                    setSelectedTicketType(tier);
                    setQuantity(1);
                  }}
                  className={cn(
                    "w-full rounded-xl border flex items-center justify-between p-4 transition-all duration-300 text-left",
                    isSelected 
                      ? "bg-[#1E1B18] border-[#1E1B18] shadow-lg scale-[1.02] z-10" 
                      : "bg-white border-border hover:border-primary/30 hover:bg-gray-50",
                    isSelected && "ring-2 ring-primary/20 ring-offset-2"
                  )}
                >
                  <div className="flex flex-col">
                    <span className={cn(
                      "font-bold", 
                      isSelected ? "text-[#EAE6DF]" : "text-text-primary"
                    )}>
                      {tier.name}
                    </span>
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-wider mt-1", 
                      isSelected ? "text-[#EAE6DF]/70" : "text-text-muted"
                    )}>
                      {tier.quantityRemaining > 0 ? `${tier.quantityRemaining} available` : 'Sold Out'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-lg font-display font-bold", 
                      isSelected ? "text-[#EAE6DF]" : "text-text-primary"
                    )}>
                      {tier.price === 0 ? 'Free' : formatCurrency(tier.price)}
                    </span>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", 
                      isSelected ? "border-[#EAE6DF] bg-[#EAE6DF]" : "border-gray-300"
                    )}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#1E1B18]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
           <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Price per guest</p>
              <p className="text-3xl font-display font-bold text-text-primary">
                 {selectedTicketType.price === 0 ? 'Free' : formatCurrency(selectedTicketType.price)}
              </p>
           </div>
           
           <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-2xl border border-border/50">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-primary/5 hover:text-primary hover:border-primary/20 disabled:opacity-50 transition-all shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="w-6 text-center font-bold text-lg text-text-primary">{quantity}</span>
              
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxTickets}
                className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-primary/5 hover:text-primary hover:border-primary/20 disabled:opacity-50 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
           </div>
        </div>
      {/* Summary */}
      <div className="pt-6 border-t border-border/50 space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-text-muted font-bold">Total Price</span>
          <span className="text-3xl font-display font-bold text-primary">
            {selectedTicketType.price === 0 ? 'Free' : formatCurrency(totalPrice)}
          </span>
        </div>
        
        <div className="space-y-3">
           <Button
             variant="primary"
             size="lg"
             onClick={handleReserveNow}
             className="w-full rounded-2xl py-7 text-lg font-bold shadow-xl shadow-primary/10"
           >
             {selectedTicketType.price === 0 
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
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Secure Booking</span>
         </div>
         <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Instant Tickets</span>
         </div>
      </div>
    </div>
  )
}

export default TicketSelector
