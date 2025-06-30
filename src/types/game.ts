import { Pokemon } from './pokemon'

export interface GameTile {
  id: string
  pokemon: Pokemon
  position: { row: number; col: number }
  isSelected: boolean
  isRemoving?: boolean
  isEmpty?: boolean
  bounceX?: number
  bounceY?: number
}

export type GameMode = 'normal' | 'beginner'

export interface GameState {
  board: GameTile[][]
  score: number
  timeLeft: number
  isPlaying: boolean
  isGameOver: boolean
  selectedTiles: GameTile[]
  mode: GameMode
}

export interface GameConfig {
  rows: number
  cols: number
  timeLimit: number // seconds
  mode: GameMode
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  rows: 9,
  cols: 16,
  timeLimit: 60,
  mode: 'normal'
}

// 모드별 설정
export const GAME_MODE_CONFIGS: Record<GameMode, Omit<GameConfig, 'mode'>> = {
  normal: {
    rows: 9,
    cols: 16,
    timeLimit: 120
  },
  beginner: {
    rows: 9,
    cols: 16,
    timeLimit: 120
  }
}
