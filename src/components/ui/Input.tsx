import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-label text-txt-secondary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`block w-full rounded-md border px-4 py-3 text-body text-txt-primary bg-bg-surface shadow-sm transition-colors placeholder:text-txt-muted focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? 'border-error focus:border-error focus:ring-error/20'
            : 'border-border focus:border-primary'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-caption text-error">{error}</p>}
    </div>
  )
}
