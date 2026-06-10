import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Calendar as CalendarIcon, Clock, MapPin, Tag, AlertCircle, Plus, Trash2, Upload, Loader2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useCategories } from '@/hooks/useCategories'
import axiosClient from '@/api/axiosClient'

interface TicketTier {
  id: string | number
  name: string
  price: string
  capacity: string
  isNew?: boolean
}

export default function EditEventView() {
  const { eventId } = useParams()
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
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  
  // Ticket Tiers State
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([])
  const [deletedTierIds, setDeletedTierIds] = useState<number[]>([])
  
  // Image Upload State
  const [coverImage, setCoverImage] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageFileName, setImageFileName] = useState('')

  // UI Flow States
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch Event Data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoadingInitial(true)
        // Fetch Event Details
        const eventRes = await axiosClient.get(`/events/${eventId}`)
        const eventData = eventRes.data

        setTitle(eventData.title || '')
        setDescription(eventData.description || '')
        setLocation(eventData.venue || '')
        setCapacity(eventData.capacity?.toString() || '')
        setSelectedCategoryId(eventData.category?.categoryId?.toString() || '')
        
        if (eventData.startDateTime) {
          const dt = new Date(eventData.startDateTime)
          const pad = (n: number) => n.toString().padStart(2, '0')
          setDate(`${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`)
          setTime(`${pad(dt.getHours())}:${pad(dt.getMinutes())}`)
        }

        if (eventData.coverImage) {
          // If it's a relative path, we don't convert to base64, we just let it be updated if a new file is chosen
          setImagePreview(`http://localhost:8080${eventData.coverImage}`)
        }

        // Fetch Ticket Types
        const ticketRes = await axiosClient.get(`/events/${eventId}/ticket-types`)
        const ticketsData = ticketRes.data || []
        
        const mappedTiers: TicketTier[] = ticketsData.map((t: any) => ({
          id: t.ticketTypeId,
          name: t.name,
          price: t.price?.toString() || '0',
          capacity: t.quantity?.toString() || '0',
          isNew: false
        }))
        
        setTicketTiers(mappedTiers)
      } catch (err: any) {
        console.error('Failed to load event data:', err)
        setError('Failed to load event data. Make sure it exists and you have permission.')
      } finally {
        setIsLoadingInitial(false)
      }
    }
    
    if (eventId) fetchEventData()
  }, [eventId])

  // Ticket Tier Handlers
  const handleAddTier = () => {
    setTicketTiers([...ticketTiers, { id: `new-${Date.now()}`, name: '', price: '', capacity: '', isNew: true }])
  }

  const handleRemoveTier = (id: number | string) => {
    if (typeof id === 'number') {
      setDeletedTierIds([...deletedTierIds, id])
    }
    setTicketTiers(ticketTiers.filter(tier => tier.id !== id))
  }

  const handleTierChange = (id: number | string, field: keyof TicketTier, value: string) => {
    setTicketTiers(ticketTiers.map(tier => 
      tier.id === id ? { ...tier, [field]: value } : tier
    ))
  }

  // Handle Triggering File Dialog
  const handleUploadContainerClick = () => {
    fileInputRef.current?.click()
  }

  // Handle Image Conversion to Base64 String
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1200
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          
          if (ctx) {
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, width, height)
            ctx.drawImage(img, 0, 0, width, height)
          }

          const base64String = canvas.toDataURL('image/jpeg', 0.7)
          setCoverImage(base64String)
          setImagePreview(base64String)
        }
        img.onerror = () => setError('Failed to process the image.')
        img.src = event.target.result as string
      }
    }
    reader.onerror = () => setError('An error occurred while reading the image file.')
    reader.readAsDataURL(file)
  }

  // Submit Flow
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategoryId) {
      setError('Please select a category.')
      return
    }

    // Calculate total capacity
    const totalGlobalCapacity = parseInt(capacity) || 0
    if (totalGlobalCapacity <= 0) {
      setError('Total event capacity must be greater than 0.')
      return
    }

    let totalTiersCapacity = 0
    for (const tier of ticketTiers) {
      if (!tier.name.trim() || tier.price === '' || tier.capacity === '') {
        setError('Please fill out all fields for every ticket tier.')
        return
      }
      totalTiersCapacity += parseInt(tier.capacity) || 0
    }

    if (ticketTiers.length > 0 && totalTiersCapacity > totalGlobalCapacity) {
      setError(`Ticket tiers capacity (${totalTiersCapacity}) cannot exceed total event capacity (${totalGlobalCapacity}).`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const start = new Date(`${date}T${time}:00`)
      const end = new Date(start.getTime() + 3 * 60 * 60 * 1000) // 3 hours duration

      const formatLocalDateTime = (d: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0')
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
      }

      // Step 1: Update the Event
      const eventPayload: any = {
        title,
        description,
        venue: location,
        startDateTime: formatLocalDateTime(start),
        endDateTime: formatLocalDateTime(end),
        capacity: totalGlobalCapacity,
        categoryId: parseInt(selectedCategoryId)
      }
      
      // Only send coverImage if it was changed
      if (coverImage) {
        eventPayload.coverImage = coverImage
      }

      await axiosClient.put(`/events/${eventId}`, eventPayload)

      // Step 2: Handle Deleted Ticket Tiers
      for (const delId of deletedTierIds) {
        try {
          await axiosClient.delete(`/events/${eventId}/ticket-types/${delId}`)
        } catch (delErr: any) {
          console.warn('Failed to delete tier', delId, delErr)
          // We don't abort the whole update if deleting a tier fails (might have sold tickets)
        }
      }

      // Step 3: Add/Update Ticket Tiers
      for (const tier of ticketTiers) {
        const ticketPayload = {
          name: tier.name,
          price: parseFloat(tier.price),
          quantity: parseInt(tier.capacity)
        }
        
        if (tier.isNew) {
          await axiosClient.post(`/events/${eventId}/ticket-types`, ticketPayload)
        } else {
          await axiosClient.put(`/events/${eventId}/ticket-types/${tier.id}`, ticketPayload)
        }
      }

      setIsSuccess(true)
      setTimeout(() => {
        navigate('/organizer/events')
      }, 2000)

    } catch (err: any) {
      console.error('Event update sequence failed:', err)
      const apiErrorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'An unexpected error occurred while updating the event.'
      setError(`Error: ${apiErrorMessage}`)
      setIsSubmitting(false)
    }
  }

  if (isLoadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-40">
        <Loader2 className="w-10 h-10 mb-4 animate-spin text-primary" />
        <p className="font-bold text-text-muted animate-pulse">Loading Event Data...</p>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl pb-20 space-y-8"
    >
      <div>
        <button 
          onClick={() => navigate('/organizer/events')}
          className="flex items-center gap-2 mb-6 text-sm font-bold transition-colors text-text-muted hover:text-text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
        
        <h1 className="mb-2 text-3xl font-bold tracking-tight font-display text-text-primary">Edit Event</h1>
        <p className="font-medium text-text-muted">Modify your event details and ticket tiers.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 text-sm font-semibold text-red-700 duration-300 border border-red-200 rounded-md bg-red-50 animate-in fade-in">
          <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="overflow-hidden bg-white border rounded-lg shadow-sm border-border">
          <div className="px-8 py-6 border-b bg-surface/30 border-border">
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
                <label className="block mb-2 text-sm font-bold text-text-primary">Category</label>
                <select 
                  className="w-full px-4 py-3 text-sm font-bold bg-white border rounded-md border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select a Category...</option>
                  {categoriesLoading ? (
                    <option disabled>Loading Categories...</option>
                  ) : (
                    (categories || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-bold text-text-primary">Event Description</label>
                <textarea 
                  className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm min-h-[120px] resize-y"
                  placeholder="Describe your event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block mb-2 text-sm font-bold text-text-primary">Event Banner</label>
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="border border-border rounded-lg overflow-hidden relative group max-h-[300px]">
                    <img src={imagePreview} alt="Banner Preview" className="w-full h-full object-cover max-h-[298px]" />
                    <div className="absolute inset-0 flex items-center justify-center gap-4 transition-opacity opacity-0 bg-black/40 group-hover:opacity-100">
                      <Button type="button" onClick={handleUploadContainerClick} variant="outline" className="font-bold bg-white border-none rounded-md text-text-primary hover:bg-gray-100">
                        Change Image
                      </Button>
                    </div>
                    {imageFileName && (
                      <div className="absolute px-3 py-1 text-xs font-bold rounded-lg shadow-sm bottom-4 left-4 bg-white/95 backdrop-blur-sm">
                        {imageFileName}
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    onClick={handleUploadContainerClick}
                    className="flex flex-col items-center justify-center p-8 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-border bg-gray-50/50 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mb-4 bg-white border rounded-full shadow-sm border-border">
                      <Upload className="w-5 h-5 text-text-muted" />
                    </div>
                    <p className="text-sm font-bold text-text-primary">Click to upload banner image</p>
                    <p className="mt-1 text-xs text-text-muted">PNG, JPG or WEBP (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white border rounded-lg shadow-sm border-border">
          <div className="px-8 py-6 border-b bg-surface/30 border-border">
            <h2 className="text-xl font-bold text-text-primary">Date & Location</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative space-y-1">
                <Input 
                  type="date" 
                  label="Date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="relative space-y-1">
                <Input 
                  type="time" 
                  label="Time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div className="relative md:col-span-2">
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

        <div className="overflow-hidden bg-white border rounded-lg shadow-sm border-border">
          <div className="flex items-center justify-between px-8 py-6 border-b bg-surface/30 border-border">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Tickets & Capacity</h2>
              <p className="mt-1 text-xs text-text-muted">Set a global capacity or add specific ticket tiers.</p>
            </div>
            <Button 
              type="button" 
              onClick={handleAddTier} 
              variant="outline" 
              className="gap-2 px-4 py-2 text-sm font-bold bg-white rounded-md text-primary border-border hover:bg-surface"
            >
              <Plus className="w-4 h-4" /> Add Ticket Tier
            </Button>
          </div>
          <div className="p-8">
            <div className="max-w-xs mb-6">
              <Input 
                type="number" 
                label="Total Event Capacity" 
                placeholder="e.g., 500" 
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="1"
                required
              />
              {ticketTiers.length > 0 && (
                <p className="mt-2 text-xs font-medium text-text-muted">
                  Sum of ticket tier capacities must not exceed the total capacity.
                </p>
              )}
            </div>

            {ticketTiers.length > 0 && (
              <div className="pt-6 space-y-4 border-t border-border">
                <h3 className="mb-4 text-sm font-bold tracking-wider uppercase text-text-primary">Ticket Tiers</h3>
                {ticketTiers.map((tier) => (
                  <div key={tier.id} className="relative grid grid-cols-1 gap-4 p-4 border rounded-md md:grid-cols-12 border-border bg-gray-50/50 group">
                  <div className="md:col-span-5">
                    <Input 
                      label="Ticket Name" 
                      placeholder="e.g., VIP Front Row" 
                      value={tier.name}
                      onChange={(e) => handleTierChange(tier.id, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Input 
                      type="number" 
                      label="Price (FCFA)" 
                      placeholder="0" 
                      value={tier.price}
                      onChange={(e) => handleTierChange(tier.id, 'price', e.target.value)}
                      min="0"
                      step="500"
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Input 
                      type="number" 
                      label="Capacity" 
                      placeholder="e.g., 50" 
                      value={tier.capacity}
                      onChange={(e) => handleTierChange(tier.id, 'capacity', e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex items-end justify-center pb-2 md:col-span-1">
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTier(tier.id)}
                      className="p-2 transition-colors rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50"
                      title="Remove Tier"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" onClick={() => navigate('/organizer/events')} variant="outline" className="px-8 font-bold rounded-md">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            className={`rounded-md font-bold px-10 gap-2 ${isSuccess ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : ''}`}
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
            ) : isSuccess ? (
              <>
                <Check className="w-5 h-5" /> Saved Successfully
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
