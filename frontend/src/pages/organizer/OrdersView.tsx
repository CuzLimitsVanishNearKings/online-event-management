import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Check, Receipt, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui'
import axiosClient from '@/api/axiosClient'
import { formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'

interface Order {
  bookingId: number
  status: string
  totalAmount: number
  bookingDate: string
  eventTitle: string
  eventVenue: string
  eventStartDateTime: string
  ticketCount: number
  buyerName: string
  buyerEmail: string
}

export default function OrdersView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await axiosClient.get('/bookings/organizer')
      setOrders(response.data || [])
    } catch (err) {
      console.error('Failed to load orders', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    }, 1500)
  }

  const filteredOrders = orders.filter(o => 
    o.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.buyerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.eventTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.bookingId.toString().includes(searchQuery)
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Sales & Orders</h1>
          <p className="text-text-muted mt-1 font-medium">Track ticket purchases and manage bookings across all your events.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="rounded-xl border-border font-bold text-text-secondary bg-white gap-2" disabled={isExporting || orders.length === 0}>
          {isExporting ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : 
           exported ? <Check className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />}
          {exported ? 'Exported!' : 'Export CSV'}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text"
                placeholder="Search by name, email, event or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full md:w-80"
              />
            </div>
          </div>
          <div className="text-sm font-bold text-text-muted">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Order ID</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Buyer</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Event & Date</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Status</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Amount</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.bookingId} className="hover:bg-gray-50/50 transition-colors border-b border-border/50 last:border-0">
                    <td className="py-4 px-6 font-medium text-text-primary">
                      #{order.bookingId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-text-primary">{order.buyerName}</div>
                      <div className="text-sm text-text-muted mt-0.5">{order.buyerEmail}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-text-primary">{order.eventTitle}</div>
                      <div className="text-sm text-text-muted mt-0.5">{formatDate(order.bookingDate)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full",
                        order.status === 'CONFIRMED' ? "bg-green-100 text-green-700" :
                        order.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-text-primary">{order.totalAmount} FCFA</div>
                      <div className="text-sm text-text-muted mt-0.5">{order.ticketCount} {order.ticketCount === 1 ? 'ticket' : 'tickets'}</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-2xl bg-surface/30">
            <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-2xl flex items-center justify-center mb-4">
              <Receipt className="w-8 h-8 text-text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">No orders found</h3>
            <p className="text-text-muted mt-2 max-w-md">
              {searchQuery 
                ? `We couldn't find any orders matching "${searchQuery}".` 
                : "When customers purchase tickets to your events, their orders will appear here."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
