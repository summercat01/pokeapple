'use client'

import { ButtonHTMLAttributes } from 'react'

interface HelpButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

export default function HelpButton({ isActive, className = '', ...props }: HelpButtonProps) {
  return (
    <button
      type="button"
      className={`
        relative group flex items-center justify-center
        w-10 h-10 rounded-full border-2 border-white
        bg-[#00cc66] text-white text-xl z-20
        shadow-lg transition-all duration-200
        hover:bg-white hover:text-[#006a33] hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00cc66]
        ${isActive ? 'ring-2 ring-offset-2 ring-white' : ''}
        ${className}
      `}
      title="도움말"
      aria-expanded={isActive}
      aria-label="도움말 열기"
      {...props}
    >
      ?
      <span
        className="pointer-events-none absolute top-12 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        도움말
      </span>
    </button>
  )
}

