import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import CurrencySelector from '../ui/CurrencySelector'
import LocationFilter from '../ui/LocationFilter'

const Navbar = () => {
  const { isAuthenticated, user, logoutMutation } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* thoughtful logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xl font-light text-text-primary group-hover:text-primary transition-colors">
              Evento
            </span>
          </Link>

          {/* thoughtful navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/events" 
              className="text-text-secondary hover:text-primary transition-colors font-light"
            >
              discover
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-text-secondary hover:text-primary transition-colors font-light"
            >
              about
            </Link>
          </div>

          {/* Location and Currency selectors */}
          <div className="hidden lg:flex items-center space-x-3">
            <LocationFilter showFlag compact />
            <CurrencySelector showFlag compact />
          </div>

          {/* thoughtful auth */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-text-secondary font-light">
                  hello, {user?.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  loading={logoutMutation.isPending}
                  className="border-primary text-primary hover:bg-primary hover:text-white rounded-full"
                >
                  goodbye
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-border text-text-secondary hover:border-primary hover:text-primary rounded-full">
                    come in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="bg-primary hover:bg-primary-dark text-white rounded-full">
                    join us
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
