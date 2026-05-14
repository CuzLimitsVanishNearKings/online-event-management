import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { Button, Input } from '../components/ui'
import { Eye, EyeOff, Github, Globe, AlertCircle } from '../components/icons'
import AuthLayout from '../components/layout/AuthLayout'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
}

const LoginPage = ({ isOrganizer = false }: { isOrganizer?: boolean }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { loginAsync, isAuthenticated, isLoading, error, clearError, user } = useAuthStore()

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginAsync({ email, password })
    } catch (err) {
      // Error is handled in the store
    }
  }

  if (isAuthenticated) {
    if (user?.role === 'ORGANIZER' || user?.role === 'organizer' || user?.role === 'ROLE_ORGANIZER' || user?.role === 'admin' || isOrganizer) {
      return <Navigate to="/organizer/dashboard" replace />
    }
    return <Navigate to="/attendee/dashboard" replace />
  }

  return (
    <AuthLayout 
      title={isOrganizer ? "Organizer Portal" : "Welcome Back"}
      subtitle={
        isOrganizer 
          ? "Sign in to manage your events, analyze performance, and grow your business." 
          : "Sign in to manage your tickets, host your next event, and connect with your audience."
      }
    >
      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit} 
        className="space-y-6"
      >
         <motion.div variants={itemVariants}>
           <Input
             label="Email Address"
             type="email"
             placeholder="name@example.com"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             className="rounded-2xl bg-surface/50 border-border focus:bg-white transition-colors"
           />
         </motion.div>

         <motion.div variants={itemVariants} className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-2xl bg-surface/50 border-border focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-text-muted hover:text-text-primary transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
         </motion.div>

         <motion.div variants={itemVariants} className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
               <div className="relative flex items-center justify-center">
                 <input type="checkbox" className="peer sr-only" />
                 <div className="w-5 h-5 rounded-md border-2 border-border peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                   <motion.svg 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" 
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                   >
                     <polyline points="20 6 9 17 4 12"></polyline>
                   </motion.svg>
                 </div>
               </div>
               <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
            </label>
            <Link to="/forgot-password" size="sm" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
               Forgot password?
            </Link>
         </motion.div>

         {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600"
            >
               <AlertCircle className="w-5 h-5 flex-shrink-0" />
               <p className="text-sm font-bold">{error}</p>
            </motion.div>
         )}

         <motion.div variants={itemVariants} className="pt-4">
           <Button
             type="submit"
             variant="primary"
             size="lg"
             className="w-full rounded-2xl py-7 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-shadow"
             loading={isLoading}
           >
             {isLoading ? 'Signing in...' : 'Sign In'}
           </Button>
         </motion.div>

         <motion.div variants={itemVariants} className="relative pt-6">
            <div className="absolute inset-0 flex items-center pt-6">
               <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
               <span className="bg-white px-4 text-text-muted">Or continue with</span>
            </div>
         </motion.div>

         <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-border/60 rounded-2xl hover:bg-surface hover:border-border transition-all font-bold text-sm text-text-primary">
               <Github className="w-5 h-5" />
               GitHub
            </button>
            <button type="button" className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-border/60 rounded-2xl hover:bg-surface hover:border-border transition-all font-bold text-sm text-text-primary">
               <Globe className="w-5 h-5" />
               Google
            </button>
         </motion.div>

         <motion.div variants={itemVariants} className="flex flex-col gap-2 pt-4">
            <p className="text-center text-text-muted font-medium">
               Don't have an account?{' '}
               <Link to={isOrganizer ? "/organizer/register" : "/register"} className="text-primary font-bold hover:underline underline-offset-4">
                  Create account
               </Link>
            </p>
            <div className="border-t border-border/60 my-2" />
            <p className="text-center text-text-muted font-medium">
               {isOrganizer ? "Looking to attend events?" : "Are you an organizer?"}{' '}
               <Link to={isOrganizer ? "/login" : "/organizer/login"} className="text-text-primary font-bold hover:underline underline-offset-4">
                  {isOrganizer ? "Sign in as Attendee" : "Sign in to Organizer Portal"}
               </Link>
            </p>
         </motion.div>
      </motion.form>
    </AuthLayout>
  )
}

export default LoginPage
