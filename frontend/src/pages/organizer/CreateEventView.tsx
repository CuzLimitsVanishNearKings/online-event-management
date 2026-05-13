import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Check, Calendar as CalendarIcon, Clock, MapPin, Tag } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useEventStore } from '@/store/eventStore'

export default function CreateEventView() {
  const navigate = useNavigate()
  const { addEvent } = useEventStore()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('conference')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Save to local Zustand store for frontend interactivity
    addEvent({
      title,
      description,
      date,
      time,
      location,
      capacity: parseInt(capacity),
      price: parseFloat(price),
      category
    })

    // Simulate API call delay for realism
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/organizer/events')
      }, 2000)
    }, 1500)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8"
    >
      <div>
        <button 
          onClick={() => navigate('/organizer/events')}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors font-bold text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
        
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight mb-2">Create New Event</h1>
        <p className="text-text-muted font-medium">Fill in the details below to publish a new event to the marketplace.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-surface/30 px-8 py-6 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">Basic Information</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Input 
                label="Event Title" 
                placeholder="e.g., Tech Startup Conference 2026" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              
              <div className="space-y-1">
                <label className="text-sm font-bold text-text-primary">Event Description</label>
                <textarea 
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm min-h-[120px] resize-y"
                  placeholder="Describe your event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-text-primary mb-2 block">Event Banner</label>
                <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                    <Upload className="w-5 h-5 text-text-muted" />
                  </div>
                  <p className="font-bold text-text-primary text-sm">Click to upload banner image</p>
                  <p className="text-xs text-text-muted mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-surface/30 px-8 py-6 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">Date & Location</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 relative">
                <Input 
                  type="date" 
                  label="Date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1 relative">
                <Input 
                  type="time" 
                  label="Time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2 relative">
                <Input 
                  label="Location" 
                  placeholder="Full address or meeting link" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-surface/30 px-8 py-6 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">Ticketing</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                type="number" 
                label="Price (FCFA)" 
                placeholder="0" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="500"
                required
              />
              <Input 
                type="number" 
                label="Capacity" 
                placeholder="Number of attendees" 
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="1"
                required
              />
              <div className="space-y-1">
                <label className="text-sm font-bold text-text-primary block">Category</label>
                <select 
                  className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="meetup">Meetup</option>
                  <option value="concert">Concert</option>
                  <option value="exhibition">Exhibition</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" onClick={() => navigate('/organizer/events')} variant="outline" className="rounded-xl font-bold px-8">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            className={`rounded-xl font-bold px-10 gap-2 ${isSuccess ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : ''}`}
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isSuccess ? (
              <>
                <Check className="w-5 h-5" /> Published
              </>
            ) : (
              'Publish Event'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
