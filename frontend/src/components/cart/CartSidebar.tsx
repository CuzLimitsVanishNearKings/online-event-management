import { Link, useNavigate } from 'react-router-dom'
import { X, Minus, Plus, Ticket } from '../icons'
import { useCartStore } from '../../store/cartStore'
import { formatCurrency } from '../../utils/format'
import { Button } from '../ui'
import { cn } from '../../utils/cn'

const CartSidebar = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, total } = useCartStore()
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface/30">
          <div className="flex items-center gap-3">
             <Ticket className="w-5 h-5 text-primary" />
             <h2 className="text-xl font-display font-bold text-text-primary tracking-tight">Selected Tickets</h2>
          </div>
          <button 
            onClick={closeCart}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center border border-border">
                <Ticket className="w-8 h-8 text-text-muted/50" />
              </div>
              <p className="text-lg font-bold text-text-primary">No tickets selected</p>
              <p className="text-text-muted">Looks like you haven't added any tickets yet.</p>
              <Button 
                onClick={() => { closeCart(); navigate('/events') }}
                variant="outline"
                className="mt-4 rounded-xl border-border font-bold text-text-secondary"
              >
                Browse Events
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-border bg-gray-50/50">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    {item.eventImage ? (
                      <img src={item.eventImage} alt={item.eventTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary/50 text-xs font-bold uppercase">
                        Ticket
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-text-primary text-sm leading-tight">{item.eventTitle}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-text-muted hover:text-red-500 transition-colors p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold text-primary">{item.price === 0 ? 'Free' : formatCurrency(item.price)}</p>
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-border p-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-primary transition-colors disabled:opacity-50" disabled={item.quantity <= 1}>
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-primary transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-surface/30 space-y-4">
            <div className="flex justify-between items-center font-bold">
              <span className="text-text-muted">Total</span>
              <span className="text-2xl text-text-primary">{formatCurrency(total)}</span>
            </div>
            <Button 
              onClick={() => { closeCart(); navigate('/checkout') }}
              variant="primary"
              className="w-full rounded-2xl py-6 text-lg font-bold shadow-xl shadow-primary/20"
            >
              Complete Reservations
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartSidebar
