import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Ticket, Download, Calendar, MapPin, Loader2 } from 'lucide-react'
import { Button, Pagination } from '@/components/ui'
import axiosClient from '@/api/axiosClient'
import { formatCurrency } from '@/utils/format'
import QRCode from 'qrcode'
import { usePagination } from '@/hooks/usePagination'
import { TicketReceipt } from '@/components/tickets/TicketReceipt'
import { generatePDFFromElement } from '@/utils/pdfGenerator'

const TicketCard = ({ ticket }: { ticket: any }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (ticket.qrCodeData) {
      QRCode.toDataURL(ticket.qrCodeData, {
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      }).then(setQrCodeUrl)
    }
  }, [ticket.qrCodeData])

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    const receiptId = `receipt-${ticket.id}`
    await generatePDFFromElement(receiptId, `Ticket-${ticket.eventName.replace(/\s+/g, '-')}-${ticket.id}.pdf`)
    setIsDownloading(false)
  }

  return (
    <>
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row">
        <div className="flex-1 p-6 flex flex-col border-b sm:border-b-0 sm:border-r border-dashed border-border">
          <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
              ticket.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {ticket.status === 'upcoming' ? 'Valid Ticket' : 'Expired'}
            </span>
            <span className="text-xs font-bold text-text-muted">Order #{ticket.bookingId}</span>
          </div>
          
          <h3 className="text-xl font-bold text-text-primary mb-4">{ticket.eventName}</h3>
          
          <div className="space-y-3 mt-auto">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">{ticket.date} • {ticket.time || 'TBD'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{ticket.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <Ticket className="w-4 h-4 text-primary" />
              <span className="font-medium">{ticket.ticketType} • {formatCurrency(ticket.price)}</span>
            </div>
          </div>
        </div>
        
        <div className="w-full sm:w-48 bg-surface/30 p-6 flex flex-col items-center justify-center relative">
          <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border-r border-border border-dashed" />
          
          <div className="w-24 h-24 bg-white border-2 border-gray-200 rounded-xl mb-3 flex items-center justify-center p-2 shadow-inner">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
            )}
          </div>
          <p className="text-[9px] font-mono text-text-muted font-bold tracking-wider mb-4 text-center truncate w-full">{ticket.qrCodeData}</p>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full text-xs font-bold rounded-lg border-border bg-white shadow-sm gap-2"
          >
            {isDownloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            {isDownloading ? 'PDF...' : 'PDF'}
          </Button>
        </div>
      </div>
      
      {/* Hidden receipt for PDF generation */}
      <TicketReceipt id={`receipt-${ticket.id}`} ticket={ticket} />
    </>
  )
}

export default function TicketsView() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const res = await axiosClient.get('/bookings/my-bookings')
      const summaries = res.data
      
      // Fetch details for each booking concurrently to extract actual issued tickets
      const detailedBookings = await Promise.all(
        summaries.map(async (b: any) => {
          try {
            const detailRes = await axiosClient.get(`/bookings/${b.bookingId}`)
            return detailRes.data
          } catch (e) {
            console.error(`Failed to load booking ${b.bookingId} details:`, e)
            return {
              ...b,
              issuedTickets: []
            }
          }
        })
      )

      // Flatten issued tickets into individual display cards
      const mappedTickets: any[] = []
      detailedBookings.forEach((b: any) => {
        const startDate = new Date(b.eventStartDateTime)
        const isUpcoming = startDate.getTime() > Date.now() && b.status === 'CONFIRMED'
        
        if (b.issuedTickets && b.issuedTickets.length > 0) {
          b.issuedTickets.forEach((t: any) => {
            mappedTickets.push({
              id: `${b.bookingId}-${t.issuedTicketId}`,
              bookingId: b.bookingId,
              eventName: b.eventTitle,
              location: b.eventVenue,
              date: startDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              time: startDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              ticketType: t.ticketTypeName,
              price: t.ticketTypePrice,
              qrCodeData: t.qrCode || `TICKET-${t.issuedTicketId}`,
              status: isUpcoming ? 'upcoming' : 'past'
            })
          })
        } else {
          // Fallback if no specific issued tickets returned yet
          mappedTickets.push({
            id: b.bookingId.toString(),
            bookingId: b.bookingId,
            eventName: b.eventTitle,
            location: b.eventVenue,
            date: startDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            time: startDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            ticketType: 'General Admission',
            price: b.totalAmount,
            qrCodeData: `BOOKING-${b.bookingId}`,
            status: isUpcoming ? 'upcoming' : 'past'
          })
        }
      })

      setTickets(mappedTickets)
    } catch (err) {
      console.error('Failed to load attendee tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const filteredTickets = tickets.filter(t => 
    t.status === activeTab &&
    t.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToNextPage,
    goToPreviousPage,
    startIndex,
    endIndex,
    totalItems
  } = usePagination(filteredTickets, 10)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">My Tickets</h1>
          <p className="text-text-muted mt-1 font-medium">Manage your event registrations and access digital tickets.</p>
        </div>
        <Button onClick={() => window.location.href = '/events'} variant="outline" className="rounded-xl font-bold bg-white">
          Find More Events
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex bg-surface rounded-lg p-1 w-full md:w-auto overflow-x-auto">
            {['upcoming', 'past'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 md:flex-none px-6 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? "bg-white text-text-primary shadow-sm" 
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full md:w-64"
              />
            </div>
            <Button variant="outline" className="rounded-xl px-3 py-2 border-border text-text-secondary">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex-1 w-full h-full flex flex-col items-center justify-center text-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-text-muted font-bold">Synchronizing tickets with secure database...</p>
            </div>
          ) : filteredTickets.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {paginatedData.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNext={goToNextPage}
                onPrevious={goToPreviousPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
              />
            </div>
          ) : (
            <div className="flex-1 w-full h-full flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-border rounded-2xl bg-surface/30">
              <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-2xl flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8 text-text-muted/50" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">No tickets found</h3>
              <p className="text-text-muted mt-2 max-w-md">
                {searchQuery 
                  ? `We couldn't find any tickets matching "${searchQuery}".` 
                  : `You don't have any ${activeTab} event tickets.`}
              </p>
              {!searchQuery && (
                <Button onClick={() => window.location.href = '/events'} variant="primary" className="mt-6 rounded-xl font-bold">
                  Browse Events
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
