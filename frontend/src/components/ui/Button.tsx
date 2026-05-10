import React from 'react'
import { cn } from '../../utils/cn'
import { Loader2 } from '../icons'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    fullWidth = false,
    icon,
    iconPosition = 'left',
    asChild = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 select-none'
    
    const variantClasses = {
      primary: 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 rounded-lg',
      accent: 'bg-accent text-white hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20 rounded-lg',
      secondary: 'bg-gray-50 text-text-primary hover:bg-border/50 rounded-lg',
      outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg',
      ghost: 'text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg',
      danger: 'bg-red-50 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 rounded-lg'
    }
    
    const sizeClasses = {
      xs: 'px-3 py-1.5 text-xs',
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl font-bold'
    }
    
    const iconSizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7'
    }

    const buttonClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    )

    const renderContent = () => {
      if (loading) {
        return (
          <>
            <Loader2 className={`animate-spin ${iconSizeClasses[size]} ${children ? 'mr-2' : ''}`} />
            {children}
          </>
        )
      }

      if (icon) {
        return (
          <>
            {iconPosition === 'left' && (
              <span className={`${children ? 'mr-2' : ''} ${iconSizeClasses[size]}`}>
                {icon}
              </span>
            )}
            {children}
            {iconPosition === 'right' && (
              <span className={`${children ? 'ml-2' : ''} ${iconSizeClasses[size]}`}>
                {icon}
              </span>
            )}
          </>
        )
      }

      return children
    }

    if (asChild && React.isValidElement(children)) {
      const childProps = children as React.ReactElement<any>
      return React.cloneElement(childProps, {
        className: cn(buttonClasses, childProps.props?.className),
        ref,
        disabled: disabled || loading,
        ...props,
      })
    }

    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {renderContent()}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button

