import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { useEffect, useState } from 'react'

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Animated background with parallax effect */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-background via-surface/20 to-background"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        ></div>
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-sage/10 rounded-full blur-3xl animate-float"></div>
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center space-y-12">
          {/* Animated opening element */}
          <div 
            className={`inline-block transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="flex items-center space-x-3 px-6 py-3 bg-surface/80 backdrop-blur-sm border border-border rounded-full hover:bg-surface transition-colors duration-300">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-text-secondary">
                ✨ Where good times happen
              </span>
            </div>
          </div>

          {/* Animated heading with stagger effect */}
          <div className="space-y-6">
            <h1 
              className={`text-6xl md:text-7xl lg:text-8xl font-light leading-tight text-text-primary transform transition-all duration-1200 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <span className="block">Life's too short</span>
              <span className="block font-medium text-primary mt-2">for boring events</span>
            </h1>
            <p 
              className={`text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-light transform transition-all duration-1000 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              We're all about creating moments that matter. 
              <span className="block text-text-primary mt-3 font-normal">
                The kind you'll actually want to remember.
              </span>
            </p>
          </div>

          {/* Animated CTA buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-1000 delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <Link to="/events">
              <Button 
                variant="primary" 
                size="lg" 
                className="px-10 py-4 text-lg font-medium bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 group"
              >
                <span className="flex items-center gap-2">
                  Find what's happening
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-10 py-4 text-lg font-medium border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
              >
                Create your own
              </Button>
            </Link>
          </div>

          {/* Animated stats with counter effect */}
          <div 
            className={`grid grid-cols-3 gap-12 max-w-3xl mx-auto pt-16 transform transition-all duration-1000 delay-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="text-center group">
              <div className="text-4xl font-light text-text-primary mb-2 group-hover:text-primary transition-colors duration-300">
                <span className="counter">2,847</span>
              </div>
              <div className="text-sm text-text-secondary font-light">awesome events</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-light text-text-primary mb-2 group-hover:text-primary transition-colors duration-300">
                <span className="counter">18.2k</span>
              </div>
              <div className="text-sm text-text-secondary font-light">happy people</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-light text-text-primary mb-2 group-hover:text-primary transition-colors duration-300">
                <span className="counter">4.9</span>
                <span className="text-2xl">⭐</span>
              </div>
              <div className="text-sm text-text-secondary font-light">average rating</div>
            </div>
          </div>

          {/* Enhanced scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center space-y-2 text-text-secondary">
              <div className="text-xs font-light">scroll for more</div>
              <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-scroll"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes scroll {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.5; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default HeroSection
