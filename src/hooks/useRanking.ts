import { useState, useEffect, useCallback } from 'react'

interface RankingEntry {
  rank: number
  name: string
  score: number
  submittedAt: string
}

interface UseRankingReturn {
  rankings: RankingEntry[]
  loading: boolean
  refresh: () => Promise<void>
}

async function fetchRankingsFromServer(scope: 'all' | 'today'): Promise<RankingEntry[]> {
  try {
    const response = await fetch(`/api/scores?scope=${scope}`)
    if (!response.ok) {
      console.error('Failed to fetch rankings:', response.status, response.statusText)
      return []
    }
    const data = await response.json().catch(() => null) as { rankings?: RankingEntry[] } | null
    return data?.rankings ?? []
  } catch (error) {
    console.error('Error fetching rankings:', error)
    return []
  }
}

export function useRanking(scope: 'all' | 'today' = 'all'): UseRankingReturn {
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRankings = useCallback(async () => {
    setLoading(true)
    const data = await fetchRankingsFromServer(scope)
    setRankings(data)
    setLoading(false)
  }, [scope])

  useEffect(() => {
    fetchRankings()
  }, [fetchRankings])

  useEffect(() => {
    const handler = () => {
      fetchRankings()
    }
    window.addEventListener('scores:updated', handler)
    return () => window.removeEventListener('scores:updated', handler)
  }, [fetchRankings])

  useEffect(() => {
    const interval = setInterval(fetchRankings, 30000)
    return () => clearInterval(interval)
  }, [fetchRankings])

  return { rankings, loading, refresh: fetchRankings }
}