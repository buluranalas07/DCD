import React from 'react'

interface LabInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const LabInput = React.forwardRef<HTMLInputElement, LabInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-zinc-400 mb-2">{label}</label>}
        <input
          ref={ref}
          className={`
            w-full 
            bg-transparent 
            border-0 border-b-2 
            border-zinc-800 
            px-0 py-2
            text-zinc-50 
            placeholder:text-zinc-600
            focus:border-primary 
            focus:outline-none 
            focus:ring-0
            transition-colors
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)

LabInput.displayName = 'LabInput'
