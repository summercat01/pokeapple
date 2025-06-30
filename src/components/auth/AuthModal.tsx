'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

interface FormData {
  username: string
  password: string
  nickname: string
}

interface FormErrors {
  username?: string
  password?: string
  nickname?: string
  general?: string
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { signIn, signUp, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab)
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    nickname: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})

  if (!isOpen) return null

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Username validation
    if (!formData.username) {
      newErrors.username = '아이디를 입력해주세요'
    } else if (formData.username.length < 3) {
      newErrors.username = '아이디는 3자 이상이어야 합니다'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = '아이디는 영문, 숫자, 언더스코어만 사용 가능합니다'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else if (formData.password.length < 4) {
      newErrors.password = '비밀번호는 4자 이상이어야 합니다'
    }

    // Register-specific validations
    if (activeTab === 'register') {
      if (!formData.nickname) {
        newErrors.nickname = '닉네임을 입력해주세요'
      } else if (formData.nickname.length < 2) {
        newErrors.nickname = '닉네임은 2자 이상이어야 합니다'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setErrors({})
      
      if (activeTab === 'login') {
        await signIn(formData.username, formData.password)
      } else {
        await signUp(formData.username, formData.nickname, formData.password)
      }
      
      // Reset form and close modal on success
      setFormData({ username: '', password: '', nickname: '' })
      onClose()
    } catch (error: unknown) {
      console.error('Auth error:', error)
      const errorMessage = error instanceof Error ? error.message : `${activeTab === 'login' ? '로그인' : '회원가입'} 중 오류가 발생했습니다`
      setErrors({ 
        general: errorMessage
      })
    }
  }

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    setErrors({})
    setFormData({ username: '', password: '', nickname: '' })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'login' ? '로그인' : '회원가입'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-blue-500 text-blue-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'border-blue-500 text-blue-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              아이디
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="아이디를 입력하세요"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Register-only fields */}
          {activeTab === 'register' && (
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                닉네임
              </label>
              <input
                type="text"
                id="nickname"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nickname ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="게임에서 표시될 이름"
              />
              {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>}
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            } text-white`}
          >
            {loading ? '처리 중...' : (activeTab === 'login' ? '로그인' : '회원가입')}
          </button>
        </form>
      </div>
    </div>
  )
} 