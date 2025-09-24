// 클라이언트 측 보안 검증 유틸리티

/**
 * 점수 유효성 검증
 */
export function validateScore(score: number): boolean {
  return (
    typeof score === 'number' &&
    !isNaN(score) &&
    isFinite(score) &&
    score >= 0 &&
    score <= 999999 &&
    Number.isInteger(score)
  )
}

/**
 * 게임 모드 유효성 검증
 */
export function validateGameMode(mode: string): mode is 'normal' | 'beginner' {
  return mode === 'normal' || mode === 'beginner'
}

/**
 * 사용자 ID 유효성 검증
 */
export function validateUserId(userId: unknown): boolean {
  return (
    typeof userId === 'number' &&
    Number.isInteger(userId) &&
    userId > 0
  )
}

/**
 * 게임 데이터 유효성 검증
 */
export function validateGameData(gameData: unknown): boolean {
  if (!gameData || typeof gameData !== 'object') {
    return false
  }

  const data = gameData as Record<string, unknown>

  // 타임스탬프 검증 (최근 1시간 이내)
  if (data.timestamp && typeof data.timestamp === 'string') {
    const gameTime = new Date(data.timestamp).getTime()
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    
    if (isNaN(gameTime) || now - gameTime > oneHour || gameTime > now) {
      return false
    }
  }

  return true
}

/**
 * 요청 빈도 제한 (클라이언트 측)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  canMakeRequest(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // 오래된 요청 제거 (1분 이상)
    const recentRequests = requests.filter(time => now - time < windowMs)
    
    if (recentRequests.length >= maxRequests) {
      return false
    }
    
    recentRequests.push(now)
    this.requests.set(key, recentRequests)
    return true
  }
}

export const rateLimiter = new RateLimiter()

/**
 * 게임 점수 저장 전 검증
 */
export function validateScoreSubmission(
  score: number, 
  mode: string, 
  userId: unknown, 
  gameData: unknown
): { valid: boolean; error?: string } {
  // 점수 검증
  if (!validateScore(score)) {
    return { valid: false, error: 'Invalid score' }
  }

  // 게임 모드 검증
  if (!validateGameMode(mode)) {
    return { valid: false, error: 'Invalid game mode' }
  }

  // 사용자 ID 검증
  if (!validateUserId(userId)) {
    return { valid: false, error: 'Invalid user ID' }
  }

  // 게임 데이터 검증
  if (!validateGameData(gameData)) {
    return { valid: false, error: 'Invalid game data' }
  }

  // 요청 빈도 제한
  if (!rateLimiter.canMakeRequest(`score_${userId}`, 5, 60000)) {
    return { valid: false, error: 'Too many requests' }
  }

  return { valid: true }
}

/**
 * 도메인 검증 (클라이언트 측)
 */
export function validateOrigin(): boolean {
  if (typeof window === 'undefined') return true

  const allowedOrigins = [
    'http://localhost:3000',
    'https://pokeapple.vercel.app',
    // 프로덕션 도메인 추가
  ]

  return allowedOrigins.includes(window.location.origin)
}

/**
 * 게임 세션 검증
 */
export function validateGameSession(): boolean {
  if (typeof window === 'undefined') return true

  // 게임이 실제로 플레이되었는지 확인하는 간단한 검증
  const gameStartTime = sessionStorage.getItem('gameStartTime')
  if (!gameStartTime) return false

  const startTime = parseInt(gameStartTime)
  const now = Date.now()
  const gameDuration = now - startTime

  // 최소 10초, 최대 30분 게임 시간
  return gameDuration >= 10000 && gameDuration <= 1800000
}

/**
 * 게임 세션 시작
 */
export function startGameSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('gameStartTime', Date.now().toString())
  }
}

/**
 * 게임 세션 종료
 */
export function endGameSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('gameStartTime')
  }
}
