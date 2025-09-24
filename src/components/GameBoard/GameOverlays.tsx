import React, { useState } from 'react'
import Image from 'next/image'
import { GamePhase } from '@/hooks/useGameState'
import { GameMode } from '@/types/game'
import UserStatus from '@/components/auth/UserStatus'
import AuthModal from '@/components/auth/AuthModal'
import CredentialRecoveryModal from '@/components/auth/CredentialRecoveryModal'
import RankingSidebar from './RankingSidebar'
import packageJson from '../../../package.json'

interface DevNote {
  version: string
  summary: string
  items: string[]
}

const devNotes: DevNote[] = [
  {
    version: '0.4.0',
    summary: '관리자 페이지 추가, 점수 올리기 버그 픽스, 아이디/비밀번호 찾기 기능 추가',
    items: [
      '관리자 페이지 추가로 칭호 관리 등 운영 기능 제공',
      '점수 올리기 관련 오류 수정으로 기록 안정화',
      '아이디/비밀번호 찾기 기능 도입'
    ]
  },
  {
    version: '0.3.0',
    summary: '로그인 기능 및 랭킹 시스템 구현',
    items: [
      '커스텀 로그인/로그아웃 기능 추가',
      '랭킹 시스템 및 점수 저장 연동'
    ]
  },
  {
    version: '0.2.0',
    summary: '게임 로직 버그 수정, 오픈 채팅방 개설',
    items: [
      '게임 로직 버그 다수 수정',
      '카카오톡 오픈 채팅방 개설'
    ]
  },
  {
    version: '0.1.0',
    summary: '포켓몬 사과게임 초기 버전',
    items: [
      '포켓몬 사과게임 프로젝트 시작',
      '많은 관심과 피드백 부탁드립니다'
    ]
  }
]

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
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false)
  const [isDevNoteOpen, setIsDevNoteOpen] = useState(false)
  const [expandedNotes, setExpandedNotes] = useState(() => devNotes.map((_, index) => index === 0))

  const toggleDevNote = (index: number) => {
    setExpandedNotes(prev => prev.map((isExpanded, idx) => (idx === index ? !isExpanded : isExpanded)))
  }
  
  const handleLoginClick = () => {
    setIsAuthModalOpen(true)
  }

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false)
  }

  const handleRecoveryClick = () => {
    setIsRecoveryModalOpen(true)
  }

  const handleRecoveryClose = () => {
    setIsRecoveryModalOpen(false)
  }

  // AuthModal 렌더링 함수 (중복 제거)
  const renderAuthModal = () => (
    <AuthModal 
      isOpen={isAuthModalOpen}
      onClose={handleAuthModalClose}
    />
  )

  const renderRecoveryModal = () => (
    <CredentialRecoveryModal
      isOpen={isRecoveryModalOpen}
      onClose={handleRecoveryClose}
    />
  )

  const renderDevNoteModal = () => {
    if (!isDevNoteOpen || devNotes.length === 0) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-6 p-8 space-y-7">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">개발자 노트</h2>
            <button
              onClick={() => setIsDevNoteOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="개발자 노트 닫기"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {devNotes.map((note, index) => {
              const isExpanded = expandedNotes[index]

              return (
                <section
                  key={note.version}
                  onClick={() => toggleDevNote(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      toggleDevNote(index)
                    }
                  }}
                  className={`border border-gray-100 rounded-lg bg-gray-50 px-4 py-4 space-y-3 transition-shadow duration-200 cursor-pointer ${
                    isExpanded ? 'shadow-md' : 'shadow-sm hover:shadow-md'
                  }`}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">v{note.version}</p>
                      <p className="text-base font-semibold text-gray-800">
                        {note.summary}
                      </p>
                    </div>
                    {index === 0 && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                        최신
                      </span>
                    )}
                  </div>
                  {isExpanded && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {note.items.map((item) => (
                        <li key={`${note.version}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              )
            })}
          </div>

          <div className="text-right">
            <button
              onClick={() => setIsDevNoteOpen(false)}
              className="px-4 py-2 text-sm font-semibold bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    )
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
              <UserStatus onLoginClick={handleLoginClick} onRecoveryClick={handleRecoveryClick} />
            </div>

            {/* Version & Dev Notes - 오른쪽 하단에 절대 위치 */}
            <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2">
              <button
                onClick={() => setIsDevNoteOpen(true)}
                className="text-xs font-semibold px-3 py-1 rounded border border-gray-300 bg-white bg-opacity-90 hover:bg-opacity-100 shadow-sm transition-all duration-200 hover:scale-105"
              >
                개발자 노트
              </button>
              <span 
                className="text-sm font-semibold px-2 py-1 rounded"
                style={{ color: '#ff3603' }}
              >
                v{packageJson.version}
              </span>
            </div>

            {/* 개발자 정보 - 하단 중앙에 절대 위치 */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 text-center">
                <div className="mb-2">
                  <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent('https://invite.kakao.com/tc/62Ss7gpVRc')}`}
                    alt="카카오톡방 QR 코드"
                    width={80}
                    height={80}
                    className="mx-auto bg-white p-1 rounded shadow-sm hover:scale-110 transition-transform duration-200"
                    unoptimized
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  QR코드 또는 아래를 클릭하여 오픈 채팅방에 참여하세요
                </p>
                <a 
                  href="https://invite.kakao.com/tc/62Ss7gpVRc" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold px-3 py-1 rounded underline hover:underline-offset-4 transition-all duration-200 hover:scale-105"
                  style={{ color: '#00cc66' }}
                >
                  카카오톡 오픈채팅 참여하기
                </a>
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
                  <br/>
                  5초 동안 매치를 찾지 못하면 자동으로 힌트가 제공됩니다.
                </p>
                
            {/* 음악 설정 버튼 */}
            <div className="flex justify-center mb-6">
                  <button
                    onClick={onToggleMusic}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-base px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105 border border-gray-600"
                  >
                    {isMusicEnabled ? '🎵 음악 ON' : '🔇 음악 OFF'}
                  </button>
                </div>
            </div>
          </div>
        </div>

        {/* AuthModal */}
        {renderAuthModal()}

        {/* CredentialRecoveryModal */}
        {renderRecoveryModal()}

        {/* Dev Note Modal */}
        {renderDevNoteModal()}
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
        {renderAuthModal()}
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
        {renderAuthModal()}
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
        {renderAuthModal()}
      </>
    )
  }

  return renderAuthModal()
} 