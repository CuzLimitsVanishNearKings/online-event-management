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
        setSelectedCategoryId(eventData.category?.id?.toString() || '')
        
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
          id: t.id,
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
      <div className="flex-1 flex flex-col items-center justify-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-text-muted font-bold animate-pulse">Loading Event Data...</p>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8 pb-20"
    >
      <div>
        <button 
          onClick={() => navigate('/organizer/events')}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors font-bold text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
        
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight mb-2">Edit Event</h1>
        <p className="text-text-muted font-medium">Modify your event details and ticket tiers.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
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
                <label className="text-sm font-bold text-text-primary block mb-2">Category</label>
                <select 
                  className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm bg-white font-bold"
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
                <label className="text-sm font-bold text-text-primary mb-2 block">Event Banner</label>
                
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
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button type="button" onClick={handleUploadContainerClick} variant="outline" className="bg-white text-text-primary hover:bg-gray-100 border-none font-bold rounded-md">
                        Change Image
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
                    className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
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

        <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
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

        <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="bg-surface/30 px-8 py-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Tickets & Capacity</h2>
              <p className="text-xs text-text-muted mt-1">Set a global capacity or add specific ticket tiers.</p>
            </div>
            <Button 
              type="button" 
              onClick={handleAddTier} 
              variant="outline" 
              className="bg-white text-primary border-border hover:bg-surface rounded-md font-bold gap-2 text-sm px-4 py-2"
            >
              <Plus className="w-4 h-4" /> Add Ticket Tier
            </Button>
          </div>
          <div className="p-8">
            <div className="mb-6 max-w-xs">
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
                <p className="text-xs text-text-muted mt-2 font-medium">
                  Sum of ticket tier capacities must not exceed the total capacity.
                </p>
              )}
            </div>

            {ticketTiers.length > 0 && (
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider mb-4">Ticket Tiers</h3>
                {ticketTiers.map((tier) => (
                  <div key={tier.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-border rounded-md bg-gray-50/50 relative group">
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
                  <div className="md:col-span-1 flex items-end justify-center pb-2">
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTier(tier.id)}
                      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
          <Button type="button" onClick={() => navigate('/organizer/events')} variant="outline" className="rounded-md font-bold px-8">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            className={`rounded-md font-bold px-10 gap-2 ${isSuccess ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : ''}`}
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
