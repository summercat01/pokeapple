import { useEffect, useRef } from 'react'

interface UseAudioOptions {
  loop?: boolean
  volume?: number
}

export function useAudio(src: string, options: UseAudioOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { loop = true, volume = 0.3 } = options

  useEffect(() => {
    audioRef.current = new Audio(src)
    audioRef.current.loop = loop
    audioRef.current.volume = volume
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [src, loop, volume])

  const play = async () => {
    try {
      if (audioRef.current) {
        await audioRef.current.play()
      }
    } catch (error) {
      console.log('음악 재생 실패:', error)
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume))
    }
  }

  return { play, pause, setVolume, audio: audioRef.current }
}
