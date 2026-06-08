import { useState, useCallback } from 'react'
import axiosClient from '../api/axiosClient'

export interface AdminTopUpRequest {
  requestId: number
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  reviewedAt?: string
  requesterName: string
  requesterEmail: string
  reviewedByName?: string
  adminNote?: string
}

export interface ReviewTopUpPayload {
  requestId: number
  approved: boolean
  adminNote?: string
}

export const useAdminWallet = () => {
  const [requests, setRequests] = useState<AdminTopUpRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTopUpRequests = useCallback(async (page = 0, size = 100) => {
    try {
      setLoading(true)
      const response = await axiosClient.get(`/top-up-requests?page=${page}&size=${size}`)
      setRequests(response.data.content || [])
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch top-up requests:', err)
      setError(err.response?.data?.message || 'Failed to load requests')
    } finally {
      setLoading(false)
    }
  }, [])

  const reviewTopUpRequest = async (payload: ReviewTopUpPayload) => {
    try {
      setLoading(true)
      await axiosClient.post('/top-up-requests/review', payload)
      await fetchTopUpRequests() // Refresh the list
      return { success: true }
    } catch (err: any) {
      console.error('Failed to review top-up request:', err)
      const msg = err.response?.data?.message || 'Failed to review request'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  return {
    requests,
    loading,
    error,
    fetchTopUpRequests,
    reviewTopUpRequest
  }
}
