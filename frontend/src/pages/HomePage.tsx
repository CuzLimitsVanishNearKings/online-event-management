import { Link } from 'react-router-dom'
import HeroSection from '../components/sections/HeroSection'
import CategoryGrid from '../components/sections/CategoryGrid'
import HowItWorks from '../components/sections/HowItWorks'
import EventCard from '../components/events/EventCard'


import { Button } from '../components/ui'
import { useEvents } from '../hooks/useEvents'
import { useState, useEffect } from 'react'
import { ArrowRight, Sparkles, TrendingUp } from '../components/icons'
import { cn } from '../utils/cn'

const HomePage = () => {
  const { events, loading } = useEvents(undefined, 6)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Trending Events Section */}
      <section className="section-padding overflow-hidden">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-4">
                 <TrendingUp className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-wider">Hot right now</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary tracking-tight">
                Trending <span className="text-primary italic">Events</span>
              </h2>
              <p className="text-lg text-text-muted mt-4">Discover the most popular experiences happening now</p>
            </div>
            <Link 
              to="/events"
              className="group flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            >
              View all events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white border border-border rounded-md overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-gray-50" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-50 rounded-full w-1/4" />
                    <div className="h-6 bg-gray-50 rounded-lg w-3/4" />
                    <div className="h-4 bg-gray-50 rounded-lg w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              events.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoryGrid />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* CTA Section */}
      <section className="section-padding bg-text-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 skew-x-12 translate-x-1/2" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-primary font-bold text-xs uppercase tracking-widest">
               <Sparkles className="w-4 h-4" />
               Join the platform
            </div>
            <h2 className="text-4xl md:text-7xl font-display font-bold text-white tracking-tight leading-tight">
              Ready to create <br />
              <span className="text-gradient">unforgettable</span> experiences?
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Join thousands of organizers who trust Evento to bring their visions to life. 
              One account for everything you do.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <Link to="/register">
                <Button size="lg" className="rounded-md px-12 py-7 text-lg font-bold shadow-xl shadow-primary/20">
                  Start Creating Now
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/5 rounded-md px-12">
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

