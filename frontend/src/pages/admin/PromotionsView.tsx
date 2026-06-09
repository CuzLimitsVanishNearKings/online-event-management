import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, Plus, Trash2, Edit, AlertCircle, Calendar, CreditCard, Percent } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import axiosClient from '@/api/axiosClient'
import { formatDate } from '@/utils/format'

interface Promotion {
  promotionId: number
  code: string
  discountValue: number
  discountType: 'PERCENTAGE' | 'FIXED'
  startDate: string
  endDate: string
  usageLimit: number
  timesUsed: number
  isActive: boolean
}

export default function PromotionsView() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Modal State
  const [editingId, setEditingId] = useState<number | null>(null)
  const [code, setCode] = useState('')
  const [discountValue, setDiscountValue] = useState('')
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [usageLimit, setUsageLimit] = useState('')

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      const res = await axiosClient.get<Promotion[]>('/promotions')
      setPromotions(res.data)
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch promotions', err)
      setError(err.response?.data?.message || 'Failed to load promotions')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (promo?: Promotion) => {
    if (promo) {
      setEditingId(promo.promotionId)
      setCode(promo.code)
      setDiscountValue(promo.discountValue.toString())
      setDiscountType(promo.discountType)
      setStartDate(promo.startDate)
      setEndDate(promo.endDate)
      setUsageLimit(promo.usageLimit.toString())
    } else {
      setEditingId(null)
      setCode('')
      setDiscountValue('')
      setDiscountType('PERCENTAGE')
      setStartDate('')
      setEndDate('')
      setUsageLimit('')
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = {
        code,
        discountValue: parseFloat(discountValue),
        discountType,
        startDate,
        endDate,
        usageLimit: parseInt(usageLimit)
      }

      if (editingId) {
        await axiosClient.put(`/promotions/${editingId}`, payload)
      } else {
        await axiosClient.post('/promotions', payload)
      }

      await fetchPromotions()
      setIsModalOpen(false)
    } catch (err: any) {
      console.error('Failed to save promotion', err)
      alert(err.response?.data?.message || 'Failed to save promotion')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return
    try {
      await axiosClient.delete(`/promotions/${id}`)
      setPromotions(prev => prev.filter(p => p.promotionId !== id))
    } catch (err: any) {
      console.error('Failed to delete promotion', err)
      alert(err.response?.data?.message || 'Failed to delete promotion')
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Promotions & Discounts</h1>
          <p className="text-text-muted mt-1">Manage promo codes available for ticket purchases.</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary" className="rounded-md font-bold shadow-md shadow-primary/20 gap-2">
          <Plus className="w-4 h-4" /> Create Promo Code
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-3 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-white rounded-lg border border-border p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No promotions found</h3>
          <p className="text-text-muted mb-6">You haven't created any promotional codes yet.</p>
          <Button onClick={() => handleOpenModal()} variant="outline" className="rounded-md">
            Create Your First Code
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border text-xs uppercase tracking-wider text-text-muted font-bold">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Validity</th>
                  <th className="px-6 py-4 text-center">Usage</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {promotions.map((promo) => (
                  <tr key={promo.promotionId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        <span className="font-bold font-mono text-text-primary bg-primary/10 px-2 py-1 rounded-md">
                          {promo.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
                        {promo.discountType === 'PERCENTAGE' ? <Percent className="w-4 h-4 text-blue-500" /> : <CreditCard className="w-4 h-4 text-green-500" />}
                        {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `${promo.discountValue} FCFA`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-text-primary">{promo.timesUsed}</span>
                      <span className="text-xs text-text-muted"> / {promo.usageLimit}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        promo.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {promo.isActive ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(promo)} className="p-2 text-text-muted hover:text-primary transition-colors bg-white rounded-lg border border-border shadow-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(promo.promotionId)} className="p-2 text-text-muted hover:text-red-500 transition-colors bg-white rounded-lg border border-border shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border bg-gray-50/50">
                <h2 className="text-xl font-display font-bold text-text-primary">
                  {editingId ? 'Edit Promo Code' : 'Create Promo Code'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-4">
                  <Input 
                    label="Promo Code" 
                    placeholder="e.g. SUMMER2026" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value.toUpperCase())} 
                    required 
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-text-primary">Discount Type</label>
                      <select 
                        className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-bold bg-white"
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value as any)}
                        required
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed Amount (FCFA)</option>
                      </select>
                    </div>
                    <Input 
                      type="number"
                      label="Discount Value" 
                      placeholder={discountType === 'PERCENTAGE' ? "20" : "5000"} 
                      value={discountValue} 
                      onChange={(e) => setDiscountValue(e.target.value)} 
                      min="0"
                      step={discountType === 'PERCENTAGE' ? "1" : "500"}
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      type="date"
                      label="Start Date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)} 
                      required 
                    />
                    <Input 
                      type="date"
                      label="End Date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)} 
                      required 
                    />
                  </div>

                  <Input 
                    type="number"
                    label="Usage Limit" 
                    placeholder="How many times can this be used?" 
                    value={usageLimit} 
                    onChange={(e) => setUsageLimit(e.target.value)} 
                    min="1"
                    required 
                  />
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-md">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting} className="rounded-md">
                    {isSubmitting ? 'Saving...' : 'Save Code'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
