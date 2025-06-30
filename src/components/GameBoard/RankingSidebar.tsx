import React from 'react'
import { GameMode } from '@/types/game'
import { useRanking } from '@/hooks/useRanking'
import { useAuth } from '@/contexts/AuthContext'

interface RankingSidebarProps {
  selectedMode: GameMode
  onModeChange: (mode: GameMode) => void
}

interface ExtendedRankingEntry {
  rank: number
  username: string
  nickname: string
  score: number
  isEmpty?: boolean
}

export default function RankingSidebar({ selectedMode, onModeChange }: RankingSidebarProps) {
  const { user } = useAuth()
  const { rankings, myRanking, loading } = useRanking(selectedMode)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return rank.toString()
    }
  }

  const modeInfo = {
    normal: { icon: '🎯', label: '일반' },
    beginner: { icon: '🌱', label: '초보자' }
  }

  // 1~10등까지 고정된 순위 배열 생성
  const getFixedRankings = (): ExtendedRankingEntry[] => {
    const fixedRankings: ExtendedRankingEntry[] = []
    for (let i = 1; i <= 10; i++) {
      const existingEntry = rankings.find(entry => entry.rank === i)
      if (existingEntry) {
        fixedRankings.push(existingEntry)
      } else {
        fixedRankings.push({
          rank: i,
          username: '',
          nickname: '',
          score: 0,
          isEmpty: true
        })
      }
    }
    return fixedRankings
  }

  return (
    <div className="w-80 bg-white bg-opacity-95 rounded-xl shadow-xl p-4 ml-4 overflow-hidden flex flex-col border-4 border-green-400">
      {/* 헤더 */}
      <div className="mb-3">
        <h2 className="text-lg font-bold mb-2 text-center" style={{ color: '#ff6600' }}>🏆 랭킹</h2>
        
        {/* 모드 탭 */}
        <div className="flex gap-2">
          {(['normal', 'beginner'] as GameMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`flex-1 px-2 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 border-2 ${
                selectedMode === mode
                  ? 'text-white shadow-lg border-transparent'
                  : 'text-gray-600 bg-white bg-opacity-80 hover:bg-opacity-100 border-gray-200 hover:border-gray-300'
              }`}
              style={{
                backgroundColor: selectedMode === mode 
                  ? (mode === 'normal' ? '#3b82f6' : '#10b981')
                  : undefined
              }}
            >
              {modeInfo[mode].icon} {modeInfo[mode].label}
            </button>
          ))}
        </div>
      </div>

      {/* 랭킹 테이블 */}
      <div className="overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-sm font-medium">로딩중...</p>
            </div>
          </div>
        ) : (
          <>
            {/* 상위 10위 (고정) */}
            <div className="overflow-y-auto">
              <div className="space-y-1">
                {getFixedRankings().map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-200 border ${
                      entry.isEmpty 
                        ? 'bg-gray-50 bg-opacity-50 opacity-60 border-gray-100' 
                        : 'bg-gradient-to-r from-white to-green-50 hover:from-green-50 hover:to-green-100 border-green-200 hover:border-green-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-6 text-center font-bold text-sm">
                        {entry.rank <= 3 ? (
                          <span className="text-lg">{getRankIcon(entry.rank)}</span>
                        ) : (
                          <span style={{ color: '#ff6600' }}>{getRankIcon(entry.rank)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {entry.isEmpty ? (
                          <p className="text-xs text-gray-400 italic font-medium">
                            -
                          </p>
                        ) : (
                          <p className="text-xs font-semibold text-gray-800 truncate">
                            {entry.nickname}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-xs font-bold">
                      {entry.isEmpty ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-bold">
                          {entry.score}점
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 구분선 및 내 랭킹 */}
            {user && (
              <div className="mt-3 pt-3 border-t-2 border-green-200">
                {myRanking ? (
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 border-2 border-blue-200 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 text-center font-bold text-sm" style={{ color: '#ff6600' }}>
                          {myRanking.rank}위
                        </div>
                        <div>
                          <p className="text-xs font-bold" style={{ color: '#ff6600' }}>
                            {user.nickname} (나)
                          </p>
                          <p className="text-xs font-medium" style={{ color: '#00cc66' }}>
                            전체 {myRanking.totalPlayers}명 중
                          </p>
                        </div>
                      </div>
                      <div className="text-xs font-bold bg-orange-100 px-2 py-1 rounded-full" style={{ color: '#ff6600' }}>
                        {myRanking.score}점
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-3 text-center border-2 border-gray-200">
                    <p className="text-xs font-semibold text-gray-600">아직 기록이 없습니다</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">게임을 플레이해보세요!</p>
                  </div>
                )}
              </div>
            )}

            {/* 로그인 안내 */}
            {!user && (
              <div className="mt-2 pt-2 border-t border-green-200">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 text-center border-2 border-yellow-200 shadow-md">
                  <p className="text-xs font-bold" style={{ color: '#ff6600' }}>
                    🔑 로그인하여 랭킹 참여
                  </p>
                  <p className="text-xs mt-1 font-medium" style={{ color: '#00cc66' }}>
                    내 기록을 저장하고 순위를 확인하세요
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 