import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axiosClient from '../api/axiosClient'

// Types
export interface User {
  id: string
  email: string
  name: string
  role?: 'user' | 'admin' | 'organizer'
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface OrganizerRegisterData extends RegisterData {
  organizationName: string
  description?: string
  location?: string
  website?: string
  logoUrl?: string
}

// Store State
interface AuthState {
  // State
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (user: User, token: string) => void
  loginAsync: (credentials: LoginCredentials) => Promise<void>
  registerAsync: (data: RegisterData) => Promise<void>
  registerOrganizerAsync: (data: OrganizerRegisterData) => Promise<void>
  logout: () => void
  clearError: () => void
}

const parseJwt = (token: string): Partial<User> | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decoded = JSON.parse(jsonPayload);
    
    return {
      email: decoded.sub,
      role: decoded.role,
      name: decoded.sub.split('@')[0], // Fallback name
    }
  } catch (e) {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }),
      
      setToken: (token) => {
        set({ token })
        if (token) {
          localStorage.setItem('token', token)
        } else {
          localStorage.removeItem('token')
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      login: (user, token) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
        localStorage.setItem('token', token)
      },

      loginAsync: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axiosClient.post('/auth/login', credentials)
          const { token } = response.data
          const decodedUser = parseJwt(token)
          
          if (!decodedUser) throw new Error('Invalid token received')

          const user: User = {
            id: decodedUser.email || 'unknown',
            email: decodedUser.email || credentials.email,
            name: decodedUser.name || 'User',
            role: decodedUser.role as any || 'user'
          }

          set({ user, token, isAuthenticated: true, isLoading: false, error: null })
          localStorage.setItem('token', token)
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'Login failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      registerAsync: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axiosClient.post('/auth/signup', data)
          const { token } = response.data
          const decodedUser = parseJwt(token)
          
          if (!decodedUser) throw new Error('Invalid token received')

          const user: User = {
            id: decodedUser.email || 'unknown',
            email: decodedUser.email || data.email,
            name: `${data.firstName} ${data.lastName}`,
            role: decodedUser.role as any || 'user'
          }

          set({ user, token, isAuthenticated: true, isLoading: false, error: null })
          localStorage.setItem('token', token)
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'Registration failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      registerOrganizerAsync: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axiosClient.post('/auth/organizer/signup', data)
          const { token } = response.data
          const decodedUser = parseJwt(token)
          
          if (!decodedUser) throw new Error('Invalid token received')

          const user: User = {
            id: decodedUser.email || 'unknown',
            email: decodedUser.email || data.email,
            name: `${data.firstName} ${data.lastName}`,
            role: decodedUser.role as any || 'organizer'
          }

          set({ user, token, isAuthenticated: true, isLoading: false, error: null })
          localStorage.setItem('token', token)
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'Registration failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
        localStorage.removeItem('token')
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
