import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '../utils/format'
import { Button } from '../components/ui'
import { ChevronLeft, Ticket, CheckCircle, ExternalLink, Trash2 } from '../components/icons'
import { Wallet, Tag } from 'lucide-react'
import axiosClient from '../api/axiosClient'
import { getImageUrl } from '../utils/image'
import { useWallet } from '../hooks/useWallet'
import { usePlanning } from '../hooks/usePlanning'
import { useEvents } from '../hooks/useEvents'

interface AppliedPromo {
  code: string
  discountValue: number
  discountType: 'PERCENTAGE' | 'FIXED'
}

const CheckoutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const singleItemCheckout = location.state?.singleItemCheckout

  const { plannedEvents, removeEvent } = usePlanning()
  const { events } = useEvents()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [successIds, setSuccessIds] = useState<string[]>([])
  
  const { wallet, loading, fetchWallet } = useWallet()

  // State for the mini ticket selectors (keyed by eventId)
  const [selections, setSelections] = useState<Record<number, { ticketTypeId: number, quantity: number, price: number }>>({})

  // Promo Code States (keyed by itemIdStr)
  const [promoInputs, setPromoInputs] = useState<Record<string, string>>({})
  const [appliedPromos, setAppliedPromos] = useState<Record<string, AppliedPromo>>({})
  const [promoErrors, setPromoErrors] = useState<Record<string, string>>({})
  const [isApplyingPromo, setIsApplyingPromo] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchWallet()
  }, [fetchWallet])

  // Pre-select default ticket types for planned events
  useEffect(() => {
    if (singleItemCheckout) return;

    const newSelections = { ...selections }
    plannedEvents.forEach(pEvent => {
      if (!newSelections[pEvent.eventId]) {
        // Find full event details
        const fullEvent = events.find(e => Number(e.id) === pEvent.eventId)
        if (fullEvent && fullEvent.ticketTypes && fullEvent.ticketTypes.length > 0) {
          const defaultTicket = fullEvent.ticketTypes[0]
          newSelections[pEvent.eventId] = {
            ticketTypeId: defaultTicket.ticketTypeId,
            quantity: 1,
            price: defaultTicket.price
          }
        }
      }
    })
    setSelections(newSelections)
  }, [plannedEvents, events, singleItemCheckout])

  const handleUpdateSelection = (eventId: number, field: string, value: any) => {
    setSelections(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value
      }
    }))
  }

  const handleApplyPromo = async (itemIdStr: string) => {
    const code = promoInputs[itemIdStr]?.trim().toUpperCase()
    if (!code) return
    
    try {
      setIsApplyingPromo(prev => ({ ...prev, [itemIdStr]: true }))
      setPromoErrors(prev => ({ ...prev, [itemIdStr]: '' }))
      
      const res = await axiosClient.post('/promotions/validate', { code })
      const data = res.data
      
      if (data.isValid) {
        setAppliedPromos(prev => ({
          ...prev,
          [itemIdStr]: {
            code: data.code,
            discountValue: data.discountValue,
            discountType: data.discountType
          }
        }))
      } else {
        setPromoErrors(prev => ({ ...prev, [itemIdStr]: data.message || 'Invalid promotion code' }))
      }
    } catch (err: any) {
      setPromoErrors(prev => ({ ...prev, [itemIdStr]: err.response?.data?.message || 'Failed to validate promo code' }))
    } finally {
      setIsApplyingPromo(prev => ({ ...prev, [itemIdStr]: false }))
    }
  }

  const handleRemovePromo = (itemIdStr: string) => {
    setAppliedPromos(prev => {
      const newState = { ...prev }
      delete newState[itemIdStr]
      return newState
    })
    setPromoInputs(prev => ({ ...prev, [itemIdStr]: '' }))
    setPromoErrors(prev => ({ ...prev, [itemIdStr]: '' }))
  }

  const handlePayment = async (item: any, isSingle: boolean) => {
    const itemIdStr = isSingle ? item.id : item.planningId.toString()
    setProcessingId(itemIdStr)
    
    try {
      let ticketTypeId = 0;
      let quantity = 1;

      if (isSingle) {
        ticketTypeId = item.ticketTypeId
        quantity = item.quantity
      } else {
        const selection = selections[item.eventId]
        if (!selection) {
          alert('Please select a ticket type first.')
          setProcessingId(null)
          return
        }
        ticketTypeId = selection.ticketTypeId
        quantity = selection.quantity
      }

      await axiosClient.post('/bookings', {
        ticketTypeId,
        quantity,
        promotionCode: appliedPromos[itemIdStr]?.code || null
      })
      
      setSuccessIds(prev => [...prev, itemIdStr])
      setProcessingId(null)
      fetchWallet() // Refresh wallet balance
      
      if (isSingle) {
        setTimeout(() => { navigate('/attendee/tickets') }, 2000)
      } else {
        setTimeout(() => { removeEvent(item.eventId) }, 2000)
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      alert(err.response?.data?.message || 'Failed to place booking. Please check wallet balance and try again.')
      setProcessingId(null)
    }
  }

  const itemsToRender = singleItemCheckout ? [singleItemCheckout] : plannedEvents

  if (itemsToRender.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <Ticket className="w-16 h-16 text-text-muted mb-4" />
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">No pending reservations</h1>
        <p className="text-text-muted mb-8 max-w-md">You have completed all your reservations or no tickets are selected.</p>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/events')} variant="primary" className="rounded-md px-8">
            Browse Events
          </Button>
          <Button onClick={() => navigate('/attendee/tickets')} variant="outline" className="rounded-md px-8 border-border">
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
            {itemsToRender.map(item => {
              const isSingle = !!singleItemCheckout
              const itemIdStr = isSingle ? item.id : item.planningId.toString()
              const isProcessing = processingId === itemIdStr
              const isSuccess = successIds.includes(itemIdStr)
              
              // Get price info
              let currentPrice = 0;
              let currentTotalPrice = 0;
              let currentQty = 1;
              let fullEventDetails: any = null;

              if (isSingle) {
                currentPrice = item.price
                currentTotalPrice = item.totalPrice
                currentQty = item.quantity
              } else {
                const sel = selections[item.eventId]
                if (sel) {
                  currentPrice = sel.price
                  currentQty = sel.quantity
                  currentTotalPrice = sel.price * sel.quantity
                }
                fullEventDetails = events.find(e => Number(e.id) === item.eventId)
              }

              // Calculate Discount
              const appliedPromo = appliedPromos[itemIdStr]
              let discountAmount = 0
              if (appliedPromo) {
                if (appliedPromo.discountType === 'PERCENTAGE') {
                  discountAmount = currentTotalPrice * (appliedPromo.discountValue / 100)
                } else {
                  discountAmount = appliedPromo.discountValue
                }
              }

              const finalPrice = Math.max(0, currentTotalPrice - discountAmount)
              const hasInsufficientFunds = wallet ? wallet.balance < finalPrice : true
              
              return (
                <motion.div 
                  key={itemIdStr}
                  layout
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden', marginTop: 0, padding: 0 }}
                  className="bg-white rounded-3xl border border-border p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden"
                >
                  {isSuccess && (
                    <div className="absolute inset-0 bg-green-50 z-10 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-green-700">
                        <CheckCircle className="w-10 h-10" />
                        <span className="font-bold text-lg">Reservation Complete!</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Event Details (Clickable) */}
                    <Link to={`/events/${item.eventId}`} className="group flex-shrink-0 relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-surface border border-border block">
                      {(item.eventImage || item.coverImage) ? (
                        <img src={getImageUrl(item.eventImage || item.coverImage)} alt={item.eventTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">EVENT</div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <ExternalLink className="w-6 h-6 text-white" />
                      </div>
                    </Link>

                    {/* Middle: Info */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <Link to={`/events/${item.eventId}`} className="group inline-flex items-center gap-2 w-fit">
                          <h3 className="text-xl font-display font-bold text-text-primary group-hover:text-primary transition-colors">{item.eventTitle}</h3>
                        </Link>
                        {!isSingle && (
                          <button onClick={() => removeEvent(item.eventId)} className="p-2 text-text-muted hover:text-red-500 bg-gray-50 rounded-full transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Ticket Configurator for Planned Events */}
                      {!isSingle && fullEventDetails && fullEventDetails.ticketTypes && fullEventDetails.ticketTypes.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-4 items-end">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Select Ticket</label>
                            <select 
                              className="w-48 h-10 px-3 bg-gray-50 border border-border rounded-md text-sm font-bold text-text-primary focus:outline-none focus:border-primary"
                              value={selections[item.eventId]?.ticketTypeId || ''}
                              onChange={(e) => {
                                const tId = Number(e.target.value)
                                const tier = fullEventDetails.ticketTypes.find((t: any) => t.ticketTypeId === tId)
                                if (tier) {
                                  handleUpdateSelection(item.eventId, 'ticketTypeId', tId)
                                  handleUpdateSelection(item.eventId, 'price', tier.price)
                                }
                              }}
                            >
                              {fullEventDetails.ticketTypes.map((tier: any) => (
                                <option key={tier.ticketTypeId} value={tier.ticketTypeId}>{tier.name} - {tier.price === 0 ? 'Free' : formatCurrency(tier.price)}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Quantity</label>
                            <input 
                              type="number" 
                              min="1" 
                              max="10"
                              value={selections[item.eventId]?.quantity || 1}
                              onChange={(e) => handleUpdateSelection(item.eventId, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-20 h-10 px-3 bg-gray-50 border border-border rounded-md text-sm font-bold text-center text-text-primary focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-text-muted">{item.ticketTypeName || 'General Admission'}</p>
                          <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-border text-sm inline-block">
                            <span className="text-text-muted">Quantity:</span> <span className="font-bold text-text-primary ml-1">{currentQty}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Payment Action */}
                    <div className="flex flex-col justify-end items-end border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 min-w-[240px]">
                      
                      {/* Price Display */}
                      <div className="flex flex-col items-end mb-4 w-full">
                        {appliedPromo ? (
                          <>
                            <span className="text-sm text-text-muted line-through font-bold">{formatCurrency(currentTotalPrice)}</span>
                            <div className="text-2xl font-display font-bold text-primary">
                              {finalPrice === 0 ? 'Free' : formatCurrency(finalPrice)}
                            </div>
                          </>
                        ) : (
                          <div className="text-2xl font-display font-bold text-primary">
                            {currentTotalPrice === 0 ? 'Free' : formatCurrency(currentTotalPrice)}
                          </div>
                        )}
                      </div>

                      {/* Promo Code Input */}
                      {currentTotalPrice > 0 && !isSuccess && (
                        <div className="w-full mb-4">
                          {appliedPromo ? (
                            <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-md border border-green-200">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-green-700 uppercase flex items-center gap-1">
                                  <Tag className="w-3 h-3" /> {appliedPromo.code} Applied
                                </span>
                                <span className="text-xs text-green-600 font-medium">
                                  -{appliedPromo.discountType === 'PERCENTAGE' ? `${appliedPromo.discountValue}%` : formatCurrency(appliedPromo.discountValue)}
                                </span>
                              </div>
                              <button onClick={() => handleRemovePromo(itemIdStr)} className="text-text-muted hover:text-red-500 transition-colors p-1" title="Remove promo code">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <div className="flex gap-2 relative">
                                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input 
                                  type="text" 
                                  placeholder="Promo code" 
                                  value={promoInputs[itemIdStr] || ''}
                                  onChange={(e) => setPromoInputs(prev => ({ ...prev, [itemIdStr]: e.target.value.toUpperCase() }))}
                                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-border rounded-md text-sm font-bold text-text-primary focus:outline-none focus:border-primary"
                                />
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleApplyPromo(itemIdStr)}
                                  disabled={!promoInputs[itemIdStr] || isApplyingPromo[itemIdStr]}
                                  className="rounded-md px-4 py-2 border-border text-xs"
                                >
                                  {isApplyingPromo[itemIdStr] ? '...' : 'Apply'}
                                </Button>
                              </div>
                              {promoErrors[itemIdStr] && (
                                <p className="text-[10px] text-red-500 font-bold px-1">{promoErrors[itemIdStr]}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Pay Button */}
                      {hasInsufficientFunds && !isSuccess && finalPrice > 0 ? (
                        <div className="text-center w-full">
                          <p className="text-red-500 text-xs font-bold mb-2">Insufficient funds</p>
                          <Button variant="outline" className="w-full rounded-md opacity-50 cursor-not-allowed border-red-200 text-red-500">
                            Cannot Pay
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="primary" 
                          onClick={() => handlePayment(item, isSingle)}
                          disabled={isProcessing || processingId !== null || (!isSingle && !selections[item.eventId])}
                          className="w-full rounded-md py-4 font-bold shadow-lg shadow-primary/20"
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Paying...
                            </div>
                          ) : (
                            `Pay ${finalPrice === 0 ? 'Free' : formatCurrency(finalPrice)}`
                          )}
                        </Button>
                      )}
                    </div>
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
