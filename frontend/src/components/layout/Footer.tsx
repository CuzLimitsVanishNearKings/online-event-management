import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-xl font-light text-text-primary">
                Evento
              </span>
            </div>
            <p className="text-text-secondary font-light text-sm">
              Creating memorable events and bringing people together.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-text-primary font-light mb-4">discover</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-text-secondary hover:text-primary transition-colors font-light text-sm">
                  events
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-text-secondary hover:text-primary transition-colors font-light text-sm">
                  about
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-text-primary font-light mb-4">legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors font-light text-sm">
                  privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors font-light text-sm">
                  terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50">
          <p className="text-center text-text-secondary font-light text-sm">
            © 2024 Gather. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
