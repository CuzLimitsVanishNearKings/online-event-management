import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Check, Calendar as CalendarIcon, Clock, MapPin, Tag, AlertCircle } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useCategories } from '@/hooks/useCategories'
import axiosClient from '@/api/axiosClient'

export default function CreateEventView() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { categories, loading: categoriesLoading } = useCategories()
  
  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState('')
  const [price, setPrice] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  
  // Image Upload State
  const [coverImage, setCoverImage] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageFileName, setImageFileName] = useState('')

  // UI Flow States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle Triggering File Dialog
  const handleUploadContainerClick = () => {
    fileInputRef.current?.click()
  }

  // Handle Image Conversion to Base64 String
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Validation Checks
    if (!file.type.startsWith('image/')) {
      setError('Selected file is not an image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file is too large. Maximum allowed size is 5MB.')
      return
    }

    setError(null)
    setImageFileName(file.name)

    // 2. JavaScript FileReader to Base64 Converter
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64String = event.target.result as string
        setCoverImage(base64String)
        setImagePreview(base64String)
      }
    }
    reader.onerror = () => {
      setError('An error occurred while reading the image file.')
    }
    reader.readAsDataURL(file)
  }

  // Submit Flow
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!coverImage) {
      setError('Please upload an event banner image first.')
      return
    }
    if (!selectedCategoryId) {
      setError('Please select a category.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Construct correct start and end LocalDateTime strings for Jackson parser in Spring Boot
      const start = new Date(`${date}T${time}:00`)
      // Check if date is in the future
      if (start.getTime() <= Date.now()) {
        throw new Error('Start date and time must be in the future.')
      }

      // Add a default 3-hour duration for the event
      const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)

      const formatLocalDateTime = (d: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0')
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
      }

      const startDateTimeStr = formatLocalDateTime(start)
      const endDateTimeStr = formatLocalDateTime(end)

      // 2. Step 1: Create the Event (Status DRAFT)
      const eventPayload = {
        title,
        description,
        venue: location, // Maps location input to the required DTO venue field
        startDateTime: startDateTimeStr,
        endDateTime: endDateTimeStr,
        capacity: parseInt(capacity),
        coverImage, // Converted Base64 cover image string
        categoryId: parseInt(selectedCategoryId)
      }

      const eventResponse = await axiosClient.post('/events', eventPayload)
      // Extract the resulting ID (Spring Boot controller details endpoint or ID)
      const eventId = eventResponse.data.id || eventResponse.data.eventId
      if (!eventId) {
        throw new Error('Event creation succeeded but server did not return an event ID.')
      }

      // 3. Step 2: Add the Ticket Type pricing structure (Required by backend validation before publishing)
      const ticketPayload = {
        name: 'General Admission',
        price: parseFloat(price),
        quantity: parseInt(capacity)
      }
      await axiosClient.post(`/events/${eventId}/ticket-types`, ticketPayload)

      // 4. Step 3: Publish the Event so it goes live in the browsable catalogue
      await axiosClient.patch(`/events/${eventId}/publish`)

      setIsSuccess(true)
      setTimeout(() => {
        navigate('/organizer/events')
      }, 2000)

    } catch (err: any) {
      console.error('Multi-step event creation sequence failed:', err)
      setError(err.response?.data?.message || err.message || 'An error occurred while publishing the event.')
      setIsSubmitting(false)
    }
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
        <p className="text-text-muted font-medium">Fill in the details below to publish a new event directly to the marketplace catalogue.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
                
                {/* Hidden input for Base64 File Trigger */}
                <input 
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="border border-border rounded-2xl overflow-hidden relative group max-h-[300px]">
                    <img src={imagePreview} alt="Banner Preview" className="w-full h-full object-cover max-h-[298px]" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button type="button" onClick={handleUploadContainerClick} variant="outline" className="bg-white text-text-primary hover:bg-gray-100 border-none font-bold rounded-xl">
                        Change Image
                      </Button>
                      <Button type="button" onClick={() => { setCoverImage(''); setImagePreview(''); setImageFileName(''); }} variant="outline" className="bg-red-600 text-white hover:bg-red-700 border-none font-bold rounded-xl">
                        Remove
                      </Button>
                    </div>
                    {imageFileName && (
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                        {imageFileName}
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    onClick={handleUploadContainerClick}
                    className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-border">
                      <Upload className="w-5 h-5 text-text-muted" />
                    </div>
                    <p className="font-bold text-text-primary text-sm">Click to upload banner image</p>
                    <p className="text-xs text-text-muted mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                  </div>
                )}
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
                  min={new Date().toISOString().split('T')[0]}
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
                <label className="text-sm font-bold text-text-primary block mb-2">Category</label>
                <select 
                  className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-white font-bold"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select a Category...</option>
                  {categoriesLoading ? (
                    <option disabled>Loading Categories...</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
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
                <Check className="w-5 h-5" /> Published Live
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
