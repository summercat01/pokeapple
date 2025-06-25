// 모든 세대 포켓몬 데이터를 통합하는 메인 파일
import { Pokemon, PokemonType } from '@/types/pokemon'
import { GAME_POKEMON as GEN1_POKEMON } from './generations/gen1/pokemonData'
// 나중에 추가될 세대들
// import { GAME_POKEMON as GEN2_POKEMON } from './generations/gen2/pokemonData'
// import { GAME_POKEMON as GEN3_POKEMON } from './generations/gen3/pokemonData'
// import { GAME_POKEMON as GEN4_POKEMON } from './generations/gen4/pokemonData'

// 모든 포켓몬 데이터 통합
export const ALL_POKEMON: Pokemon[] = [
  ...GEN1_POKEMON,
  // 나중에 추가될 세대들
  // ...GEN2_POKEMON,
  // ...GEN3_POKEMON,
  // ...GEN4_POKEMON,
]

// 현재 게임에서 사용할 포켓몬 (설정으로 제어 가능)
export const GAME_POKEMON: Pokemon[] = ALL_POKEMON

// 랜덤 포켓몬 선택
export function getRandomPokemon(): Pokemon {
  return GAME_POKEMON[Math.floor(Math.random() * GAME_POKEMON.length)]
}

// 타입별 포켓몬 필터링
export function getPokemonByType(type: PokemonType): Pokemon[] {
  return GAME_POKEMON.filter(pokemon => pokemon.types.includes(type))
}

// 포켓몬이 특정 타입인지 확인 (복합타입 고려)
export function hasType(pokemon: Pokemon, type: PokemonType): boolean {
  return pokemon.types.includes(type)
}

// 세대별 포켓몬 가져오기
export function getPokemonByGeneration(generation: 1 | 2 | 3 | 4): Pokemon[] {
  switch (generation) {
    case 1:
      return GEN1_POKEMON
    // case 2:
    //   return GEN2_POKEMON
    // case 3:
    //   return GEN3_POKEMON
    // case 4:
    //   return GEN4_POKEMON
    default:
      return GEN1_POKEMON
  }
}

// 특정 세대만 사용하도록 설정
export function setGameGeneration(generation: 1 | 2 | 3 | 4 | 'all') {
  // 나중에 구현 - 게임에서 사용할 세대 선택
}
