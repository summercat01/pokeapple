import { GameTile } from '@/types/game'

/**
 * 보드에서 드래그 선택 가능한 매치가 있는지 확인
 * 간단한 접근법: 작은 직사각형 영역들을 체크
 * @param board 게임 보드
 * @returns 드래그로 선택 가능한 매치가 있으면 true
 */
export function hasValidMatches(board: GameTile[][]): boolean {
  const rows = board.length
  const cols = board[0].length
  
  // 1. 먼저 인접한 2개 타일 체크 (가로/세로)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const currentTile = board[row][col]
      if (currentTile.isEmpty || !currentTile.pokemon) continue
      
      // 오른쪽 타일과 비교
      if (col + 1 < cols) {
        const rightTile = board[row][col + 1]
        if (!rightTile.isEmpty && rightTile.pokemon && hasCommonType(currentTile, rightTile)) {
          return true
        }
      }
      
      // 아래쪽 타일과 비교
      if (row + 1 < rows) {
        const bottomTile = board[row + 1][col]
        if (!bottomTile.isEmpty && bottomTile.pokemon && hasCommonType(currentTile, bottomTile)) {
          return true
        }
      }
    }
  }
  
  // 2. 작은 직사각형 영역들 체크 (2x2, 2x3, 3x2 등)
  const maxSize = 4 // 최대 4x4까지만 체크
  
  for (let size1 = 2; size1 <= maxSize; size1++) {
    for (let size2 = 2; size2 <= maxSize; size2++) {
      for (let startRow = 0; startRow <= rows - size1; startRow++) {
        for (let startCol = 0; startCol <= cols - size2; startCol++) {
          if (checkRectangleMatch(board, startRow, startCol, size1, size2)) {
            return true
          }
        }
      }
    }
  }
  
  return false
}

/**
 * 두 타일이 공통 타입을 가지는지 확인
 */
function hasCommonType(tile1: GameTile, tile2: GameTile): boolean {
  if (!tile1.pokemon || !tile2.pokemon) return false
  
  return tile1.pokemon.types.some(type => tile2.pokemon!.types.includes(type))
}

/**
 * 특정 직사각형 영역에서 매치 가능한지 확인
 * 조건: 영역 내 모든 타일이 포켓몬을 가지고 있고, 모두 공통 타입을 가져야 함
 */
function checkRectangleMatch(
  board: GameTile[][],
  startRow: number,
  startCol: number,
  height: number,
  width: number
): boolean {
  const tilesInArea: GameTile[] = []
  
  // 영역 내 모든 타일 확인
  for (let row = startRow; row < startRow + height; row++) {
    for (let col = startCol; col < startCol + width; col++) {
      const tile = board[row][col]
      
      // 빈 타일이 하나라도 있으면 직사각형 매치 불가능
      if (tile.isEmpty || !tile.pokemon) {
        return false
      }
      
      tilesInArea.push(tile)
    }
  }
  
  // 최소 2개 이상의 타일이 있어야 함
  if (tilesInArea.length < 2) {
    return false
  }
  
  // 첫 번째 타일의 각 타입에 대해 확인
  const firstTile = tilesInArea[0]
  
  for (const type of firstTile.pokemon!.types) {
    // 모든 타일이 이 타입을 가지고 있는지 확인
    const allHaveThisType = tilesInArea.every(tile => 
      tile.pokemon!.types.includes(type)
    )
    
    if (allHaveThisType) {
      // 이 타입으로 매치 가능!
      return true
    }
  }
  
  return false
}

/**
 * 기존 포켓몬들의 위치만 섞어서 재배치
 * @param board 현재 게임 보드
 * @returns 셔플된 새 보드
 */
export function shuffleExistingTiles(board: GameTile[][]): GameTile[][] {
  // 모든 비어있지 않은 타일들을 수집
  const nonEmptyTiles: GameTile[] = []
  const emptyPositions: { row: number; col: number }[] = []
  
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const tile = board[row][col]
      if (!tile.isEmpty && tile.pokemon) {
        nonEmptyTiles.push(tile)
      } else if (tile.isEmpty) {
        emptyPositions.push({ row, col })
      }
    }
  }
  
  // 포켓몬들만 셔플 (Fisher-Yates 알고리즘)
  const shuffledPokemon = nonEmptyTiles.map(tile => tile.pokemon!)
  for (let i = shuffledPokemon.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledPokemon[i], shuffledPokemon[j]] = [shuffledPokemon[j], shuffledPokemon[i]]
  }
  
  // 새 보드 생성
  const newBoard: GameTile[][] = board.map(row => 
    row.map(tile => ({ ...tile, isSelected: false }))
  )
  
  // 셔플된 포켓몬들을 비어있지 않은 위치에 다시 배치
  let pokemonIndex = 0
  for (let row = 0; row < newBoard.length; row++) {
    for (let col = 0; col < newBoard[row].length; col++) {
      if (!newBoard[row][col].isEmpty && pokemonIndex < shuffledPokemon.length) {
        newBoard[row][col] = {
          ...newBoard[row][col],
          pokemon: shuffledPokemon[pokemonIndex],
          isSelected: false
        }
        pokemonIndex++
      }
    }
  }
  
  return newBoard
}

/**
 * 보드에 남은 포켓몬이 있는지 확인
 * @param board 게임 보드
 * @returns 남은 포켓몬이 있으면 true
 */
export function hasRemainingPokemon(board: GameTile[][]): boolean {
  for (const row of board) {
    for (const tile of row) {
      if (!tile.isEmpty && tile.pokemon) {
        return true
      }
    }
  }
  return false
}

/**
 * 게임이 완전히 끝났는지 확인 (더 이상 매치도 셔플도 불가능)
 * @param board 게임 보드
 * @returns 게임이 완전히 끝났으면 true
 */
export function isGameCompletelyFinished(board: GameTile[][]): boolean {
  // 남은 포켓몬이 없으면 게임 완료
  if (!hasRemainingPokemon(board)) {
    return true
  }
  
  // 매치 가능한 조합이 있으면 아직 끝나지 않음
  if (hasValidMatches(board)) {
    return false
  }
  
  // 매치가 불가능하면 셔플해서 확인
  const shuffledBoard = shuffleExistingTiles(board)
  return !hasValidMatches(shuffledBoard)
} 