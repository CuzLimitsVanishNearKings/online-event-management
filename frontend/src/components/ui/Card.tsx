import React from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'bordered' | 'elevated' | 'premium'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white border border-border rounded-md transition-all duration-200',
      bordered: 'bg-white border-2 border-border rounded-md transition-all duration-200',
      elevated: 'bg-white border border-border rounded-md shadow-card transition-all duration-200',
      premium: 'bg-white border border-border rounded-md shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden'
    }

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pb-4', className)}
      {...props}
    />
  )
)

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-display font-bold text-xl leading-tight tracking-tight text-text-primary', className)}
      {...props}
    />
  )
)

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-text-muted text-sm leading-relaxed', className)}
      {...props}
    />
  )
)

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between p-6 pt-4 mt-auto', className)}
      {...props}
    />
  )
)

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardTitle.displayName = 'CardTitle'
CardDescription.displayName = 'CardDescription'
CardContent.displayName = 'CardContent'
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

