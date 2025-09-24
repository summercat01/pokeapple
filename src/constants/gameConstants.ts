// 게임 보드 관련 상수들
export const GAME_LAYOUT = {
  TILE_SIZE: 60,
  TILE_GAP: 12,
  PADDING_Y: 64, // py-16 equivalent
  PADDING_X: 80, // px-20 equivalent
  BOARD_COLUMNS: 18, // gridTemplateColumns: 'repeat(18, minmax(0, 1fr))'
  BORDER_WIDTH: 60,
} as const

// 게임 보드 크기 계산 함수들
export const calculateTileCenterPosition = (rowIndex: number, colIndex: number) => {
  const tileCenterX = colIndex * (GAME_LAYOUT.TILE_SIZE + GAME_LAYOUT.TILE_GAP) + 
                    GAME_LAYOUT.PADDING_X + (GAME_LAYOUT.TILE_SIZE / 2)
  const tileCenterY = rowIndex * (GAME_LAYOUT.TILE_SIZE + GAME_LAYOUT.TILE_GAP) + 
                     GAME_LAYOUT.PADDING_Y + (GAME_LAYOUT.TILE_SIZE / 2)
  
  return { tileCenterX, tileCenterY }
}

// 색상 상수
export const GAME_COLORS = {
  PRIMARY_GREEN: '#00cc66',
  PRIMARY_ORANGE: '#ff6600',  
  PRIMARY_RED: '#ff3603',
  BACKGROUND_GREEN: '#d5f6cd',
  WHITE: '#fff',
  GRAY_100: '#f7fafc',
  GRAY_600: '#718096',
  GRAY_700: '#4a5568',
  BLUE_500: '#4299e1',
} as const

// UI 위치 상수
export const UI_POSITIONS = {
  SCORE_TOP: '100px',
  SCORE_RIGHT: '50px',
  TIMER_TOP: '200px',
  TIMER_RIGHT: '70px',
  TIMER_HEIGHT: '500px',
  TIMER_WIDTH: '16px',
  BUTTON_TOP: '10px',
  RESET_BUTTON_RIGHT: '10px',
  MUSIC_BUTTON_RIGHT: '90px',
} as const

// 애니메이션 상수
export const ANIMATION = {
  TILE_REMOVE_DURATION: 800, // ms
  SHUFFLE_DELAY: 500, // ms
  STATE_UPDATE_DELAY: 100, // ms
  MAX_SHUFFLE_COUNT: 5,
} as const