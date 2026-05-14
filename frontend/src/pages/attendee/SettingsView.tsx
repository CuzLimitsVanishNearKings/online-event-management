import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { Bell, CreditCard, Save } from 'lucide-react'

import { useAuthStore } from '@/store/authStore'

export default function SettingsView() {
  const { user } = useAuthStore()
  const [isSaved, setIsSaved] = useState(false)
  const [toggles, setToggles] = useState([true, true, false])

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const toggleSetting = (index: number) => {
    const newToggles = [...toggles]
    newToggles[index] = !newToggles[index]
    setToggles(newToggles)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8"
    >
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="text-text-muted mt-1 font-medium">Manage your notification preferences and payment methods.</p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3 bg-gray-50/30">
          <Bell className="w-5 h-5 text-text-muted" />
          <h2 className="text-lg font-bold text-text-primary">Notification Preferences</h2>
        </div>
        <div className="p-6 space-y-6">
          {[
            { title: 'Event Reminders', desc: 'Get notified 24 hours before your registered events.' },
            { title: 'Ticket Updates', desc: 'Receive emails when new tickets are available for saved events.' },
            { title: 'Marketing Emails', desc: 'Receive personalized recommendations and promotional offers.' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="pr-4">
                <p className="font-bold text-text-primary">{item.title}</p>
                <p className="text-sm text-text-muted mt-0.5">{item.desc}</p>
              </div>
              <button 
                onClick={() => toggleSetting(idx)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  toggles[idx] ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  toggles[idx] ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3 bg-gray-50/30">
          <CreditCard className="w-5 h-5 text-text-muted" />
          <h2 className="text-lg font-bold text-text-primary">Payment Methods</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Visa Card Simulation */}
            <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-md bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                  <CreditCard className="w-8 h-8 opacity-80" />
                  <span className="font-bold text-lg italic tracking-wider">VISA</span>
                </div>
                <div>
                  <p className="font-mono text-lg tracking-[0.2em] mb-1">•••• •••• •••• 4242</p>
                  <div className="flex justify-between text-xs font-medium opacity-80 uppercase tracking-widest">
                    <span>{user?.name || 'Cardholder Name'}</span>
                    <span>12/28</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MTN Mobile Money Simulation */}
            <div className="relative overflow-hidden rounded-2xl p-6 text-black shadow-md bg-gradient-to-br from-[#FFCC00] to-[#E6B800] border border-[#CCA300]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl" />
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                  <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded-md">MTN MoMo</div>
                  <span className="font-bold text-sm bg-black/10 px-2 py-1 rounded-lg">Default</span>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold tracking-widest mb-1">+237 67X XXX XXX</p>
                  <div className="flex justify-between text-xs font-bold opacity-80 uppercase tracking-widest">
                    <span>Mobile Money</span>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full rounded-xl font-bold bg-gray-50 border-border text-text-primary hover:bg-surface border-dashed">
            + Add New Payment Method
          </Button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} variant="primary" className="rounded-xl px-8 font-bold gap-2 shadow-md shadow-primary/20">
          <Save className="w-4 h-4" />
          {isSaved ? 'Saved!' : 'Save Preferences'}
        </Button>
      </div>
    </motion.div>
  )
}
