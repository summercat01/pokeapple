import { GameTile, GameState, GameConfig, GameMode, GAME_MODE_CONFIGS } from '@/types/game'
import { GAME_POKEMON } from '../pokemon/generations/gen1/pokemonData'

// 16x9 게임 설정 (오른쪽 2열은 UI 영역)
export const GAME_CONFIG: GameConfig = {
  rows: 9,
  cols: 16,
  timeLimit: 120,
  mode: 'normal'
}

// Fisher-Yates 셔플 알고리즘
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 모드별 게임 보드 생성 (중복 포켓몬 방지)
export function createGameBoard(mode: GameMode = 'normal'): GameTile[][] {
  const config = GAME_MODE_CONFIGS[mode]
  const board: GameTile[][] = []
  const totalTiles = config.rows * config.cols
  
  // 전체 포켓몬 목록을 셔플하여 중복 없이 선택
  const shuffledPokemon = shuffleArray(GAME_POKEMON)
  
  // 필요한 만큼만 포켓몬 선택 (보드 크기만큼)
  const selectedPokemon = shuffledPokemon.slice(0, totalTiles)
  
  let pokemonIndex = 0
  
  for (let row = 0; row < config.rows; row++) {
    board[row] = []
    for (let col = 0; col < config.cols; col++) {
      board[row][col] = {
        id: `${row}-${col}`,
        pokemon: selectedPokemon[pokemonIndex],
        position: { row, col },
        isSelected: false
      }
      pokemonIndex++
    }
  }
  
  return board
}

// 초기 게임 상태 생성
export function createInitialGameState(mode: GameMode = 'normal'): GameState {
  const config = GAME_MODE_CONFIGS[mode]
  return {
    board: createGameBoard(mode),
    score: 0,
    timeLeft: config.timeLimit,
    isPlaying: false,
    isGameOver: false,
    selectedTiles: [],
    mode
  }
}

// 보드에서 특정 위치의 타일 가져오기
export function getTileAt(board: GameTile[][], row: number, col: number): GameTile | null {
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
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

// 보드 리셋 (새로운 포켓몬으로 교체, 중복 없이)
export function resetBoard(mode: GameMode = 'normal'): GameTile[][] {
  return createGameBoard(mode)
}
