'use client'

import { useState } from 'react'
import GameBoard from '@/components/GameBoard/GameBoard'

export default function StartScreen() {
  const [gameStarted, setGameStarted] = useState(false)

  if (gameStarted) {
    return <GameBoard />
  }

  return (
    <main className="min-h-screen bg-gray-100 p-1">
      <div className="flex flex-col items-center gap-6 w-full px-1">
        {/* 시작 화면 제목 */}
        <h1 className="text-5xl font-bold text-center text-gray-800 mt-8 mb-4">
          포켓몬 사과게임
        </h1>
        
        {/* 게임보드와 동일한 크기의 시작 화면 */}
        <div 
          className="relative grid place-items-center py-16 px-20 bg-green-100 rounded-xl shadow-xl select-none"
          style={{
            width: 'fit-content',
            margin: '0 auto',
            maxWidth: '95vw',
            borderWidth: '12px',
            borderStyle: 'solid',
            borderColor: '#059669',
            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        >
          <div className="text-center">
            <h2 className="text-6xl font-bold mb-16">
              <span className="text-orange-500">포켓몬</span>
              <span className="text-green-600">사과게임</span>
            </h2>
            
            <button
              onClick={() => setGameStarted(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold text-4xl px-16 py-8 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 border-4 border-red-600"
            >
              🎮 Play
            </button>
            
            <p className="text-xl text-gray-700 mt-12 max-w-2xl mx-auto">
              같은 타입의 포켓몬들을 드래그로 선택하여 점수를 얻으세요!
              <br/>
              복합 타입 포켓몬은 어느 타입으로든 매칭 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
