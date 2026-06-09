import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Check, Receipt, Ticket, CreditCard, Wallet, User, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils/cn'
import { useAdminWallet, AdminTopUpRequest } from '@/hooks/useAdminWallet'
import axiosClient from '@/api/axiosClient'

type BookingTab = 'all' | 'confirmed' | 'pending' | 'cancelled'

// --- Bookings ---
export function Bookings() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<BookingTab>('all')
  const [isExporting, setIsExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosClient.get('/bookings')
        const mapped = res.data.map((b: any) => ({
          id: b.bookingId,
          user: b.clientName,
          event: b.eventTitle,
          status: b.status === 'CONFIRMED' ? 'confirmed' : (b.status === 'PENDING' ? 'pending' : 'cancelled'),
          date: new Date(b.createdAt || new Date()).toLocaleDateString()
        }))
        setBookings(mapped)
      } catch (err) {
        console.error('Failed to fetch bookings', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => { setIsExporting(false); setExported(true); setTimeout(() => setExported(false), 3000) }, 1500)
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.user?.toLowerCase().includes(searchQuery.toLowerCase()) || b.event?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || b.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Bookings</h1>
          <p className="text-text-muted mt-1 font-medium">Monitor all platform-wide ticket reservations and orders.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="rounded-md border-border font-bold text-text-secondary bg-white gap-2" disabled={isExporting}>
          {isExporting ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> :
           exported ? <Check className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />}
          {exported ? 'Exported!' : 'Export CSV'}
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex gap-2 bg-surface/50 p-1 rounded-lg">
            {(['all', 'confirmed', 'pending', 'cancelled'] as BookingTab[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn('px-4 py-2 text-sm font-bold capitalize rounded-md transition-all',
                  activeTab === tab ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary')}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="text" placeholder="Search by user or event..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full md:w-80" />
            </div>
            <Button variant="outline" className="rounded-md px-3 py-2 border-border text-text-secondary"><Filter className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-lg bg-surface/30">
          {loading ? (
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          ) : filteredBookings.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border text-xs uppercase tracking-wider text-text-muted font-bold">
                  <th className="p-4">User</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-text-primary">{b.user}</td>
                    <td className="p-4 text-text-secondary">{b.event}</td>
                    <td className="p-4 text-sm text-text-muted">{b.date}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        b.status === 'confirmed' ? "bg-green-100 text-green-700" :
                        b.status === 'cancelled' ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      )}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-lg flex items-center justify-center mb-4">
                <Receipt className="w-8 h-8 text-text-muted/50" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">No bookings found</h3>
              <p className="text-text-muted mt-2 max-w-md">
                {searchQuery ? `No results for "${searchQuery}".` : "Ticket bookings will appear here once users start purchasing."}
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// --- Tickets ---
type TicketTab = 'all' | 'active' | 'used' | 'cancelled'

export function Tickets() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TicketTab>('all')
  const tickets: any[] = []

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = t.holder?.toLowerCase().includes(searchQuery.toLowerCase()) || t.code?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || t.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Tickets</h1>
          <p className="text-text-muted mt-1 font-medium">Track and verify all digital ticket issuance across the platform.</p>
        </div>
        <Button variant="outline" className="rounded-md border-border font-bold text-text-secondary bg-white gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex gap-2 bg-surface/50 p-1 rounded-lg">
            {(['all', 'active', 'used', 'cancelled'] as TicketTab[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn('px-4 py-2 text-sm font-bold capitalize rounded-md transition-all',
                  activeTab === tab ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary')}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="text" placeholder="Search by holder or code..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-72" />
            </div>
            <Button variant="outline" className="rounded-md px-3 py-2 border-border text-text-secondary"><Filter className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-lg bg-surface/30">
          <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-lg flex items-center justify-center mb-4">
            <Ticket className="w-8 h-8 text-text-muted/50" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">No tickets found</h3>
          <p className="text-text-muted mt-2 max-w-md">
            {searchQuery ? `No results for "${searchQuery}".` : "Issued tickets will appear here once bookings are made."}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// --- Payments ---
type PaymentTab = 'all' | 'completed' | 'pending' | 'refunded'

export function Payments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<PaymentTab>('all')
  const [isExporting, setIsExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosClient.get('/payments')
        const mapped = res.data.map((p: any) => ({
          id: p.paymentId,
          reference: p.providerTransactionId || `PAY-${p.paymentId}`,
          user: p.booking?.clientName || 'Unknown',
          amount: p.amount,
          status: p.status === 'SUCCESS' ? 'completed' : (p.status === 'PENDING' ? 'pending' : 'refunded'),
          date: new Date(p.createdAt || new Date()).toLocaleDateString()
        }))
        setPayments(mapped)
      } catch (err) {
        console.error('Failed to fetch payments', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => { setIsExporting(false); setExported(true); setTimeout(() => setExported(false), 3000) }, 1500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Payments</h1>
          <p className="text-text-muted mt-1 font-medium">Financial transaction logs and platform revenue overview.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="rounded-md border-border font-bold text-text-secondary bg-white gap-2" disabled={isExporting}>
          {isExporting ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> :
           exported ? <Check className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />}
          {exported ? 'Exported!' : 'Export CSV'}
        </Button>
      </div>
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex gap-2 bg-surface/50 p-1 rounded-lg">
            {(['all', 'completed', 'pending', 'refunded'] as PaymentTab[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn('px-4 py-2 text-sm font-bold capitalize rounded-md transition-all',
                  activeTab === tab ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary')}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="text" placeholder="Search by reference or user..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-72" />
            </div>
            <Button variant="outline" className="rounded-md px-3 py-2 border-border text-text-secondary"><Filter className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-lg bg-surface/30">
          {loading ? (
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          ) : payments.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border text-xs uppercase tracking-wider text-text-muted font-bold">
                  <th className="p-4">Reference</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-text-primary">{p.reference}</td>
                    <td className="p-4 text-text-secondary">{p.user}</td>
                    <td className="p-4 font-bold text-text-primary">{p.amount.toLocaleString()} FCFA</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        p.status === 'completed' ? "bg-green-100 text-green-700" :
                        p.status === 'refunded' ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      )}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-text-muted">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-text-muted/50" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">No transactions yet</h3>
              <p className="text-text-muted mt-2 max-w-md">
                {searchQuery ? `No results for "${searchQuery}".` : "Payment records will appear here as users complete transactions."}
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// --- Top-Up Requests ---
export function TopUpRequests() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')
  const { requests, loading, fetchTopUpRequests, reviewTopUpRequest } = useAdminWallet()

  // Modal State
  const [selectedRequest, setSelectedRequest] = useState<AdminTopUpRequest | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchTopUpRequests(0, 100)
  }, [fetchTopUpRequests])

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.requesterEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'ALL' || r.status === activeTab
    return matchesSearch && matchesTab
  })

  const handleReview = async (approved: boolean) => {
    if (!selectedRequest) return
    setIsSubmitting(true)
    const result = await reviewTopUpRequest({
      requestId: selectedRequest.requestId,
      approved,
      adminNote: adminNote.trim() || undefined
    })
    setIsSubmitting(false)
    if (result.success) {
      setSelectedRequest(null)
      setAdminNote('')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Top-Up Requests</h1>
          <p className="text-text-muted mt-1 font-medium">Manage and review attendee wallet top-up requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex gap-2 bg-surface/50 p-1 rounded-lg">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn('px-4 py-2 text-sm font-bold capitalize rounded-md transition-all',
                  activeTab === tab ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary')}>
                {tab.toLowerCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="text" placeholder="Search requester..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-72" />
            </div>
            <Button variant="outline" className="rounded-md px-3 py-2 border-border text-text-secondary"><Filter className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading && requests.length === 0 ? (
            <div className="p-12 text-center text-text-muted font-bold">Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-lg bg-surface/30">
              <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-lg flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-text-muted/50" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">No requests found</h3>
              <p className="text-text-muted mt-2 max-w-md">
                {searchQuery ? `No results for "${searchQuery}".` : "Attendee top-up requests will appear here."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border text-xs uppercase tracking-wider text-text-muted font-bold">
                  <th className="p-4">Requester</th>
                  <th className="p-4">Amount (FCFA)</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRequests.map((req) => (
                  <tr key={req.requestId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-sm">{req.requesterName}</p>
                          <p className="text-xs text-text-muted">{req.requesterEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-text-primary">{req.amount.toLocaleString()}</td>
                    <td className="p-4 text-sm text-text-muted">{formatDate(req.createdAt)}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1",
                        req.status === 'APPROVED' ? "bg-green-100 text-green-700" :
                        req.status === 'REJECTED' ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      )}>
                        {req.status === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                        {req.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {req.status === 'PENDING' ? (
                        <Button onClick={() => setSelectedRequest(req)} size="sm" variant="primary" className="rounded-md font-bold text-xs h-8">
                          Review
                        </Button>
                      ) : (
                        <span className="text-xs text-text-muted font-bold">Reviewed by {req.reviewedByName || 'Admin'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative border border-border"
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface/30">
              <h3 className="font-bold text-xl text-text-primary">Review Request</h3>
              <button onClick={() => !isSubmitting && setSelectedRequest(null)} className="p-2 text-text-muted hover:text-text-primary">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-md border border-border">
                <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-1">Requested Amount</p>
                <h2 className="text-4xl font-display font-bold text-primary">{selectedRequest.amount.toLocaleString()} FCFA</h2>
                <p className="text-sm text-text-secondary mt-2">by <strong>{selectedRequest.requesterName}</strong></p>
                <p className="text-xs text-text-muted">{selectedRequest.requesterEmail}</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-text-primary">Admin Note (Optional)</label>
                <textarea 
                  value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Leave a note explaining your decision..."
                  className="w-full px-4 py-3 border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[100px] resize-none"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => handleReview(false)} disabled={isSubmitting} variant="outline" 
                  className="flex-1 rounded-md font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  {isSubmitting ? '...' : 'Reject'}
                </Button>
                <Button 
                  onClick={() => handleReview(true)} disabled={isSubmitting} variant="primary" 
                  className="flex-1 rounded-md font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                >
                  {isSubmitting ? '...' : 'Approve'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
