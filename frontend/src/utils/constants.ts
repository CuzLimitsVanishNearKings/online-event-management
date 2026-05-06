export const API_BASE_URL = 'http://localhost:4000'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgotpassword',
  RESET_PASSWORD: '/resetpassword',
  USER_ACCOUNT: '/useraccount',
  CREATE_EVENT: '/createEvent',
  EVENT_DETAIL: '/event/:id',
  CALENDAR: '/calendar',
  WALLET: '/wallet',
  ORDER_SUMMARY: '/event/:id/ordersummary',
  PAYMENT_SUMMARY: '/event/:id/ordersummary/paymentsummary',
} as const

export const EVENT_CATEGORIES = [
  'Music',
  'Sports',
  'Technology',
  'Business',
  'Arts',
  'Food & Drink',
  'Education',
  'Entertainment',
  'Health & Wellness',
  'Social',
] as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const

export const TICKET_STATUS = {
  ACTIVE: 'active',
  USED: 'used',
  EXPIRED: 'expired',
} as const

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
} as const
