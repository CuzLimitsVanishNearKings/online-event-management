import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail } from '../icons'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const sections = [
    {
      title: 'Discover',
      links: [
        { label: 'All Events', path: '/events' },
        { label: 'Online Experiences', path: '/events?type=online' },
        { label: 'Free Workshops', path: '/events?price=free' },
        { label: 'Today\'s Events', path: '/events?time=today' },
      ]
    },
    {
      title: 'Host',
      links: [
        { label: 'List your Event', path: '/register' },
        { label: 'Event Planning', path: '/planning' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'Organizer Help', path: '/help' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press', path: '/press' },
        { label: 'Contact Support', path: '/help' },
      ]
    }
  ]

  return (
    <footer className="bg-text-primary text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-base">E</span>
              </div>
              <span className="text-xl font-display font-bold">Evento</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              Discover and host unforgettable experiences. The world's most trusted event marketplace for individuals and organizations.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-white/40 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-white/40 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-white/40 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-white/40 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-white/50 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">© {currentYear} Evento. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link to="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-white/60 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
