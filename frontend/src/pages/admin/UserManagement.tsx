import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Mail, Users, Check, UserPlus, MoreVertical, Shield, Ban } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils/cn'

type UserTab = 'all' | 'attendees' | 'organizers' | 'admins'

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<UserTab>('all')
  const [isExporting, setIsExporting] = useState(false)
  const [exported, setExported] = useState(false)

  // No mock data – will be populated from API
  const users: any[] = []

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'attendees' && u.role === 'ATTENDEE') ||
      (activeTab === 'organizers' && u.role === 'ORGANIZER') ||
      (activeTab === 'admins' && u.role === 'ADMIN')
    return matchesSearch && matchesTab
  })

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    }, 1500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Users</h1>
          <p className="text-text-muted mt-1 font-medium">Manage all platform participants and their roles.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleExport} variant="outline" className="rounded-xl border-border font-bold text-text-secondary bg-white gap-2" disabled={isExporting}>
            {isExporting ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> :
             exported ? <Check className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />}
            {exported ? 'Exported!' : 'Export CSV'}
          </Button>
          <Button variant="primary" className="rounded-xl gap-2 font-bold shadow-md shadow-primary/20">
            <UserPlus className="w-5 h-5" />
            Add User
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex gap-2 bg-surface/50 p-1 rounded-lg">
            {(['all', 'attendees', 'organizers', 'admins'] as UserTab[]).map((tab) => (
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
                placeholder="Search users by name or email..."
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

        {/* Table */}
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">User</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Role</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Joined</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Status</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-gray-50/50 transition-colors border-b border-border/50 last:border-0">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary">{u.name}</p>
                          <p className="text-sm text-text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        'px-3 py-1 text-xs font-bold rounded-full uppercase',
                        u.role === 'ORGANIZER' ? 'bg-accent/20 text-accent-dark' :
                        u.role === 'ADMIN' ? 'bg-primary/10 text-primary' :
                        'bg-gray-100 text-gray-700'
                      )}>{u.role}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-text-muted">{u.joinedAt}</td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        'px-3 py-1 text-xs font-bold rounded-full',
                        u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      )}>{u.active ? 'Active' : 'Suspended'}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Manage Role">
                          <Shield className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Suspend User">
                          <Ban className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-2xl bg-surface/30">
            <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-text-muted/50" />
            </div>
            <h3 className="text-xl font-display font-bold text-text-primary">No users found</h3>
            <p className="text-text-muted mt-2 max-w-md">
              {searchQuery
                ? `We couldn't find anyone matching "${searchQuery}". Try adjusting your filters.`
                : "Once users register on the platform, they'll appear here."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
