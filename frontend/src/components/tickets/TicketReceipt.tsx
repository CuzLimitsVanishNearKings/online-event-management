import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { formatCurrency } from '@/utils/format'
import { Ticket, Calendar, MapPin, Clock, Info } from 'lucide-react'

interface TicketReceiptProps {
  id: string // the DOM element id
  ticket: {
    id: string
    bookingId: string | number
    eventName: string
    location: string
    date: string
    time: string
    ticketType: string
    price: number
    qrCodeData: string
  }
}

export const TicketReceipt: React.FC<TicketReceiptProps> = ({ id, ticket }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  useEffect(() => {
    if (ticket.qrCodeData) {
      QRCode.toDataURL(ticket.qrCodeData, {
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).then(setQrCodeUrl)
    }
  }, [ticket.qrCodeData])

  return (
    <div id={id} className="bg-white" style={{ width: '800px', display: 'none' }}>
      <div className="p-8 bg-gray-50">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
          
          {/* Header Banner */}
          <div className="bg-primary p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Ticket className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight uppercase">Official Ticket Receipt</h1>
                <p className="text-primary-foreground/80 text-sm font-medium">Order #{ticket.bookingId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-primary-foreground/80 uppercase tracking-widest">Ticket ID</p>
              <p className="text-xl font-mono tracking-wider">{ticket.id}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row min-h-[400px]">
            
            {/* Left side: Event Details */}
            <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-dashed border-gray-300 relative">
              {/* Cutout half-circles */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gray-50 rounded-full border-b border-l border-gray-200" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gray-50 rounded-full border-t border-l border-gray-200" />

              <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">{ticket.eventName}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Date</p>
                    <p className="text-lg font-bold text-gray-900">{ticket.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Time</p>
                    <p className="text-lg font-bold text-gray-900">{ticket.time || 'TBD'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Location</p>
                    <p className="text-lg font-bold text-gray-900">{ticket.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Ticket Type</p>
                    <p className="text-2xl font-bold text-gray-900">{ticket.ticketType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Price Paid</p>
                    <p className="text-2xl font-black text-primary">{formatCurrency(ticket.price)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: QR Code */}
            <div className="w-full md:w-[300px] p-8 bg-gray-50 flex flex-col items-center justify-center relative">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 text-center">
                Scan for Access
              </p>
              
              <div className="bg-white p-4 rounded-3xl shadow-md border border-gray-200 w-full aspect-square flex items-center justify-center">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Ticket QR Code" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
                )}
              </div>
              
              <p className="mt-6 text-xs text-gray-400 text-center max-w-[200px]">
                Please present this code at the venue entrance. Do not share this code.
              </p>
              
              <div className="mt-auto pt-6 flex items-center gap-2 text-primary font-bold text-sm">
                <Info className="w-4 h-4" />
                Valid Ticket
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
