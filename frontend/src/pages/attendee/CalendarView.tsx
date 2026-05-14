import { useState } from 'react'
import { motion } from 'framer-motion'
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
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui'
import { useAttendeeStore } from '@/store/attendeeStore'
import { cn } from '@/utils/cn'

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { tickets } = useAttendeeStore()
  
  // Filter for upcoming events only
  const upcomingEvents = tickets.filter(t => t.status === 'upcoming')

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const dateFormat = "d"
  const rows = []

  let days = []
  let day = startDate
  let formattedDate = ""

  // Generate calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat)
      const cloneDay = day

      // Find events for this day
      const dayEvents = upcomingEvents.filter(event => {
        // Simple string matching since we use "MMM do, yyyy" format in mock data
        // In real app, we'd parse both to Date objects and compare
        const eventDateStr = event.date // "May 15th, 2026"
        const cellDateStr = format(cloneDay, "MMM do, yyyy")
        
        // A simple heuristic for our mock data format
        // This is robust enough for the frontend simulation
        const currentMonthShort = format(cloneDay, "MMM")
        const currentDayNum = format(cloneDay, "d")
        const currentYear = format(cloneDay, "yyyy")
        
        return eventDateStr.includes(currentMonthShort) && 
               eventDateStr.includes(currentDayNum) && 
               eventDateStr.includes(currentYear)
      })

      days.push(
        <div
          key={day.toString()}
          className={cn(
            "min-h-[120px] p-2 border-b border-r border-border/50 relative group transition-colors",
            !isSameMonth(day, monthStart) ? "bg-surface/30 text-text-muted/50" : "bg-white hover:bg-gray-50",
            isSameDay(day, new Date()) ? "bg-primary/5" : ""
          )}
        >
          <div className="flex justify-between items-start">
            <span className={cn(
              "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full",
              isSameDay(day, new Date()) ? "bg-primary text-white" : "text-text-primary"
            )}>
              {formattedDate}
            </span>
          </div>
          
          <div className="mt-2 space-y-1">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                className="px-2 py-1.5 bg-accent/20 text-accent-dark text-xs font-bold rounded-md truncate cursor-pointer hover:bg-accent/30 transition-colors border border-accent/30"
                title={event.eventName}
              >
                {event.eventName}
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 h-full flex flex-col"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">My Calendar</h1>
          <p className="text-text-muted mt-1 font-medium">Keep track of all your upcoming events in one place.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-border shadow-sm">
          <Button variant="outline" onClick={prevMonth} className="px-2 border-none shadow-none text-text-muted hover:text-text-primary">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-bold text-text-primary min-w-[140px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button variant="outline" onClick={nextMonth} className="px-2 border-none shadow-none text-text-muted hover:text-text-primary">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex-1 flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-gray-50/80 border-b border-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
            <div key={dayName} className="p-3 text-center text-xs font-bold text-text-muted uppercase tracking-wider border-r border-border/50 last:border-r-0">
              {dayName}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto">
          {rows}
        </div>
      </div>
      
      {/* Upcoming List (Mobile or quick view) */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary">Upcoming Soon</h2>
        </div>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.slice(0, 3).map(event => (
              <div key={event.id} className="p-4 rounded-xl border border-border/60 bg-gray-50/50 hover:bg-surface/30 transition-colors">
                <h3 className="font-bold text-text-primary line-clamp-1">{event.eventName}</h3>
                <div className="mt-3 space-y-2">
                  <p className="flex items-center gap-2 text-xs text-text-muted font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {event.date}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-text-muted font-medium line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {event.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-text-muted font-medium text-sm">No upcoming events on your schedule.</p>
            <Button onClick={() => window.location.href = '/events'} variant="outline" className="mt-4 rounded-xl font-bold">
              Browse Events
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
