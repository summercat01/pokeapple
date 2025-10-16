export interface HelpSection {
  heading: string
  description?: string
  items: string[]
}

export interface PokemonTypeInfo {
  id: string
  label: string
  color: string
}

export type HelpTabId = 'how-to-play' | 'pokemon-types' | 'score-and-tips'

export interface HelpTab {
  id: HelpTabId
  title: string
  icon: string
  description?: string
  sections?: HelpSection[]
  typeList?: PokemonTypeInfo[]
}

export const DEFAULT_HELP_TAB_ID: HelpTabId = 'how-to-play'

export const POKEMON_TYPE_LIST: PokemonTypeInfo[] = [
  { id: 'normal', label: '노말', color: '#A8A77A' },
  { id: 'fire', label: '불꽃', color: '#EE8130' },
  { id: 'water', label: '물', color: '#6390F0' },
  { id: 'electric', label: '전기', color: '#F7D02C' },
  { id: 'grass', label: '풀', color: '#7AC74C' },
  { id: 'ice', label: '얼음', color: '#96D9D6' },
  { id: 'fighting', label: '격투', color: '#C22E28' },
  { id: 'poison', label: '독', color: '#A33EA1' },
  { id: 'ground', label: '땅', color: '#E2BF65' },
  { id: 'flying', label: '비행', color: '#A98FF3' },
  { id: 'psychic', label: '에스퍼', color: '#F95587' },
  { id: 'bug', label: '벌레', color: '#A6B91A' },
  { id: 'rock', label: '바위', color: '#B6A136' },
  { id: 'ghost', label: '고스트', color: '#735797' },
  { id: 'dragon', label: '드래곤', color: '#6F35FC' },
  { id: 'dark', label: '악', color: '#705746' },
  { id: 'steel', label: '강철', color: '#B7B7CE' }
]

export const HELP_TABS: HelpTab[] = [
  {
    id: 'how-to-play',
    title: '게임 방법',
    icon: '🎮',
    sections: [
      {
        heading: '게임 목표',
        items: [
          '같은 타입의 포켓몬들을 드래그로 선택하여 점수를 얻으세요',
          '제한 시간 내에 가장 많은 점수를 얻는 게임입니다'
        ]
      },
      {
        heading: '조작 방법',
        items: [
          '마우스로 드래그하여 영역을 선택하세요',
          '같은 타입 포켓몬들이 선택되면 자동으로 제거됩니다다',
          '2개 이상 연결되면 즉시 제거할 수 있습니다'
        ]
      },
      {
        heading: '시간 제한',
        items: [
          '120초'
        ]
      }
    ]
  },
  {
    id: 'pokemon-types',
    title: '포켓몬 타입',
    icon: '🔥',
    description: '같은 타입끼리만 매칭되며, 복합 타입 포켓몬은 두 타입 중 하나만 일치하면 됩니다.',
    sections: [
      {
        heading: '타입 매칭 규칙',
        items: [
          '같은 타입끼리만 매칭 가능합니다',
          '복합 타입 포켓몬은 어느 타입으로든 매칭 가능합니다.'
        ]
      }
    ],
    typeList: POKEMON_TYPE_LIST
  },
  {
    id: 'score-and-tips',
    title: '점수 & 팁',
    icon: '💡',
    sections: [
      {
        heading: '점수 시스템',
        items: [
          '제거한 타일 개수 당 1점'
        ]
      },
      {
        heading: '게임 팁',
        items: [
          '5초 동안 매칭이 없으면 자동으로 힌트가 표시됩니다',
          '더 이상 매칭이 없으면 자동으로 셔플됩니다',
          '넓은 영역을 드래그하여 많은 포켓몬을 선택해보세요'
        ]
      }
    ]
  }
]