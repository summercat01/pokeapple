import React from 'react'
import { GameTile, GameMode } from '@/types/game'
import TypeHintedTile from './TypeHintedTile'

interface DragInfo {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

interface TileGridProps {
  board: GameTile[][]
  mode?: GameMode
  isShuffling?: boolean
  dragInfo?: DragInfo | null
}

export default function TileGrid({ board, mode = 'normal', isShuffling = false, dragInfo = null }: TileGridProps) {
  const showTypeHints = mode === 'beginner'

  return (
    <>
      {/* 각 행마다 16개 타일 + 2개 빈 공간 */}
      {board.map((row, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {/* 해당 행의 16개 타일들 */}
          {row.map((tile, colIndex) => (
            <TypeHintedTile
              key={tile.id}
              tile={tile}
              showTypeHints={showTypeHints}
              isShuffling={isShuffling}
              dragInfo={dragInfo}
              rowIndex={rowIndex}
              colIndex={colIndex}
            />
          ))}
          
          {/* 이 행의 오른쪽 2개 빈 공간 (UI 영역) */}
          <div key={`empty-${rowIndex}-0`} className="w-15 h-15" style={{ pointerEvents: 'none' }} />
          <div key={`empty-${rowIndex}-1`} className="w-15 h-15" style={{ pointerEvents: 'none' }} />
        </React.Fragment>
      ))}
    </>
  )
}
