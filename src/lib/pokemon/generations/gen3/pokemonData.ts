import { Pokemon, PokemonType } from '@/types/pokemon'

// 3세대 포켓몬 데이터 (252~386)
export const GAME_POKEMON: Pokemon[] = [
  // 252~260 (호엔 스타터)
  { id: 252, name: 'Treecko', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/252.png' },
  { id: 253, name: 'Grovyle', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/253.png' },
  { id: 254, name: 'Sceptile', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/254.png' },
  { id: 255, name: 'Torchic', types: ['fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/255.png' },
  { id: 256, name: 'Combusken', types: ['fire', 'fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/256.png' },
  { id: 257, name: 'Blaziken', types: ['fire', 'fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/257.png' },
  { id: 258, name: 'Mudkip', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/258.png' },
  { id: 259, name: 'Marshtomp', types: ['water', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/259.png' },
  { id: 260, name: 'Swampert', types: ['water', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/260.png' },

  // 261~270
  { id: 261, name: 'Poochyena', types: ['dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/261.png' },
  { id: 262, name: 'Mightyena', types: ['dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/262.png' },
  { id: 263, name: 'Zigzagoon', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/263.png' },
  { id: 264, name: 'Linoone', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/264.png' },
  { id: 265, name: 'Wurmple', types: ['bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/265.png' },
  { id: 266, name: 'Silcoon', types: ['bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/266.png' },
  { id: 267, name: 'Beautifly', types: ['bug', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/267.png' },
  { id: 268, name: 'Cascoon', types: ['bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/268.png' },
  { id: 269, name: 'Dustox', types: ['bug', 'poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/269.png' },
  { id: 270, name: 'Lotad', types: ['water', 'grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/270.png' },

  // 271~280
  { id: 271, name: 'Lombre', types: ['water', 'grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/271.png' },
  { id: 272, name: 'Ludicolo', types: ['water', 'grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/272.png' },
  { id: 273, name: 'Seedot', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/273.png' },
  { id: 274, name: 'Nuzleaf', types: ['grass', 'dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/274.png' },
  { id: 275, name: 'Shiftry', types: ['grass', 'dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/275.png' },
  { id: 276, name: 'Taillow', types: ['normal', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/276.png' },
  { id: 277, name: 'Swellow', types: ['normal', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/277.png' },
  { id: 278, name: 'Wingull', types: ['water', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/278.png' },
  { id: 279, name: 'Pelipper', types: ['water', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/279.png' },
  { id: 280, name: 'Ralts', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/280.png' },

  // 281~290
  { id: 281, name: 'Kirlia', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/281.png' },
  { id: 282, name: 'Gardevoir', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/282.png' },
  { id: 283, name: 'Surskit', types: ['bug', 'water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/283.png' },
  { id: 284, name: 'Masquerain', types: ['bug', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/284.png' },
  { id: 285, name: 'Shroomish', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/285.png' },
  { id: 286, name: 'Breloom', types: ['grass', 'fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/286.png' },
  { id: 287, name: 'Slakoth', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/287.png' },
  { id: 288, name: 'Vigoroth', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/288.png' },
  { id: 289, name: 'Slaking', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/289.png' },
  { id: 290, name: 'Nincada', types: ['bug', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/290.png' },

  // 291~300
  { id: 291, name: 'Ninjask', types: ['bug', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/291.png' },
  { id: 292, name: 'Shedinja', types: ['bug', 'ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/292.png' },
  { id: 293, name: 'Whismur', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/293.png' },
  { id: 294, name: 'Loudred', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/294.png' },
  { id: 295, name: 'Exploud', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/295.png' },
  { id: 296, name: 'Makuhita', types: ['fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/296.png' },
  { id: 297, name: 'Hariyama', types: ['fighting'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/297.png' },
  { id: 298, name: 'Azurill', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/298.png' },
  { id: 299, name: 'Nosepass', types: ['rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/299.png' },
  { id: 300, name: 'Skitty', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/300.png' },

  // 301~310
  { id: 301, name: 'Delcatty', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/301.png' },
  { id: 302, name: 'Sableye', types: ['dark', 'ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/302.png' },
  { id: 303, name: 'Mawile', types: ['steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/303.png' },
  { id: 304, name: 'Aron', types: ['steel', 'rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/304.png' },
  { id: 305, name: 'Lairon', types: ['steel', 'rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/305.png' },
  { id: 306, name: 'Aggron', types: ['steel', 'rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/306.png' },
  { id: 307, name: 'Meditite', types: ['fighting', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/307.png' },
  { id: 308, name: 'Medicham', types: ['fighting', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/308.png' },
  { id: 309, name: 'Electrike', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/309.png' },
  { id: 310, name: 'Manectric', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/310.png' },

  // 311~320
  { id: 311, name: 'Plusle', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/311.png' },
  { id: 312, name: 'Minun', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/312.png' },
  { id: 313, name: 'Volbeat', types: ['bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/313.png' },
  { id: 314, name: 'Illumise', types: ['bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/314.png' },
  { id: 315, name: 'Roselia', types: ['grass', 'poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/315.png' },
  { id: 316, name: 'Gulpin', types: ['poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/316.png' },
  { id: 317, name: 'Swalot', types: ['poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/317.png' },
  { id: 318, name: 'Carvanha', types: ['water', 'dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/318.png' },
  { id: 319, name: 'Sharpedo', types: ['water', 'dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/319.png' },
  { id: 320, name: 'Wailmer', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/320.png' },

  // 321~330
  { id: 321, name: 'Wailord', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/321.png' },
  { id: 322, name: 'Numel', types: ['fire', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/322.png' },
  { id: 323, name: 'Camerupt', types: ['fire', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/323.png' },
  { id: 324, name: 'Torkoal', types: ['fire'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/324.png' },
  { id: 325, name: 'Spoink', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/325.png' },
  { id: 326, name: 'Grumpig', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/326.png' },
  { id: 327, name: 'Spinda', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/327.png' },
  { id: 328, name: 'Trapinch', types: ['ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/328.png' },
  { id: 329, name: 'Vibrava', types: ['ground', 'dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/329.png' },
  { id: 330, name: 'Flygon', types: ['ground', 'dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/330.png' },

  // 331~340
  { id: 331, name: 'Cacnea', types: ['grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/331.png' },
  { id: 332, name: 'Cacturne', types: ['grass', 'dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/332.png' },
  { id: 333, name: 'Swablu', types: ['normal', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/333.png' },
  { id: 334, name: 'Altaria', types: ['dragon', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/334.png' },
  { id: 335, name: 'Zangoose', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/335.png' },
  { id: 336, name: 'Seviper', types: ['poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/336.png' },
  { id: 337, name: 'Lunatone', types: ['rock', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/337.png' },
  { id: 338, name: 'Solrock', types: ['rock', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/338.png' },
  { id: 339, name: 'Barboach', types: ['water', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/339.png' },
  { id: 340, name: 'Whiscash', types: ['water', 'ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/340.png' },

  // 341~350
  { id: 341, name: 'Corphish', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/341.png' },
  { id: 342, name: 'Crawdaunt', types: ['water', 'dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/342.png' },
  { id: 343, name: 'Baltoy', types: ['ground', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/343.png' },
  { id: 344, name: 'Claydol', types: ['ground', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/344.png' },
  { id: 345, name: 'Lileep', types: ['rock', 'grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/345.png' },
  { id: 346, name: 'Cradily', types: ['rock', 'grass'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/346.png' },
  { id: 347, name: 'Anorith', types: ['rock', 'bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/347.png' },
  { id: 348, name: 'Armaldo', types: ['rock', 'bug'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/348.png' },
  { id: 349, name: 'Feebas', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/349.png' },
  { id: 350, name: 'Milotic', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/350.png' },

  // 351~360
  { id: 351, name: 'Castform', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/351.png' },
  { id: 352, name: 'Kecleon', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/352.png' },
  { id: 353, name: 'Shuppet', types: ['ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/353.png' },
  { id: 354, name: 'Banette', types: ['ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/354.png' },
  { id: 355, name: 'Duskull', types: ['ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/355.png' },
  { id: 356, name: 'Dusclops', types: ['ghost'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/356.png' },
  { id: 357, name: 'Tropius', types: ['grass', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/357.png' },
  { id: 358, name: 'Chimecho', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/358.png' },
  { id: 359, name: 'Absol', types: ['dark'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/359.png' },
  { id: 360, name: 'Wynaut', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/360.png' },

  // 361~370
  { id: 361, name: 'Snorunt', types: ['ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/361.png' },
  { id: 362, name: 'Glalie', types: ['ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/362.png' },
  { id: 363, name: 'Spheal', types: ['ice', 'water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/363.png' },
  { id: 364, name: 'Sealeo', types: ['ice', 'water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/364.png' },
  { id: 365, name: 'Walrein', types: ['ice', 'water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/365.png' },
  { id: 366, name: 'Clamperl', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/366.png' },
  { id: 367, name: 'Huntail', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/367.png' },
  { id: 368, name: 'Gorebyss', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/368.png' },
  { id: 369, name: 'Relicanth', types: ['water', 'rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/369.png' },
  { id: 370, name: 'Luvdisc', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/370.png' },

  // 371~380 (드래곤 타입과 전설 포켓몬)
  { id: 371, name: 'Bagon', types: ['dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/371.png' },
  { id: 372, name: 'Shelgon', types: ['dragon'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/372.png' },
  { id: 373, name: 'Salamence', types: ['dragon', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/373.png' },
  { id: 374, name: 'Beldum', types: ['steel', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/374.png' },
  { id: 375, name: 'Metang', types: ['steel', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/375.png' },
  { id: 376, name: 'Metagross', types: ['steel', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/376.png' },
  { id: 377, name: 'Regirock', types: ['rock'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/377.png' },
  { id: 378, name: 'Regice', types: ['ice'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/378.png' },
  { id: 379, name: 'Registeel', types: ['steel'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/379.png' },
  { id: 380, name: 'Latias', types: ['dragon', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/380.png' },

  // 381~386 (전설의 포켓몬들)
  { id: 381, name: 'Latios', types: ['dragon', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/381.png' },
  { id: 382, name: 'Kyogre', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/382.png' },
  { id: 383, name: 'Groudon', types: ['ground'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/383.png' },
  { id: 384, name: 'Rayquaza', types: ['dragon', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/384.png' },
  { id: 385, name: 'Jirachi', types: ['steel', 'psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/385.png' },
  { id: 386, name: 'Deoxys', types: ['psychic'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/386.png' },
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