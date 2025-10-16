'use client'

import { useState } from 'react'
import { GameMode, GAME_MODE_CONFIGS } from '@/types/game'
import { Pokemon } from '@/types/pokemon'
import TileGrid from './TileGrid'
import GameOverlays from './GameOverlays'
import { useGameState } from '@/hooks/useGameState'
import { useGameAudio } from '@/hooks/useGameAudio'
import {
  GAME_LAYOUT,
  GAME_COLORS,
  ANIMATION
} from '@/constants/gameConstants'
import { getSelectedTilesInDragArea, validateTileTypeMatch } from '@/utils/dragUtils'

interface GameBoardProps {
  initialMode?: GameMode
}

export default function GameBoard({ initialMode = 'normal' }: GameBoardProps) {
  // 커스텀 훅들 사용
  const gameState = useGameState(initialMode)
  const audio = useGameAudio()
  
  // 드래그 상태 (분리하지 않고 여기서 관리)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragEnd, setDragEnd] = useState({ x: 0, y: 0 })
  // 타이머 로직은 useGameState에서 처리됨

  // 게임 시작 핸들러
  const handleStartCountdown = () => {
    gameState.startCountdown()
    audio.startBackgroundMusic()
  }

  // 게임 리셋 핸들러  
  const handleResetGame = () => {
    gameState.resetGame()
    audio.stopBackgroundMusic()
  }

  // 음악 토글 핸들러
  const handleToggleMusic = () => {
    audio.toggleMusic(gameState.gamePhase)
  }

  // 모드 변경 핸들러
  const handleModeChange = (mode: GameMode) => {
    gameState.setSelectedMode(mode)
  }

  // 게임 재시작 핸들러
  const handleRestart = () => {
    gameState.resetGame()
    audio.stopBackgroundMusic()
  }

  // === 드래그 처리 로직 (분리하지 않음) ===
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - GAME_LAYOUT.BORDER_WIDTH
    const y = e.clientY - rect.top - GAME_LAYOUT.BORDER_WIDTH
    
    setIsDragging(true)
    setDragStart({ x, y })
    setDragEnd({ x, y })
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !gameState.gameState) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - GAME_LAYOUT.BORDER_WIDTH
    const y = e.clientY - rect.top - GAME_LAYOUT.BORDER_WIDTH
    
    // 드래그 박스만 업데이트 (게임 상태는 업데이트하지 않음)
    setDragEnd({ x, y })
  }
  
  const handleMouseUp = () => {
    if (!isDragging || !gameState.gameState) return
    
    setIsDragging(false)
    
    // 드래그 영역 계산
    const minX = Math.min(dragStart.x, dragEnd.x)
    const maxX = Math.max(dragStart.x, dragEnd.x)
    const minY = Math.min(dragStart.y, dragEnd.y)
    const maxY = Math.max(dragStart.y, dragEnd.y)
    
    // 드래그 영역 내의 타일들 찾기 (성능 최적화된 버전)
    const { selectedTiles, selectedTileIds } = getSelectedTilesInDragArea(
      gameState.gameState.board,
      minX,
      maxX,
      minY,
      maxY
    )
    
    if (selectedTiles.length >= 2) {
      // 같은 타입인지 확인
      if (validateTileTypeMatch(selectedTiles)) {
        // 성공! 점수 추가 및 타일 제거 (한 번의 순회로 처리)
        const points = selectedTiles.length
        const selectedIncludesHint = selectedTiles.some(tile => tile.isHinted)
        
        const boardWithAnimation = gameState.gameState.board.map(row =>
          row.map(tile => {
            // Set을 사용해 O(1) 조회
            if (selectedTileIds.has(tile.id)) {
              const bounceX = (Math.random() - 0.5) * 100
              const bounceY = -Math.random() * 30 - 30
              
              return { 
                ...tile, 
                isRemoving: true,
                bounceX,
                bounceY,
                isSelected: false,
                isHinted: false
              }
            }
            return { ...tile, isSelected: false }
          })
        )
        
        gameState.setGameState({
          ...gameState.gameState,
          board: boardWithAnimation,
          score: gameState.gameState.score + points
        })

        if (selectedIncludesHint) {
          gameState.clearHints({ forceNewDelay: true })
        }
        
        audio.playSuccessSound()
        
        // 애니메이션 후 타일 실제 제거
        setTimeout(() => {
          gameState.setGameState(prev => {
            if (!prev) return null
            
            const finalBoard = prev.board.map(row =>
              row.map(tile => {
                if (tile.isRemoving) {
                  return { 
                    ...tile, 
                    isEmpty: true, 
                    pokemon: {} as Pokemon,
                    isRemoving: false,
                    bounceX: undefined,
                    bounceY: undefined,
                    isHinted: false
                  }
                }
                return { ...tile }
              })
            )
            
            const newGameState = {
              ...prev,
              board: finalBoard
            }
            
            // 타일 제거 완료 후 즉시 셔플 체크 (finalBoard 사용)
            setTimeout(async () => {
              await gameState.checkAndShuffleAfterTileRemoval(finalBoard)
            }, 50)
            
            return newGameState
          })
        }, ANIMATION.TILE_REMOVE_DURATION)
      } else {
        // 실패! 효과음만 재생 (상태 업데이트 불필요)
        audio.playFailSound()
      }
    } else if (selectedTiles.length > 0) {
      // 2개 미만! 효과음만 재생 (상태 업데이트 불필요)
      audio.playFailSound()
    }
  }

  if (!gameState.gameState) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-100 p-1">
      <div className="flex flex-col items-center gap-6 w-full px-1">
        {/* 게임 보드 */}
        <div 
          className="relative grid gap-3 py-16 px-20 rounded-xl shadow-xl select-none"
          style={{
            gridTemplateColumns: `repeat(${GAME_LAYOUT.BOARD_COLUMNS}, minmax(0, 1fr))`,
            backgroundColor: GAME_COLORS.BACKGROUND_GREEN,
            width: 'fit-content',
            margin: '0 auto',
            maxWidth: '95vw',
            overflow: 'hidden',
            borderWidth: `${GAME_LAYOUT.BORDER_WIDTH}px`,
            borderStyle: 'solid',
            borderColor: GAME_COLORS.PRIMARY_GREEN,
            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
          onMouseDown={gameState.gamePhase === 'playing' && !gameState.isShuffling ? handleMouseDown : undefined}
          onMouseMove={gameState.gamePhase === 'playing' && !gameState.isShuffling ? handleMouseMove : undefined}
          onMouseUp={gameState.gamePhase === 'playing' && !gameState.isShuffling ? handleMouseUp : undefined}
          onMouseLeave={gameState.gamePhase === 'playing' && !gameState.isShuffling ? handleMouseUp : undefined}
        >
          {/* 게임 UI 요소들 */}
          {gameState.gamePhase === 'playing' && (
            <>
              {/* 점수 표시 */}
              <div 
                className="absolute z-20"
                style={{ top: '100px', right: '50px' }}
              >
                <span className="text-4xl font-bold" style={{ color: '#00cc66' }}>
                  {gameState.gameState.score}
                </span>
              </div>
              
              {/* 시간 진행바 */}
              <div 
                className="absolute z-20"
                style={{
                  top: '200px',
                  right: '70px',
                  height: '500px',
                  width: '16px'
                }}
              >
                <div 
                  className="w-full h-full bg-transparent overflow-hidden relative"
                  style={{ border: '2px solid #00cc66' }}
                >
                  <div 
                    className="absolute bottom-0 w-full transition-all duration-1000 ease-linear"
                    style={{
                      height: `${(gameState.timeLeft / GAME_MODE_CONFIGS[gameState.selectedMode].timeLimit) * 100}%`,
                      backgroundColor: '#00cc66'
                    }}
                  />
                </div>
              </div>

              {/* Reset 버튼 */}
              <button
                onClick={handleRestart}
                className="absolute text-white hover:text-gray-800 hover:bg-white hover:bg-opacity-90 font-bold text-xs px-4 py-2 rounded-md border-2 border-white shadow-lg transition-all duration-200 hover:scale-105 z-20"
                style={{ top: '10px', right: '10px', backgroundColor: '#00cc66' }}
              >
                Reset
              </button>
              
              {/* 음악 토글 버튼 */}
              <button
                onClick={handleToggleMusic}
                className="absolute text-white hover:text-gray-800 hover:bg-white hover:bg-opacity-90 font-bold text-xs px-4 py-2 rounded-md border-2 border-white shadow-lg transition-all duration-200 hover:scale-105 z-20"
                style={{ top: '10px', right: '90px', backgroundColor: '#00cc66' }}
              >
                {audio.isMusicEnabled ? '🎵 ON' : '🔇 OFF'}
              </button>
            </>
          )}

          {/* 타일 그리드 */}
          <TileGrid 
            board={gameState.gameState.board} 
            mode={gameState.selectedMode}
            isShuffling={gameState.isShuffling}
            dragInfo={isDragging ? { 
              minX: Math.min(dragStart.x, dragEnd.x),
              maxX: Math.max(dragStart.x, dragEnd.x),
              minY: Math.min(dragStart.y, dragEnd.y),
              maxY: Math.max(dragStart.y, dragEnd.y)
            } : null}
          />

          {/* 드래그 박스 */}
          {isDragging && (
            <div
              className="absolute border-2 border-blue-500 pointer-events-none z-30"
              style={{
                left: Math.min(dragStart.x, dragEnd.x),
                top: Math.min(dragStart.y, dragEnd.y),
                width: Math.abs(dragEnd.x - dragStart.x),
                height: Math.abs(dragEnd.y - dragStart.y),
                backgroundColor: 'rgba(59, 130, 246, 0.2)'
              }}
            />
          )}

          {/* 오버레이들 */}
          <GameOverlays
            gamePhase={gameState.gamePhase}
            countdownNumber={gameState.countdownNumber}
            selectedMode={gameState.selectedMode}
            gameScore={gameState.gameState.score}
            isShuffling={gameState.isShuffling}
            isMusicEnabled={audio.isMusicEnabled}
            onStartCountdown={handleStartCountdown}
            onResetGame={handleResetGame}
            onToggleMusic={handleToggleMusic}
            onModeChange={handleModeChange}
          />
        </div>
      </div>
    </main>
  )
} 