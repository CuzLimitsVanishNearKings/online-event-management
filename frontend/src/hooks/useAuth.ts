import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    loginAsync,
    registerAsync,
    registerOrganizerAsync,
    logout,
    clearError,
    setUser,
    login,
  } = useAuthStore()

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    loginAsync,
    registerAsync,
    registerOrganizerAsync,
    logout,
    clearError,
    setUser,
    login,
  }
}