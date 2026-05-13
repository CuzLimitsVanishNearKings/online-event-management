import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Check, Receipt } from 'lucide-react'
import { Button } from '@/components/ui'

export default function OrdersView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [exported, setExported] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    }, 1500)
  }

  // No mock data - expecting API integration later
  const orders: any[] = []

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Sales & Orders</h1>
          <p className="text-text-muted mt-1 font-medium">Track ticket purchases and manage refunds.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="rounded-xl border-border font-bold text-text-secondary bg-white gap-2" disabled={isExporting}>
          {isExporting ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : 
           exported ? <Check className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />}
          {exported ? 'Exported!' : 'Export CSV'}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text"
                placeholder="Search by order ID or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full md:w-80"
              />
            </div>
            <Button variant="outline" className="rounded-xl px-3 py-2 border-border text-text-secondary">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-gray-50/10">
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-4">
            <Receipt className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">No orders yet</h3>
          <p className="text-text-muted mt-2 max-w-md">
            {searchQuery 
              ? `We couldn't find any orders matching "${searchQuery}".` 
              : "When customers purchase tickets to your events, their orders will appear here."}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
