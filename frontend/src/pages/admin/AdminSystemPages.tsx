import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { Button, Input } from '@/components/ui'
import { Save, Check, Bell, ShieldCheck, Globe, Layers, Plus, Trash2, Edit3, Activity, Search, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import axiosClient from '@/api/axiosClient'

// --- Reports / Analytics ---
export function Reporting() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  const kpis = [
    { label: 'Total Platform Revenue', value: '0 FCFA', desc: 'All transactions' },
    { label: 'Active Users (MAU)', value: '0', desc: 'Monthly active users' },
    { label: 'Event Success Rate', value: '0%', desc: 'Published vs cancelled' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Reports & Analytics</h1>
          <p className="text-text-muted mt-1 font-medium">Platform-wide performance, business intelligence, and growth metrics.</p>
        </div>
        <div className="flex bg-surface rounded-lg p-1 w-fit">
          {(['7d', '30d', '90d', 'All Time'] as const).map((label, idx) => {
            const val = idx === 3 ? 'all' : label as any
            return (
              <button key={label} onClick={() => setTimeRange(val)}
                className={cn('px-4 py-1.5 text-sm font-bold rounded-md transition-all',
                  timeRange === val ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary')}>
                {label.toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-2xl font-display font-bold text-text-primary mt-1">{kpi.value}</h3>
              <p className="text-xs font-medium text-text-muted mt-1">{kpi.desc}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface/50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-text-muted" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {
            title: 'Revenue Breakdown',
            desc: 'By event category',
            empty: 'Nothing to break down yet.',
            hint: 'Revenue will be split by category as events get booked.'
          },
          {
            title: 'User Growth',
            desc: 'Registrations over time',
            empty: 'Quiet so far.',
            hint: 'A registration trend will appear as attendees and organizers sign up.'
          },
          {
            title: 'Geographic Distribution',
            desc: 'Attendee locations',
            empty: 'No location data yet.',
            hint: 'Where your audience comes from — visible once tickets are sold.'
          },
          {
            title: 'Conversion Funnel',
            desc: 'View → Book → Attend',
            empty: 'Funnel is empty.',
            hint: 'See where users drop off, from browsing an event to attending it.'
          }
        ].map((chart, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-border shadow-sm p-6 min-h-[300px] flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-text-primary">{chart.title}</h2>
              <p className="text-sm text-text-muted">{chart.desc}</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center bg-gray-50/30 rounded-xl border-2 border-dashed border-border/50">
              <Activity className="w-10 h-10 text-text-muted/40 mb-3" />
              <p className="font-bold text-text-primary">{chart.empty}</p>
              <p className="text-sm text-text-muted mt-1 max-w-xs">{chart.hint}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// --- Categories ---
interface Category {
  categoryId: number
  name: string
  description?: string
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [newCategory, setNewCategory] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosClient.get<Category[]>('/categories')
      setCategories(res.data || [])
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAdd = async () => {
    if (!newCategory.trim()) return
    setIsAdding(true)
    setError(null)
    try {
      const res = await axiosClient.post<Category>('/categories', {
        name: newCategory.trim(),
        description: newDescription.trim() || undefined
      })
      setCategories(prev => [...prev, res.data])
      setNewCategory('')
      setNewDescription('')
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to create category.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (categoryId: number) => {
    setError(null)
    try {
      await axiosClient.delete(`/categories/${categoryId}`)
      setCategories(prev => prev.filter(c => c.categoryId !== categoryId))
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to delete category (it may be linked to active events).')
    }
  }

  const filteredCategories = categories.filter(c => {
    const query = searchQuery.toLowerCase()
    return (c.name || '').toLowerCase().includes(query) ||
      (c.description || '').toLowerCase().includes(query)
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Categories</h1>
        <p className="text-text-muted mt-1 font-medium">Manage event classifications and taxonomies for the platform.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50/50 flex items-center gap-3">
          <Layers className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary">Event Categories</h2>
        </div>
        <div className="p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 text-red-600 border border-red-100 bg-red-50 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <Input
                label="Category Name"
                placeholder="e.g. Music, Sports, Tech"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                label="Description (Optional)"
                placeholder="What type of events are these?"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <Button
              onClick={handleAdd}
              variant="primary"
              className="rounded-xl font-bold gap-2 py-3 px-6 h-[44px]"
              disabled={isAdding || !newCategory.trim()}
            >
              {isAdding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
               added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              Add
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3 py-6">
              <div className="h-10 bg-gray-50 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-50 rounded-xl animate-pulse" />
              <div className="h-10 bg-gray-50 rounded-xl animate-pulse" />
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-full"
                />
              </div>

              <div className="divide-y divide-border border-t border-border mt-4">
                {filteredCategories.map((cat) => (
                  <div key={cat.categoryId} className="flex items-center justify-between py-4 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Layers className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-bold text-text-primary block">{cat.name}</span>
                        {cat.description && (
                          <span className="text-sm text-text-muted">{cat.description}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDelete(cat.categoryId)} className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Category">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50/30 rounded-xl border-2 border-dashed border-border">
              <Layers className="w-10 h-10 text-text-muted mb-3" />
              <p className="font-bold text-text-primary">
                {searchQuery ? 'No matching categories' : 'No categories yet'}
              </p>
              <p className="text-sm text-text-muted mt-1">
                {searchQuery ? `No category matched "${searchQuery}"` : 'Add your first category above to classify events.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// --- Notifications ---
export function Notifications() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState<'all' | 'attendees' | 'organizers'>('all')
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [toggles, setToggles] = useState([true, false, true, true])

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setSent(true)
      setTitle('')
      setMessage('')
      setTimeout(() => setSent(false), 3000)
    }, 1500)
  }

  const handleToggle = (idx: number) => {
    setToggles(prev => { const n = [...prev]; n[idx] = !n[idx]; return n })
  }

  const notificationTypes = [
    { title: 'New User Registrations', desc: 'Get notified when a new user signs up.' },
    { title: 'Organizer Applications', desc: 'Alert when someone applies to become an organizer.' },
    { title: 'Event Published', desc: 'Notify when an organizer publishes a new event.' },
    { title: 'Payment Issues', desc: 'Critical alerts for failed or disputed transactions.' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Notifications</h1>
        <p className="text-text-muted mt-1 font-medium">Send global announcements and manage system alert preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50/50 flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary">Send Announcement</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Notification Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Platform Maintenance Notice" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-text-secondary mb-2">Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement message here..."
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2">Target Audience</label>
              <div className="flex gap-2 bg-surface/50 p-1 rounded-lg w-fit">
                {(['all', 'attendees', 'organizers'] as const).map((a) => (
                  <button key={a} onClick={() => setAudience(a)}
                    className={cn('px-4 py-2 text-sm font-bold capitalize rounded-md transition-all',
                      audience === a ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary')}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant="primary" onClick={handleSend} disabled={isSending || !title.trim() || !message.trim()} className="rounded-xl font-bold gap-2">
              {isSending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
               sent ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              {sent ? 'Sent!' : 'Send Notification'}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50/50 flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary">Admin Alert Preferences</h2>
        </div>
        <div className="p-6 space-y-4">
          {notificationTypes.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl">
              <div>
                <p className="font-bold text-text-primary text-sm">{item.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
              </div>
              <div onClick={() => handleToggle(i)}
                className={cn('w-11 h-6 rounded-full relative cursor-pointer transition-colors', toggles[i] ? 'bg-primary' : 'bg-gray-300')}>
                <div className={cn('absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all', toggles[i] ? 'right-1' : 'left-1')} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// --- Settings ---
export function Settings() {
  const { user, setUser } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isSaved, setIsSaved] = useState(false)
  const [toggles, setToggles] = useState([true, true, false])

  const handleSave = () => {
    if (user) { setUser({ ...user, name, email }); setIsSaved(true); setTimeout(() => setIsSaved(false), 3000) }
  }
  const handleToggle = (idx: number) => setToggles(prev => { const n = [...prev]; n[idx] = !n[idx]; return n })

  const securityToggles = [
    { title: 'Two-Factor Authentication', desc: 'Require 2FA for all admin logins.' },
    { title: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity.' },
    { title: 'Maintenance Mode', desc: 'Take the platform offline for all public users.' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="text-text-muted mt-1 font-medium">Manage global platform configurations and your admin account.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50/50 flex items-center gap-3">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary">Admin Account</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="md:col-span-2">
              <Input label="Platform Name" placeholder="Evento" />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant="primary" onClick={handleSave} className="rounded-xl font-bold gap-2">
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50/50 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary">Security & Platform Controls</h2>
        </div>
        <div className="p-6 space-y-4">
          {securityToggles.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl">
              <div>
                <p className="font-bold text-text-primary text-sm">{item.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
              </div>
              <div onClick={() => handleToggle(i)}
                className={cn('w-11 h-6 rounded-full relative cursor-pointer transition-colors', toggles[i] ? 'bg-primary' : 'bg-gray-300')}>
                <div className={cn('absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all', toggles[i] ? 'right-1' : 'left-1')} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// --- Profile ---
export function Profile() {
  const { user, setUser } = useAuthStore()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [profilePic, setProfilePic] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (user) {
      const names = (user.name || '').split(' ')
      setFirstName(names[0] || '')
      setLastName(names.slice(1).join(' ') || '')
      setProfilePic(user.profilePic || '')
    }
  }, [user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfilePic(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    try {
      const response = await axiosClient.put('/users/profile', {
        firstName,
        lastName,
        profilePic: profilePic || null
      })

      const updated = response.data
      setUser({
        ...user!,
        name: `${updated.firstName} ${updated.lastName}`,
        email: updated.email,
        profilePic: updated.profilePic
      })

      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err) {
      console.error(err)
      alert("Failed to save admin profile.")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">My Profile</h1>
        <p className="text-text-muted mt-1 font-medium">Manage your administrative profile and account details.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center relative group overflow-hidden">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <ShieldCheck className="w-12 h-12 text-primary" />
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-xs font-bold text-center px-2">Upload Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-text-primary">{user?.name || 'Administrator'}</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="px-3 py-1 bg-surface text-primary text-xs font-bold rounded-full inline-flex items-center gap-1 uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> System Admin
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="First Name" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input 
                label="Last Name" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Input 
                label="Email Address" 
                type="email"
                value={user?.email || ''}
                disabled
                className="md:col-span-2 bg-gray-50 text-text-muted"
              />
            </div>

            <div className="pt-6 border-t border-border flex justify-end">
              <Button onClick={handleSave} variant="primary" className="rounded-xl px-8 font-bold gap-2">
                <Save className="w-4 h-4" />
                {isSaved ? 'Saved!' : 'Save Details'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
