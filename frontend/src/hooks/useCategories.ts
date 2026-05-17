import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient'

export interface Category {
  id: string | number
  name: string
  icon: string
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosClient.get('/categories')
        const mapped = res.data.map((cat: any) => ({
          id: cat.categoryId || cat.id,
          name: cat.name,
          icon: cat.icon || 'Sparkles'
        }))
        setCategories(mapped)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return { categories, loading }
}
