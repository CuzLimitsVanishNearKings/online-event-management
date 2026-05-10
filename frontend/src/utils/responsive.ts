import { useState, useEffect } from 'react'

// Responsive breakpoints and utilities
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
  
  // Max-width queries
  'max-sm': `(max-width: ${breakpoints.sm})`,
  'max-md': `(max-width: ${breakpoints.md})`,
  'max-lg': `(max-width: ${breakpoints.lg})`,
  'max-xl': `(max-width: ${breakpoints.xl})`,
  'max-2xl': `(max-width: ${breakpoints['2xl']})`,
  
  // Range queries
  'sm-md': `(min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`,
  'md-lg': `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  'lg-xl': `(min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl})`,
}

// Responsive class utilities
export const responsiveClasses = {
  // Grid layouts
  grid: {
    '1': 'grid-cols-1',
    '2': 'grid-cols-2',
    '3': 'grid-cols-3',
    '4': 'grid-cols-4',
    '5': 'grid-cols-5',
    '6': 'grid-cols-6',
  },
  
  // Flex layouts
  flex: {
    'row': 'flex-row',
    'col': 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  },
  
  // Spacing
  spacing: {
    '0': 'p-0 m-0',
    '1': 'p-1 m-1',
    '2': 'p-2 m-2',
    '3': 'p-3 m-3',
    '4': 'p-4 m-4',
    '5': 'p-5 m-5',
    '6': 'p-6 m-6',
    '8': 'p-8 m-8',
    '10': 'p-10 m-10',
  },
  
  // Text sizes
  text: {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  },
  
  // Component sizes
  component: {
    'xs': 'w-8 h-8',
    'sm': 'w-10 h-10',
    'md': 'w-12 h-12',
    'lg': 'w-16 h-16',
    'xl': 'w-20 h-20',
    '2xl': 'w-24 h-24',
  },
}

// Hook for responsive behavior
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowSize.width < 768
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024
  const isDesktop = windowSize.width >= 1024
  const isLargeDesktop = windowSize.width >= 1280

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoint: 
      windowSize.width < 640 ? 'xs' :
      windowSize.width < 768 ? 'sm' :
      windowSize.width < 1024 ? 'md' :
      windowSize.width < 1280 ? 'lg' :
      windowSize.width < 1536 ? 'xl' : '2xl',
  }
}

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Lazy loading utilities
export const lazyLoad = (callback: () => void, options?: IntersectionObserverInit) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback()
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    }
  )

  return observer
}

// Image optimization utilities
export const getOptimizedImageUrl = (
  url: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  // This is a placeholder - implement based on your image CDN/service
  if (!url) return ''
  
  const params = new URLSearchParams()
  if (width) params.append('w', width.toString())
  if (height) params.append('h', height.toString())
  params.append('q', quality.toString())
  
  const paramString = params.toString()
  return paramString ? `${url}?${paramString}` : url
}

// Touch detection
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  )
}

// Viewport utilities
export const getViewportHeight = (): number => {
  if (typeof window === 'undefined') return 0
  return window.innerHeight
}

export const getViewportWidth = (): number => {
  if (typeof window === 'undefined') return 0
  return window.innerWidth
}

// Scroll utilities
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, behavior })
}

export const scrollToElement = (
  elementId: string,
  offset: number = 0,
  behavior: ScrollBehavior = 'smooth'
) => {
  if (typeof document === 'undefined') return
  const element = document.getElementById(elementId)
  if (element) {
    const top = element.offsetTop - offset
    window.scrollTo({ top, behavior })
  }
}

// Animation utilities
export const fadeIn = (element: HTMLElement, duration: number = 300) => {
  element.style.opacity = '0'
  element.style.transition = `opacity ${duration}ms ease-in-out`
  
  requestAnimationFrame(() => {
    element.style.opacity = '1'
  })
}

export const fadeOut = (element: HTMLElement, duration: number = 300) => {
  element.style.transition = `opacity ${duration}ms ease-in-out`
  
  requestAnimationFrame(() => {
    element.style.opacity = '0'
  })
  
  setTimeout(() => {
    element.style.display = 'none'
  }, duration)
}

// Device detection
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouch: false,
      orientation: 'landscape' as 'portrait' | 'landscape',
    }
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  const isTablet = /tablet|ipad|playbook|silk/i.test(userAgent)
  const isDesktop = !isMobile && !isTablet
  const isTouch = isTouchDevice()
  const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    orientation,
  }
}

// Responsive grid helper
export const getResponsiveGridCols = (breakpoint: string): string => {
  const gridCols = {
    xs: 'grid-cols-1',
    sm: 'grid-cols-1 sm:grid-cols-2',
    md: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    lg: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    xl: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  }
  
  return gridCols[breakpoint as keyof typeof gridCols] || gridCols.md
}

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window === 'undefined' || !window.performance) {
    return fn()
  }
  
  const start = performance.now()
  fn()
  const end = performance.now()
  
  console.log(`${name} took ${end - start} milliseconds`)
}

// CSS custom properties for responsive design
export const setCSSVariable = (name: string, value: string) => {
  if (typeof document === 'undefined') return
  document.documentElement.style.setProperty(name, value)
}

export const getCSSVariable = (name: string): string => {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name)
}
