import React from 'react'
import { GameTile } from '@/types/game'
import { POKEMON_TYPE_COLORS } from '@/types/pokemon'

interface TileGridProps {
  board: GameTile[][]
}

export default function TileGrid({ board }: TileGridProps) {
  return (
    <>
      {/* 각 행마다 16개 타일 + 2개 빈 공간 */}
      {board.map((row, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {/* 해당 행의 16개 타일들 */}
          {row.map((tile, colIndex) => {
            // 빈 타일인 경우 마우스 이벤트 통과
            if (tile.isEmpty) {
              return (
                <div
                  key={tile.id}
                  className="w-15 h-15"
                  style={{ pointerEvents: 'none' }}
                />
              )
            }
          
          // 애니메이션 스타일 계산
          const getAnimationStyle = () => {
            let transform = ''
            let transition = 'all 0.3s ease-out'
            let opacity = 1
            let zIndex = 1
            
            if (tile.isRemoving && tile.bounceX !== undefined && tile.bounceY !== undefined) {
              // 포물선 애니메이션 - 일정한 속도로
              const animationName = `parabola-${tile.id}`
              
              // 더 정교한 keyframes로 속도 균등화
              const keyframes = `
                @keyframes ${animationName} {
                  0% {
                    transform: translateX(0px) translateY(0px);
                    opacity: 1;
                  }
                  20% {
                    transform: translateX(${tile.bounceX * 0.4}px) translateY(${tile.bounceY * 0.8}px);
                    opacity: 1;
                  }
                  40% {
                    transform: translateX(${tile.bounceX * 0.8}px) translateY(${tile.bounceY}px);
                    opacity: 1;
                  }
                  60% {
                    transform: translateX(${tile.bounceX * 1.2}px) translateY(${tile.bounceY * 0.6}px);
                    opacity: 1;
                  }
                  80% {
                    transform: translateX(${tile.bounceX * 1.6}px) translateY(100px);
                    opacity: 0.7;
                  }
                  100% {
                    transform: translateX(${tile.bounceX * 2}px) translateY(400px);
                    opacity: 0;
                  }
                }
              `
              
              // 스타일 태그가 없으면 생성
              if (!document.getElementById(`keyframes-${tile.id}`)) {
                const style = document.createElement('style')
                style.id = `keyframes-${tile.id}`
                style.textContent = keyframes
                document.head.appendChild(style)
              }
              
              return {
                animation: `${animationName} 1.2s linear forwards`,
                zIndex: 10
              }
            }
            
            return {
              transform,
              transition,
              opacity,
              zIndex
            }
          }
          
          return (
            <div
              key={tile.id}
              data-tile-id={tile.id}
              className={`
                w-15 h-15 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200
                ${
                  tile.isSelected 
                    ? 'border-4 border-yellow-300 scale-105' 
                    : 'border-2 border-gray-300'
                }
              `}
              style={{
                backgroundColor: POKEMON_TYPE_COLORS[tile.pokemon.types[0]],
                color: 'white',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                ...getAnimationStyle()
              }}
            >
              {tile.pokemon.name.slice(0, 3)}
            </div>
          )
        })}
        
        {/* 이 행의 오른쪽 2개 빈 공간 */}
        <div key={`empty-${rowIndex}-0`} className="w-15 h-15" style={{ pointerEvents: 'none' }} />
        <div key={`empty-${rowIndex}-1`} className="w-15 h-15" style={{ pointerEvents: 'none' }} />
      </React.Fragment>
      ))}
    </>
  )
}
