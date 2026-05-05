import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const steps = [
    {
      id: 1,
      title: "Find your vibe",
      description: "Browse events that match your interests. From chill hangouts to epic parties.",
      icon: "🔍",
      color: "from-purple-400 to-pink-400"
    },
    {
      id: 2,
      title: "Join the fun",
      description: "Book your spot in seconds. Easy checkout, instant confirmation.",
      icon: "🎫",
      color: "from-blue-400 to-cyan-400"
    },
    {
      id: 3,
      title: "Make memories",
      description: "Show up, have fun, meet awesome people. That's it, really.",
      icon: "✨",
      color: "from-yellow-400 to-orange-400"
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-surface/20">
      <div className="max-w-7xl mx-auto">
        {/* Animated Section Header */}
        <div 
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <span className="text-sm font-medium text-accent">how it works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-text-primary mb-4">
            <span className="block">Good times are</span>
            <span className="block font-medium text-accent">just three clicks away</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            No complicated forms, no hidden fees. Just simple, fun events.
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(-1)}
            >
              <div className={`group relative p-8 bg-card border-2 ${
                activeStep === index ? 'border-primary shadow-xl shadow-primary/20' : 'border-border'
              } rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer`}>
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.id}
                </div>
                
                {/* Icon */}
                <div className={`text-6xl mb-6 transform transition-all duration-300 ${
                  activeStep === index ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
                }`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>
                
                {/* Animated underline */}
                <div className={`mt-4 h-1 bg-gradient-to-r ${step.color} transform transition-all duration-300 ${
                  activeStep === index ? 'scale-x-100' : 'scale-x-0'
                }`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div 
          className={`text-center transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
            <h3 className="text-2xl font-light text-text-primary mb-4">
              Ready to dive in?
            </h3>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Your next favorite memory is waiting. Don't let FOMO win.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events">
                <button className="group btn-interactive inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
                  Start exploring
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
              <Link to="/register">
                <button className="px-8 py-4 border-2 border-accent text-accent rounded-full font-medium hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105">
                  Create an event
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
