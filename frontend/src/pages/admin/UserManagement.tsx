import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Download, Mail, Users, Check, UserPlus, Shield, X, AlertCircle } from 'lucide-react'
import { Button, Input, Pagination } from '@/components/ui'
import { cn } from '@/utils/cn'
import axiosClient from '@/api/axiosClient'
import { usePagination } from '@/hooks/usePagination'

type UserTab = 'all' | 'attendees' | 'organizers' | 'admins'

interface UserSummary {
  id: number
  firstName: string
  lastName: string
  email: string
  userName: string
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED'
  role: 'CLIENT' | 'ORGANIZER' | 'ADMIN'
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<UserTab>('all')
  const [isExporting, setIsExporting] = useState(false)
  const [exported, setExported] = useState(false)

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [submittingUser, setSubmittingUser] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  // Add User Form Fields
  const [formRole, setFormRole] = useState<'CLIENT' | 'ORGANIZER'>('CLIENT')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Organizer specific fields
  const [organizationName, setOrganizationName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosClient.get<UserSummary[]>('/users')
      setUsers(res.data || [])
    } catch (err: any) {
      console.error('Failed to fetch users:', err)
      setError(err.response?.data?.message || 'Failed to fetch platform users.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    try {
      if (currentStatus === 'SUSPENDED') {
        await axiosClient.patch(`/users/${userId}/activate`)
      } else {
        await axiosClient.patch(`/users/${userId}/suspend`)
      }
      fetchUsers()
    } catch (err) {
      console.error('Failed to toggle user status', err)
      alert('Failed to change user status.')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim().toLowerCase()
    const query = searchQuery.toLowerCase()
    
    const matchesSearch =
      fullName.includes(query) ||
      (u.userName || '').toLowerCase().includes(query) ||
      (u.email || '').toLowerCase().includes(query)
      
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'attendees' && u.role === 'CLIENT') ||
      (activeTab === 'organizers' && u.role === 'ORGANIZER') ||
      (activeTab === 'admins' && u.role === 'ADMIN')
      
    return matchesSearch && matchesTab
  })

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToNextPage,
    goToPreviousPage,
    startIndex,
    endIndex,
    totalItems
  } = usePagination(filteredUsers, 10)

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      // Create CSV content from live data
      const headers = ['First Name', 'Last Name', 'Username', 'Email', 'Role', 'Status']
      const rows = filteredUsers.map((u) => [
        u.firstName || '',
        u.lastName || '',
        u.userName || '',
        u.email || '',
        u.role || '',
        u.status || ''
      ])
      
      const csvContent = 
        'data:text/csv;charset=utf-8,' + 
        [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n')
        
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `evento_users_${activeTab}_export.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsExporting(false)
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    }, 1000)
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingUser(true)
    setSubmissionError(null)
    setSubmissionSuccess(false)

    try {
      if (formRole === 'CLIENT') {
        const payload = {
          firstName,
          lastName,
          userName,
          email,
          password
        }
        await axiosClient.post('/auth/signup', payload)
      } else {
        const payload = {
          firstName,
          lastName,
          userName,
          email,
          password,
          organizationName,
          description: description || undefined,
          location: location || undefined,
          website: website || undefined
        }
        await axiosClient.post('/auth/organizer/signup', payload)
      }

      setSubmissionSuccess(true)
      
      // Reset form
      setFirstName('')
      setLastName('')
      setUserName('')
      setEmail('')
      setPassword('')
      setOrganizationName('')
      setDescription('')
      setLocation('')
      setWebsite('')

      // Reload users
      await fetchUsers()

      // Close modal after delay
      setTimeout(() => {
        setIsAddModalOpen(false)
        setSubmissionSuccess(false)
      }, 1500)

    } catch (err: any) {
      console.error('Failed to create user:', err)
      setSubmissionError(err.response?.data?.message || 'Failed to create user. Please try again.')
    } finally {
      setSubmittingUser(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Users</h1>
          <p className="text-text-muted mt-1 font-medium">Manage all platform participants and their roles.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleExport} variant="outline" className="rounded-md border-border font-bold text-text-secondary bg-white gap-2" disabled={isExporting || users.length === 0}>
            {isExporting ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> :
             exported ? <Check className="w-4 h-4 text-green-600" /> : <Download className="w-4 h-4" />}
            {exported ? 'Exported!' : 'Export CSV'}
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} variant="primary" className="rounded-md gap-2 font-bold shadow-md shadow-primary/20">
            <UserPlus className="w-5 h-5" />
            Add User
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
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
                placeholder="Search users by name, username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full md:w-80"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 space-y-4">
            <div className="h-6 bg-gray-100 rounded-lg w-1/4 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-50 rounded-md animate-pulse" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600 font-bold flex flex-col items-center justify-center gap-3">
            <AlertCircle className="w-12 h-12" />
            <p>{error}</p>
            <Button variant="outline" onClick={fetchUsers} className="rounded-md border-red-200 mt-2 text-red-700 hover:bg-red-50">Retry</Button>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">User</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Username</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Role</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border">Status</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((u) => (
                    <tr key={u.email} className="group hover:bg-gray-50/50 transition-colors border-b border-border/50 last:border-0">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {(u.firstName || u.userName || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-text-primary">
                              {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : (u.userName || 'Anonymous')}
                            </p>
                            <p className="text-sm text-text-muted">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-text-primary font-medium">
                        {u.userName || '—'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn(
                          'px-3 py-1 text-xs font-bold rounded-full uppercase',
                          u.role === 'ORGANIZER' ? 'bg-accent/20 text-accent-dark' :
                          u.role === 'ADMIN' ? 'bg-primary/10 text-primary' :
                          'bg-gray-100 text-gray-700'
                        )}>
                          {u.role === 'CLIENT' ? 'ATTENDEE' : u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn(
                          'px-3 py-1 text-xs font-bold rounded-full uppercase',
                          u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                          u.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        )}>{u.status}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u.role !== 'ADMIN' && (
                          <button 
                            onClick={() => handleToggleStatus(u.id, u.status)}
                            className="px-3 py-1.5 text-xs font-bold bg-white border border-border hover:border-primary rounded-lg transition-colors"
                          >
                            {u.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={goToNextPage}
              onPrevious={goToPreviousPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
            />
          </div>
        ) : (
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-12 text-center m-6 border-2 border-dashed border-border rounded-lg bg-surface/30">
            <div className="w-16 h-16 bg-white border border-border shadow-sm rounded-lg flex items-center justify-center mb-4">
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

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-white rounded-lg border border-border shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-border bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-text-primary">Add New User</h2>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-text-muted hover:text-text-primary rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="overflow-y-auto p-6 space-y-6 flex-1">
                {submissionError && (
                  <div className="flex items-center gap-3 p-4 text-red-600 border border-red-100 bg-red-50 rounded-md">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-bold">{submissionError}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-primary">Select Role</label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setFormRole('CLIENT')} className={cn('flex-1 py-3 px-4 rounded-md border-2 font-bold text-sm text-center transition-all', formRole === 'CLIENT' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary hover:bg-surface')}>
                      Attendee / Client
                    </button>
                    <button type="button" onClick={() => setFormRole('ORGANIZER')} className={cn('flex-1 py-3 px-4 rounded-md border-2 font-bold text-sm text-center transition-all', formRole === 'ORGANIZER' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary hover:bg-surface')}>
                      Organizer
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  <Input label="Last Name" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  <Input label="Username" placeholder="johndoe" value={userName} onChange={(e) => setUserName(e.target.value)} />
                  <Input label="Email Address" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <div className="md:col-span-2">
                    <Input label="Password" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                  </div>
                </div>

                {formRole === 'ORGANIZER' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-4 border-t border-border">
                    <h3 className="font-bold text-text-primary">Organizer Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Input label="Organization Name" placeholder="e.g. Acme Events Group" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} required />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-sm font-bold text-text-primary">Description</label>
                        <textarea className="w-full px-4 py-2.5 border border-border rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm min-h-[80px]" placeholder="Brief info about the organization..." value={description} onChange={(e) => setDescription(e.target.value)} />
                      </div>
                      <Input label="Location" placeholder="e.g. Douala, Cameroon" value={location} onChange={(e) => setLocation(e.target.value)} />
                      <Input label="Website" placeholder="e.g. https://acmeevents.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-border">
                  <Button type="button" variant="outline" className="rounded-md font-bold" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="rounded-md font-bold px-8" disabled={submittingUser || submissionSuccess}>
                    {submittingUser ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : submissionSuccess ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      'Create User'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
