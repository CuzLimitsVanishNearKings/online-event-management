import { cn } from '../../utils/cn'
import { Search, Calendar, Ticket } from '../icons'

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Discover',
      description: 'Browse thousands of events by category, date, or location.',
    },
    {
      icon: Ticket,
      title: 'Book',
      description: 'Secure your tickets instantly with our simple checkout.',
    },
    {
      icon: Calendar,
      title: 'Attend',
      description: 'Show up and enjoy an unforgettable experience.',
    },
  ]

  return (
    <section className="section-padding bg-white border-t border-border/50">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary">
            How Evento works
          </h2>
          <p className="text-sm text-text-muted mt-2 max-w-md mx-auto">
            Finding and attending events has never been easier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-xs font-bold text-primary mb-1">Step {index + 1}</div>
              <h3 className="text-lg font-display font-bold text-text-primary mb-2">{step.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
