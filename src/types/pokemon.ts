export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel'

export interface Pokemon {
  id: number
  name: string
  types: PokemonType[]
  sprite?: string
}

export const POKEMON_TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#9FA19F',     // 보통 회색
  fire: '#E62829',       // 보통 빨강
  water: '#2980EF',      // 보통 파랑
  electric: '#FAC000',   // 보통 노랑
  grass: '#3FA129',      // 보통 초록
  ice: '#3DCEF3',        // 보통 하늘색
  fighting: '#FF8000',   // 보통 주황
  poison: '#9141CB',     // 보통 보라
  ground: '#915121',     // 보통 갈색
  flying: '#81B9EF',     // 보통 하늘색
  psychic: '#EF4179',    // 보통 핑크
  bug: '#91A119',        // 보통 연두
  rock: '#AFA981',       // 보통 베이지
  ghost: '#704170',      // 보통 자주색
  dragon: '#5060E1',     // 보통 보라
  dark: '#624D4E',       // 보통 회갈색
  steel: '#60A1B8',      // 보통 청록색
}
