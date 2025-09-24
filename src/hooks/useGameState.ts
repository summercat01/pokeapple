'use client'

import { useReducer, useCallback, useEffect } from 'react'
import { GameState, GameMode, GAME_MODE_CONFIGS, GameTile } from '@/types/game'
import { createInitialGameState } from '@/lib/game/gameLogic'
import { hasValidMatches, shuffleExistingTiles, hasRemainingPokemon } from '@/lib/game/shuffleLogic'
import { useAuth } from '@/contexts/AuthContext'
import { saveGameScore } from '@/lib/supabase'
import { validateScoreSubmission, startGameSession, endGameSession, validateGameSession } from '@/utils/securityUtils'

// --- 1. 상태, 액션 타입 정의 ---
export type GamePhase = 'main' | 'countdown' | 'playing' | 'gameOver'

interface ReducerState {
  gameState: GameState
  gamePhase: GamePhase
  countdownNumber: number
  selectedMode: GameMode
  isShuffling: boolean
  shuffleCount: number
  scoreSaved: boolean
}

type Action = 
  | { type: 'CHANGE_MODE'; mode: GameMode }
  | { type: 'START_COUNTDOWN' }
  | { type: 'DECREMENT_COUNTDOWN' }
  | { type: 'START_PLAYING' }
  | { type: 'TICK' } // 시간 감소 액션
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'SHUFFLE_START' }
  | { type: 'SHUFFLE_COMPLETE'; board: GameTile[][] }
  | { type: 'UPDATE_BOARD_AND_SCORE'; board: GameTile[][]; score: number }
  | { type: 'SET_SCORE_SAVED'; saved: boolean }
  | { type: 'SET_GAME_STATE'; gameState: GameState }

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
        }
      }
    case 'DECREMENT_COUNTDOWN':
      return { ...state, countdownNumber: state.countdownNumber - 1 }
    case 'START_PLAYING':
      return { ...state, gamePhase: 'playing' }
    case 'TICK':
      if (state.gamePhase !== 'playing') return state
      return { ...state, gameState: { ...state.gameState, timeLeft: state.gameState.timeLeft - 1 } }
    case 'END_GAME':
      return { ...state, gamePhase: 'gameOver' }
    case 'RESET_GAME':
      return getInitialState(state.selectedMode)
    case 'SHUFFLE_START':
      return { ...state, isShuffling: true, shuffleCount: state.shuffleCount + 1 }
    case 'SHUFFLE_COMPLETE':
      return { ...state, isShuffling: false, gameState: { ...state.gameState, board: action.board } }
    case 'UPDATE_BOARD_AND_SCORE':
      return { ...state, gameState: { ...state.gameState, board: action.board, score: action.score } }
    case 'SET_SCORE_SAVED':
      return { ...state, scoreSaved: action.saved }
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.gameState }
    default:
      return state
  }
}

// --- 3. 초기 상태 생성 함수 ---
function getInitialState(mode: GameMode): ReducerState {
  // 서버와 클라이언트에서 동일한 시드 사용 (hydration mismatch 방지)
  const seed = 12345 // 고정 시드 사용
  const initialGameState = createInitialGameState(mode, seed)
  return {
    gameState: initialGameState,
    gamePhase: 'main',
    countdownNumber: 3,
    selectedMode: mode,
    isShuffling: false,
    shuffleCount: 0,
    scoreSaved: false
  }
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

// --- 4. 커스텀 훅 ---
export function useGameState(initialMode: GameMode = 'normal') {
  const [state, dispatch] = useReducer(gameReducer, getInitialState(initialMode))
  const { isAuthenticated, user } = useAuth()

  const { gameState, gamePhase, selectedMode, isShuffling, shuffleCount, scoreSaved } = state

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
      if (shuffleCount > 0) dispatch({ type: 'RESET_GAME' }) // Reset shuffle count if matches are found after a shuffle
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
  const startCountdown = useCallback(() => {
    startGameSession() // 게임 세션 시작
    dispatch({ type: 'START_COUNTDOWN' })
  }, [])

  // 게임 리셋
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
  }, [])

  // 모드 변경
  const changeMode = useCallback((mode: GameMode) => {
    dispatch({ type: 'CHANGE_MODE', mode })
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

  // 셔플 후 재검사 로직
  useEffect(() => {
    // 셔플이 막 끝났고, 게임이 진행중일 때만 재검사
    if (!isShuffling && gamePhase === 'playing') {
      const check = async () => {
        await delay(100) // 상태 업데이트 후 잠시 대기
        console.log('🔍 셔플 후 매치 가능성 재검사...')
        await checkAndShuffle()
      }
      check()
    }
  }, [isShuffling, gamePhase, checkAndShuffle])

  return {
    ...state,
    dispatch,
    startCountdown,
    resetGame,
    checkAndShuffle,
    endGame,
    handleSaveScore,
    changeMode,
    setSelectedMode: changeMode,
    timeLeft: gameState.timeLeft,
    setTimeLeft: () => dispatch({ type: 'TICK' }),
    setGameState: (updater: ((prev: GameState | null) => GameState | null) | GameState) => {
      if (typeof updater === 'function') {
        const newState = updater(gameState)
        if (newState) {
          dispatch({ type: 'SET_GAME_STATE', gameState: newState })
        }
      } else {
        dispatch({ type: 'SET_GAME_STATE', gameState: updater })
      }
    }
  }
}
 