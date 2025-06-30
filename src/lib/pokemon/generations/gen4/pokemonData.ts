import { Pokemon, PokemonType } from '@/types/pokemon'

// 4세대 포켓몬 데이터 (387~493)
export const GAME_POKEMON: Pokemon[] = [
  // 신오 스타터 (387~395)
  { id: 387, name: 'Turtwig', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/387.png' },
  { id: 388, name: 'Grotle', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/388.png' },
  { id: 389, name: 'Torterra', types: ['grass', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/389.png' },
  { id: 390, name: 'Chimchar', types: ['fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/390.png' },
  { id: 391, name: 'Monferno', types: ['fire', 'fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/391.png' },
  { id: 392, name: 'Infernape', types: ['fire', 'fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/392.png' },
  { id: 393, name: 'Piplup', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/393.png' },
  { id: 394, name: 'Prinplup', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/394.png' },
  { id: 395, name: 'Empoleon', types: ['water', 'steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/395.png' },

  // 396~410
  { id: 396, name: 'Starly', types: ['normal', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/396.png' },
  { id: 397, name: 'Staravia', types: ['normal', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/397.png' },
  { id: 398, name: 'Staraptor', types: ['normal', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/398.png' },
  { id: 399, name: 'Bidoof', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/399.png' },
  { id: 400, name: 'Bibarel', types: ['normal', 'water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/400.png' },
  { id: 401, name: 'Kricketot', types: ['bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/401.png' },
  { id: 402, name: 'Kricketune', types: ['bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/402.png' },
  { id: 403, name: 'Shinx', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/403.png' },
  { id: 404, name: 'Luxio', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/404.png' },
  { id: 405, name: 'Luxray', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/405.png' },
  { id: 406, name: 'Budew', types: ['grass', 'poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/406.png' },
  { id: 407, name: 'Roserade', types: ['grass', 'poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/407.png' },
  { id: 408, name: 'Cranidos', types: ['rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/408.png' },
  { id: 409, name: 'Rampardos', types: ['rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/409.png' },
  { id: 410, name: 'Shieldon', types: ['rock', 'steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/410.png' },

  // 411~430
  { id: 411, name: 'Bastiodon', types: ['rock', 'steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/411.png' },
  { id: 412, name: 'Burmy', types: ['bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/412.png' },
  { id: 413, name: 'Wormadam', types: ['bug', 'grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/413.png' },
  { id: 414, name: 'Mothim', types: ['bug', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/414.png' },
  { id: 415, name: 'Combee', types: ['bug', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/415.png' },
  { id: 416, name: 'Vespiquen', types: ['bug', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/416.png' },
  { id: 417, name: 'Pachirisu', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/417.png' },
  { id: 418, name: 'Buizel', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/418.png' },
  { id: 419, name: 'Floatzel', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/419.png' },
  { id: 420, name: 'Cherubi', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/420.png' },
  { id: 421, name: 'Cherrim', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/421.png' },
  { id: 422, name: 'Shellos', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/422.png' },
  { id: 423, name: 'Gastrodon', types: ['water', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/423.png' },
  { id: 424, name: 'Ambipom', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/424.png' },
  { id: 425, name: 'Drifloon', types: ['ghost', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/425.png' },
  { id: 426, name: 'Drifblim', types: ['ghost', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/426.png' },
  { id: 427, name: 'Buneary', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/427.png' },
  { id: 428, name: 'Lopunny', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/428.png' },
  { id: 429, name: 'Mismagius', types: ['ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/429.png' },
  { id: 430, name: 'Honchkrow', types: ['dark', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/430.png' },

  // 431~450
  { id: 431, name: 'Glameow', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/431.png' },
  { id: 432, name: 'Purugly', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/432.png' },
  { id: 433, name: 'Chingling', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/433.png' },
  { id: 434, name: 'Stunky', types: ['poison', 'dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/434.png' },
  { id: 435, name: 'Skuntank', types: ['poison', 'dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/435.png' },
  { id: 436, name: 'Bronzor', types: ['steel', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/436.png' },
  { id: 437, name: 'Bronzong', types: ['steel', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/437.png' },
  { id: 438, name: 'Bonsly', types: ['rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/438.png' },
  { id: 439, name: 'Mime Jr.', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/439.png' },
  { id: 440, name: 'Happiny', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/440.png' },
  { id: 441, name: 'Chatot', types: ['normal', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/441.png' },
  { id: 442, name: 'Spiritomb', types: ['ghost', 'dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/442.png' },
  { id: 443, name: 'Gible', types: ['dragon', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/443.png' },
  { id: 444, name: 'Gabite', types: ['dragon', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/444.png' },
  { id: 445, name: 'Garchomp', types: ['dragon', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/445.png' },
  { id: 446, name: 'Munchlax', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/446.png' },
  { id: 447, name: 'Riolu', types: ['fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/447.png' },
  { id: 448, name: 'Lucario', types: ['fighting', 'steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/448.png' },
  { id: 449, name: 'Hippopotas', types: ['ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/449.png' },
  { id: 450, name: 'Hippowdon', types: ['ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/450.png' },

  // 451~470
  { id: 451, name: 'Skorupi', types: ['poison', 'bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/451.png' },
  { id: 452, name: 'Drapion', types: ['poison', 'dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/452.png' },
  { id: 453, name: 'Croagunk', types: ['poison', 'fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/453.png' },
  { id: 454, name: 'Toxicroak', types: ['poison', 'fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/454.png' },
  { id: 455, name: 'Carnivine', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/455.png' },
  { id: 456, name: 'Finneon', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/456.png' },
  { id: 457, name: 'Lumineon', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/457.png' },
  { id: 458, name: 'Mantyke', types: ['water', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/458.png' },
  { id: 459, name: 'Snover', types: ['grass', 'ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/459.png' },
  { id: 460, name: 'Abomasnow', types: ['grass', 'ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/460.png' },
  { id: 461, name: 'Weavile', types: ['dark', 'ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/461.png' },
  { id: 462, name: 'Magnezone', types: ['electric', 'steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/462.png' },
  { id: 463, name: 'Lickilicky', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/463.png' },
  { id: 464, name: 'Rhyperior', types: ['ground', 'rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/464.png' },
  { id: 465, name: 'Tangrowth', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/465.png' },
  { id: 466, name: 'Electivire', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/466.png' },
  { id: 467, name: 'Magmortar', types: ['fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/467.png' },
  { id: 468, name: 'Togekiss', types: ['normal', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/468.png' },
  { id: 469, name: 'Yanmega', types: ['bug', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/469.png' },
  { id: 470, name: 'Leafeon', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/470.png' },

  // 471~480
  { id: 471, name: 'Glaceon', types: ['ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/471.png' },
  { id: 472, name: 'Gliscor', types: ['ground', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/472.png' },
  { id: 473, name: 'Mamoswine', types: ['ice', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/473.png' },
  { id: 474, name: 'Porygon-Z', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/474.png' },
  { id: 475, name: 'Gallade', types: ['psychic', 'fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/475.png' },
  { id: 476, name: 'Probopass', types: ['rock', 'steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/476.png' },
  { id: 477, name: 'Dusknoir', types: ['ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/477.png' },
  { id: 478, name: 'Froslass', types: ['ice', 'ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/478.png' },
  { id: 479, name: 'Rotom', types: ['electric', 'ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/479.png' },
  { id: 480, name: 'Uxie', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/480.png' },

  // 481~493 (전설의 포켓몬들)
  { id: 481, name: 'Mesprit', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/481.png' },
  { id: 482, name: 'Azelf', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/482.png' },
  { id: 483, name: 'Dialga', types: ['steel', 'dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/483.png' },
  { id: 484, name: 'Palkia', types: ['water', 'dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/484.png' },
  { id: 485, name: 'Heatran', types: ['fire', 'steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/485.png' },
  { id: 486, name: 'Regigigas', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/486.png' },
  { id: 487, name: 'Giratina', types: ['ghost', 'dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/487.png' },
  { id: 488, name: 'Cresselia', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/488.png' },
  { id: 489, name: 'Phione', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/489.png' },
  { id: 490, name: 'Manaphy', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/490.png' },
  { id: 491, name: 'Darkrai', types: ['dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/491.png' },
  { id: 492, name: 'Shaymin', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/492.png' },
  { id: 493, name: 'Arceus', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/493.png' },
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