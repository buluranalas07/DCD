import React from 'react'

interface LabCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export const LabCard: React.FC<LabCardProps> = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        glass
        rounded-lg
        p-6
        ${hover ? 'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
