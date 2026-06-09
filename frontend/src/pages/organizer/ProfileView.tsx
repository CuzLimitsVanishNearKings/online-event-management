import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User as UserIcon, Mail, Phone, Calendar, ShieldCheck, Activity, Save, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Button, Input } from '@/components/ui'
import { format } from 'date-fns'
import axiosClient from '@/api/axiosClient'

export default function ProfileView() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  
  const isLoading = false
  const isError = false

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [bio, setBio] = useState('')
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
      setPhone(user.phoneNumber || '')
      setCompany('Acme Events Co.') // Simulated data for organizer profile
      setBio('We organize the best tech and music events in the city.') // Simulated data
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

  const handlePasswordUpdate = () => {
    setIsPasswordSaved(true)
    setTimeout(() => {
      setIsPasswordSaved(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }, 3000)
  }

  if (isLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    )
  }

  const role = user?.role?.toUpperCase() || 'ORGANIZER'
  const status = user?.status || 'Active'
  const joinedDate = user?.registrationDate || user?.createdAt || new Date().toISOString()
  
  let formattedDate = 'Unknown Date'
  try {
    if (joinedDate) {
      const dateVal = Array.isArray(joinedDate) 
        ? new Date(joinedDate[0], joinedDate[1] - 1, joinedDate[2])
        : new Date(joinedDate)
      
      if (!isNaN(dateVal.getTime())) {
        formattedDate = format(dateVal, 'MMMM do, yyyy')
      }
    }
  } catch (e) {
    console.error("Date formatting error:", e)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8"
    >
      <div>
        <button 
          onClick={() => navigate('/organizer/dashboard')}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors font-bold text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight mb-2">Organizer Profile</h1>
        <p className="text-text-muted font-medium">Manage your organization details and payout information.</p>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-bold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Could not sync with server. Showing cached profile data. Backend returned error.
        </div>
      )}

      {/* Profile Details */}
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center relative group overflow-hidden">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-12 h-12 text-primary" />
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-xs font-bold text-center px-2">Upload Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-text-primary">{name || 'Organizer'}</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="px-3 py-1 bg-surface text-primary text-xs font-bold rounded-full inline-flex items-center gap-1 uppercase tracking-widest">
                   <ShieldCheck className="w-3 h-3" /> {role}
                </span>
              </div>
              <p className="text-xs font-bold text-green-600 mt-2 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></span>
                {status} since {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Organization / Full Name" 
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
                label="Company Website" 
                type="url"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <div className="md:col-span-2 space-y-1.5">
                 <label className="block text-sm font-bold text-text-primary">Organization Bio</label>
                 <textarea 
                   value={bio}
                   onChange={(e) => setBio(e.target.value)}
                   rows={4}
                   className="w-full px-4 py-3 rounded-md border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm font-medium"
                 />
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-end">
              <Button onClick={handleSave} variant="primary" className="rounded-md px-8 font-bold gap-2">
                <Save className="w-4 h-4" />
                {isSaved ? 'Saved!' : 'Save Details'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3 bg-gray-50/30">
          <Shield className="w-5 h-5 text-text-muted" />
          <h2 className="text-lg font-bold text-text-primary">Security & Password</h2>
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
