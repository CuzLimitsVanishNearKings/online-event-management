import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button, Input } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { User, Mail, Phone, MapPin, Save, Shield } from 'lucide-react'
import axiosClient from '@/api/axiosClient'

export default function ProfileView() {
  const { user, setUser } = useAuthStore()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [profilePic, setProfilePic] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordSaved, setIsPasswordSaved] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
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

  const handlePasswordUpdate = () => {
    setIsPasswordSaved(true)
    setTimeout(() => {
      setIsPasswordSaved(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }, 3000)
  }

  const handleSave = async () => {
    try {
      const names = name.split(' ')
      const firstName = names[0] || ''
      const lastName = names.slice(1).join(' ') || ' '
      
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
      alert("Failed to save profile.")
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8"
    >
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">My Profile</h1>
        <p className="text-text-muted mt-1 font-medium">Manage your personal information and contact details.</p>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center relative group overflow-hidden">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-xs font-bold text-center px-2">Upload Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-text-primary">{name || 'Attendee'}</h3>
              <span className="px-3 py-1 bg-surface text-text-secondary text-xs font-bold rounded-full inline-block mt-2 uppercase tracking-widest">
                Attendee
              </span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input 
                label="Email Address" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input 
                label="Phone Number" 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input 
                label="City" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input 
                label="Country" 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className="pt-6 border-t border-border flex justify-end">
              <Button onClick={handleSave} variant="primary" className="rounded-md px-8 font-bold gap-2">
                <Save className="w-4 h-4" />
                {isSaved ? 'Saved!' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3 bg-gray-50/30">
          <Shield className="w-5 h-5 text-text-muted" />
          <h2 className="text-lg font-bold text-text-primary">Change Password</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Current Password" 
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <div className="hidden md:block"></div>
            <Input 
              label="New Password" 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input 
              label="Confirm New Password" 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <div className="pt-2 flex justify-end">
            <Button onClick={handlePasswordUpdate} variant="outline" className="rounded-md px-8 font-bold border-border bg-white text-text-secondary hover:text-text-primary">
              {isPasswordSaved ? 'Password Updated!' : 'Update Password'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
