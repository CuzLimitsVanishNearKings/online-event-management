import { useNavigate, useRouteError } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'

export default function NotFoundView() {
  const error: any = useRouteError()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <h1 className="text-9xl font-black text-primary">404</h1>
          </div>
          <div className="relative pt-12 pb-4">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-text-primary">Page Not Found</h2>
            <p className="text-text-muted mt-2">
              {error?.statusText || error?.message || "We couldn't find the page you were looking for. It might have been removed, renamed, or didn't exist in the first place."}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="rounded-xl border-border font-bold text-text-secondary bg-white gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="rounded-xl font-bold gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
