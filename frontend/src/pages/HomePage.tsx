import HeroSection from '@/components/sections/HeroSection'
import CategoryGrid from '@/components/sections/CategoryGrid'
import HowItWorks from '@/components/sections/HowItWorks'
import EventRecommendations from '@/components/sections/EventRecommendations'
import FeaturedEvents from '@/components/sections/FeaturedEvents'

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <HowItWorks />
      <EventRecommendations />
      <FeaturedEvents />
    </div>
  )
}

export default HomePage
