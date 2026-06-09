import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store/cartStore'
import { formatCurrency } from '../utils/format'
import { Button } from '../components/ui'
import { ChevronLeft, Ticket, CheckCircle, ExternalLink } from '../components/icons'
import { Wallet } from 'lucide-react'
import axiosClient from '../api/axiosClient'
import { getImageUrl } from '../utils/image'
import { useWallet } from '../hooks/useWallet'

const CheckoutPage = () => {
  const { items, total, removeItem } = useCartStore()
  const navigate = useNavigate()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [successIds, setSuccessIds] = useState<string[]>([])
  
  const { wallet, loading, fetchWallet } = useWallet()

  useEffect(() => {
    fetchWallet()
  }, [fetchWallet])

  const handlePayment = async (item: any) => {
    setProcessingId(item.id)
    
    try {
      await axiosClient.post('/bookings', {
        ticketTypeId: item.ticketTypeId,
        quantity: item.quantity,
        promotionCode: null
      })
      
      setSuccessIds(prev => [...prev, item.id])
      setProcessingId(null)
      fetchWallet() // Refresh wallet balance
      
      // Remove from cart after 2 seconds
      setTimeout(() => {
        removeItem(item.id)
      }, 2000)
    } catch (err: any) {
      console.error('Checkout error:', err)
      alert(err.response?.data?.message || 'Failed to place booking. Please check wallet balance and try again.')
      setProcessingId(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <Ticket className="w-16 h-16 text-text-muted mb-4" />
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">No pending reservations</h1>
        <p className="text-text-muted mb-8 max-w-md">You have completed all your reservations or no tickets are selected.</p>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/events')} variant="primary" className="rounded-xl px-8">
            Browse Events
          </Button>
          <Button onClick={() => navigate('/attendee/tickets')} variant="outline" className="rounded-xl px-8 border-border">
            View My Tickets
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/events" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary font-bold text-sm transition-colors uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" /> Keep Browsing
          </Link>
        </div>
        
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">Complete Reservations</h1>
          <p className="text-text-muted mt-2">Pay for your selected tickets individually below.</p>
        </div>

        {/* Digital Wallet Header */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-sm mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-muted uppercase tracking-wider">Digital Wallet Balance</p>
              {loading ? (
                <div className="w-24 h-6 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-display font-bold text-primary">{wallet ? formatCurrency(wallet.balance) : 'Error'}</p>
              )}
            </div>
          </div>
          <Link to="/attendee/wallet" className="text-sm font-bold text-text-secondary hover:text-primary underline">
            Top Up Wallet
          </Link>
        </div>

        {/* Individual Items List */}
        <div className="space-y-6">
          <AnimatePresence>
            {items.map(item => {
              const isProcessing = processingId === item.id
              const isSuccess = successIds.includes(item.id)
              const hasInsufficientFunds = wallet ? wallet.balance < item.totalPrice : true
              
              return (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden', marginTop: 0, padding: 0 }}
                  className="bg-white rounded-3xl border border-border p-6 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden"
                >
                  {isSuccess && (
                    <div className="absolute inset-0 bg-green-50 z-10 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-green-700">
                        <CheckCircle className="w-10 h-10" />
                        <span className="font-bold text-lg">Reservation Complete!</span>
                      </div>
                    </div>
                  )}

                  {/* Left: Event Details (Clickable) */}
                  <Link to={`/events/${item.eventId}`} className="group flex-shrink-0 relative w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-surface border border-border block">
                    {item.eventImage ? (
                      <img src={getImageUrl(item.eventImage)} alt={item.eventTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">EVENT</div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                  </Link>

                  {/* Middle: Info */}
                  <div className="flex-1 flex flex-col justify-center">
                    <Link to={`/events/${item.eventId}`} className="group inline-flex items-center gap-2 w-fit">
                      <h3 className="text-xl font-display font-bold text-text-primary group-hover:text-primary transition-colors">{item.eventTitle}</h3>
                    </Link>
                    <p className="text-sm text-text-muted mt-1">{item.ticketTypeName}</p>
                    
                    <div className="flex items-center gap-6 mt-4">
                      <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-border text-sm">
                        <span className="text-text-muted">Quantity:</span> <span className="font-bold text-text-primary ml-1">{item.quantity}</span>
                      </div>
                      <div className="text-xl font-display font-bold text-primary">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                  </div>

                  {/* Right: Payment Action */}
                  <div className="flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                    {hasInsufficientFunds && !isSuccess ? (
                      <div className="text-center w-full">
                        <p className="text-red-500 text-xs font-bold mb-2">Insufficient funds</p>
                        <Button variant="outline" className="w-full rounded-xl opacity-50 cursor-not-allowed border-red-200 text-red-500">
                          Cannot Pay
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="primary" 
                        onClick={() => handlePayment(item)}
                        disabled={isProcessing || processingId !== null}
                        className="w-full rounded-xl py-4 font-bold shadow-lg shadow-primary/20"
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Paying...
                          </div>
                        ) : (
                          `Pay ${formatCurrency(item.totalPrice)}`
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

