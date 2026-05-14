import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Input } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { useEventStore } from '@/store/eventStore'
import { Save, Building2, CreditCard, Bell, Check, Loader2 } from 'lucide-react'

export default function SettingsView() {
  const { user, setUser } = useAuthStore()
  const { payoutConnected, connectPayout } = useEventStore()
  
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isSaved, setIsSaved] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const [toggles, setToggles] = useState([true, false, true])

  const handleToggle = (index: number) => {
    const newToggles = [...toggles]
    newToggles[index] = !newToggles[index]
    setToggles(newToggles)
  }

  const handleSave = () => {
    if (user) {
      setUser({ ...user, name, email })
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }
  }

  const handleConnectPayout = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      connectPayout()
    }, 1500)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl"
    >
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="text-text-muted mt-1 font-medium">Manage your organization profile, payouts, and notifications.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-gray-50/50 flex items-center gap-3">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary">Organization Details</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Organization Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Contact Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="md:col-span-2">
              <Input label="Website URL" type="url" placeholder="https://..." />
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
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { title: 'New Ticket Sales', desc: 'Get notified when someone buys a ticket.' },
            { title: 'Event Reminders', desc: 'Receive a summary 24h before your event starts.' },
            { title: 'Payout Updates', desc: 'Get alerted when a payout is processed to your bank.' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl">
              <div>
                <p className="font-bold text-text-primary text-sm">{item.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
              </div>
              <div 
                onClick={() => handleToggle(i)}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${toggles[i] ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${toggles[i] ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  )
}
