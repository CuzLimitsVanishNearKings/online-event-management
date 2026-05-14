import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore } from '../store/cartStore'
import { formatCurrency } from '../utils/format'
import { Button, Input } from '../components/ui'
import { ChevronLeft, Ticket, ShieldCheck, CheckCircle } from '../components/icons'

const CheckoutPage = () => {
  const { items, total, clearCart } = useCartStore()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'vip10') {
      setDiscount(total * 0.1)
    } else {
      setDiscount(0)
      alert("Invalid promo code")
    }
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      clearCart()
      
      // Navigate to tickets after 3 seconds
      setTimeout(() => {
        navigate('/attendee/tickets')
      }, 3000)
    }, 2000)
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <Ticket className="w-16 h-16 text-text-muted mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">Your cart is empty</h1>
        <p className="text-text-muted mb-6">Add some events before checking out.</p>
        <Button onClick={() => navigate('/events')} variant="primary" className="rounded-xl px-8">
          Browse Events
        </Button>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-3xl border border-border shadow-xl max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Payment Successful!</h1>
          <p className="text-text-muted mb-8 leading-relaxed">
            Your tickets have been issued and sent to your email. Get ready for an amazing experience.
          </p>
          
          <div className="w-full h-32 bg-gray-100 rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
             {/* Simulated Barcode */}
             <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(90deg, #000 2px, transparent 2px, transparent 6px, #000 6px, #000 10px, transparent 10px, transparent 12px, #000 12px, #000 16px, transparent 16px)', backgroundSize: '20px 100%' }} />
             <span className="relative bg-white px-4 py-1 rounded-md text-xs font-bold text-text-muted z-10 border border-border">Generating secure ticket...</span>
          </div>
          
          <p className="text-sm font-bold text-primary animate-pulse">Redirecting to your tickets...</p>
        </motion.div>
      </div>
    )
  }

  const finalTotal = total - discount

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/events" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary font-bold text-sm transition-colors uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" /> Keep Browsing
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">Checkout</h1>
              <p className="text-text-muted mt-2">Complete your order securely.</p>
            </div>

            <form onSubmit={handlePayment} className="bg-white rounded-3xl border border-border p-8 shadow-sm space-y-8 relative overflow-hidden">
              {/* Glassmorphism subtle background element */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" required />
                  <Input label="Last Name" required />
                  <Input label="Email Address" type="email" required className="md:col-span-2" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" /> Payment Method
                </h3>
                
                {/* Simulated Credit Card Box */}
                <div className="p-6 rounded-2xl border border-border bg-gray-50/50 space-y-4">
                  <Input label="Card Number" placeholder="0000 0000 0000 0000" required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiry Date" placeholder="MM/YY" required />
                    <Input label="CVC" placeholder="123" required />
                  </div>
                  <Input label="Name on Card" required />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full rounded-2xl py-6 text-lg font-bold shadow-xl shadow-primary/20 relative"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ${formatCurrency(finalTotal)}`
                )}
              </Button>
              <p className="text-center text-xs text-text-muted font-medium flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Payments are secure and encrypted
              </p>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-border p-8 shadow-sm sticky top-8 space-y-6">
              <h3 className="text-xl font-display font-bold text-text-primary border-b border-border pb-4">Order Summary</h3>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-surface rounded-xl overflow-hidden flex-shrink-0 border border-border">
                       {item.eventImage ? (
                          <img src={item.eventImage} alt="Event" className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">TIC</div>
                       )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-text-primary line-clamp-1">{item.eventTitle}</h4>
                      <p className="text-xs text-text-muted mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-text-primary text-sm">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Promo Code */}
              <div className="pt-6 border-t border-border">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Promo code (try VIP10)" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border border-border rounded-xl px-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                  <Button onClick={handleApplyPromo} variant="outline" className="rounded-xl border-border bg-gray-50 text-text-secondary font-bold">Apply</Button>
                </div>
              </div>

              {/* Totals */}
              <div className="pt-6 border-t border-border space-y-3">
                <div className="flex justify-between text-sm text-text-muted font-medium">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-bold">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-display font-bold text-text-primary pt-3 border-t border-border">
                  <span>Total</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
