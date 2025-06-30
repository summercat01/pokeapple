'use client'

import { useEffect } from 'react'
import { GamePhase } from './useGameState'

interface UseGameTimerProps {
  gamePhase: GamePhase
  timeLeft: number
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>
  onTimeUp: () => void
}

export function useGameTimer({ gamePhase, timeLeft, setTimeLeft, onTimeUp }: UseGameTimerProps) {
  useEffect(() => {
    if (gamePhase === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const nextTime = prev - 1
          if (nextTime <= 0) {
            onTimeUp()
            return 0
          }
          return nextTime
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gamePhase, timeLeft, setTimeLeft, onTimeUp])
} 