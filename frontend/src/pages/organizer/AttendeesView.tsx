import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Mail, Users, Check, MoreVertical, Ticket } from 'lucide-react'
import { Button } from '@/components/ui'
import axiosClient from '@/api/axiosClient'
import { formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'

interface Attendee {
  issuedTicketId: number
  ticketCode: string
  status: string
  issuedAt: string
  ticketTypeName: string
  ticketTypePrice: number
  attendeeName: string
  attendeeEmail: string
  eventTitle: string
}

export default function AttendeesView() {
  const [isExporting, setIsExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [isEmailing, setIsEmailing] = useState(false)
  const [emailed, setEmailed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAttendees()
  }, [])

  const fetchAttendees = async () => {
    try {
      setIsLoading(true)
      const response = await axiosClient.get('/tickets/organizer')
      setAttendees(response.data || [])
    } catch (err) {
      console.error('Failed to load attendees', err)
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

  const handleEmail = () => {
    setIsEmailing(true)
    setTimeout(() => {
      setIsEmailing(false)
      setEmailed(true)
      setTimeout(() => setEmailed(false), 3000)
    }, 1500)
  }

  const filteredAttendees = attendees.filter(a => 
    a.attendeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.attendeeEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.eventTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Attendees</h1>
          <p className="text-text-muted mt-1 font-medium">Manage your guest lists and communicate with attendees across all your events.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Button onClick={handleEmail} variant="outline" className="rounded-md border-border font-bold text-text-secondary bg-white gap-2" disabled={isEmailing || attendees.length === 0}>
            {isEmailing ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : 
             emailed ? <Check className="w-4 h-4 text-green-600" /> : <Mail className="w-4 h-4" />}
            {emailed ? 'Sent!' : 'Email All'}
          </Button>
          <Button onClick={handleExport} variant="outline" className="rounded-md border-border font-bold text-text-secondary bg-white gap-2" disabled={isExporting || attendees.length === 0}>
            {isExporting ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : 
             exported ? <Check className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />}
            {exported ? 'Exported!' : 'Export List'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text"
                placeholder="Search by name, email or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full md:w-80"
              />
            </div>
          </div>
          <div className="text-sm font-bold text-text-muted">
            {filteredAttendees.length} {filteredAttendees.length === 1 ? 'Attendee' : 'Attendees'}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredAttendees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Attendee</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Event & Ticket</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Status</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Purchased On</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map((attendee) => (
                  <tr key={attendee.issuedTicketId} className="hover:bg-gray-50/50 transition-colors border-b border-border/50 last:border-0">
                    <td className="py-4 px-6">
                      <div className="font-bold text-text-primary">{attendee.attendeeName}</div>
                      <div className="text-sm text-text-muted mt-0.5">{attendee.attendeeEmail}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-text-primary">{attendee.eventTitle}</div>
                      <div className="flex items-center gap-1.5 text-sm text-text-muted mt-0.5">
                        <Ticket className="w-3.5 h-3.5" />
                        {attendee.ticketTypeName} • {attendee.ticketCode}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full",
                        attendee.status === 'VALID' ? "bg-green-100 text-green-700" :
                        attendee.status === 'USED' ? "bg-gray-100 text-gray-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {attendee.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-text-muted">
                      {formatDate(attendee.issuedAt)}
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
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-lg bg-surface/30">
            <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-lg flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">No attendees found</h3>
            <p className="text-text-muted mt-2 max-w-md">
              {searchQuery 
                ? `We couldn't find anyone matching "${searchQuery}".` 
                : "Once people register for your events, they will be added to your CRM here."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
