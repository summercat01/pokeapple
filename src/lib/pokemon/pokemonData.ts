import { Pokemon, PokemonType } from '@/types/pokemon'

// 게임에서 사용할 포켓몬 데이터
export const GAME_POKEMON: Pokemon[] = [
  // 불타입
  { id: 4, name: 'Charmander', types: ['fire'] },
  { id: 5, name: 'Charmeleon', types: ['fire'] },
  { id: 37, name: 'Vulpix', types: ['fire'] },
  { id: 58, name: 'Growlithe', types: ['fire'] },
  { id: 77, name: 'Ponyta', types: ['fire'] },
  
  // 물타입
  { id: 7, name: 'Squirtle', types: ['water'] },
  { id: 8, name: 'Wartortle', types: ['water'] },
  { id: 54, name: 'Psyduck', types: ['water'] },
  { id: 60, name: 'Poliwag', types: ['water'] },
  { id: 72, name: 'Tentacool', types: ['water', 'poison'] },
  
  // 풀타입
  { id: 1, name: 'Bulbasaur', types: ['grass', 'poison'] },
  { id: 2, name: 'Ivysaur', types: ['grass', 'poison'] },
  { id: 43, name: 'Oddish', types: ['grass', 'poison'] },
  { id: 46, name: 'Paras', types: ['bug', 'grass'] },
  { id: 69, name: 'Bellsprout', types: ['grass', 'poison'] },
  
  // 전기타입
  { id: 25, name: 'Pikachu', types: ['electric'] },
  { id: 26, name: 'Raichu', types: ['electric'] },
  { id: 81, name: 'Magnemite', types: ['electric', 'steel'] },
  { id: 100, name: 'Voltorb', types: ['electric'] },
  { id: 125, name: 'Electabuzz', types: ['electric'] },
  
  // 노말타입
  { id: 16, name: 'Pidgey', types: ['normal', 'flying'] },
  { id: 19, name: 'Rattata', types: ['normal'] },
  { id: 39, name: 'Jigglypuff', types: ['normal', 'fairy'] },
  { id: 52, name: 'Meowth', types: ['normal'] },
  { id: 108, name: 'Lickitung', types: ['normal'] },
  
  // 독타입
  { id: 13, name: 'Weedle', types: ['bug', 'poison'] },
  { id: 23, name: 'Ekans', types: ['poison'] },
  { id: 29, name: 'Nidoran♀', types: ['poison'] },
  { id: 32, name: 'Nidoran♂', types: ['poison'] },
  { id: 41, name: 'Zubat', types: ['poison', 'flying'] },
  
  // 비행타입
  { id: 21, name: 'Spearow', types: ['normal', 'flying'] },
  { id: 83, name: 'Farfetchd', types: ['normal', 'flying'] },
  { id: 84, name: 'Doduo', types: ['normal', 'flying'] },
  { id: 142, name: 'Aerodactyl', types: ['rock', 'flying'] },
  { id: 144, name: 'Articuno', types: ['ice', 'flying'] },
]

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
