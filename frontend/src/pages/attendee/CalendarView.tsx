import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays
} from 'date-fns'
import { ChevronLeft, ChevronRight, MapPin, Clock, Ticket, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import axiosClient from '@/api/axiosClient'
import { cn } from '@/utils/cn'
import { useNavigate } from 'react-router-dom'

interface CalendarEvent {
  id: string
  title: string
  date: Date
  location: string
}

export default function CalendarView() {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await axiosClient.get('/bookings/my-bookings')
      const mapped = res.data
        .filter((b: any) => b.status === 'CONFIRMED')
        .map((b: any) => ({
          id: b.bookingId.toString(),
          title: b.eventTitle,
          date: new Date(b.eventStartDateTime),
          location: b.eventVenue || 'TBD'
        }))
      setEvents(mapped)
    } catch (err) {
      console.error('Failed to load bookings for calendar', err)
    } finally {
      setLoading(false)
    }
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const rows = []
  let days = []
  let day = startDate

  // Render Grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day
      const dayEvents = events.filter(e => isSameDay(e.date, cloneDay))
      const isSelected = selectedDate && isSameDay(cloneDay, selectedDate)
      const isToday = isSameDay(cloneDay, new Date())

      days.push(
        <div
          key={cloneDay.toString()}
          onClick={() => setSelectedDate(cloneDay)}
          className={cn(
            "min-h-[120px] p-2 border-b border-r border-border/50 relative transition-colors cursor-pointer flex flex-col",
            !isSameMonth(cloneDay, monthStart) ? "bg-gray-50/50" : "bg-white hover:bg-gray-50/80",
            isSelected ? "bg-primary/5" : ""
          )}
        >
          <div className="flex justify-end mb-1">
            <span className={cn(
              "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
              isToday 
                ? "bg-red-500 text-white shadow-md" 
                : isSelected
                  ? "bg-text-primary text-white"
                  : !isSameMonth(cloneDay, monthStart) 
                    ? "text-text-muted/40" 
                    : "text-text-primary"
            )}>
              {format(cloneDay, "d")}
            </span>
          </div>
          
          <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md truncate border border-blue-200/50 shadow-sm"
              >
                {format(event.date, "HH:mm")} {event.title}
              </div>
            ))}
          </div>
        </div>
      )
      day = addDays(day, 1)
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    )
    days = []
  }

  const selectedDayEvents = selectedDate ? events.filter(e => isSameDay(e.date, selectedDate)) : []

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 relative overflow-hidden">
      {/* Main Calendar Area */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-white z-10">
          <h1 className="text-3xl font-display font-bold text-text-primary">
            {format(currentDate, "MMMM yyyy")}
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={goToday} className="rounded-xl px-4 text-sm font-bold h-10 border-border">
              Today
            </Button>
            <div className="flex items-center rounded-xl border border-border overflow-hidden h-10 bg-white">
              <button onClick={prevMonth} className="px-3 h-full hover:bg-gray-50 border-r border-border transition-colors">
                <ChevronLeft className="w-5 h-5 text-text-muted" />
              </button>
              <button onClick={nextMonth} className="px-3 h-full hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-5 h-5 text-text-muted" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Days Header */}
            <div className="grid grid-cols-7 bg-white">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                <div key={dayName} className="p-3 text-center text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-r border-border/50 last:border-r-0">
                  {dayName}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white flex flex-col pb-10">
              {rows}
            </div>
          </div>
        )}
      </motion.div>

      {/* Inspector Sidebar */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedDate?.toString() || 'none'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="w-full md:w-80 h-full bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col flex-shrink-0"
        >
          {selectedDate && (
            <>
              <div className="p-6 border-b border-border bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-text-primary">
                      {format(selectedDate, "d")}
                    </h2>
                    <p className="text-sm font-bold text-text-muted uppercase tracking-widest mt-1">
                      {format(selectedDate, "EEEE, MMMM")}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map(event => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={event.id} 
                      className="bg-white border border-border rounded-xl p-4 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group"
                    >
                      <h3 className="font-bold text-text-primary mb-3 line-clamp-2 leading-tight">{event.title}</h3>
                      <div className="space-y-2 mb-5">
                        <p className="flex items-center gap-2 text-xs text-text-muted font-medium">
                          <Clock className="w-3.5 h-3.5 text-primary" /> {format(event.date, "h:mm a")}
                        </p>
                        <p className="flex items-center gap-2 text-xs text-text-muted font-medium line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> {event.location}
                        </p>
                      </div>
                      <Button onClick={() => navigate('/attendee/tickets')} variant="outline" className="w-full text-xs h-9 font-bold border-border hover:bg-primary/5 hover:text-primary hover:border-primary/30 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                        <Ticket className="w-3.5 h-3.5 mr-1.5" /> View Ticket
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Ticket className="w-8 h-8 text-text-muted" />
                    </div>
                    <p className="text-base font-bold text-text-primary">No Events</p>
                    <p className="text-sm text-text-muted mt-1">You don't have any reservations on this day.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
