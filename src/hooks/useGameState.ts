'use client'

import { useState, useEffect } from 'react'
import { GameState, GameMode, GAME_MODE_CONFIGS } from '@/types/game'
import { createInitialGameState } from '@/lib/game/gameLogic'
import { hasValidMatches, shuffleExistingTiles, hasRemainingPokemon } from '@/lib/game/shuffleLogic'
import { useAuth } from '@/contexts/AuthContext'
import { saveGameScore } from '@/lib/supabase'

export type GamePhase = 'main' | 'countdown' | 'playing' | 'gameOver'

export function useGameState(initialMode: GameMode = 'normal') {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [gamePhase, setGamePhase] = useState<GamePhase>('main')
  const [countdownNumber, setCountdownNumber] = useState(3)
  const [timeLeft, setTimeLeft] = useState(120)
  const [selectedMode, setSelectedMode] = useState<GameMode>(initialMode)
  const [scoreSaved, setScoreSaved] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  
  const { isAuthenticated } = useAuth()

  // 게임 초기화
  useEffect(() => {
    const newGameState = createInitialGameState(selectedMode)
    setGameState(newGameState)
    setTimeLeft(newGameState.timeLeft)
    setScoreSaved(false)
  }, [selectedMode])

  // 점수 저장 함수
  const handleSaveScore = async () => {
    if (!gameState || scoreSaved) return null
    
    // 인증되지 않은 사용자는 점수를 저장하지 않지만 결과는 반환
    if (!isAuthenticated) {
      return { 
        success: false, 
        score: gameState.score, 
        isAuthenticated: false,
        isPerfectGame: gameState.score === 144
      }
    }
    
    try {
      setScoreSaved(true)
      const result = await saveGameScore(gameState.score, selectedMode)
      
      return {
        success: true,
        score: result.score,
        isAuthenticated: true,
        isNewRecord: result.isNewRecord,
        previousBest: result.isNewRecord ? result.previousBest : undefined,
        currentBest: !result.isNewRecord ? result.currentBest : undefined,
        isPerfectGame: result.score === 144,
        mode: selectedMode
      }
    } catch (error) {
      console.error('점수 저장 실패:', error)
      setScoreSaved(false)
      return {
        success: false,
        score: gameState.score,
        isAuthenticated: true,
        error: error instanceof Error ? error.message : '점수 저장에 실패했습니다',
        isPerfectGame: gameState.score === 144
      }
    }
  }

  // 게임 시작
  const startCountdown = () => {
    setGamePhase('countdown')
    setCountdownNumber(3)
    const modeConfig = GAME_MODE_CONFIGS[selectedMode]
    setTimeLeft(modeConfig.timeLimit)
    
    const countdownInterval = setInterval(() => {
      setCountdownNumber(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setGamePhase('playing')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 게임 리셋
  const resetGame = () => {
    setGamePhase('main')
    const newGameState = createInitialGameState(selectedMode)
    setGameState(newGameState)
    setTimeLeft(newGameState.timeLeft)
    setScoreSaved(false)
  }

  // 자동 셔플
  const performAutoShuffle = () => {
    if (!gameState || isShuffling) return
    
    setIsShuffling(true)
    
    setTimeout(() => {
      setGameState(prev => {
        if (!prev) return null
        const shuffledBoard = shuffleExistingTiles(prev.board)
        return { ...prev, board: shuffledBoard }
      })
      
      setTimeout(() => {
        setIsShuffling(false)
      }, 500)
    }, 500)
  }

  // 매치 가능 여부 체크 및 자동 셔플
  const checkAndShuffle = async () => {
    if (!gameState || isShuffling) return
    
    // 남은 포켓몬이 없으면 게임 완료
    if (!hasRemainingPokemon(gameState.board)) {
      console.log("게임 완료! 모든 포켓몬을 제거했습니다.")
      setGamePhase('gameOver')
      const result = await handleSaveScore()
      return result
    }
    
    // 매치 가능한 조합이 있으면 셔플 불필요
    if (hasValidMatches(gameState.board)) {
      console.log("매치 가능한 조합이 있습니다.")
      return
    }
    
    console.log("매치 불가능! 자동 셔플을 시작합니다.")
    performAutoShuffle()
  }

  // 게임 종료 처리
  const endGame = async () => {
    setGamePhase('gameOver')
    const result = await handleSaveScore()
    return result
  }

  return {
    // 상태
    gameState,
    gamePhase,
    countdownNumber,
    timeLeft,
    selectedMode,
    scoreSaved,
    isShuffling,
    
    // 액션
    setGameState,
    setGamePhase,
    setTimeLeft,
    setSelectedMode,
    startCountdown,
    resetGame,
    checkAndShuffle,
    endGame,
    handleSaveScore
  }
} 