import { useAuthStore } from '@/store/authStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import axiosClient from '@/api/axiosClient'
import { LoginCredentials, RegisterData, User, ApiResponse } from '@/types'

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    setUser,
    setToken,
    login,
    logout,
    setLoading,
  } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await axiosClient.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/login',
        credentials
      )
      return response.data
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        login(data.data.user, data.data.token)
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await axiosClient.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/register',
        userData
      )
      return response.data
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        login(data.data.user, data.data.token)
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.post<ApiResponse<null>>('/auth/logout')
      return response.data
    },
    onSuccess: () => {
      logout()
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      logout()
    },
  })

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<User>>('/auth/profile')
      return response.data
    },
    enabled: !!token && isAuthenticated,
  })

  // Handle profile data updates safely using useEffect
  useEffect(() => {
    if (profileQuery.data?.success && profileQuery.data.data) {
      setUser(profileQuery.data.data)
    }
  }, [profileQuery.data?.success, profileQuery.data?.data, setUser])

  return {
    user,
    token,
    isAuthenticated,
    isLoading, // Only use Zustand's isLoading for auth blocking
    loginMutation,
    registerMutation,
    logoutMutation,
    profileQuery,
    login,
    logout,
  }
}
