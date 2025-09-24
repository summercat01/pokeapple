import { GameTile } from '@/types/game'
import { calculateTileCenterPosition } from '@/constants/gameConstants'

interface DragSelection {
  selectedTiles: GameTile[]
  selectedTileIds: Set<string>
}

/**
 * 드래그 영역 내의 타일들을 효율적으로 찾는 함수
 * 성능 최적화: 드래그 영역과 겹치는 행/열만 검사
 */
export function getSelectedTilesInDragArea(
  board: GameTile[][],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): DragSelection {
  const selectedTiles: GameTile[] = []
  const selectedTileIds = new Set<string>()
  
  // 드래그 영역과 겹치는 대략적인 행/열 범위 계산 (성능 최적화)
  const TILE_SIZE = 60
  const TILE_GAP = 12
  const PADDING_X = 80
  const PADDING_Y = 64
  
  const tileStep = TILE_SIZE + TILE_GAP
  
  // 최소/최대 행/열 계산 (여유분 포함)
  const startRow = Math.max(0, Math.floor((minY - PADDING_Y) / tileStep) - 1)
  const endRow = Math.min(board.length - 1, Math.ceil((maxY - PADDING_Y) / tileStep) + 1)
  const startCol = Math.max(0, Math.floor((minX - PADDING_X) / tileStep) - 1)
  const endCol = Math.min(board[0]?.length - 1 || 0, Math.ceil((maxX - PADDING_X) / tileStep) + 1)
  
  // 계산된 범위 내에서만 검사 (전체 보드 순회 방지)
  for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
    for (let colIndex = startCol; colIndex <= endCol; colIndex++) {
      const tile = board[rowIndex]?.[colIndex]
      if (!tile || tile.isEmpty) continue
      
      const { tileCenterX, tileCenterY } = calculateTileCenterPosition(rowIndex, colIndex)
      
      const isSelected = tileCenterX >= minX && tileCenterX <= maxX &&
                        tileCenterY >= minY && tileCenterY <= maxY
      
      if (isSelected) {
        selectedTiles.push(tile)
        selectedTileIds.add(tile.id)
      }
    }
  }
  
  return { selectedTiles, selectedTileIds }
}

/**
 * 선택된 타일들이 같은 타입을 가지는지 확인
 */
export function validateTileTypeMatch(tiles: GameTile[]): boolean {
  if (tiles.length < 2) return false
  
  const firstTileTypes = tiles[0].pokemon?.types
  if (!firstTileTypes) return false
  
  return firstTileTypes.some(type => 
    tiles.every(tile => tile.pokemon?.types?.includes(type))
  )
}