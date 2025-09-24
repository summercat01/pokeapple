import { createClient } from '@supabase/supabase-js'
import { GameMode } from '@/types/game'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 타입 정의
export interface User {
  id: number // Back to integer ID for custom auth
  username: string
  nickname: string
  title?: string | null
  active_title?: string | null
  password_hash: string
  normal_best_score: number
  beginner_best_score: number
  created_at: string
}

export interface UserTitle {
  id: number
  user_id: number
  title: string
}

interface RankingEntryWithTitle {
  rank: number
  username: string
  nickname: string
  active_title?: string | null
  score: number
}

// 간단한 비밀번호 해시 함수 (실제 프로덕션에서는 bcrypt 사용 권장)
function hashPassword(password: string): string {
  // 간단한 해시 (실제로는 bcrypt 등 사용해야 함)
  return btoa(password + 'pokeapple_salt')
}

// 간단한 인증 함수들
export async function signUp(username: string, nickname: string, password: string) {
  try {
    console.log('SignUp attempt:', { username, nickname, passwordLength: password.length })
    
    // 1. Check if Supabase client is working
    if (!supabase) {
      console.error('Supabase client not initialized')
      throw new Error('데이터베이스 연결 오류')
    }
    
    // 2. Check environment variables
    console.log('Environment check:')
    console.log('- Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('- Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
    
    // 3. Validate input
    if (!username || username.length < 3) {
      throw new Error('아이디는 3자 이상이어야 합니다')
    }
    if (!nickname || nickname.length < 2) {
      throw new Error('닉네임은 2자 이상이어야 합니다')
    }
    if (!password || password.length < 4) {
      throw new Error('비밀번호는 4자 이상이어야 합니다')
    }
    
    // 4. Check for duplicate username
    console.log('Checking for duplicate username:', username)
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, username')
      .eq('username', username)
      .maybeSingle()
    
    console.log('Duplicate check result:', { existingUser, checkError })
    
    if (checkError) {
      console.error('Error checking duplicate username:', checkError)
      throw new Error(`사용자명 중복 확인 오류: ${checkError.message}`)
    }
    
    if (existingUser) {
      console.log('Username already exists:', username)
      throw new Error('이미 존재하는 사용자명입니다')
    }
    
    // 5. Check for duplicate nickname
    console.log('Checking for duplicate nickname:', nickname)
    const { data: existingNickname, error: nicknameCheckError } = await supabase
      .from('users')
      .select('id, nickname')
      .eq('nickname', nickname)
      .maybeSingle()
    
    console.log('Nickname duplicate check result:', { existingNickname, nicknameCheckError })
    
    if (nicknameCheckError) {
      console.error('Error checking duplicate nickname:', nicknameCheckError)
      throw new Error(`닉네임 중복 확인 오류: ${nicknameCheckError.message}`)
    }
    
    if (existingNickname) {
      console.log('Nickname already exists:', nickname)
      throw new Error('이미 존재하는 닉네임입니다')
    }
    
    // 6. Create new user
    console.log('Creating new user with data:', { username, nickname })
    const { data: userData, error: insertError } = await supabase
      .from('users')
      .insert([{
        username,
        nickname,
        password_hash: hashPassword(password),
        normal_best_score: 0,
        beginner_best_score: 0
      }])
      .select()
      .single()
    
    console.log('User creation result:', { userData, insertError })
    
    if (insertError) {
      console.error('User creation error:', insertError)
      throw new Error(`회원가입 실패: ${insertError.message}`)
    }
    
    if (!userData) {
      throw new Error('사용자 데이터가 생성되지 않았습니다')
    }
    
    console.log('Signup successful for user:', userData.id)
    return userData
    
  } catch (error: unknown) {
    console.error('Complete signup error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined
    })
    throw error
  }
}

export async function signIn(username: string, password: string) {
  if (!username || !password) {
    throw new Error('아이디와 비밀번호를 입력해주세요')
  }

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })

  let data: { user?: User; error?: string } | null = null

  try {
    data = await response.json()
  } catch (error) {
    console.error('Failed to parse login response:', error)
  }

  if (!response.ok || !data?.user) {
    const message = data?.error ?? '로그인 중 오류가 발생했습니다'
    throw new Error(message)
  }

  return data.user
}

export async function updateNickname(userId: number, nickname: string) {
  const response = await fetch('/api/auth/update-nickname', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, nickname })
  })

  let data: { user?: User; error?: string } | null = null

  try {
    data = await response.json()
  } catch (error) {
    console.error('Failed to parse update nickname response:', error)
  }

  if (!response.ok || !data?.user) {
    const message = data?.error ?? '닉네임 변경 중 오류가 발생했습니다'
    throw new Error(message)
  }

  // 로컬 데이터 업데이트
  localStorage.setItem('pokeapple_user', JSON.stringify(data.user))

  return data.user
}

export interface AdminUserSummary {
  id: number
  username: string
  nickname: string
  active_title?: string | null
  titles?: string[]
  created_at: string
}

export async function fetchAllUsers(adminId: number, adminUsername: string) {
  const params = new URLSearchParams({
    adminId: String(adminId),
    adminUsername
  })
  const response = await fetch(`/api/admin/users?${params.toString()}`)

  let data: { users?: AdminUserSummary[]; error?: string } | null = null
  try {
    data = await response.json()
  } catch (error) {
    console.error('Failed to parse admin users response:', error)
  }

  if (!response.ok || !data?.users) {
    const message = data?.error ?? '사용자 목록을 불러오는 중 오류가 발생했습니다'
    throw new Error(message)
  }

  return data.users
}

export async function resetUserPassword(adminId: number, userId: number, newPassword: string) {
  const response = await fetch('/api/admin/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ adminId, userId, newPassword })
  })

  let data: { success?: boolean; error?: string } | null = null
  try {
    data = await response.json()
  } catch (error) {
    console.error('Failed to parse reset password response:', error)
  }

  if (!response.ok || !data?.success) {
    const message = data?.error ?? '비밀번호 재설정 중 오류가 발생했습니다'
    throw new Error(message)
  }

  return data.success
}

export async function fetchUserTitles(userId: number) {
  const response = await fetch(`/api/auth/titles?userId=${userId}`)

  let data: { titles?: string[]; error?: string } | null = null
  try {
    data = await response.json()
  } catch (error) {
    console.error('Failed to parse user titles response:', error)
  }

  if (!response.ok || !data?.titles) {
    const message = data?.error ?? '칭호 목록을 불러오는 중 오류가 발생했습니다'
    throw new Error(message)
  }

  return data.titles
}

export async function setActiveTitle(userId: number, title: string | null) {
  const response = await fetch('/api/auth/set-active-title', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, title })
  })

  let data: { user?: User; error?: string } | null = null
  try {
    data = await response.json()
  } catch (error) {
    console.error('Failed to parse set active title response:', error)
  }

  if (!response.ok || !data?.user) {
    const message = data?.error ?? '칭호를 설정하는 중 오류가 발생했습니다'
    throw new Error(message)
  }

  localStorage.setItem('pokeapple_user', JSON.stringify(data.user))

  return data.user
}

export async function grantTitle(adminId: number, userId: number, title: string) {
  const response = await fetch('/api/admin/grant-title', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ adminId, userId, title })
  })

  let data: { success?: boolean; error?: string; alreadyHadTitle?: boolean } | null = null
  try {
    data = await response.json()
  } catch (error) {
    console.error('Failed to parse grant title response:', error)
  }

  if (!response.ok || !data?.success) {
    const message = data?.error ?? '칭호 수여 중 오류가 발생했습니다'
    throw new Error(message)
  }

  return data.success
}

export async function findUsernameByNickname(nickname: string) {
  const { data, error } = await supabase
    .from('users')
    .select('username')
    .eq('nickname', nickname)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data?.username ?? null
}

export async function findPasswordByNicknameAndUsername(nickname: string, username: string) {
  const { data, error } = await supabase
    .from('users')
    .select('password_hash')
    .eq('nickname', nickname)
    .eq('username', username)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data?.password_hash) {
    return null
  }

  // 테스트용이라 바로 복호화 (실제 서비스에서는 절대 금지)
  try {
    const decoded = atob(data.password_hash)
    return decoded.replace('pokeapple_salt', '')
  } catch (error) {
    console.error('Failed to decode password hash:', error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log('Getting current user from localStorage...')

    const userData = localStorage.getItem('pokeapple_user')
    if (!userData) {
      console.log('No user data in localStorage')
      return null
    }

    const user = JSON.parse(userData)
    console.log('Found user in localStorage:', user.id)

    try {
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (dbError) {
        console.warn('Database verification error, using cached user:', dbError)
        return user
      }

      if (!dbUser) {
        console.log('User not found in database, clearing localStorage')
        localStorage.removeItem('pokeapple_user')
        return null
      }

      if (JSON.stringify(dbUser) !== userData) {
        console.log('Updating localStorage with latest user data')
        localStorage.setItem('pokeapple_user', JSON.stringify(dbUser))
      }

      return dbUser as User
    } catch (dbError) {
      console.warn('Error verifying user in database, falling back to cached user:', dbError)
      return user
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function signOut(): Promise<void> {
  try {
    console.log('Signing out user...')
    
    // Simply clear localStorage for custom auth
    localStorage.removeItem('pokeapple_user')
    
    console.log('Successfully signed out')
  } catch (error) {
    console.error('Complete signout error:', error)
    throw error
  }
}

// 게임 점수 관련 함수들 (API 라우트 사용)
export async function saveGameScore(score: number, mode: GameMode) {
  const user = await getCurrentUser()
  if (!user) throw new Error('로그인이 필요합니다')

  try {
    // API 라우트를 통해 점수 저장
    const response = await fetch('/api/save-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        score,
        mode,
        gameData: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '점수 저장 실패')
    }

    const result = await response.json()
    
    // localStorage의 사용자 정보도 업데이트
    if (result.isNewRecord) {
      const updateField = mode === 'normal' ? 'normal_best_score' : 'beginner_best_score'
      const updatedUser = { ...user, [updateField]: score }
      localStorage.setItem('pokeapple_user', JSON.stringify(updatedUser))
    }
    
    return result
  } catch (error) {
    console.error('Error saving score:', error)
    throw error
  }
}

export async function getRankingsByMode(mode: GameMode, limit = 10) {
  try {
    const response = await fetch(`/api/rankings?mode=${mode}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error fetching rankings:', errorData.error)
      return []
    }

    const data = await response.json()
    return (data.rankings ?? []) as RankingEntryWithTitle[]
  } catch (error) {
    console.error('Error fetching rankings:', error)
    return []
  }
}

export async function getUserBestScore(mode: GameMode) {
  const user = await getCurrentUser()
  if (!user) return null

  return mode === 'normal' ? user.normal_best_score : user.beginner_best_score
}

export async function getUserStats() {
  const user = await getCurrentUser()
  if (!user) return null

  return {
    normalBestScore: user.normal_best_score,
    beginnerBestScore: user.beginner_best_score,
    totalBestScore: user.normal_best_score + user.beginner_best_score
  }
}

// 사용자 랭킹 조회 함수
export async function getUserRanking(mode: GameMode) {
  const user = await getCurrentUser()
  if (!user) return null

  try {
    const response = await fetch(`/api/user-ranking?userId=${user.id}&mode=${mode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error fetching user ranking:', errorData.error)
      return null
    }

    const data = await response.json()
    return data.ranking
  } catch (error) {
    console.error('Error fetching user ranking:', error)
    return null
  }
}
