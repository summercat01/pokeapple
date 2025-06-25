'use client'

import { useState, useEffect } from 'react'
import { GameState } from '@/types/game'
import { createInitialGameState } from '@/lib/game/gameLogic'
import { useAudio } from '@/hooks/useAudio'
import TileGrid from './TileGrid'
import ScoreDisplay from './ScoreDisplay'

interface GameBoardProps {
  onBackToStart?: () => void
}

type GamePhase = 'main' | 'countdown' | 'playing' | 'gameOver'

export default function GameBoard({ onBackToStart }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [gamePhase, setGamePhase] = useState<GamePhase>('main')
  const [countdownNumber, setCountdownNumber] = useState(3)
  const [timeLeft, setTimeLeft] = useState(120) // 120초 타이머 다시 추가
  const [isMusicEnabled, setIsMusicEnabled] = useState(true)
  const [musicVolume, setMusicVolume] = useState(0.3)
  
  // 배경음악 훅
  const backgroundMusic = useAudio('/background-music.mp3', { 
    loop: true, 
    volume: 1.0
  })
  
  // 효과음 훅
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
  
  // 드래그 상태
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragEnd, setDragEnd] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setGameState(createInitialGameState())
  }, [])

  // 게임 타이머 (다시 활성화)
  useEffect(() => {
    if (gamePhase === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGamePhase('gameOver')
            // 게임 오버 시 음악 정지 및 효과음 재생
            backgroundMusic.pause()
            if (isMusicEnabled) {
              gameOverSound.play()
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gamePhase, timeLeft, backgroundMusic, isMusicEnabled, gameOverSound])

  const startCountdown = () => {
    setGamePhase('countdown')
    setCountdownNumber(3)
    setTimeLeft(120) // 타이머 초기화
    
    // 배경음악 시작
    if (isMusicEnabled) {
      backgroundMusic.play()
    }
    
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

  const resetGame = () => {
    setGamePhase('main')
    setGameState(createInitialGameState())
    setTimeLeft(120) // 타이머 초기화
    
    // 배경음악 정지 및 처음부터 재생 준비
    backgroundMusic.pause()
    if (backgroundMusic.audio) {
      backgroundMusic.audio.currentTime = 0
    }
  }

  const handleRestart = () => {
    resetGame()
  }
  
  // 음악 토글 함수
  const toggleMusic = () => {
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
  
  // 음량 조절 함수
  const handleVolumeChange = (newVolume: number) => {
    setMusicVolume(newVolume)
    backgroundMusic.setVolume(newVolume)
  }

  // 드래그 함수들
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    // 테두리 60px를 빼서 실제 콘텐츠 영역 기준으로 계산
    const x = e.clientX - rect.left - 60
    const y = e.clientY - rect.top - 60
    
    setIsDragging(true)
    setDragStart({ x, y })
    setDragEnd({ x, y })
    
    // 드래그 시작 시 모든 선택 해제
    if (gameState) {
      const newBoard = gameState.board.map(row =>
        row.map(tile => ({ ...tile, isSelected: false }))
      )
      setGameState(prev => prev ? { ...prev, board: newBoard } : null)
    }
    
    console.log('드래그 시작:', { x, y })
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    // 동일하게 테두리 60px 빼기
    const x = e.clientX - rect.left - 60
    const y = e.clientY - rect.top - 60
    
    setDragEnd({ x, y })
    
    // 드래그 영역 내의 타일들 선택
    if (gameState) {
      const minX = Math.min(dragStart.x, x)
      const maxX = Math.max(dragStart.x, x)
      const minY = Math.min(dragStart.y, y)
      const maxY = Math.max(dragStart.y, y)
      
      const newBoard = gameState.board.map((row, rowIndex) =>
        row.map((tile, colIndex) => {
          if (tile.isEmpty) return tile
          
          // 타일의 실제 위치 계산 (py-16=64px, px-20=80px 패딩 고려)
          const tileSize = 60
          const gap = 12
          const paddingY = 64 // py-16
          const paddingX = 80 // px-20
          
          // 타일의 중심점 좌표 계산
          const tileCenterX = colIndex * (tileSize + gap) + paddingX + (tileSize / 2)
          const tileCenterY = rowIndex * (tileSize + gap) + paddingY + (tileSize / 2)
          
          // 타일 중심점이 드래그 영역 내에 있는지 확인
          const isSelected = tileCenterX >= minX && tileCenterX <= maxX &&
                           tileCenterY >= minY && tileCenterY <= maxY
          
          return { ...tile, isSelected }
        })
      )
      
      setGameState(prev => prev ? { ...prev, board: newBoard } : null)
    }
  }
  
  const handleMouseUp = () => {
    if (!isDragging || !gameState) return
    
    setIsDragging(false)
    
    // 선택된 타일들 가져오기
    const selectedTiles = gameState.board.flat().filter(tile => tile.isSelected)
    
    console.log('드래그 완료:')
    console.log('- 선택된 타일 수:', selectedTiles.length)
    console.log('- 선택된 타일들:', selectedTiles.map(t => `${t.pokemon.name}(${t.pokemon.types.join('/')})`))
    
    if (selectedTiles.length >= 2) {
      // 같은 타입인지 확인 (복합 타입 고려)
      const firstTileTypes = selectedTiles[0].pokemon.types
      console.log('- 첫 번째 타일 타입:', firstTileTypes)
      
      const allSameType = selectedTiles.every(tile => {
        const hasMatchingType = tile.pokemon.types.some(type => firstTileTypes.includes(type))
        console.log(`  ${tile.pokemon.name}(${tile.pokemon.types.join('/')}) -> 매칭: ${hasMatchingType}`)
        return hasMatchingType
      })
      
      console.log('- 모두 같은 타입:', allSameType)
      
      if (allSameType) {
        // 같은 타입! 점수 추가 및 타일 제거
        const points = selectedTiles.length
        
        // 1단계: 튀겨나가는 애니메이션 시작
        const boardWithAnimation = gameState.board.map(row =>
          row.map(tile => {
            if (tile.isSelected) {
              // 랜덤 방향으로 튀겨나가기
              const bounceX = (Math.random() - 0.5) * 400 // -200 ~ 200
              const bounceY = -Math.random() * 50 - 50 // -50 ~ -100 (위로)
              
              return { 
                ...tile, 
                isRemoving: true,
                bounceX,
                bounceY,
                isSelected: false 
              }
            }
            return { ...tile, isSelected: false }
          })
        )
        
        // 점수 업데이트와 애니메이션 시작
        setGameState(prev => prev ? {
          ...prev,
          board: boardWithAnimation,
          score: prev.score + points
        } : null)
        
        // 2단계: 1초 후 빈 공간으로 교체
        setTimeout(() => {
          setGameState(prev => {
            if (!prev) return null
            
            const boardWithEmptySpaces = prev.board.map(row =>
              row.map(tile => {
                if (tile.isRemoving) {
                  return { ...tile, isEmpty: true, isRemoving: false, bounceX: undefined, bounceY: undefined }
                }
                return tile
              })
            )
            
            return {
              ...prev,
              board: boardWithEmptySpaces
            }
          })
        }, 1000)
        
        console.log(`성공! ${selectedTiles.length}개 매칭, +${points}점`)
        
        // 성공 효과음 재생
        if (isMusicEnabled) {
          successSound.play()
        }
      } else {
        // 다른 타입! 선택만 해제
        const newBoard = gameState.board.map(row =>
          row.map(tile => ({ ...tile, isSelected: false }))
        )
        setGameState(prev => prev ? { ...prev, board: newBoard } : null)
        
        console.log('실패! 다른 타입들입니다.')
        
        // 실패 효과음 재생
        if (isMusicEnabled) {
          failSound.play()
        }
      }
    } else {
      // 3개 미만! 선택만 해제
      const newBoard = gameState.board.map(row =>
        row.map(tile => ({ ...tile, isSelected: false }))
      )
      setGameState(prev => prev ? { ...prev, board: newBoard } : null)
      
      if (selectedTiles.length > 0) {
        console.log(`실패! 2개 이상 선택해야 합니다. (현재: ${selectedTiles.length}개)`)
        
        // 실패 효과음 재생
        if (isMusicEnabled) {
          failSound.play()
        }
      }
    }
  }

  if (!gameState) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-100 p-1">
      <div className="flex flex-col items-center gap-6 w-full px-1 pt-8">
        {/* 게임 보드 */}
        <div 
          className="relative grid gap-3 py-16 px-20 rounded-xl shadow-xl select-none"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
            backgroundColor: '#d5f6cd',
            width: 'fit-content',
            margin: '0 auto',
            maxWidth: '95vw',
            borderWidth: '60px',
            borderStyle: 'solid',
            borderColor: '#00cc66',
            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
          onMouseDown={gamePhase === 'playing' ? handleMouseDown : undefined}
          onMouseMove={gamePhase === 'playing' ? handleMouseMove : undefined}
          onMouseUp={gamePhase === 'playing' ? handleMouseUp : undefined}
          onMouseLeave={gamePhase === 'playing' ? handleMouseUp : undefined}
        >
          {/* 게임보드 안쪽 상단 우측 - 점수 */}
          {gamePhase === 'playing' && (
            <>
              {/* 점수 표시 - 오른쪽 빈 공간 첫 번째 행 높이 */}
              <div 
                className="absolute z-20"
                style={{
                  top: '64px',
                  right: '50px'
                }}
              >
                <span className="text-4xl font-bold" style={{ color: '#00cc66' }}>{gameState.score}</span>
              </div>
              
              {/* 시간 진행바 - 점수 밑에 세로로 */}
              <div 
                className="absolute z-20"
                style={{
                  top: '160px', // 점수 밑 + 30px 더 아래로
                  right: '70px', // 중앙 정렬
                  height: '500px', // 세로 길이 더 길게
                  width: '16px'
                }}
              >
                {/* 배경 바 (세로) - 투명하고 직각, 테두리 */}
                <div 
                  className="w-full h-full bg-transparent overflow-hidden relative"
                  style={{
                    border: '2px solid #00cc66'
                  }}
                >
                  {/* 진행 바 (위에서 아래로 차오르기) - 직각 */}
                  <div 
                    className="absolute bottom-0 w-full transition-all duration-1000 ease-linear"
                    style={{
                      height: `${(timeLeft / 120) * 100}%`,
                      backgroundColor: '#00cc66'
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* 게임보드 안쪽 하단 좌측 - Reset 버튼 */}
          {gamePhase === 'playing' && (
            <>
              <button
                onClick={handleRestart}
                className="absolute bg-transparent hover:bg-white hover:bg-opacity-80 text-white hover:text-gray-800 font-bold text-xs px-4 py-2 rounded-md border-2 border-white shadow-lg transition-all duration-200 hover:scale-105 z-20"
                style={{
                  bottom: '-52px',
                  left: '80px'
                }}
              >
                Reset
              </button>
              
              {/* 음악 토글 버튼 */}
              <button
                onClick={toggleMusic}
                className="absolute bg-transparent hover:bg-white hover:bg-opacity-80 text-white hover:text-gray-800 font-bold text-xs px-4 py-2 rounded-md border-2 border-white shadow-lg transition-all duration-200 hover:scale-105 z-20"
                style={{
                  bottom: '-52px',
                  left: '160px'
                }}
              >
                {isMusicEnabled ? '🎵 ON' : '🔇 OFF'}
              </button>
            </>
          )}

          {/* 메인 화면 오버레이 */}
          {gamePhase === 'main' && (
            <div 
              className="absolute inset-0 flex items-center justify-center rounded-lg z-10"
              style={{
                backgroundColor: '#d5f6cd' // 완전 불투명하게
              }}
            >
              <div className="text-center">
                <h1 className="text-6xl font-bold mb-8">
                  <span style={{ color: '#ff6600' }}>포켓몬 </span>
                  <span style={{ color: '#00cc66' }}>사과게임</span>
                </h1>
                
                <button
                  onClick={startCountdown}
                  className="text-white font-bold text-4xl px-16 py-8 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 border-4 mb-8"
                  style={{
                    backgroundColor: '#ff3603',
                    borderColor: '#ff3603'
                  }}
                >
                  🎮 Play
                </button>
                
                <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
                  같은 타입의 포켓몬들을 드래그로 선택하여 점수를 얻으세요!
                  <br/>
                  복합 타입 포켓몬은 어느 타입으로든 매칭 가능합니다.
                </p>
                
                {/* 음악 설정 버튼 */}
                <div className="flex justify-center">
                  <button
                    onClick={toggleMusic}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold text-lg px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 border-2 border-gray-600"
                  >
                    {isMusicEnabled ? '🎵 음악 ON' : '🔇 음악 OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 카운트다운 오버레이 */}
          {gamePhase === 'countdown' && (
            <div 
              className="absolute inset-0 flex items-center justify-center rounded-lg z-10"
              style={{
                backgroundColor: '#d5f6cd' // 완전 불투명하게
              }}
            >
              <div className="text-center">
                <div 
                  className="text-9xl font-bold animate-pulse"
                  style={{ color: '#ff3603' }}
                >
                  {countdownNumber}
                </div>
                <p className="text-2xl text-gray-700 mt-4">게임 시작 준비중...</p>
              </div>
            </div>
          )}

          {/* 게임 오버 오버레이 */}
          {gamePhase === 'gameOver' && (
            <div 
              className="absolute inset-0 flex items-center justify-center rounded-lg z-10"
              style={{
                backgroundColor: 'rgba(213, 246, 205, 0.3)' // 반투명하게 바꿀어서 게임화면이 보이게
              }}
            >
              <div className="text-center">
                {/* 점수 표시 */}
                <div className="mb-12">
                  <div 
                    className="text-6xl font-bold mb-4"
                    style={{ 
                      color: '#ff6600',
                      WebkitTextStroke: '2px #fff',
                      textShadow: '0 0 2px #fff, 0 0 2px #fff'
                    }}
                  >
                    Score
                  </div>
                  <div 
                    className="text-9xl font-bold mb-6"
                    style={{ 
                      color: '#ff6600',
                      WebkitTextStroke: '3px #fff',
                      textShadow: '0 0 4px #fff, 0 0 4px #fff'
                    }}
                  >
                    {gameState.score}
                  </div>
                </div>
                
                {/* 다시 시작 버튼 */}
                <button
                  onClick={resetGame}
                  className="text-white font-bold text-3xl px-12 py-6 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 border-4"
                  style={{
                    backgroundColor: '#00cc66',
                    borderColor: '#fff', // 흰색 테두리
                    borderStyle: 'solid'
                  }}
                >
                  다시 시작
                </button>
              </div>
            </div>
          )}

          {/* 드래그박스 표시 */}
          {isDragging && gamePhase === 'playing' && (
            <div
              className="absolute border-2 border-blue-500 pointer-events-none z-10"
              style={{
                left: Math.min(dragStart.x, dragEnd.x),
                top: Math.min(dragStart.y, dragEnd.y),
                width: Math.abs(dragEnd.x - dragStart.x),
                height: Math.abs(dragEnd.y - dragStart.y),
                backgroundColor: 'rgba(255, 255, 0, 0.1)' // 10% 투명도
              }}
            />
          )}
          
          {/* 포켓몬 타일들 */}
          <TileGrid board={gameState.board} />
        </div>
      </div>
    </main>
  )
}
