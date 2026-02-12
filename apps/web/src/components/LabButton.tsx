import React from 'react'

interface LabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  children: React.ReactNode
}

export const LabButton: React.FC<LabButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = `
    px-6 py-3 
    rounded-lg 
    font-semibold 
    transition-all 
    duration-200 
    disabled:opacity-50 
    disabled:cursor-not-allowed
  `

  const variants = {
    primary: `
      bg-primary 
      text-primary-foreground 
      hover:bg-primary/90 
      hover:shadow-lg 
      hover:shadow-primary/20
      active:scale-95
    `,
    ghost: `
      bg-transparent 
      text-primary 
      border-2 
      border-primary 
      hover:bg-primary/10
      active:scale-95
    `,
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
