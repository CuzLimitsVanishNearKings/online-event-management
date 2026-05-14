import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { Button, Input } from '@/components/ui'
import { Save, Check, Bell, ShieldCheck, Globe, Layers, Plus, Trash2, Edit3, Activity } from 'lucide-react'
import { cn } from '@/utils/cn'

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
export function Categories() {
  const [newCategory, setNewCategory] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

  const handleAdd = () => {
    if (!newCategory.trim()) return
    setIsAdding(true)
    setTimeout(() => {
      setCategories(prev => [...prev, newCategory.trim()])
      setNewCategory('')
      setIsAdding(false)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }, 800)
  }

  const handleDelete = (idx: number) => {
    setCategories(prev => prev.filter((_, i) => i !== idx))
  }

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
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label=""
                placeholder="New category name (e.g. Music, Sports, Tech)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <Button
              onClick={handleAdd}
              variant="primary"
              className="rounded-xl font-bold gap-2 self-end"
              disabled={isAdding || !newCategory.trim()}
            >
              {isAdding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
               added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              Add
            </Button>
          </div>

          {categories.length > 0 ? (
            <div className="divide-y divide-border">
              {categories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between py-4 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Layers className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-bold text-text-primary">{cat}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(idx)} className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50/30 rounded-xl border-2 border-dashed border-border">
              <Layers className="w-10 h-10 text-text-muted mb-3" />
              <p className="font-bold text-text-primary">No categories yet</p>
              <p className="text-sm text-text-muted mt-1">Add your first category above to classify events.</p>
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
  const { user } = useAuthStore()

  const profileData = {
    name: user?.name || 'Administrator',
    email: user?.email || 'admin@evento.com',
    role: 'System Administrator',
    status: 'Active',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">My Profile</h1>
        <p className="text-text-muted mt-1 font-medium">View your administrative account details.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-surface/30 px-8 py-6 border-b border-border flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 text-primary-dark rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-text-primary">{profileData.name}</h2>
            <p className="text-sm font-bold text-primary mt-1 tracking-wider">{profileData.role}</p>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
            {[
              { label: 'Full Name', value: profileData.name },
              { label: 'Email Address', value: profileData.email },
              { label: 'Role', value: profileData.role },
              { label: 'Account Status', value: profileData.status, green: true },
            ].map((field, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{field.label}</p>
                <p className={cn('text-lg font-bold', field.green ? 'text-green-700 flex items-center gap-2' : 'text-text-primary')}>
                  {field.green && <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />}
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
