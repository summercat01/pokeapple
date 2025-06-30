'use client'

import { useState } from 'react'
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
  const startBackgroundMusic = () => {
    if (isMusicEnabled) {
      backgroundMusic.play()
    }
  }

  // 배경음악 정지
  const stopBackgroundMusic = () => {
    backgroundMusic.pause()
    if (backgroundMusic.audio) {
      backgroundMusic.audio.currentTime = 0
    }
  }

  // 성공 효과음 재생
  const playSuccessSound = () => {
    if (isMusicEnabled) {
      successSound.play()
    }
  }

  // 실패 효과음 재생
  const playFailSound = () => {
    if (isMusicEnabled) {
      failSound.play()
    }
  }

  // 게임오버 효과음 재생
  const playGameOverSound = () => {
    if (isMusicEnabled) {
      gameOverSound.play()
    }
  }

  // 음악 토글
  const toggleMusic = (gamePhase: GamePhase) => {
    if (isMusicEnabled) {
      backgroundMusic.pause()
      setIsMusicEnabled(false)
    } else {
      if (gamePhase === 'playing' || gamePhase === 'countdown') {
        backgroundMusic.play()
      }
      setIsMusicEnabled(true)
    }
  }

  return {
    isMusicEnabled,
    startBackgroundMusic,
    stopBackgroundMusic,
    playSuccessSound,
    playFailSound,
    playGameOverSound,
    toggleMusic
  }
} 