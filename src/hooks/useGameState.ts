'use client'

import { useReducer, useCallback, useEffect, useRef } from 'react'
import { GameState, GameMode, GAME_MODE_CONFIGS, GameTile } from '@/types/game'
import { createInitialGameState } from '@/lib/game/gameLogic'
import { hasValidMatches, shuffleExistingTiles, hasRemainingPokemon, findHintCombination } from '@/lib/game/shuffleLogic'
import { useAuth } from '@/contexts/AuthContext'
import { saveGameScore } from '@/lib/supabase'
import { validateScoreSubmission, startGameSession, endGameSession, validateGameSession } from '@/utils/securityUtils'
import { HINT_CONFIG } from '@/constants/gameConstants'

// --- 1. 상태, 액션 타입 정의 ---
export type GamePhase = 'main' | 'countdown' | 'playing' | 'paused' | 'gameOver'

interface ReducerState {
  gameState: GameState
  gamePhase: GamePhase
  countdownNumber: number
  selectedMode: GameMode
  isShuffling: boolean
  shuffleCount: number
  scoreSaved: boolean
  lastScoreTimestamp: number
  hintActive: boolean
  pausedFrom: GamePhase | null
}

type Action = 
  | { type: 'CHANGE_MODE'; mode: GameMode }
  | { type: 'START_COUNTDOWN' }
  | { type: 'DECREMENT_COUNTDOWN' }
  | { type: 'START_PLAYING' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'TICK' } // 시간 감소 액션
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'RESET_SHUFFLE_COUNT' }
  | { type: 'SHUFFLE_START' }
  | { type: 'SHUFFLE_COMPLETE'; board: GameTile[][] }
  | { type: 'SET_SCORE_SAVED'; saved: boolean }
  | { type: 'SET_GAME_STATE'; gameState: GameState }
  | { type: 'APPLY_GAME_STATE_UPDATER'; updater: (prev: GameState) => GameState | null }
  | { type: 'RECORD_SCORE_UPDATE'; timestamp: number }
  | { type: 'SET_HINT_ACTIVE'; active: boolean }
  | { type: 'SHOW_HINT'; tileIds: string[] }
  | { type: 'CLEAR_HINTS' }

// --- 2. 리듀서 함수 ---
function gameReducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case 'CHANGE_MODE':
      const initialState = getInitialState(action.mode)
      return {
        ...initialState,
        selectedMode: action.mode
      }
    case 'START_COUNTDOWN':
      return {
        ...state,
        gamePhase: 'countdown',
        countdownNumber: 3,
        gameState: {
          ...state.gameState,
          timeLeft: GAME_MODE_CONFIGS[state.selectedMode].timeLimit
        },
        pausedFrom: null
      }
    case 'DECREMENT_COUNTDOWN':
      return { ...state, countdownNumber: state.countdownNumber - 1 }
    case 'START_PLAYING':
      return { ...state, gamePhase: 'playing', pausedFrom: null }
    case 'PAUSE_GAME': {
      if (state.gamePhase !== 'playing' && state.gamePhase !== 'countdown') return state
      return { ...state, gamePhase: 'paused', pausedFrom: state.gamePhase }
    }
    case 'RESUME_GAME': {
      if (state.gamePhase !== 'paused') return state
      const resumePhase = state.pausedFrom && state.pausedFrom !== 'paused' ? state.pausedFrom : 'playing'
      return { ...state, gamePhase: resumePhase, pausedFrom: null }
    }
    case 'TICK':
      if (state.gamePhase !== 'playing') return state
      return { ...state, gameState: { ...state.gameState, timeLeft: state.gameState.timeLeft - 1 } }
    case 'END_GAME':
      return { ...state, gamePhase: 'gameOver', pausedFrom: null }
    case 'RESET_GAME': {
      const resetState = getInitialState(state.selectedMode)
      return {
        ...resetState,
        gameState: {
          ...resetState.gameState,
          score: 0,
          timeLeft: GAME_MODE_CONFIGS[state.selectedMode].timeLimit
        },
        gamePhase: 'main',
        pausedFrom: null
      }
    }
    case 'RESET_SHUFFLE_COUNT':
      return { ...state, shuffleCount: 0 }
    case 'SHUFFLE_START':
      return { ...state, isShuffling: true, shuffleCount: state.shuffleCount + 1 }
    case 'SHUFFLE_COMPLETE':
      return { ...state, isShuffling: false, gameState: { ...state.gameState, board: action.board } }
    case 'SET_SCORE_SAVED':
      return { ...state, scoreSaved: action.saved }
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.gameState }
    case 'APPLY_GAME_STATE_UPDATER': {
      const updatedGameState = action.updater(state.gameState)
      return updatedGameState ? { ...state, gameState: updatedGameState } : state
    }
    case 'RECORD_SCORE_UPDATE':
      return { ...state, lastScoreTimestamp: action.timestamp }
    case 'SET_HINT_ACTIVE':
      return { ...state, hintActive: action.active }
    case 'SHOW_HINT':
      return {
        ...state,
        hintActive: true,
        gameState: {
          ...state.gameState,
          board: state.gameState.board.map(row =>
            row.map(tile => {
              if (action.tileIds.includes(tile.id)) {
                return { ...tile, isHinted: true }
              }
              return { ...tile, isHinted: false }
            })
          )
        }
      }
    case 'CLEAR_HINTS':
      return {
        ...state,
        hintActive: false,
        gameState: {
          ...state.gameState,
          board: state.gameState.board.map(row =>
            row.map(tile => ({ ...tile, isHinted: false }))
          )
        }
      }
    default:
      return state
  }
}

// --- 3. 초기 상태 생성 함수 ---
function getInitialState(mode: GameMode): ReducerState {
  // 서버와 클라이언트에서 동일한 시드 사용 (hydration mismatch 방지)
  const seed = 12345
  const initialGameState = createInitialGameState(mode, seed)
  return {
    gameState: initialGameState,
    gamePhase: 'main',
    countdownNumber: 3,
    selectedMode: mode,
    isShuffling: false,
    shuffleCount: 0,
    scoreSaved: false,
    lastScoreTimestamp: Date.now(),
    hintActive: false,
    pausedFrom: null
  }
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

// --- 4. 커스텀 훅 ---
export function useGameState(initialMode: GameMode = 'normal') {
  const [state, dispatch] = useReducer(gameReducer, getInitialState(initialMode))
  const { isAuthenticated, user } = useAuth()
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { gameState, gamePhase, selectedMode, isShuffling, shuffleCount, scoreSaved, lastScoreTimestamp, hintActive } = state
  const prevScoreRef = useRef(gameState.score)

  // 점수 저장
  const handleSaveScore = useCallback(async () => {
    if (scoreSaved) return null
    dispatch({ type: 'SET_SCORE_SAVED', saved: true })

    if (!isAuthenticated) {
      return { success: false, score: gameState.score, isAuthenticated: false }
    }

    try {
      // 보안 검증
      const validation = validateScoreSubmission(
        gameState.score,
        selectedMode,
        user?.id,
        {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }
      )

      if (!validation.valid) {
        console.warn('Score submission validation failed:', validation.error)
        return { success: false, score: gameState.score, isAuthenticated: true, error: validation.error }
      }

      // 게임 세션 검증
      if (!validateGameSession()) {
        console.warn('Invalid game session')
        return { success: false, score: gameState.score, isAuthenticated: true, error: 'Invalid game session' }
      }

      const result = await saveGameScore(gameState.score, selectedMode)
      return { ...result, success: true, isAuthenticated: true }
    } catch (error) {
      dispatch({ type: 'SET_SCORE_SAVED', saved: false })
      return { success: false, score: gameState.score, isAuthenticated: true, error }
    }
  }, [gameState.score, isAuthenticated, selectedMode, scoreSaved, user?.id])

  // 게임 종료 (시간 초과 또는 수동)
  const endGame = useCallback(async () => {
    dispatch({ type: 'END_GAME' })
    const result = await handleSaveScore()
    endGameSession() // 게임 세션 종료
    return result
  }, [handleSaveScore])

  // 자동 셔플
  const performAutoShuffle = useCallback(async () => {
    if (isShuffling) return
    dispatch({ type: 'SHUFFLE_START' })
    console.log(`🔄 셔플 시작: ${shuffleCount + 1}번째`)

    await delay(500) // 셔플 애니메이션 시간
    // 셔플 시드: 현재 시간 + 셔플 횟수로 고유성 보장
    const shuffleSeed = (typeof window !== 'undefined' ? Date.now() : 12345) + shuffleCount
    const shuffledBoard = shuffleExistingTiles(gameState.board, shuffleSeed)
    dispatch({ type: 'SHUFFLE_COMPLETE', board: shuffledBoard })
    console.log('🔄 셔플 완료')
  }, [gameState.board, isShuffling, shuffleCount])

  // 매치 확인 및 자동 셔플
  const checkAndShuffle = useCallback(async () => {
    if (isShuffling) return

    if (!hasRemainingPokemon(gameState.board)) {
      console.log("🎉 게임 완료! 모든 포켓몬 제거.")
      await endGame()
      return
    }

    if (hasValidMatches(gameState.board)) {
      console.log("✅ 매치 가능한 조합 발견.")
      if (shuffleCount > 0) dispatch({ type: 'RESET_SHUFFLE_COUNT' }) // 셔플 후 매치 발견 시 셔플 횟수만 초기화
      return
    }

    if (shuffleCount >= 5) {
      console.log("❌ 최대 셔플 횟수 도달. 게임 종료.")
      await endGame()
      return
    }

    console.log(`🚫 매치 불가능! 자동 셔플 실행. (${shuffleCount + 1}/5)`)
    await performAutoShuffle()
  }, [gameState.board, isShuffling, shuffleCount, endGame, performAutoShuffle])

  // 타일 제거 후에만 셔플 체크하는 함수 (현재 보드 상태 기반)
  const checkAndShuffleAfterTileRemoval = useCallback(async (currentBoard?: GameTile[][]) => {
    if (isShuffling) return

    // 현재 보드 상태 사용 (타일 제거 완료 후)
    const boardToCheck = currentBoard || gameState.board

    if (!hasRemainingPokemon(boardToCheck)) {
      console.log("🎉 게임 완료! 모든 포켓몬 제거.")
      await endGame()
      return
    }

    if (hasValidMatches(boardToCheck)) {
      console.log("✅ 매치 가능한 조합 발견.")
      if (shuffleCount > 0) dispatch({ type: 'RESET_SHUFFLE_COUNT' }) // 셔플 후 매치 발견 시 셔플 횟수만 초기화
      return
    }

    if (shuffleCount >= 5) {
      console.log("❌ 최대 셔플 횟수 도달. 게임 종료.")
      await endGame()
      return
    }

    console.log(`🚫 매치 불가능! 자동 셔플 실행. (${shuffleCount + 1}/5)`)
    await performAutoShuffle()
  }, [gameState.board, isShuffling, shuffleCount, endGame, performAutoShuffle])

  // 카운트다운 시작
  const clearHintsAndResetTimer = useCallback((options?: { forceNewDelay?: boolean }) => {
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current)
      hintTimeoutRef.current = null
    }
    dispatch({ type: 'CLEAR_HINTS' })
    if (options?.forceNewDelay) {
      dispatch({ type: 'RECORD_SCORE_UPDATE', timestamp: Date.now() })
    }
  }, [dispatch])

  const startCountdown = useCallback(() => {
    startGameSession() // 게임 세션 시작
    
    // 클라이언트에서 랜덤 시드로 보드 재생성
    if (typeof window !== 'undefined') {
      const randomSeed = Date.now() + Math.random() * 1000
      const randomGameState = createInitialGameState(selectedMode, randomSeed)
      dispatch({ type: 'SET_GAME_STATE', gameState: randomGameState })
    }
    
    clearHintsAndResetTimer({ forceNewDelay: true })
    dispatch({ type: 'START_COUNTDOWN' })
  }, [selectedMode, clearHintsAndResetTimer])

  // 게임 리셋
  const resetGame = useCallback(() => {
    // 클라이언트에서 랜덤 시드로 보드 재생성
    if (typeof window !== 'undefined') {
      const randomSeed = Date.now() + Math.random() * 1000
      const randomGameState = createInitialGameState(selectedMode, randomSeed)
      dispatch({ type: 'SET_GAME_STATE', gameState: randomGameState })
    }
    clearHintsAndResetTimer({ forceNewDelay: true })
    dispatch({ type: 'RESET_GAME' })
  }, [selectedMode, clearHintsAndResetTimer])

  // 모드 변경
  const changeMode = useCallback((mode: GameMode) => {
    dispatch({ type: 'CHANGE_MODE', mode })
  }, [])

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' })
  }, [])

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' })
  }, [])

  // 카운트다운 로직
  useEffect(() => {
    if (gamePhase !== 'countdown') return

    if (state.countdownNumber <= 0) {
      dispatch({ type: 'START_PLAYING' })
      return
    }

    const timer = setTimeout(() => {
      dispatch({ type: 'DECREMENT_COUNTDOWN' })
    }, 1000)

    return () => clearTimeout(timer)
  }, [gamePhase, state.countdownNumber])

  // 게임 타이머 로직 (useGameTimer 통합)
  useEffect(() => {
    if (gamePhase !== 'playing') return

    if (gameState.timeLeft <= 0) {
      endGame()
      return
    }

    const gameTimer = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)

    return () => clearInterval(gameTimer)
  }, [gamePhase, gameState.timeLeft, endGame])

  // 점수 변화 감지 (힌트 비활성화 유지)
  useEffect(() => {
    if (gamePhase !== 'playing') {
      prevScoreRef.current = gameState.score
      clearHintsAndResetTimer()
      return
    }

    if (gameState.score !== prevScoreRef.current) {
      prevScoreRef.current = gameState.score
      dispatch({ type: 'RECORD_SCORE_UPDATE', timestamp: Date.now() })
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current)
        hintTimeoutRef.current = null
      }
    }
  }, [gamePhase, gameState.score, dispatch, clearHintsAndResetTimer])

  // 힌트 자동 표시 타이머 관리
  useEffect(() => {
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current)
      hintTimeoutRef.current = null
    }

    if (gamePhase !== 'playing' || isShuffling || hintActive) {
      return
    }

    const now = Date.now()
    const elapsed = now - lastScoreTimestamp
    const delay = Math.max(HINT_CONFIG.AUTO_REVEAL_DELAY_MS - elapsed, 0)

    hintTimeoutRef.current = setTimeout(() => {
      hintTimeoutRef.current = null
      const hintTiles = findHintCombination(state.gameState.board)
      if (hintTiles && hintTiles.length > 0) {
        dispatch({ type: 'SHOW_HINT', tileIds: hintTiles.map(tile => tile.id) })
      }
    }, delay)

    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current)
        hintTimeoutRef.current = null
      }
    }
  }, [gamePhase, lastScoreTimestamp, isShuffling, hintActive, state.gameState.board, dispatch])

  // 셔플 후 재검사 로직 (제거 - 타일 제거 후 불필요한 재검사 방지)
  // useEffect(() => {
  //   // 셔플이 막 끝났고, 게임이 진행중일 때만 재검사
  //   if (!isShuffling && gamePhase === 'playing') {
  //     const check = async () => {
  //       await delay(100) // 상태 업데이트 후 잠시 대기
  //       console.log('🔍 셔플 후 매치 가능성 재검사...')
  //       await checkAndShuffle()
  //     }
  //     check()
  //   }
  // }, [isShuffling, gamePhase, checkAndShuffle])

  return {
    ...state,
    dispatch,
    startCountdown,
    resetGame,
    checkAndShuffle,
    checkAndShuffleAfterTileRemoval,
    endGame,
    handleSaveScore,
    changeMode,
    setSelectedMode: changeMode,
    pauseGame,
    resumeGame,
    timeLeft: gameState.timeLeft,
    setTimeLeft: () => dispatch({ type: 'TICK' }),
    isHintActive: hintActive,
    setGameState: (updater: ((prev: GameState | null) => GameState | null) | GameState) => {
      if (typeof updater === 'function') {
        dispatch({ type: 'APPLY_GAME_STATE_UPDATER', updater: updater as (prev: GameState) => GameState | null })
      } else {
        dispatch({ type: 'SET_GAME_STATE', gameState: updater })
      }
    },
    clearHints: clearHintsAndResetTimer
  }
}
 