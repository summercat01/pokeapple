'use client'

import { useState, useCallback, useMemo } from 'react'
import { useAudio } from '@/hooks/useAudio'
import { GamePhase } from './useGameState'

export function useGameAudio() {
  const [isMusicEnabled, setIsMusicEnabled] = useState(true)
  
  // 오디오 훅들
  const backgroundMusic = useAudio('/background-music.mp3', { 
    loop: true, 
    volume: 1.0
  })
  
  const successSound = useAudio('/success-sound.mp3', { 
    loop: false, 
    volume: 0.5 
  })
  
  const failSound = useAudio('/fail-sound.mp3', { 
    loop: false, 
    volume: 0.4 
  })
  
  const gameOverSound = useAudio('/gameover-sound.mp3', { 
    loop: false, 
    volume: 0.6 
  })

  // 배경음악 시작
  const startBackgroundMusic = useCallback(() => {
    if (isMusicEnabled) {
      backgroundMusic.play()
    }
  }, [isMusicEnabled, backgroundMusic])

  // 배경음악 정지
  const stopBackgroundMusic = useCallback(() => {
    backgroundMusic.pause()
    if (backgroundMusic.audio) {
      backgroundMusic.audio.currentTime = 0
    }
  }, [backgroundMusic])

  // 성공 효과음 재생
  const playSuccessSound = useCallback(() => {
    if (isMusicEnabled) {
      successSound.play()
    }
  }, [isMusicEnabled, successSound])

  // 실패 효과음 재생
  const playFailSound = useCallback(() => {
    if (isMusicEnabled) {
      failSound.play()
    }
  }, [isMusicEnabled, failSound])

  // 게임오버 효과음 재생
  const playGameOverSound = useCallback(() => {
    if (isMusicEnabled) {
      gameOverSound.play()
    }
  }, [isMusicEnabled, gameOverSound])

  // 음악 토글
  const toggleMusic = useCallback((gamePhase: GamePhase) => {
    if (isMusicEnabled) {
      backgroundMusic.pause()
      setIsMusicEnabled(false)
    } else {
      if (gamePhase === 'playing' || gamePhase === 'countdown') {
        backgroundMusic.play()
      }
      setIsMusicEnabled(true)
    }
  }, [isMusicEnabled, backgroundMusic])

  return useMemo(() => ({
    isMusicEnabled,
    startBackgroundMusic,
    stopBackgroundMusic,
    playSuccessSound,
    playFailSound,
    playGameOverSound,
    toggleMusic
  }), [
    isMusicEnabled,
    startBackgroundMusic,
    stopBackgroundMusic,
    playSuccessSound,
    playFailSound,
    playGameOverSound,
    toggleMusic
  ])
} 