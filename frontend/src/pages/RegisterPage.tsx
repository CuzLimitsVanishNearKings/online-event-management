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

const RegisterPage = ({ isOrganizer = false }: { isOrganizer?: boolean }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { registerAsync, registerOrganizerAsync, isAuthenticated, isLoading, error, clearError, user } = useAuthStore()

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isOrganizer) {
        await registerOrganizerAsync({ firstName, lastName, email, password, organizationName })
      } else {
        await registerAsync({ firstName, lastName, email, password })
      }
    } catch (err) {
      // Error is handled in the store
    }
  }

  if (isAuthenticated) {
    if (user?.role === 'ORGANIZER' || user?.role === 'organizer' || user?.role === 'ROLE_ORGANIZER' || user?.role === 'admin' || isOrganizer) {
      return <Navigate to="/organizer/dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return (
    <AuthLayout 
      title={isOrganizer ? "Become an Organizer" : "Create Account"}
      subtitle={
        isOrganizer 
          ? "Host events, sell tickets, and manage your community on a premium platform."
          : "Join a community of thousands. Whether you're here to discover experiences or host your own, your journey starts here."
      }
    >
      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit} 
        className="space-y-5"
      >
         <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="rounded-2xl bg-surface/50 border-border focus:bg-white transition-colors"
            />
            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="rounded-2xl bg-surface/50 border-border focus:bg-white transition-colors"
            />
         </motion.div>

         {isOrganizer && (
           <motion.div variants={itemVariants}>
             <Input
               label="Organization Name"
               type="text"
               placeholder="Acme Events Ltd."
               value={organizationName}
               onChange={(e) => setOrganizationName(e.target.value)}
               required
               className="rounded-2xl bg-surface/50 border-border focus:bg-white transition-colors"
             />
           </motion.div>
         )}

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

         <motion.p variants={itemVariants} className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-relaxed pt-2">
            By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
         </motion.p>

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
             {isLoading ? 'Creating account...' : 'Create Account'}
           </Button>
         </motion.div>

         <motion.div variants={itemVariants} className="relative pt-6">
            <div className="absolute inset-0 flex items-center pt-6">
               <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
               <span className="bg-white px-4 text-text-muted">Or join with</span>
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
               Already have an account?{' '}
               <Link to={isOrganizer ? "/organizer/login" : "/login"} className="text-primary font-bold hover:underline underline-offset-4">
                  Sign In
               </Link>
            </p>
            <div className="border-t border-border/60 my-2" />
            <p className="text-center text-text-muted font-medium">
               {isOrganizer ? "Just looking to attend?" : "Want to host events?"}{' '}
               <Link to={isOrganizer ? "/register" : "/organizer/register"} className="text-text-primary font-bold hover:underline underline-offset-4">
                  {isOrganizer ? "Sign up as Attendee" : "Sign up as Organizer"}
               </Link>
            </p>
         </motion.div>
      </motion.form>
    </AuthLayout>
  )
}

export default RegisterPage
