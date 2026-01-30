import React from 'react'

export default function Button({
    children = null,
    onClick,
    disabled = false,
    className = '',
    type,
    icon = null
}) {
  return (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`btn-${type} ${className}`}  
    >
      {icon && <span className="icon">{icon}</span>}
      {children}
    </button>
  )
}
