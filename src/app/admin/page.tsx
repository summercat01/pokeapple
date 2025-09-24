'use client'

import { useEffect, useState } from 'react'
import { AdminUserSummary } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function AdminPage() {
  const {
    user,
    isAuthenticated,
    isAdmin,
    signOut,
    loading: authLoading,
    fetchAdminUsers,
    resetPassword,
    grantTitleToUser
  } = useAuth()
  const [users, setUsers] = useState<AdminUserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [activeResetUser, setActiveResetUser] = useState<number | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [activeTitleUser, setActiveTitleUser] = useState<number | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadUsers = async () => {
      if (!user || !isAdmin) {
        return
      }

      try {
        setLoading(true)
        const userList = await fetchAdminUsers()
        setUsers(userList)
      } catch (err) {
        console.error('Admin users fetch failed:', err)
        setError(err instanceof Error ? err.message : '사용자 목록을 불러오지 못했습니다')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [user, isAdmin])

  const handleResetPassword = async (targetUserId: number) => {
    if (!user) return

    const trimmed = newPassword.trim()
    if (trimmed.length < 4) {
      setError('새 비밀번호는 4자 이상이어야 합니다')
      return
    }

    try {
      setIsSubmitting(true)
      await resetPassword(targetUserId, trimmed)
      setSuccessMessage('비밀번호를 재설정했습니다')
      setNewPassword('')
      setActiveResetUser(null)
    } catch (err) {
      console.error('Reset password failed:', err)
      setError(err instanceof Error ? err.message : '비밀번호 재설정에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGrantTitle = async (targetUserId: number) => {
    if (!user) return

    const titleText = newTitle.trim()
    if (!titleText) {
      setError('칭호를 입력해주세요')
      return
    }

    try {
      setIsSubmitting(true)
      await grantTitleToUser(targetUserId, titleText)
      setSuccessMessage('칭호를 수여했습니다')
      setNewTitle('')
      setActiveTitleUser(null)
      const refreshed = await fetchAdminUsers()
      setUsers(refreshed)
    } catch (err) {
      console.error('Grant title failed:', err)
      setError(err instanceof Error ? err.message : '칭호 수여에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">관리자 정보를 확인하는 중입니다...</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">접근 불가</h1>
          <p className="text-gray-600">관리자만 접근할 수 있는 페이지입니다.</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">관리자 대시보드</h1>
            <p className="text-gray-500">계정 관리를 위한 관리자 전용 페이지입니다</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
            >
              메인으로
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              로그아웃
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-600 text-sm">
            {successMessage}
          </div>
        )}

        <section className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">사용자 목록</h2>
            {loading && <span className="text-sm text-gray-500">불러오는 중...</span>}
          </div>

          <div className="divide-y divide-gray-100">
            {!loading && users.length === 0 && (
              <div className="p-6 text-center text-gray-500 text-sm">등록된 사용자가 없습니다.</div>
            )}

            {users.map((u) => (
              <div key={u.id} className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    {u.nickname}
                    {u.active_title && (
                      <span className="text-[10px] font-medium text-indigo-700 bg-indigo-100/80 px-1.5 py-0.5 rounded-full border border-indigo-200">
                        {u.active_title}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">@{u.username}</p>
                  <p className="text-xs text-gray-400">가입일: {new Date(u.created_at).toLocaleString()}</p>
                  {u.titles && u.titles.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      보유 칭호: {u.titles.join(', ')}
                    </p>
                  )}
                </div>

                <div className="flex flex-col md:items-end gap-3">
                  <div className="flex flex-wrap gap-3">
                    {activeResetUser === u.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="새 비밀번호"
                          className="w-36 px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          disabled={isSubmitting}
                        />
                        <button
                          onClick={() => handleResetPassword(u.id)}
                          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? '적용 중...' : '적용'}
                        </button>
                        <button
                          onClick={() => {
                            setActiveResetUser(null)
                            setNewPassword('')
                            setError(null)
                          }}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveResetUser(u.id)
                          setNewPassword('')
                          setError(null)
                          setSuccessMessage(null)
                        }}
                        className="px-3 py-1 text-sm border border-indigo-200 text-indigo-600 rounded-md hover:bg-indigo-50"
                      >
                        비밀번호 재설정
                      </button>
                    )}

                    {activeTitleUser === u.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="칭호 입력"
                          className="w-40 px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          disabled={isSubmitting}
                        />
                        <button
                          onClick={() => handleGrantTitle(u.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? '수여 중...' : '수여하기'}
                        </button>
                        <button
                          onClick={() => {
                            setActiveTitleUser(null)
                            setNewTitle('')
                            setError(null)
                          }}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveTitleUser(u.id)
                          setNewTitle('')
                          setError(null)
                          setSuccessMessage(null)
                        }}
                        className="px-3 py-1 text-sm border border-green-200 text-green-600 rounded-md hover:bg-green-50"
                      >
                        칭호 수여하기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

