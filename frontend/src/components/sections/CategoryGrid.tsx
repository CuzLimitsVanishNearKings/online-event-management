import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { 
  Music, Trophy, Monitor, Briefcase, Palette, 
  Utensils, GraduationCap, Theater, HeartPulse, Users,
  ChevronLeft, ChevronRight, Star
} from '../icons'
import { useCategories } from '../../hooks/useCategories'
import { Loader2 } from 'lucide-react'

const CategoryGrid = () => {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)

  const { categories, loading } = useCategories()
  
  const defaultCategories = [
    { id: 'music', name: 'Music', icon: <Music className="w-4 h-4" /> },
    { id: 'sports', name: 'Sports', icon: <Trophy className="w-4 h-4" /> },
    { id: 'tech', name: 'Tech', icon: <Monitor className="w-4 h-4" /> },
    { id: 'business', name: 'Business', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'arts', name: 'Arts', icon: <Palette className="w-4 h-4" /> },
    { id: 'food', name: 'Food & Drink', icon: <Utensils className="w-4 h-4" /> },
    { id: 'learn', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'fun', name: 'Entertainment', icon: <Theater className="w-4 h-4" /> },
    { id: 'wellness', name: 'Wellness', icon: <HeartPulse className="w-4 h-4" /> },
    { id: 'social', name: 'Community', icon: <Users className="w-4 h-4" /> },
  ]

  const displayCategories = categories.length > 0 
    ? categories.map(c => ({ id: c.id, name: c.name, icon: <span className="text-sm">{c.icon || '📌'}</span> }))
    : defaultCategories

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 200
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-8 bg-background">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-display font-bold text-text-primary">Browse by category</h2>
          <div className="hidden sm:flex items-center gap-1">
            <button onClick={() => scroll('left')} className="p-1.5 rounded-md border border-border text-text-muted hover:text-text-primary hover:border-text-muted transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')} className="p-1.5 rounded-md border border-border text-text-muted hover:text-text-primary hover:border-text-muted transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Pills */}
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {loading ? (
             <div className="flex items-center justify-center w-full py-4">
               <Loader2 className="w-6 h-6 text-primary animate-spin" />
             </div>
          ) : (
            displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/events?category=${cat.id}`)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-lg whitespace-nowrap text-sm font-medium text-text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex-shrink-0"
              >
                {cat.icon}
                {cat.name}
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
