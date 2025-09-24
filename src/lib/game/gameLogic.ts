import { GameTile, GameState, GameConfig, GameMode, GAME_MODE_CONFIGS } from '@/types/game'
import { GAME_POKEMON } from '../pokemon'

// 16x9 게임 설정 (오른쪽 2열은 UI 영역)
export const GAME_CONFIG: GameConfig = {
  rows: 9,
  cols: 16,
  timeLimit: 120,
  mode: 'normal'
}

// 고정된 시드 기반 셔플 알고리즘 (서버-클라이언트 일관성 보장)
function seededShuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  let currentSeed = seed
  
  // 간단한 선형 합동 생성기 (Linear Congruential Generator)
  const lcg = () => {
    currentSeed = (currentSeed * 1664525 + 1013904223) % Math.pow(2, 32)
    return currentSeed / Math.pow(2, 32)
  }
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(lcg() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 모드별 게임 보드 생성 (중복 포켓몬 방지, 서버-클라이언트 일관성 보장)
export function createGameBoard(mode: GameMode = 'normal', seed?: number): GameTile[][] {
  const config = GAME_MODE_CONFIGS[mode]
  const board: GameTile[][] = []
  const totalTiles = config.rows * config.cols
  
  // 시드가 제공되지 않으면 현재 시간을 기반으로 생성 (클라이언트에서만)
  const finalSeed = seed ?? (typeof window !== 'undefined' ? Date.now() : 12345)
  
  // 전체 포켓몬 목록을 시드 기반으로 셔플하여 중복 없이 선택
  const shuffledPokemon = seededShuffleArray(GAME_POKEMON, finalSeed)
  
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
export function createInitialGameState(mode: GameMode = 'normal', seed?: number): GameState {
  const config = GAME_MODE_CONFIGS[mode]
  return {
    board: createGameBoard(mode, seed),
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
export function resetBoard(mode: GameMode = 'normal', seed?: number): GameTile[][] {
  return createGameBoard(mode, seed)
}
