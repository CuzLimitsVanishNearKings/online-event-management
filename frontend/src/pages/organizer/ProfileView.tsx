import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User as UserIcon, Mail, Phone, Calendar, ShieldCheck, Activity } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui'
import { format } from 'date-fns'

export default function ProfileView() {
  const navigate = useNavigate()
  const { user, profileQuery } = useAuth()
  
  const isLoading = profileQuery.isLoading
  const isError = profileQuery.isError

  if (isLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    )
  }

  // Using real data from user profile, with fallbacks for UI presentation
  const profileData = {
    name: user?.name || 'Unknown',
    email: user?.email || 'N/A',
    phone: user?.phoneNumber || 'Not provided',
    role: user?.role?.toUpperCase() || 'ORGANIZER',
    status: user?.status || 'Active',
    joined: user?.registrationDate || user?.createdAt || new Date().toISOString()
  }

  let formattedDate = 'Unknown Date'
  try {
    if (profileData.joined) {
      // Handle potential Java array formats or standard ISO strings
      const dateVal = Array.isArray(profileData.joined) 
        ? new Date(profileData.joined[0], profileData.joined[1] - 1, profileData.joined[2])
        : new Date(profileData.joined)
      
      if (!isNaN(dateVal.getTime())) {
        formattedDate = format(dateVal, 'MMMM do, yyyy')
      }
    }
  } catch (e) {
    console.error("Date formatting error:", e)
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <button 
          onClick={() => navigate('/organizer/dashboard')}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors font-bold text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight mb-2">My Profile</h1>
        <p className="text-text-muted font-medium">View your personal information and account details.</p>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Could not sync with server. Showing cached profile data. Backend returned 500.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-surface/30 px-8 py-6 border-b border-border flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 text-primary-dark rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/10">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-text-primary">{profileData.name}</h2>
            <p className="text-sm font-bold text-primary mt-1 tracking-wider">{profileData.role}</p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-muted mb-1.5">
                <UserIcon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Full Name</span>
              </div>
              <p className="text-lg font-bold text-text-primary">{profileData.name}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-muted mb-1.5">
                <Mail className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Email Address</span>
              </div>
              <p className="text-lg font-bold text-text-primary">{profileData.email}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-muted mb-1.5">
                <Phone className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Phone Number</span>
              </div>
              <p className="text-lg font-bold text-text-primary">{profileData.phone}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-muted mb-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Role</span>
              </div>
              <p className="text-lg font-bold text-text-primary">{profileData.role}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-muted mb-1.5">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Account Status</span>
              </div>
              <p className="text-lg font-bold text-green-700 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></span>
                {profileData.status}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-muted mb-1.5">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Registration Date</span>
              </div>
              <p className="text-lg font-bold text-text-primary">{formattedDate}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
