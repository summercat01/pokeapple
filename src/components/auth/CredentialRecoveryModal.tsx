'use client'

import { useState } from 'react'

interface CredentialRecoveryModalProps {
  isOpen: boolean
  onClose: () => void
}

type ActiveTab = 'username' | 'password'

export default function CredentialRecoveryModal({ isOpen, onClose }: CredentialRecoveryModalProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('username')
  const [nickname, setNickname] = useState('')
  const [username, setUsername] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const resetState = () => {
    setNickname('')
    setUsername('')
    setResult(null)
    setError(null)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab)
    setResult(null)
    setError(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setResult(null)
    setError(null)

    if (!nickname.trim()) {
      setError('닉네임을 입력하세요')
      return
    }

    if (activeTab === 'password' && !username.trim()) {
      setError('아이디를 입력하세요')
      return
    }

    try {
      setLoading(true)

      const endpoint = activeTab === 'username' ? '/api/recover-username' : '/api/recover-password'
      const payload: Record<string, string> = { nickname: nickname.trim() }
      if (activeTab === 'password') {
        payload.username = username.trim()
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      let data: any = null
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('Failed to parse recovery response:', parseError)
      }

      if (!response.ok) {
        setError(data?.error ?? '정보를 찾는 중 오류가 발생했습니다')
        return
      }

      if (activeTab === 'username') {
        setResult(`등록된 아이디: ${data?.username ?? '알 수 없음'}`)
      } else {
        setResult(`임시 비밀번호: ${data?.password ?? '알 수 없음'}`)
      }
    } catch (fetchError) {
      console.error('Credential recovery error:', fetchError)
      setError('정보를 찾는 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">아이디 / 비밀번호 찾기</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>

        <div className="flex mb-4 border-b">
          <button
            onClick={() => handleTabChange('username')}
            className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'username'
                ? 'border-blue-500 text-blue-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            아이디 찾기
          </button>
          <button
            onClick={() => handleTabChange('password')}
            className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'password'
                ? 'border-blue-500 text-blue-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            비밀번호 찾기
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              placeholder="닉네임을 입력하세요"
            />
          </div>

          {activeTab === 'password' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="아이디를 입력하세요"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md p-3">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 text-sm rounded-md p-3 whitespace-pre-wrap">
              {result}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? '조회 중...' : activeTab === 'username' ? '아이디 찾기' : '비밀번호 찾기'}
          </button>
        </form>
      </div>
    </div>
  )}

