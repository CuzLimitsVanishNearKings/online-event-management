import { ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, ArrowLeft } from '../icons'
import { cn } from '../../utils/cn'

import concertImg from '../../assets/images/auth/concert.png'
import speakerImg from '../../assets/images/auth/speaker.png'
import networkingImg from '../../assets/images/auth/networking.png'

const SCENES = [
  {
    id: 'concert',
    image: concertImg,
    title: 'Experience the Energy',
    subtitle: 'Join thousands of attendees at premium live events.',
  },
  {
    id: 'speaker',
    image: speakerImg,
    title: 'Inspire and Connect',
    subtitle: 'Host thought-provoking sessions and scale your reach.',
  },
  {
    id: 'networking',
    image: networkingImg,
    title: 'Build Meaningful Networks',
    subtitle: 'Curate exclusive spaces for professionals to thrive.',
  }
]

export default function AuthLayout({ children, title, subtitle }: { children: ReactNode, title: string, subtitle: string }) {
  const [currentScene, setCurrentScene] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % SCENES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:right-8 md:left-auto z-50 flex items-center gap-2 text-white md:text-text-muted hover:text-white md:hover:text-primary transition-colors font-bold text-sm uppercase tracking-wider mix-blend-difference md:mix-blend-normal"
      >
         <ArrowLeft className="w-4 h-4" />
         Back to Store
      </Link>

      {/* Left: Animated Scene */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative items-center justify-center overflow-hidden bg-[#1A1A1A]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/20 z-10 mix-blend-multiply" />
            <img 
              src={SCENES[currentScene].image} 
              alt="Event Scene" 
              className="w-full h-full object-cover object-center"
            />
            
            {/* Overlay Gradient for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute bottom-20 left-12 right-12 lg:left-20 lg:right-20 z-20 text-white"
            >
               <h2 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4 drop-shadow-lg text-white">
                 {SCENES[currentScene].title}
               </h2>
               <p className="text-xl text-white/80 font-medium">
                 {SCENES[currentScene].subtitle}
               </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        {/* Progress Indicators */}
        <div className="absolute bottom-8 left-12 lg:left-20 z-30 flex gap-3">
           {SCENES.map((_, idx) => (
             <div key={idx} className="h-1.5 rounded-full bg-white/20 overflow-hidden" style={{ width: idx === currentScene ? '48px' : '24px', transition: 'width 0.5s ease' }}>
                {idx === currentScene && (
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                  />
                )}
             </div>
           ))}
        </div>
      </div>

      {/* Right: Auth Form Container */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-20 bg-white relative overflow-y-auto">
         {/* Decorative blobs for depth */}
         <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
         <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
         
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
           className="w-full max-w-md mx-auto space-y-8 relative z-10"
         >
            {/* Logo */}
            <div className="flex flex-col gap-6 mb-8">
               <Link to="/" className="flex items-center gap-2 group w-max">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-primary/20">
                     <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-display font-bold text-text-primary">Evento</span>
               </Link>
               <div>
                 <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">{title}</h1>
                 <p className="text-text-muted mt-3 text-lg leading-relaxed">{subtitle}</p>
               </div>
            </div>

            {children}
            
         </motion.div>
      </div>
    </div>
  )
}
