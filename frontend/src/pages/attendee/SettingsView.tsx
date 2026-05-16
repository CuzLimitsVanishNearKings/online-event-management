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



      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} variant="primary" className="rounded-xl px-8 font-bold gap-2 shadow-md shadow-primary/20">
          <Save className="w-4 h-4" />
          {isSaved ? 'Saved!' : 'Save Preferences'}
        </Button>
      </div>
    </motion.div>
  )
}
