import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { useState, useEffect } from 'react'

const CategoryGrid = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const categories = [
    { id: 'music', name: 'Music', icon: '🎵', color: 'from-purple-400 to-pink-400' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'from-green-400 to-blue-400' },
    { id: 'technology', name: 'Tech', icon: '💻', color: 'from-blue-400 to-cyan-400' },
    { id: 'business', name: 'Business', icon: '💼', color: 'from-gray-600 to-gray-800' },
    { id: 'arts', name: 'Arts', icon: '🎨', color: 'from-orange-400 to-red-400' },
    { id: 'food-drink', name: 'Food', icon: '🍽️', color: 'from-yellow-400 to-orange-400' },
    { id: 'education', name: 'Learn', icon: '📚', color: 'from-indigo-400 to-purple-400' },
    { id: 'entertainment', name: 'Fun', icon: '🎭', color: 'from-pink-400 to-purple-400' },
    { id: 'health-wellness', name: 'Wellness', icon: '🧘', color: 'from-green-400 to-teal-400' },
    { id: 'social', name: 'Social', icon: '👥', color: 'from-blue-400 to-purple-400' },
  ]

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/events?category=${categoryId}`)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-surface/20 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Animated Section Header */}
        <div 
          className={`text-center mb-12 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">explore your vibe</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-text-primary mb-4">
            <span className="block">Find what</span>
            <span className="block font-medium text-primary">moves you</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Whatever you're into, we've got something that'll make your week.
          </p>
        </div>
        
        {/* Mobile: Enhanced Horizontal scroll */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex flex-col items-center gap-3 px-6 py-4 bg-card border border-border rounded-2xl whitespace-nowrap transition-all duration-300 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className={`text-3xl transform transition-all duration-300 ${
                  hoveredCategory === category.id ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
                }`}>
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {category.name}
                </span>
                {hoveredCategory === category.id && (
                  <div className="w-8 h-1 bg-primary rounded-full transform transition-all duration-300"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Enhanced Grid with animations */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`group relative flex flex-col items-center gap-4 p-8 bg-card border border-border rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/10 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Icon with enhanced hover effect */}
              <div className={`relative text-5xl transform transition-all duration-500 ${
                hoveredCategory === category.id ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
              }`}>
                {category.icon}
                {/* Glow effect on hover */}
                {hoveredCategory === category.id && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 blur-xl rounded-full`}></div>
                )}
              </div>
              
              <span className="text-base font-medium text-text-primary text-center relative z-10">
                {category.name}
              </span>
              
              {/* Animated underline */}
              <div className={`w-full h-0.5 bg-gradient-to-r ${category.color} transform transition-all duration-300 ${
                hoveredCategory === category.id ? 'scale-x-100' : 'scale-x-0'
              }`}></div>
              
              {/* Floating particles on hover */}
              {hoveredCategory === category.id && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="absolute top-8 right-6 w-1 h-1 bg-accent rounded-full animate-pulse delay-75"></div>
                  <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-sage rounded-full animate-pulse delay-150"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Call to action */}
        <div 
          className={`mt-16 text-center transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="text-text-secondary mb-6">
            Can't find what you're looking for?
          </p>
          <button 
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
          >
            Browse all events
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
