import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-sm',
  accent:  'bg-accent text-white hover:bg-accent-dark focus:ring-accent shadow-sm',
  secondary: 'bg-bg-alt text-txt-primary hover:bg-border focus:ring-primary',
  outline: 'border border-border text-txt-secondary hover:bg-bg-alt focus:ring-primary',
  ghost: 'text-txt-secondary hover:bg-bg-alt focus:ring-primary',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-label rounded-md',
  md: 'px-4 py-2.5 text-label rounded-md',
  lg: 'px-6 py-3.5 text-label-lg rounded-md',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
