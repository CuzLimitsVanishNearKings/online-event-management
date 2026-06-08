import { useState, useCallback } from 'react'
import axiosClient from '../api/axiosClient'

export interface WalletTransaction {
  transactionId: number
  amount: number
  type: 'CREDIT' | 'DEBIT' | 'REFUND'
  description: string
  createdAt: string
}

export interface WalletWithTransactions {
  walletId: number
  balance: number
  currency: string
  totalCredited: number
  totalDebited: number
  transactions: WalletTransaction[]
}

export interface TopUpRequest {
  requestId: number
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  reviewedAt?: string
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletWithTransactions | null>(null)
  const [topUpRequests, setTopUpRequests] = useState<TopUpRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/wallet/transactions')
      setWallet(response.data)
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch wallet:', err)
      setError(err.response?.data?.message || 'Failed to load wallet details')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTopUpRequests = useCallback(async () => {
    try {
      const response = await axiosClient.get('/top-up-requests/my-requests')
      // Backend now returns a Spring Page object, so the array is in response.data.content
      setTopUpRequests(response.data.content || [])
    } catch (err: any) {
      console.error('Failed to fetch top-up requests:', err)
    }
  }, [])

  const submitTopUp = async (amount: number) => {
    try {
      setLoading(true)
      await axiosClient.post('/top-up-requests', {
        amount
      })
      await fetchTopUpRequests() // Refresh the list
      return { success: true }
    } catch (err: any) {
      console.error('Failed to submit top-up request:', err)
      const msg = err.response?.data?.message || 'Failed to submit top-up request'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  return {
    wallet,
    topUpRequests,
    loading,
    error,
    fetchWallet,
    fetchTopUpRequests,
    submitTopUp
  }
}
