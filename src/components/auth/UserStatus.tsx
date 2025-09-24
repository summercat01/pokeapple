'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

interface UserStatusProps {
  onLoginClick: () => void
  onRecoveryClick: () => void
}

export default function UserStatus({ onLoginClick, onRecoveryClick }: UserStatusProps) {
  const { isAuthenticated, user, signOut, loading, updateNickname, isAdmin, fetchTitles, updateActiveTitle } = useAuth()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [nicknameInput, setNicknameInput] = useState(user?.nickname ?? '')
  const [nicknameError, setNicknameError] = useState<string | null>(null)
  const [isNicknameUpdating, setIsNicknameUpdating] = useState(false)
  const [titles, setTitles] = useState<string[]>([])
  const [titleError, setTitleError] = useState<string | null>(null)
  const [isTitlesLoading, setIsTitlesLoading] = useState(false)

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

  const startNicknameEdit = () => {
    if (!user) return
    setNicknameInput(user.nickname)
    setNicknameError(null)
    setIsEditingNickname(true)
  }

  const cancelNicknameEdit = () => {
    if (!user) return
    setNicknameInput(user.nickname)
    setNicknameError(null)
    setIsEditingNickname(false)
  }

  const submitNicknameEdit = async () => {
    if (!user) return

    const trimmed = nicknameInput.trim()
    if (trimmed.length < 2) {
      setNicknameError('닉네임은 2자 이상이어야 합니다')
      return
    }

    if (trimmed.length > 8) {
      setNicknameError('닉네임은 최대 8자까지 가능합니다')
      return
    }

    if (trimmed === user.nickname) {
      setIsEditingNickname(false)
      return
    }

    try {
      setIsNicknameUpdating(true)
      setNicknameError(null)
      await updateNickname(trimmed)
      setIsEditingNickname(false)
    } catch (error) {
      console.error('Nickname update failed:', error)
      const message = error instanceof Error ? error.message : '닉네임 변경에 실패했습니다'
      setNicknameError(message)
    } finally {
      setIsNicknameUpdating(false)
    }
  }

  const handleToggleDropdown = async () => {
    const nextState = !showDropdown
    setShowDropdown(nextState)

    if (nextState && user && titles.length === 0 && !isTitlesLoading) {
      try {
        setIsTitlesLoading(true)
        const fetchedTitles = await fetchTitles()
        setTitles(fetchedTitles)
        setTitleError(null)
      } catch (error) {
        console.error('Failed to fetch titles:', error)
        setTitleError(error instanceof Error ? error.message : '칭호를 불러오지 못했습니다')
      } finally {
        setIsTitlesLoading(false)
      }
    }
  }

  const handleActiveTitleChange = async (title: string) => {
    if (!user) return

    try {
      setTitleError(null)
      const newTitle = title === '__none__' ? null : title
      await updateActiveTitle(newTitle)
    } catch (error) {
      console.error('Failed to update active title:', error)
      setTitleError(error instanceof Error ? error.message : '칭호를 설정하지 못했습니다')
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
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={onLoginClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
        >
          로그인
        </button>
        <button
          onClick={onRecoveryClick}
          className="text-sm text-gray-800 underline hover:text-black transition-colors"
        >
          아이디 / 비밀번호 찾기
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggleDropdown}
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
      >
        <span>👋</span>
        <span className="flex items-center gap-1">
          {user.nickname}
          {user.active_title && !isEditingNickname && (
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
              {user.active_title}
            </span>
          )}
        </span>
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
                <div className="flex items-center gap-2">
                  {isEditingNickname ? (
                    <>
                      <input
                        type="text"
                        value={nicknameInput}
                        maxLength={8}
                        onChange={(e) => {
                          setNicknameInput(e.target.value)
                          if (nicknameError) setNicknameError(null)
                        }}
                        className="w-[7.5rem] px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={isNicknameUpdating}
                      />
                      <button
                        onClick={submitNicknameEdit}
                        className="text-green-600 hover:text-green-700"
                        disabled={isNicknameUpdating}
                        title="저장"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelNicknameEdit}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isNicknameUpdating}
                        title="취소"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <p className="font-semibold text-gray-800">{user.nickname}</p>
                  )}
                </div>
                {nicknameError && (
                  <p className="text-xs text-red-500 mt-1">{nicknameError}</p>
                )}
                <p className="text-xs text-gray-500">@{user.username}</p>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">칭호 선택</label>
                  <select
                    value={user.active_title ?? '__none__'}
                    onChange={(e) => handleActiveTitleChange(e.target.value)}
                    className="w-full text-xs px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isTitlesLoading}
                  >
                    <option value="__none__">표시 안 함</option>
                    {titles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                  {isTitlesLoading && (
                    <p className="text-[10px] text-gray-500 mt-1">칭호를 불러오는 중...</p>
                  )}
                  {titleError && (
                    <p className="text-[10px] text-red-500 mt-1">{titleError}</p>
                  )}
                </div>
              </div>

              <button
                onClick={startNicknameEdit}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <PencilSquareIcon className="w-4 h-4 text-gray-500" />
                닉네임 변경
              </button>

              {isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-2"
                >
                  관리자 페이지
                </button>
              )}

              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
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