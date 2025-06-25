import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 점수 저장
export async function saveScore(score: number, playerName?: string) {
  const { data, error } = await supabase
    .from('scores')
    .insert([
      { score, player_name: playerName || 'Anonymous', created_at: new Date() }
    ])
  
  if (error) {
    console.error('Error saving score:', error)
    return null
  }
  
  return data
}

// 랭킹 가져오기
export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
  
  return data
}
