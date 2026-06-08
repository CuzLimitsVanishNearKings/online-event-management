import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, Plus, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { Button, Input } from '@/components/ui'
import { cn } from '@/utils/cn'

export default function WalletView() {
  const { wallet, topUpRequests, loading, error, fetchWallet, fetchTopUpRequests, submitTopUp } = useWallet()
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
  
  // Form state
  const [amount, setAmount] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchWallet()
    fetchTopUpRequests()
  }, [fetchWallet, fetchTopUpRequests])

  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(false)
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setFormError('Please enter a valid amount greater than 0.')
      return
    }

    setIsSubmitting(true)
    const result = await submitTopUp(Number(amount))
    setIsSubmitting(false)

    if (result.success) {
      setFormSuccess(true)
      setTimeout(() => {
        setIsTopUpModalOpen(false)
        setAmount('')
        setFormSuccess(false)
      }, 2000)
    } else {
      setFormError(result.error || 'Failed to submit request.')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-8 pb-10 max-w-5xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight mb-2">My Wallet</h1>
        <p className="text-text-muted font-medium">Manage your balance and top-up requests securely.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Balance Card */}
      <div className="bg-primary rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-primary/20">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Wallet className="w-64 h-64 rotate-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-white/80 font-bold uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Available Balance
            </p>
            {loading && !wallet ? (
              <div className="h-14 w-48 bg-white/20 rounded-lg animate-pulse" />
            ) : (
              <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tight">
                {wallet?.balance?.toLocaleString() || 0} <span className="text-2xl text-white/80">{wallet?.currency || 'FCFA'}</span>
              </h2>
            )}
          </div>
          
          <Button 
            onClick={() => setIsTopUpModalOpen(true)}
            className="bg-white text-primary hover:bg-white/90 rounded-xl font-bold shadow-lg gap-2 py-3 px-6 shrink-0"
          >
            <Plus className="w-5 h-5" /> Top Up Balance
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction History */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-6 border-b border-border bg-surface/30">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Clock className="w-5 h-5 text-text-muted" /> Transaction History
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {loading && !wallet ? (
              <div className="p-8 text-center text-text-muted">Loading transactions...</div>
            ) : !wallet?.transactions || wallet.transactions.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Wallet className="w-8 h-8 text-text-muted/50" />
                </div>
                <p className="text-text-muted font-bold text-sm">No transactions yet</p>
                <p className="text-xs text-text-muted/70 mt-1">Your wallet activity will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {wallet.transactions.map((tx) => (
                  <div key={tx.transactionId} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-border transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        tx.type === 'CREDIT' || tx.type === 'REFUND' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      )}>
                        {tx.type === 'CREDIT' || tx.type === 'REFUND' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary capitalize">{tx.type.toLowerCase()}</p>
                        <p className="text-xs font-medium text-text-muted mt-0.5">{tx.description || 'Wallet operation'}</p>
                        <p className="text-[10px] text-text-muted/80 mt-1 uppercase tracking-wider">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "font-bold text-base",
                      tx.type === 'CREDIT' || tx.type === 'REFUND' ? "text-green-600" : "text-text-primary"
                    )}>
                      {tx.type === 'CREDIT' || tx.type === 'REFUND' ? '+' : '-'}{tx.amount} {wallet.currency}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top-Up Requests */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-6 border-b border-border bg-surface/30">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-text-muted" /> Top-Up Requests
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {loading && topUpRequests.length === 0 ? (
              <div className="p-8 text-center text-text-muted">Loading requests...</div>
            ) : topUpRequests.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <ArrowUpRight className="w-8 h-8 text-text-muted/50" />
                </div>
                <p className="text-text-muted font-bold text-sm">No pending requests</p>
                <p className="text-xs text-text-muted/70 mt-1">Submit a top-up request to add funds.</p>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {topUpRequests.map((req) => (
                  <div key={req.requestId} className="p-4 rounded-xl border border-border bg-gray-50/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-lg font-bold text-text-primary">{req.amount} FCFA</p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        req.status === 'APPROVED' ? "bg-green-100 text-green-700" :
                        req.status === 'REJECTED' ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      )}>
                        {req.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-text-muted">
                      <span>{formatDate(req.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top-Up Modal */}
      <AnimatePresence>
        {isTopUpModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsTopUpModalOpen(false)}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl border border-border w-full max-w-md overflow-hidden relative"
              >
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-surface/30">
                  <h3 className="text-xl font-bold text-text-primary">Add Funds</h3>
                  <button 
                    onClick={() => !isSubmitting && setIsTopUpModalOpen(false)}
                    className="p-2 -m-2 text-text-muted hover:text-text-primary rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleTopUpSubmit} className="p-6 space-y-5">
                  {formError && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {formError}
                    </div>
                  )}

                  {formSuccess && (
                    <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      Top-up request submitted successfully!
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary block mb-1.5">Amount (FCFA)</label>
                    <Input 
                      type="number"
                      placeholder="e.g., 5000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      disabled={isSubmitting || formSuccess}
                    />
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsTopUpModalOpen(false)}
                      disabled={isSubmitting}
                      className="rounded-xl font-bold"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={isSubmitting || formSuccess}
                      className="rounded-xl font-bold min-w-[120px]"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Submit Request'
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
