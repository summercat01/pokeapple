import React, { useState } from 'react'
import Image from 'next/image'
import { GamePhase } from '@/hooks/useGameState'
import { GameMode } from '@/types/game'
import UserStatus from '@/components/auth/UserStatus'
import AuthModal from '@/components/auth/AuthModal'
import CredentialRecoveryModal from '@/components/auth/CredentialRecoveryModal'
import RankingSidebar from './RankingSidebar'
import { HelpButton, HelpModal, DEFAULT_HELP_TAB_ID, type HelpTabId } from '@/components/Help'
import packageJson from '../../../package.json'

interface DevNote {
  version: string
  summary: string
  items: string[]
  date: string
}

const devNotes: DevNote[] = [
  {
    version: '0.5.0',
    date: '2025.10.16',
    summary: '도움말 기능 추가, 힌트 기능 제공',
    items: [
      '도움말 기능을 통해 게임 방법 확인',
      '5초 동안 매치를 찾지 못하면 자동으로 힌트가 제공'
    ]
  },
  {
    version: '0.4.0',
    date: '2025.09.21',
    summary: '관리자 페이지 추가, 점수 올리기 버그 픽스, 아이디/비밀번호 찾기 기능 추가',
    items: [
      '관리자 페이지 추가로 칭호 관리 등 운영 기능 제공',
      '점수 올리기 관련 오류 수정으로 기록 안정화',
      '아이디/비밀번호 찾기 기능 도입'
    ]
  },
  {
    version: '0.3.0',
    date: '2025.07.29',
    summary: '로그인 기능 및 랭킹 시스템 구현',
    items: [
      '커스텀 로그인/로그아웃 기능 추가',
      '랭킹 시스템 및 점수 저장 연동'
    ]
  },
  {
    version: '0.2.0',
    date: '2025.07.22',
    summary: '게임 로직 버그 수정, 오픈 채팅방 개설',
    items: [
      '게임 로직 버그 다수 수정',
      '카카오톡 오픈 채팅방 개설'
    ]
  },
  {
    version: '0.1.0',
    date: '2025.06.29',
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
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [activeHelpTab, setActiveHelpTab] = useState<HelpTabId>(DEFAULT_HELP_TAB_ID)

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
                    <div className="w-full">
                      <div className="flex items-center justify-between text-gray-500">
                        <p className="text-sm font-semibold">v{note.version}</p>
                        <p className="text-xs text-gray-400">{note.date}</p>
                      </div>
                      <p className="text-base font-semibold text-gray-800">
                        {note.summary}
                      </p>
                    </div>
                    {/* 최신 뱃지 제거 */}
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
        <div className="absolute inset-0 z-20 flex">
          <div className="relative flex h-full w-full rounded-lg bg-[#d5f6cd] px-10 py-8 gap-8">
            <div className="hidden xl:flex w-[320px] flex-col">
              <RankingSidebar selectedMode={selectedMode} onModeChange={onModeChange} />
            </div>

            <div className="flex flex-1 flex-col xl:-ml-80">
              <div className="flex items-start justify-end">
                <UserStatus onLoginClick={handleLoginClick} onRecoveryClick={handleRecoveryClick} />
              </div>

              <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-4">
                <h1 className="text-5xl sm:text-6xl font-bold">
                  <span style={{ color: '#ff6600' }}>포켓몬 </span>
                  <span style={{ color: '#00cc66' }}>사과게임</span>
                </h1>

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => onModeChange('normal')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      selectedMode === 'normal' ? 'text-white shadow-lg' : 'text-gray-600 bg-white/80'
                    }`}
                    style={{ backgroundColor: selectedMode === 'normal' ? '#3b82f6' : undefined }}
                  >
                    🎯 일반모드
                  </button>
                  <button
                    onClick={() => onModeChange('beginner')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      selectedMode === 'beginner' ? 'text-white shadow-lg' : 'text-gray-600 bg-white/80'
                    }`}
                    style={{ backgroundColor: selectedMode === 'beginner' ? '#10b981' : undefined }}
                  >
                    🌱 초보자모드
                  </button>
                </div>

                <button
                  onClick={onStartCountdown}
                  className="text-white font-bold text-3xl sm:text-4xl px-12 py-6 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 border-4"
                  style={{ backgroundColor: '#ff3603', borderColor: '#ff3603' }}
                >
                  🎮 Play
                </button>


                <div className="flex justify-center">
                  <button
                    onClick={onToggleMusic}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105 border border-gray-600"
                  >
                    {isMusicEnabled ? '🎵 음악 ON' : '🔇 음악 OFF'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 pb-2 text-sm text-gray-700">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent('https://invite.kakao.com/tc/62Ss7gpVRc')}`}
                  alt="카카오톡방 QR 코드"
                  width={80}
                  height={80}
                  className="bg-white p-1 rounded shadow-sm"
                  unoptimized
                />
                <p>QR코드 또는 아래를 클릭하여 오픈 채팅방에 참여하세요</p>
                <a
                  href="https://invite.kakao.com/tc/62Ss7gpVRc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold underline"
                  style={{ color: '#00cc66' }}
                >
                  카카오톡 오픈채팅 참여하기
                </a>
                <a
                  href="https://github.com/summercat01/pokeapple"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-gray-700 bg-white/80 px-3 py-1 rounded-full shadow-sm hover:shadow transition-all duration-200 hover:scale-105"
                >
                  Developed by 고재우
                </a>
              </div>
            </div>

            <div className="absolute bottom-8 left-8">
              <HelpButton onClick={() => setIsHelpOpen(true)} className="ml-10" />
            </div>

            <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2">
              <button
                onClick={() => setIsDevNoteOpen(true)}
                className="text-xs font-semibold px-4 py-2 rounded border border-gray-300 bg-white/90 shadow-sm transition-all duration-200 hover:scale-105"
              >
                개발자 노트
              </button>
              <span className="text-sm font-semibold" style={{ color: '#ff3603' }}>
                v{packageJson.version}
              </span>
            </div>
          </div>
        </div>

        {renderAuthModal()}
        {renderRecoveryModal()}
        {renderDevNoteModal()}

        <HelpModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          activeTab={activeHelpTab}
          onTabChange={setActiveHelpTab}
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