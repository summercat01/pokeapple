'use client'

import { useEffect, useRef } from 'react'
import { GamePhase } from './useGameState'

interface UseGameTimerProps {
  gamePhase: GamePhase
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>
  onTimeUp: () => void
}

export function useGameTimer({ gamePhase, setTimeLeft, onTimeUp }: UseGameTimerProps) {
  const onTimeUpRef = useRef(onTimeUp)
  
  // onTimeUp 콜백을 최신으로 유지
  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    if (gamePhase === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            onTimeUpRef.current()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gamePhase, setTimeLeft])
} 