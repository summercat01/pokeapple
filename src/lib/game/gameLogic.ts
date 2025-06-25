import { GameTile, GameState, GameConfig } from '@/types/game'
import { getRandomPokemon, GAME_POKEMON } from '../pokemon'

// 16x9 게임 설정 (오른쪽 2열은 UI 영역)
export const GAME_CONFIG: GameConfig = {
  rows: 9,
  cols: 16,
  timeLimit: 60
}

// 게임 보드 생성 - 각 포켓몬 한 번씩만 사용 (완전 중복 방지)
export function createGameBoard(): GameTile[][] {
  const board: GameTile[][] = []
  
  // 필요한 포켓몬 수 계산 (16 x 9 = 144개)
  const totalTiles = GAME_CONFIG.rows * GAME_CONFIG.cols
  
  // 사용 가능한 포켓몬 목록 복사 (원본 보존)
  const availablePokemon = [...GAME_POKEMON]
  
  console.log(`보드 생성 설정:`);
  console.log(`- 총 타일: ${totalTiles}개`);
  console.log(`- 사용 가능한 포켓몬: ${GAME_POKEMON.length}개`);
  console.log(`- 각 포켓몬 사용 횟수: 1회 (완전 중복 방지)`);
  
  // 포켓몬이 부족한 경우 경고
  if (availablePokemon.length < totalTiles) {
    console.warn(`포켓몬 수 부족: 필요 ${totalTiles}개, 보유 ${availablePokemon.length}개`);
    console.warn('부족한 타일은 랜덤 포켓몬으로 채워집니다.');
  }
  
  for (let row = 0; row < GAME_CONFIG.rows; row++) {
    board[row] = []
    for (let col = 0; col < GAME_CONFIG.cols; col++) {
      let pokemon
      
      if (availablePokemon.length > 0) {
        // 남은 포켓몬 중에서 랜덤 선택
        const randomIndex = Math.floor(Math.random() * availablePokemon.length)
        pokemon = availablePokemon[randomIndex]
        
        // 사용된 포켓몬 제거 (중복 방지)
        availablePokemon.splice(randomIndex, 1)
      } else {
        // 포켓몬이 부족한 경우 전체 목록에서 랜덤 선택
        pokemon = GAME_POKEMON[Math.floor(Math.random() * GAME_POKEMON.length)]
        console.warn(`포켓몬 부족으로 중복 생성: ${pokemon.name}`);
      }
      
      board[row][col] = {
        id: `${row}-${col}`,
        pokemon: pokemon,
        position: { row, col },
        isSelected: false
      }
    }
  }
  
  console.log(`보드 생성 완료: 남은 포켓몬 ${availablePokemon.length}개`);
  
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

// 빈 타일에 새 포켓몬 배치 (게임 진행 중 사용)
export function fillEmptyTiles(board: GameTile[][]): GameTile[][] {
  const newBoard = board.map(row => 
    row.map(tile => {
      if (tile.isEmpty) {
        const newPokemon = getRandomPokemon()
        return {
          ...tile,
          pokemon: newPokemon,
          isEmpty: false,
          isSelected: false
        }
      }
      return tile
    })
  )
  
  return newBoard
}
