import React from 'react'
import { GameTile } from '@/types/game'

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
          {row.map(tile => {
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
            const transform = ''
            const transition = 'all 0.3s ease-out'
            const opacity = 1
            const zIndex = 1
            
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
                w-15 h-15 rounded-lg flex items-center justify-center transition-all duration-200 overflow-visible relative
                ${
                  tile.isSelected 
                    ? 'scale-105' 
                    : ''
                }
              `}
              style={{
                ...getAnimationStyle()
              }}
            >
              {/* 선택된 경우 뒤에 노란색 실루엣 */}
              {tile.isSelected && (
                <>
                  <img 
                    src={tile.pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'} 
                    alt={`${tile.pokemon.name} silhouette`}
                    className="w-16 h-16 object-contain pixel-art absolute pokemon-silhouette"
                    style={{
                      transform: 'translate(-2px, -2px)',
                      zIndex: 1
                    }}
                    draggable={false}
                  />
                  <img 
                    src={tile.pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'} 
                    alt={`${tile.pokemon.name} silhouette`}
                    className="w-16 h-16 object-contain pixel-art absolute pokemon-silhouette"
                    style={{
                      transform: 'translate(2px, -2px)',
                      zIndex: 1
                    }}
                    draggable={false}
                  />
                  <img 
                    src={tile.pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'} 
                    alt={`${tile.pokemon.name} silhouette`}
                    className="w-16 h-16 object-contain pixel-art absolute pokemon-silhouette"
                    style={{
                      transform: 'translate(-2px, 2px)',
                      zIndex: 1
                    }}
                    draggable={false}
                  />
                  <img 
                    src={tile.pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'} 
                    alt={`${tile.pokemon.name} silhouette`}
                    className="w-16 h-16 object-contain pixel-art absolute pokemon-silhouette"
                    style={{
                      transform: 'translate(2px, 2px)',
                      zIndex: 1
                    }}
                    draggable={false}
                  />
                  <img 
                    src={tile.pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'} 
                    alt={`${tile.pokemon.name} silhouette`}
                    className="w-16 h-16 object-contain pixel-art absolute pokemon-silhouette"
                    style={{
                      transform: 'translate(0px, -2px)',
                      zIndex: 1
                    }}
                    draggable={false}
                  />
                  <img 
                    src={tile.pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'} 
                    alt={`${tile.pokemon.name} silhouette`}
                    className="w-16 h-16 object-contain pixel-art absolute pokemon-silhouette"
                    style={{
                      transform: 'translate(0px, 2px)',
                      zIndex: 1
                    }}
                    draggable={false}
                  />
                  <img 
                    src={tile.pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'} 
                    alt={`${tile.pokemon.name} silhouette`}
                    className="w-16 h-16 object-contain pixel-art absolute pokemon-silhouette"
                    style={{
                      transform: 'translate(-2px, 0px)',
                      zIndex: 1
                    }}
                    draggable={false}
                  />
                  <img 
                    src={tile.pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'} 
                    alt={`${tile.pokemon.name} silhouette`}
                    className="w-16 h-16 object-contain pixel-art absolute pokemon-silhouette"
                    style={{
                      transform: 'translate(2px, 0px)',
                      zIndex: 1
                    }}
                    draggable={false}
                  />
                </>
              )}
              
              {/* 메인 포켓몬 이미지 */}
              <img 
                src={tile.pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'} 
                alt={tile.pokemon.name}
                className="w-15 h-15 object-contain pixel-art relative"
                style={{
                  zIndex: 2
                }}
                draggable={false}
              />
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
