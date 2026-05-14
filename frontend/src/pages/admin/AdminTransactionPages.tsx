import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Check, Receipt, Ticket, CreditCard, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils/cn'

type BookingTab = 'all' | 'confirmed' | 'pending' | 'cancelled'

// --- Bookings ---
export function Bookings() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<BookingTab>('all')
  const [isExporting, setIsExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const bookings: any[] = []

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
        <Button onClick={handleExport} variant="outline" className="rounded-xl border-border font-bold text-text-secondary bg-white gap-2" disabled={isExporting}>
          {isExporting ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> :
           exported ? <Check className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />}
          {exported ? 'Exported!' : 'Export CSV'}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
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
                className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full md:w-80" />
            </div>
            <Button variant="outline" className="rounded-xl px-3 py-2 border-border text-text-secondary"><Filter className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-2xl bg-surface/30">
          <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-2xl flex items-center justify-center mb-4">
            <Receipt className="w-8 h-8 text-text-muted/50" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">No bookings found</h3>
          <p className="text-text-muted mt-2 max-w-md">
            {searchQuery ? `No results for "${searchQuery}".` : "Ticket bookings will appear here once users start purchasing."}
          </p>
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
        <Button variant="outline" className="rounded-xl border-border font-bold text-text-secondary bg-white gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
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
                className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-72" />
            </div>
            <Button variant="outline" className="rounded-xl px-3 py-2 border-border text-text-secondary"><Filter className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-2xl bg-surface/30">
          <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-2xl flex items-center justify-center mb-4">
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
  const payments: any[] = []

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
        <Button onClick={handleExport} variant="outline" className="rounded-xl border-border font-bold text-text-secondary bg-white gap-2" disabled={isExporting}>
          {isExporting ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> :
           exported ? <Check className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />}
          {exported ? 'Exported!' : 'Export CSV'}
        </Button>
      </div>
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
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
                className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-72" />
            </div>
            <Button variant="outline" className="rounded-xl px-3 py-2 border-border text-text-secondary"><Filter className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-2xl bg-surface/30">
          <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-2xl flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-text-muted/50" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">No transactions yet</h3>
          <p className="text-text-muted mt-2 max-w-md">
            {searchQuery ? `No results for "${searchQuery}".` : "Payment records will appear here as users complete transactions."}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
