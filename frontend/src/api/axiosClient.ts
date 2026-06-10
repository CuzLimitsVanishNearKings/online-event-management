import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8082/api',
  withCredentials: false,               
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    if (error.response?.status === 403) {
      // Forbidden - handle permission issues
      console.error('Access forbidden')
    }
    
    return Promise.reject(error)
  }
)

export default axiosClient
