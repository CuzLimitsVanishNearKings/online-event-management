import React from 'react'
import { cn } from '../../utils/cn'
import { Eye, EyeOff, Search, Calendar, MapPin, DollarSign, User } from '../icons'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'search' | 'date' | 'location' | 'price' | 'email'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  helperText?: string
  label?: string
  icon?: React.ReactNode
  showPasswordToggle?: boolean
  fullWidth?: boolean
}

const InputRedesigned = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    error = false,
    helperText,
    label,
    icon,
    showPasswordToggle = false,
    fullWidth = false,
    type,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const baseClasses = 'w-full rounded-xl border transition-all duration-200 placeholder:text-text-muted focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantClasses = {
      default: 'bg-white border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20',
      search: 'bg-surface/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 pl-10',
      date: 'bg-white border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 pl-10',
      location: 'bg-white border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 pl-10',
      price: 'bg-white border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 pl-10',
      email: 'bg-white border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 pl-10'
    }
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg'
    }
    
    const iconClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    const inputClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
      className
    )

    const getDefaultIcon = () => {
      switch (variant) {
        case 'search':
          return <Search className={iconClasses[size]} />
        case 'date':
          return <Calendar className={iconClasses[size]} />
        case 'location':
          return <MapPin className={iconClasses[size]} />
        case 'price':
          return <DollarSign className={iconClasses[size]} />
        case 'email':
          return <User className={iconClasses[size]} />
        default:
          return null
      }
    }

    const renderIcon = () => {
      const iconToRender = icon || getDefaultIcon()
      if (!iconToRender) return null

      return (
        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconClasses[size]} text-text-muted`}>
          {iconToRender}
        </div>
      )
    }

    const renderPasswordToggle = () => {
      if (!showPasswordToggle || type !== 'password') return null

      return (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${iconClasses[size]} text-text-muted hover:text-text-primary transition-colors duration-200`}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      )
    }

    const inputType = type === 'password' && showPassword ? 'text' : type

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {renderIcon()}
          
          <input
            type={inputType}
            className={inputClasses}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
          
          {renderPasswordToggle()}
        </div>
        
        {helperText && (
          <p className={cn(
            'mt-2 text-sm',
            error ? 'text-red-500' : 'text-text-muted'
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

InputRedesigned.displayName = 'Input'

export default InputRedesigned
