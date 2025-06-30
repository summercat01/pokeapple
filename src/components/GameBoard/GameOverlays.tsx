import React, { useState } from 'react'
import { GamePhase } from '@/hooks/useGameState'
import { GameMode } from '@/types/game'
import UserStatus from '@/components/auth/UserStatus'
import AuthModal from '@/components/auth/AuthModal'
import RankingSidebar from './RankingSidebar'
import packageJson from '../../../package.json'

interface GameOverlaysProps {
  gamePhase: GamePhase
  countdownNumber: number
  selectedMode: GameMode
  gameScore: number
  isShuffling: boolean
  isMusicEnabled: boolean
  onStartCountdown: () => void
  onResetGame: () => void
  onToggleMusic: () => void
  onModeChange: (mode: GameMode) => void
}

export default function GameOverlays({
  gamePhase,
  countdownNumber,
  selectedMode,
  gameScore,
  isShuffling,
  isMusicEnabled,
  onStartCountdown,
  onResetGame,
  onToggleMusic,
  onModeChange
}: GameOverlaysProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  
  const handleLoginClick = () => {
    setIsAuthModalOpen(true)
  }

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false)
  }

  // 메인 화면 오버레이
  if (gamePhase === 'main') {
    return (
      <>
        <div 
          className="absolute inset-0 rounded-lg z-10"
          style={{ backgroundColor: '#d5f6cd' }}
        >
          {/* Left: RankingSidebar - 절대 위치로 오버레이 */}
          <div className="absolute left-4 top-4 bottom-4 w-80 z-20">
            <RankingSidebar 
              selectedMode={selectedMode}
              onModeChange={onModeChange}
            />
          </div>

          {/* Center: Game content - 화면 전체 중앙 */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* UserStatus - 오른쪽 상단에 절대 위치 */}
            <div className="absolute top-4 right-4 z-20">
              <UserStatus onLoginClick={handleLoginClick} />
            </div>

            {/* Version - 오른쪽 하단에 절대 위치 */}
            <div className="absolute bottom-4 right-4 z-20">
              <span 
                className="text-sm font-semibold px-2 py-1 rounded"
                style={{ color: '#ff3603' }}
              >
                v{packageJson.version}
              </span>
            </div>

            <div className="text-center">
                <h1 className="text-6xl font-bold mb-8">
                  <span style={{ color: '#ff6600' }}>포켓몬 </span>
                  <span style={{ color: '#00cc66' }}>사과게임</span>
                </h1>
                
                {/* 모드 선택 섹션 */}
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <button
                      onClick={() => onModeChange('normal')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        selectedMode === 'normal' 
                          ? 'text-white shadow-lg' 
                          : 'text-gray-600 bg-white bg-opacity-50'
                      }`}
                      style={{
                        backgroundColor: selectedMode === 'normal' ? '#3b82f6' : undefined
                      }}
                    >
                      🎯 일반모드
                    </button>
                    
                    <button
                      onClick={() => onModeChange('beginner')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        selectedMode === 'beginner' 
                          ? 'text-white shadow-lg' 
                          : 'text-gray-600 bg-white bg-opacity-50'
                      }`}
                      style={{
                        backgroundColor: selectedMode === 'beginner' ? '#10b981' : undefined
                      }}
                    >
                      🌱 초보자모드
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={onStartCountdown}
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
                    onClick={onToggleMusic}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold text-lg px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 border-2 border-gray-600"
                  >
                    {isMusicEnabled ? '🎵 음악 ON' : '🔇 음악 OFF'}
                  </button>
                </div>
            </div>
          </div>
        </div>

        {/* AuthModal */}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={handleAuthModalClose}
        />
      </>
    )
  }

  // 카운트다운 오버레이
  if (gamePhase === 'countdown') {
    return (
      <>
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-lg z-10"
          style={{ backgroundColor: '#d5f6cd' }}
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

        {/* AuthModal */}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={handleAuthModalClose}
        />
      </>
    )
  }

  // 셔플 중 오버레이
  if (isShuffling && gamePhase === 'playing') {
    return (
      <>
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-lg z-10"
          style={{ backgroundColor: 'rgba(213, 246, 205, 0.8)' }}
        >
          <div className="text-center">
            <div 
              className="text-6xl font-bold animate-pulse mb-4"
              style={{ color: '#ff6600' }}
            >
              🔄
            </div>
            <p className="text-3xl font-bold text-gray-700">재배치 중...</p>
            <p className="text-lg text-gray-600 mt-2">새로운 매치를 찾고 있습니다</p>
          </div>
        </div>

        {/* AuthModal */}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={handleAuthModalClose}
        />
      </>
    )
  }

  // 게임 오버 오버레이
  if (gamePhase === 'gameOver') {
    return (
      <>
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-lg z-10"
          style={{ backgroundColor: 'rgba(213, 246, 205, 0.3)' }}
        >
          <div className="text-center">
            {/* 점수 표시 */}
            <div className="mb-12">
              <div 
                className="text-4xl font-bold mb-2"
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
                {gameScore}
              </div>
            </div>
            
            {/* 메인으로 버튼 */}
            <button
              onClick={onResetGame}
              className="text-white font-bold text-3xl px-12 py-6 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 border-4"
              style={{
                backgroundColor: '#ff3603',
                borderColor: '#ff3603'
              }}
            >
              🎮 메인으로
            </button>
          </div>
        </div>

        {/* AuthModal */}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={handleAuthModalClose}
        />
      </>
    )
  }

  return (
    <AuthModal 
      isOpen={isAuthModalOpen}
      onClose={handleAuthModalClose}
    />
  )
} 