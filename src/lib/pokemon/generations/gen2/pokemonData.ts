import { Pokemon, PokemonType } from '@/types/pokemon'

// 2세대 포켓몬 데이터 (152~251)
export const GAME_POKEMON: Pokemon[] = [
  // 152~160
  { id: 152, name: 'Chikorita', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/152.png' },
  { id: 153, name: 'Bayleef', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/153.png' },
  { id: 154, name: 'Meganium', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/154.png' },
  { id: 155, name: 'Cyndaquil', types: ['fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/155.png' },
  { id: 156, name: 'Quilava', types: ['fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/156.png' },
  { id: 157, name: 'Typhlosion', types: ['fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/157.png' },
  { id: 158, name: 'Totodile', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/158.png' },
  { id: 159, name: 'Croconaw', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/159.png' },
  { id: 160, name: 'Feraligatr', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/160.png' },

  // 161~170
  { id: 161, name: 'Sentret', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/161.png' },
  { id: 162, name: 'Furret', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/162.png' },
  { id: 163, name: 'Hoothoot', types: ['normal', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/163.png' },
  { id: 164, name: 'Noctowl', types: ['normal', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/164.png' },
  { id: 165, name: 'Ledyba', types: ['bug', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/165.png' },
  { id: 166, name: 'Ledian', types: ['bug', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/166.png' },
  { id: 167, name: 'Spinarak', types: ['bug', 'poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/167.png' },
  { id: 168, name: 'Ariados', types: ['bug', 'poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/168.png' },
  { id: 169, name: 'Crobat', types: ['poison', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/169.png' },
  { id: 170, name: 'Chinchou', types: ['water', 'electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/170.png' },

  // 171~180
  { id: 171, name: 'Lanturn', types: ['water', 'electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/171.png' },
  { id: 172, name: 'Pichu', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/172.png' },
  { id: 173, name: 'Cleffa', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/173.png' },
  { id: 174, name: 'Igglybuff', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/174.png' },
  { id: 175, name: 'Togepi', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/175.png' },
  { id: 176, name: 'Togetic', types: ['normal', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/176.png' },
  { id: 177, name: 'Natu', types: ['psychic', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/177.png' },
  { id: 178, name: 'Xatu', types: ['psychic', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/178.png' },
  { id: 179, name: 'Mareep', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/179.png' },
  { id: 180, name: 'Flaaffy', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/180.png' },

  // 181~190
  { id: 181, name: 'Ampharos', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/181.png' },
  { id: 182, name: 'Bellossom', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/182.png' },
  { id: 183, name: 'Marill', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/183.png' },
  { id: 184, name: 'Azumarill', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/184.png' },
  { id: 185, name: 'Sudowoodo', types: ['rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/185.png' },
  { id: 186, name: 'Politoed', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/186.png' },
  { id: 187, name: 'Hoppip', types: ['grass', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/187.png' },
  { id: 188, name: 'Skiploom', types: ['grass', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/188.png' },
  { id: 189, name: 'Jumpluff', types: ['grass', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/189.png' },
  { id: 190, name: 'Aipom', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/190.png' },

  // 191~200
  { id: 191, name: 'Sunkern', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/191.png' },
  { id: 192, name: 'Sunflora', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/192.png' },
  { id: 193, name: 'Yanma', types: ['bug', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/193.png' },
  { id: 194, name: 'Wooper', types: ['water', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/194.png' },
  { id: 195, name: 'Quagsire', types: ['water', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/195.png' },
  { id: 196, name: 'Espeon', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/196.png' },
  { id: 197, name: 'Umbreon', types: ['dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/197.png' },
  { id: 198, name: 'Murkrow', types: ['dark', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/198.png' },
  { id: 199, name: 'Slowking', types: ['water', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/199.png' },
  { id: 200, name: 'Misdreavus', types: ['ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/200.png' },

  // 201~210
  { id: 201, name: 'Unown', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/201.png' },
  { id: 202, name: 'Wobbuffet', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/202.png' },
  { id: 203, name: 'Girafarig', types: ['normal', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/203.png' },
  { id: 204, name: 'Pineco', types: ['bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/204.png' },
  { id: 205, name: 'Forretress', types: ['bug', 'steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/205.png' },
  { id: 206, name: 'Dunsparce', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/206.png' },
  { id: 207, name: 'Gligar', types: ['ground', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/207.png' },
  { id: 208, name: 'Steelix', types: ['steel', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/208.png' },
  { id: 209, name: 'Snubbull', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/209.png' },
  { id: 210, name: 'Granbull', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/210.png' },

  // 211~220
  { id: 211, name: 'Qwilfish', types: ['water', 'poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/211.png' },
  { id: 212, name: 'Scizor', types: ['bug', 'steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/212.png' },
  { id: 213, name: 'Shuckle', types: ['bug', 'rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/213.png' },
  { id: 214, name: 'Heracross', types: ['bug', 'fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/214.png' },
  { id: 215, name: 'Sneasel', types: ['dark', 'ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/215.png' },
  { id: 216, name: 'Teddiursa', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/216.png' },
  { id: 217, name: 'Ursaring', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/217.png' },
  { id: 218, name: 'Slugma', types: ['fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/218.png' },
  { id: 219, name: 'Magcargo', types: ['fire', 'rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/219.png' },
  { id: 220, name: 'Swinub', types: ['ice', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/220.png' },

  // 221~230
  { id: 221, name: 'Piloswine', types: ['ice', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/221.png' },
  { id: 222, name: 'Corsola', types: ['water', 'rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/222.png' },
  { id: 223, name: 'Remoraid', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/223.png' },
  { id: 224, name: 'Octillery', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/224.png' },
  { id: 225, name: 'Delibird', types: ['ice', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/225.png' },
  { id: 226, name: 'Mantine', types: ['water', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/226.png' },
  { id: 227, name: 'Skarmory', types: ['steel', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/227.png' },
  { id: 228, name: 'Houndour', types: ['dark', 'fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/228.png' },
  { id: 229, name: 'Houndoom', types: ['dark', 'fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/229.png' },
  { id: 230, name: 'Kingdra', types: ['water', 'dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/230.png' },

  // 231~240
  { id: 231, name: 'Phanpy', types: ['ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/231.png' },
  { id: 232, name: 'Donphan', types: ['ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/232.png' },
  { id: 233, name: 'Porygon2', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/233.png' },
  { id: 234, name: 'Stantler', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/234.png' },
  { id: 235, name: 'Smeargle', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/235.png' },
  { id: 236, name: 'Tyrogue', types: ['fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/236.png' },
  { id: 237, name: 'Hitmontop', types: ['fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/237.png' },
  { id: 238, name: 'Smoochum', types: ['ice', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/238.png' },
  { id: 239, name: 'Elekid', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/239.png' },
  { id: 240, name: 'Magby', types: ['fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/240.png' },

  // 241~251
  { id: 241, name: 'Miltank', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/241.png' },
  { id: 242, name: 'Blissey', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/242.png' },
  { id: 243, name: 'Raikou', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/243.png' },
  { id: 244, name: 'Entei', types: ['fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/244.png' },
  { id: 245, name: 'Suicune', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/245.png' },
  { id: 246, name: 'Larvitar', types: ['rock', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/246.png' },
  { id: 247, name: 'Pupitar', types: ['rock', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/247.png' },
  { id: 248, name: 'Tyranitar', types: ['rock', 'dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/248.png' },
  { id: 249, name: 'Lugia', types: ['psychic', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/249.png' },
  { id: 250, name: 'Ho-Oh', types: ['fire', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/250.png' },
  { id: 251, name: 'Celebi', types: ['psychic', 'grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/251.png' },
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