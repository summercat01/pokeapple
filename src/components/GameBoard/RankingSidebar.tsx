'use client'

import React, { useMemo, useState } from 'react'
import { useRanking } from '@/hooks/useRanking'

type RankingScope = 'all' | 'today'

interface FixedRankingEntry {
  rank: number
  name: string
  score: number
  isEmpty?: boolean
}

const scopeInfo: Record<RankingScope, { label: string; description: string; color: string }> = {
  all: {
    label: '전체 랭킹',
    description: '최고의 점수 상위 10명',
    color: '#3b82f6'
  },
  today: {
    label: '일간 랭킹',
    description: '오늘의 기록 상위 10명',
    color: '#10b981'
  }
}

export default function RankingSidebar() {
  const [scope, setScope] = useState<RankingScope>('all')
  const { rankings, loading } = useRanking(scope)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return rank.toString()
    }
  }

  const fixedRankings: FixedRankingEntry[] = useMemo(() => {
    const normalized = rankings.map(entry => ({
      rank: entry.rank,
      name: entry.name,
      score: entry.score
    }))

    const list: FixedRankingEntry[] = []
    for (let i = 1; i <= 10; i++) {
      const existing = normalized.find(item => item.rank === i)
      if (existing) {
        list.push(existing)
      } else {
        list.push({ rank: i, name: '', score: 0, isEmpty: true })
      }
    }
    return list
  }, [rankings])

  return (
    <div className="w-80 bg-white bg-opacity-95 rounded-xl shadow-xl p-4 ml-4 overflow-hidden flex flex-col border-4 border-green-400">
      {/* 헤더 */}
      <div className="mb-3">
        <h2 className="text-lg font-bold mb-2 text-center" style={{ color: '#ff6600' }}>🏆 랭킹</h2>
        
        {/* 랭킹 범위 탭 */}
        <div className="flex gap-2" role="tablist" aria-label="랭킹 범위 전환">
          {(Object.keys(scopeInfo) as RankingScope[]).map((scopeKey) => {
            const isActive = scope === scopeKey
            return (
              <button
                key={scopeKey}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setScope(scopeKey)}
                className={`flex-1 px-2 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isActive
                    ? 'text-white shadow-lg border-transparent focus:ring-green-200'
                    : 'text-gray-600 bg-white bg-opacity-80 hover:bg-opacity-100 border-gray-200 hover:border-gray-300 focus:ring-green-100'
                }`}
                style={{
                  backgroundColor: isActive ? scopeInfo[scopeKey].color : undefined
                }}
              >
                {scopeInfo[scopeKey].label}
              </button>
            )
          })}
        </div>
        <p className="text-[11px] text-gray-500 mt-2 text-center">
          {scopeInfo[scope].description}
        </p>
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
                {fixedRankings.map((entry) => (
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
                            {entry.name}
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

            {rankings.length === 0 && !loading && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-3 text-center border-2 border-gray-200">
                  <p className="text-xs font-semibold text-gray-600">아직 등록된 기록이 없습니다</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">게임을 플레이하고 첫 기록을 남겨보세요!</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 