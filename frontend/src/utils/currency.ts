import { Currency, CURRENCIES } from '../types'

// Format price with currency symbol
export const formatPrice = (price: number, currency: Currency): string => {
  const convertedPrice = convertPrice(price, currency)
  
  // Handle different formatting rules for different currencies
  switch (currency.code) {
    case 'JPY':
    case 'CNY':
      // No decimal places for these currencies
      return `${currency.symbol}${Math.round(convertedPrice).toLocaleString()}`
    
    case 'NGN':
    case 'KES':
    case 'ZAR':
      // Show 2 decimal places for African currencies
      return `${currency.symbol}${convertedPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    
    default:
      // Standard formatting for other currencies
      return `${currency.symbol}${convertedPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }
}

// Convert price from USD to target currency
export const convertPrice = (price: number, targetCurrency: Currency): number => {
  return price * targetCurrency.rate
}

// Get currency by code
export const getCurrencyByCode = (code: string): Currency | undefined => {
  return CURRENCIES.find(currency => currency.code === code)
}

// Get default currency based on country
export const getDefaultCurrencyForCountry = (countryCode: string): Currency => {
  const countryCurrencyMap: { [key: string]: string } = {
    'US': 'USD',
    'GB': 'GBP',
    'CA': 'CAD',
    'AU': 'AUD',
    'NG': 'NGN',
    'KE': 'KES',
    'ZA': 'ZAR',
    'JP': 'JPY',
    'CN': 'CNY',
    'CH': 'CHF',
  }
  
  const currencyCode = countryCurrencyMap[countryCode] || 'USD'
  return getCurrencyByCode(currencyCode) || CURRENCIES[0] // Default to USD
}

// Calculate price difference percentage
export const calculateDiscountPercentage = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= discountedPrice) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

// Format price range (for events with price ranges)
export const formatPriceRange = (minPrice: number, maxPrice: number, currency: Currency): string => {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency)
  }
  
  const formattedMin = formatPrice(minPrice, currency)
  const formattedMax = formatPrice(maxPrice, currency)
  
  return `${formattedMin} - ${formattedMax}`
}

// Get popular currencies (displayed first in dropdown)
export const getPopularCurrencies = (): Currency[] => {
  return [
    getCurrencyByCode('USD')!,
    getCurrencyByCode('EUR')!,
    getCurrencyByCode('GBP')!,
    getCurrencyByCode('JPY')!,
    getCurrencyByCode('CAD')!,
    getCurrencyByCode('AUD')!,
  ].filter(Boolean)
}

// Get all currencies except popular ones
export const getOtherCurrencies = (): Currency[] => {
  const popularCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
  return CURRENCIES.filter(currency => !popularCodes.includes(currency.code))
}

// Detect user's preferred currency based on browser locale
export const detectUserCurrency = (): Currency => {
  const locale = navigator.language || 'en-US'
  
  // Map common locales to currencies
  const localeCurrencyMap: { [key: string]: string } = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'en-CA': 'CAD',
    'en-AU': 'AUD',
    'fr-FR': 'EUR',
    'de-DE': 'EUR',
    'es-ES': 'EUR',
    'it-IT': 'EUR',
    'ja-JP': 'JPY',
    'zh-CN': 'CNY',
    'en-NG': 'NGN',
    'en-KE': 'KES',
    'en-ZA': 'ZAR',
  }
  
  const currencyCode = localeCurrencyMap[locale] || 'USD'
  return getCurrencyByCode(currencyCode) || CURRENCIES[0]
}

// Validate currency code
export const isValidCurrencyCode = (code: string): boolean => {
  return CURRENCIES.some(currency => currency.code === code)
}

// Convert currency amount between any two currencies
export const convertBetweenCurrencies = (
  amount: number, 
  fromCurrency: Currency, 
  toCurrency: Currency
): number => {
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromCurrency.rate
  return usdAmount * toCurrency.rate
}
