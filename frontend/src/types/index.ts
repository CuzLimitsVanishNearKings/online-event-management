// User types
export interface User {
  id: string
  email: string
  name: string
  role?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
  country?: string
  city?: string
  phoneNumber?: string
  status?: string
  registrationDate?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword?: string
}



// Location types
export interface Country {
  code: string
  name: string
  cities: City[]
  currency?: string
}

export interface City {
  id: string
  name: string
  state?: string
  country: string
}

export const COUNTRIES: Country[] = []

// Event types
export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  price: number
  originalPrice?: number // For showing discounts
  capacity: number
  currentAttendees: number
  category: string
  images: string[] // Multiple images support
  thumbnail?: string // Primary thumbnail
  organizer: string
  organizerId: string
  country: string
  city: string
  venue?: string
  tags?: string[]
  isFeatured?: boolean
  isTrending?: boolean
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface CreateEventData {
  title: string
  description: string
  date: string
  time: string
  location: string
  price: number
  originalPrice?: number
  capacity: number
  category: string
  images: string[]
  country: string
  city: string
  venue?: string
  tags?: string[]
}

// Order/Ticket types
export interface Order {
  id: string
  eventId: string
  userId: string
  quantity: number
  totalAmount: number
  status: 'pending' | 'paid' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Ticket {
  id: string
  orderId: string
  eventId: string
  userId: string
  qrCode?: string
  status: 'active' | 'used' | 'expired'
  createdAt: string
}



// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'textarea'
  placeholder?: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: RegExp
  }
}
