import { GameTile, GameState, GameConfig } from '@/types/game'
import { getRandomPokemon } from '../pokemon/pokemonData'

// 16x9 게임 설정 (오른쪽 2열은 UI 영역)
export const GAME_CONFIG: GameConfig = {
  rows: 9,
  cols: 16,
  timeLimit: 60
}

// 게임 보드 생성
export function createGameBoard(): GameTile[][] {
  const board: GameTile[][] = []
  
  for (let row = 0; row < GAME_CONFIG.rows; row++) {
    board[row] = []
    for (let col = 0; col < GAME_CONFIG.cols; col++) {
      board[row][col] = {
        id: `${row}-${col}`,
        pokemon: getRandomPokemon(),
        position: { row, col },
        isSelected: false
      }
    }
  }
  
  return board
}

// 초기 게임 상태 생성
export function createInitialGameState(): GameState {
  return {
    board: createGameBoard(),
    score: 0,
    timeLeft: GAME_CONFIG.timeLimit,
    isPlaying: false,
    isGameOver: false,
    selectedTiles: []
  }
}

// 보드에서 특정 위치의 타일 가져오기
export function getTileAt(board: GameTile[][], row: number, col: number): GameTile | null {
  if (row < 0 || row >= GAME_CONFIG.rows || col < 0 || col >= GAME_CONFIG.cols) {
    return null
  }
  return board[row][col]
}

// 선택된 영역 내의 모든 타일 가져오기
export function getTilesInArea(
  board: GameTile[][], 
  startRow: number, 
  startCol: number, 
  endRow: number, 
  endCol: number
): GameTile[] {
  const tiles: GameTile[] = []
  
  const minRow = Math.min(startRow, endRow)
  const maxRow = Math.max(startRow, endRow)
  const minCol = Math.min(startCol, endCol)
  const maxCol = Math.max(startCol, endCol)
  
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const tile = getTileAt(board, row, col)
      if (tile) {
        tiles.push(tile)
      }
    }
  }
  
  return tiles
}

// 보드 리셋 (새로운 포켓몬으로 교체)
export function resetBoard(): GameTile[][] {
  return createGameBoard()
}
