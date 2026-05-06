// User types
export interface User {
  id: string
  email: string
  name: string
  role?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
  preferredCurrency?: string
  country?: string
  city?: string
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

// Currency types
export interface Currency {
  code: string
  symbol: string
  name: string
  rate: number // Base rate compared to USD
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.85 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.73 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 110.21 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.25 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.35 },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rate: 0.92 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 6.45 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 74.32 },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 410.52 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 15.42 },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', rate: 109.23 },
]

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

export const COUNTRIES: Country[] = [
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    cities: [
      { id: 'nyc', name: 'New York City', country: 'US', state: 'NY' },
      { id: 'la', name: 'Los Angeles', country: 'US', state: 'CA' },
      { id: 'chicago', name: 'Chicago', country: 'US', state: 'IL' },
      { id: 'houston', name: 'Houston', country: 'US', state: 'TX' },
      { id: 'phoenix', name: 'Phoenix', country: 'US', state: 'AZ' },
      { id: 'philadelphia', name: 'Philadelphia', country: 'US', state: 'PA' },
      { id: 'san-francisco', name: 'San Francisco', country: 'US', state: 'CA' },
      { id: 'boston', name: 'Boston', country: 'US', state: 'MA' },
      { id: 'miami', name: 'Miami', country: 'US', state: 'FL' },
      { id: 'seattle', name: 'Seattle', country: 'US', state: 'WA' },
    ]
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    cities: [
      { id: 'london', name: 'London', country: 'GB' },
      { id: 'manchester', name: 'Manchester', country: 'GB' },
      { id: 'birmingham', name: 'Birmingham', country: 'GB' },
      { id: 'glasgow', name: 'Glasgow', country: 'GB' },
      { id: 'liverpool', name: 'Liverpool', country: 'GB' },
    ]
  },
  {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    cities: [
      { id: 'toronto', name: 'Toronto', country: 'CA' },
      { id: 'montreal', name: 'Montreal', country: 'CA' },
      { id: 'vancouver', name: 'Vancouver', country: 'CA' },
      { id: 'calgary', name: 'Calgary', country: 'CA' },
      { id: 'ottawa', name: 'Ottawa', country: 'CA' },
    ]
  },
  {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    cities: [
      { id: 'sydney', name: 'Sydney', country: 'AU' },
      { id: 'melbourne', name: 'Melbourne', country: 'AU' },
      { id: 'brisbane', name: 'Brisbane', country: 'AU' },
      { id: 'perth', name: 'Perth', country: 'AU' },
      { id: 'adelaide', name: 'Adelaide', country: 'AU' },
    ]
  },
  {
    code: 'NG',
    name: 'Nigeria',
    currency: 'NGN',
    cities: [
      { id: 'lagos', name: 'Lagos', country: 'NG' },
      { id: 'abuja', name: 'Abuja', country: 'NG' },
      { id: 'kano', name: 'Kano', country: 'NG' },
      { id: 'ibadan', name: 'Ibadan', country: 'NG' },
      { id: 'port-harcourt', name: 'Port Harcourt', country: 'NG' },
    ]
  },
  {
    code: 'KE',
    name: 'Kenya',
    currency: 'KES',
    cities: [
      { id: 'nairobi', name: 'Nairobi', country: 'KE' },
      { id: 'mombasa', name: 'Mombasa', country: 'KE' },
      { id: 'kisumu', name: 'Kisumu', country: 'KE' },
      { id: 'nakuru', name: 'Nakuru', country: 'KE' },
      { id: 'eldoret', name: 'Eldoret', country: 'KE' },
    ]
  },
  {
    code: 'ZA',
    name: 'South Africa',
    currency: 'ZAR',
    cities: [
      { id: 'johannesburg', name: 'Johannesburg', country: 'ZA' },
      { id: 'cape-town', name: 'Cape Town', country: 'ZA' },
      { id: 'durban', name: 'Durban', country: 'ZA' },
      { id: 'pretoria', name: 'Pretoria', country: 'ZA' },
      { id: 'port-elizabeth', name: 'Port Elizabeth', country: 'ZA' },
    ]
  },
]

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

// Currency utility functions
export const getCurrencyByCode = (code: string): Currency | undefined => {
  return CURRENCIES.find(currency => currency.code === code)
}

export const getPopularCurrencies = (): Currency[] => {
  return [
    getCurrencyByCode('USD')!,
    getCurrencyByCode('EUR')!,
    getCurrencyByCode('GBP')!,
    getCurrencyByCode('JPY')!,
    getCurrencyByCode('CAD')!,
    getCurrencyByCode('AUD')!,
  ].filter(Boolean)
}

export const getOtherCurrencies = (): Currency[] => {
  const popularCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
  return CURRENCIES.filter(currency => !popularCodes.includes(currency.code))
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
