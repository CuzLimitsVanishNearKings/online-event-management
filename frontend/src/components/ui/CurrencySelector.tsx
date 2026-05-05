import { useState, useEffect } from 'react'
import { Currency, getPopularCurrencies, getOtherCurrencies, getCurrencyByCode } from '../../types'
import { formatPrice, detectUserCurrency } from '../../utils/currency'
import { useLocationStore } from '../../store/locationStore'

interface CurrencySelectorProps {
  className?: string
  showFlag?: boolean
  compact?: boolean
}

const CurrencySelector = ({ className = '', showFlag = false, compact = false }: CurrencySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { preferredCurrency, setPreferredCurrency } = useLocationStore()
  
  const popularCurrencies = getPopularCurrencies()
  const otherCurrencies = getOtherCurrencies()
  
  // Filter currencies based on search
  const filteredPopular = popularCurrencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const filteredOther = otherCurrencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.currency-selector')) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCurrencySelect = (currency: Currency) => {
    setPreferredCurrency(currency)
    setIsOpen(false)
    setSearchTerm('')
  }

  const displayPrice = formatPrice(100, preferredCurrency) // Show sample price

  // Currency flag emojis (simplified - in real app you'd use proper flag images)
  const getFlagEmoji = (code: string): string => {
    const flagMap: { [key: string]: string } = {
      'USD': '🇺🇸',
      'EUR': '🇪🇺',
      'GBP': '🇬🇧',
      'JPY': '🇯🇵',
      'CAD': '🇨🇦',
      'AUD': '🇦🇺',
      'CHF': '🇨🇭',
      'CNY': '🇨🇳',
      'INR': '🇮🇳',
      'NGN': '🇳🇬',
      'ZAR': '🇿🇦',
      'KES': '🇰🇪',
    }
    return flagMap[code] || '🌍'
  }

  return (
    <div className={`currency-selector relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-surface transition-colors duration-200 ${
          compact ? 'px-2 py-1 text-sm' : ''
        }`}
      >
        {showFlag && (
          <span className="text-lg">{getFlagEmoji(preferredCurrency.code)}</span>
        )}
        <span className="font-medium text-text-primary">
          {preferredCurrency.code}
        </span>
        {!compact && (
          <span className="text-text-secondary text-sm">
            ({displayPrice})
          </span>
        )}
        <svg 
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <svg 
                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search currency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Currency list */}
          <div className="overflow-y-auto max-h-80">
            {/* Popular currencies */}
            {filteredPopular.length > 0 && (
              <div>
                <div className="px-3 py-2 bg-surface/50 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Popular
                </div>
                {filteredPopular.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencySelect(currency)}
                    className={`w-full flex items-center justify-between px-3 py-3 hover:bg-surface transition-colors duration-200 ${
                      preferredCurrency.code === currency.code ? 'bg-primary/10 border-l-2 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {showFlag && (
                        <span className="text-lg">{getFlagEmoji(currency.code)}</span>
                      )}
                      <div className="text-left">
                        <div className="font-medium text-text-primary">
                          {currency.name}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {currency.code}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-text-primary">
                        {formatPrice(100, currency)}
                      </div>
                      {preferredCurrency.code === currency.code && (
                        <div className="text-xs text-primary">
                          ✓ Active
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Other currencies */}
            {filteredOther.length > 0 && (
              <div>
                <div className="px-3 py-2 bg-surface/50 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Other
                </div>
                {filteredOther.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencySelect(currency)}
                    className={`w-full flex items-center justify-between px-3 py-3 hover:bg-surface transition-colors duration-200 ${
                      preferredCurrency.code === currency.code ? 'bg-primary/10 border-l-2 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {showFlag && (
                        <span className="text-lg">{getFlagEmoji(currency.code)}</span>
                      )}
                      <div className="text-left">
                        <div className="font-medium text-text-primary">
                          {currency.name}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {currency.code}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-text-primary">
                        {formatPrice(100, currency)}
                      </div>
                      {preferredCurrency.code === currency.code && (
                        <div className="text-xs text-primary">
                          ✓ Active
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {filteredPopular.length === 0 && filteredOther.length === 0 && (
              <div className="px-3 py-8 text-center text-text-secondary">
                No currencies found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrencySelector
