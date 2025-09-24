import { useState, useEffect, useCallback } from 'react'
import { GameMode } from '@/types/game'
import { getRankingsByMode, getUserRanking } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface RankingEntry {
  rank: number
  username: string
  nickname: string
  active_title?: string | null
  score: number
}

interface MyRanking {
  rank: number
  score: number
  totalPlayers: number
  active_title?: string | null
}

interface UseRankingReturn {
  rankings: RankingEntry[]
  myRanking: MyRanking | null
  loading: boolean
  refresh: () => Promise<void>
}

export function useRanking(mode: GameMode): UseRankingReturn {
  const { user } = useAuth()
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [myRanking, setMyRanking] = useState<MyRanking | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRankings = useCallback(async () => {
    try {
      setLoading(true)
      
      // 상위 10위 랭킹 가져오기
      const rankingsData = await getRankingsByMode(mode, 10)
      setRankings(rankingsData)
      
      // 내 랭킹 가져오기 (로그인한 경우만)
      if (user) {
        const myRankingData = await getUserRanking(mode)
        setMyRanking(myRankingData)
      } else {
        setMyRanking(null)
      }
    } catch (error) {
      console.error('Error fetching rankings:', error)
      setRankings([])
      setMyRanking(null)
    } finally {
      setLoading(false)
    }
  }, [mode, user])

  // 초기 로드 및 모드 변경 시 새로고침
  useEffect(() => {
    fetchRankings()
  }, [fetchRankings])

  // 30초마다 자동 새로고침
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRankings()
    }, 30000) // 30초

    return () => clearInterval(interval)
  }, [fetchRankings])

  return {
    rankings,
    myRanking,
    loading,
    refresh: fetchRankings
  }
} 