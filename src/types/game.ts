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

export interface GameState {
  board: GameTile[][]
  score: number
  timeLeft: number
  isPlaying: boolean
  isGameOver: boolean
  selectedTiles: GameTile[]
}

export interface GameConfig {
  rows: number
  cols: number
  timeLimit: number // seconds
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  rows: 9,
  cols: 16,
  timeLimit: 60
}
