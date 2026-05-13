import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import { 
  Search, 
  Menu, 
  X, 
  User, 
  ChevronDown,
  LogOut,
  Plus,
  Ticket,
  Heart,
  LayoutDashboard,
  Calendar
} from '../icons'
import { cn } from '../../utils/cn'

const Navbar = () => {
  const { isAuthenticated, user, logoutMutation } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logoutMutation.mutate()
    setIsMobileMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const navLinks = [
    { path: '/events', label: 'Find Events' },
    { path: '/events/new', label: 'Create Events' },
  ]

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white border-b border-border shadow-nav" : "bg-white border-b border-transparent"
    )}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <img src="/05_evento-horizontal.svg" alt="Evento" className="h-8 w-auto" />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 text-sm font-bold rounded-lg transition-colors",
                    location.pathname.startsWith(item.path)
                      ? "text-primary bg-primary/5"
                      : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex items-center bg-gray-50 border border-border rounded-xl px-4 py-2.5 hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <Search className="w-4 h-4 text-text-muted mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="bg-transparent border-none p-0 text-sm font-medium focus:ring-0 w-full placeholder:text-text-muted"
                />
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button className="hidden sm:flex p-2.5 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <Heart className="w-5 h-5" />
                </button>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-border transition-all">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-text-muted mr-1" />
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 overflow-hidden z-50">
                    <div className="px-6 py-5 bg-gray-50/50 border-b border-border">
                      <p className="text-sm font-bold text-text-primary">{user?.name}</p>
                      <p className="text-xs text-text-muted font-medium truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      {(user?.role === 'ORGANIZER' || user?.role === 'organizer' || user?.role === 'ROLE_ORGANIZER' || user?.role === 'admin') && (
                        <Link to="/organizer/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-secondary hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                          <LayoutDashboard className="w-4 h-4" /> Organizer Dashboard
                        </Link>
                      )}
                      <Link to="/events" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-secondary hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                        <Calendar className="w-4 h-4" /> Discover Events
                      </Link>
                      <div className="border-t border-border my-2 mx-2" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
                  Log In
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="md" className="font-bold rounded-xl px-6">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-text-secondary hover:text-text-primary rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-border">
          <div className="container-custom py-4 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-gray-50 border border-border rounded-lg px-3 py-2.5">
                <Search className="w-4 h-4 text-text-muted mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events"
                  className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full"
                />
              </div>
            </form>
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-primary rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-3 border-t border-border space-y-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-center px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:border-primary transition-colors">
                  Log In
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block text-center px-4 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
