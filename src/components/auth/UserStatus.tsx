'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface UserStatusProps {
  onLoginClick: () => void
}

export default function UserStatus({ onLoginClick }: UserStatusProps) {
  const { isAuthenticated, user, signOut, loading } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSignOut = async () => {
    try {
      console.log('UserStatus: Starting logout...')
      
      // 드롭다운 먼저 닫기
      setShowDropdown(false)
      
      // 로그아웃 실행
      await signOut()
      
      console.log('UserStatus: Logout completed')
      
      // 페이지 새로고침으로 확실하게 상태 초기화
      window.location.reload()
      
    } catch (error) {
      console.error('Logout error:', error)
      // 오류가 발생해도 새로고침
      window.location.reload()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={onLoginClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
      >
        로그인
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
      >
        <span>👋</span>
        <span>{user.nickname}</span>
        <svg
          className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm text-gray-600">로그인됨</p>
                <p className="font-semibold text-gray-800">{user.nickname}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
              
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 