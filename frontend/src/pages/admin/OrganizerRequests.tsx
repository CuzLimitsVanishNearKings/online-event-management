import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Check, X, Eye, UserCheck, Mail, Calendar } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils/cn'

type RequestTab = 'pending' | 'approved' | 'rejected'

export default function OrganizerRequests() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<RequestTab>('pending')
  const [approving, setApproving] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)

  // No mock data – will be populated from API
  const requests: any[] = []

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.organization?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = r.status === activeTab
    return matchesSearch && matchesTab
  })

  const handleApprove = (id: string) => {
    setApproving(id)
    setTimeout(() => setApproving(null), 1500)
  }

  const handleReject = (id: string) => {
    setRejecting(id)
    setTimeout(() => setRejecting(null), 1500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Organizer Requests</h1>
          <p className="text-text-muted mt-1 font-medium">Review and approve new organizer account applications.</p>
        </div>
        <Button variant="outline" className="rounded-xl border-border font-bold text-text-secondary bg-white gap-2">
          <Mail className="w-4 h-4" />
          Email All Pending
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex gap-2 bg-surface/50 p-1 rounded-lg">
            {(['pending', 'approved', 'rejected'] as RequestTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 text-sm font-bold capitalize rounded-md transition-all',
                  activeTab === tab ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search applicants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full md:w-72"
              />
            </div>
            <Button variant="outline" className="rounded-xl px-3 py-2 border-border text-text-secondary">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {filteredRequests.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredRequests.map((req) => (
              <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20 text-primary font-bold text-lg">
                    {req.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-text-primary text-lg">{req.name}</h3>
                      <span className={cn(
                        'px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider',
                        req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        req.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      )}>{req.status}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted font-medium">
                      <span className="flex items-center gap-1.5"><UserCheck className="w-4 h-4" /> {req.organization}</span>
                      <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {req.email}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Applied {req.submittedAt}</span>
                    </div>
                  </div>
                </div>
                {activeTab === 'pending' && (
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button variant="outline" className="rounded-xl px-4 py-2 border-border text-sm font-bold text-text-secondary gap-1.5">
                      <Eye className="w-4 h-4" /> View
                    </Button>
                    <Button
                      onClick={() => handleReject(req.id)}
                      variant="outline"
                      className="rounded-xl px-4 py-2 border-red-200 text-sm font-bold text-red-600 hover:bg-red-50 gap-1.5"
                      disabled={rejecting === req.id}
                    >
                      {rejecting === req.id ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <X className="w-4 h-4" />}
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(req.id)}
                      variant="primary"
                      className="rounded-xl px-4 py-2 text-sm font-bold shadow-md shadow-primary/20 gap-1.5"
                      disabled={approving === req.id}
                    >
                      {approving === req.id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-2xl bg-surface/30">
            <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-2xl flex items-center justify-center mb-4">
              <UserCheck className="w-8 h-8 text-text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              {activeTab === 'pending' ? 'No pending requests' : activeTab === 'approved' ? 'No approved organizers yet' : 'No rejected requests'}
            </h3>
            <p className="text-text-muted mt-2 max-w-md">
              {searchQuery
                ? `No results matching "${searchQuery}".`
                : activeTab === 'pending'
                  ? "All organizer applications have been processed."
                  : "Applications you've reviewed will appear here."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
