# 포켓몬 사과게임 (Pokeapple)

포켓몬의 타입을 활용해 같은 계열의 포켓몬을 드래그로 선택하며 점수를 올리는 실시간 퍼즐 게임입니다. 커스텀 로그인과 Supabase 기반의 랭킹 시스템, 관리자 전용 대시보드 등을 갖춘 풀스택 Next.js 애플리케이션입니다.

## 주요 기능

- 실시간 드래그 선택: 포켓몬의 타입을 기준으로 다수의 타일을 한번에 제거
- 모드 선택: 일반(`normal`)·초보자(`beginner`) 모드를 지원, 초보자 모드에서는 타입 힌트 제공
- 자동 힌트 & 셔플: 5초 동안 매치를 만들지 못하면 힌트 노출, 매치가 없을 경우 최대 5회까지 자동 셔플
- 사운드 및 BGM: 배경 음악/효과음을 상황에 맞춰 재생하고 토글 가능
- 사용자 계정: 자체 회원가입·로그인, 닉네임/칭호 관리, 아이디 찾기 UI 제공
- 랭킹 시스템: 모드별 상위 10위 랭킹, 내 순위 조회, 최고 점수 자동 갱신
- 관리자 페이지: 사용자 목록 조회, 비밀번호 초기화, 칭호 부여 등의 운영 도구
- 보안 검증: 점수 저장 시 클라이언트·서버 양단에서 기본 유효성 검증과 세션 체크 수행

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript, React 19
- **Styling**: Tailwind CSS 4, CSS Modules (일부 컴포넌트)
- **상태 관리**: React 훅 + 커스텀 컨텍스트(`AuthContext`)
- **Backend 서비스**: Supabase (Auth·DB·Edge Functions), Next.js Route Handler API
- **Build & 품질**: ESLint 9, TypeScript 5

## 프로젝트 구조

```
src/
  app/
    layout.tsx            # 전역 레이아웃, 폰트, AuthProvider 적용
    page.tsx              # 메인 페이지, GameBoard 렌더링
    admin/                # 관리자 전용 페이지
    api/                  # Next.js Route Handler 기반 REST API 엔드포인트
  components/
    GameBoard/            # 게임 보드 UI와 오버레이, 랭킹 사이드바 등
    Help/                 # 도움말 모달 & 버튼
    auth/                 # 로그인/회원가입 모달, 사용자 상태 표시
  constants/              # 게임 설정 및 도움말 데이터 상수
  contexts/               # 인증 컨텍스트
  hooks/                  # 게임 상태, 오디오, 랭킹 관련 커스텀 훅
  lib/
    game/                 # 게임 보드 생성, 셔플 로직
    pokemon/              # 세대별 포켓몬 데이터
    supabase.ts           # Supabase 클라이언트 및 데이터 액세스 함수
  types/                  # 게임·포켓몬 타입 정의
  utils/                  # 드래그/보안 관련 유틸리티

public/                   # 오디오 리소스, 정적 자산
docs/                     # 개발 환경 안내 및 도구별 가이드
```

## 동작 개요

1. 사용자가 메인 화면에서 모드를 선택하고 `Play` 버튼을 누르면 카운트다운 이후 게임이 시작됩니다.
2. `useGameState` 훅이 게임 타이머, 점수, 셔플, 힌트 등 핵심 상태를 관리합니다.
3. 드래그로 선택된 타일은 타입 검증(`validateTileTypeMatch`)을 거쳐 점수를 올리고 사라지며, 이후 자동 셔플 여부를 판단합니다.
4. 게임 종료 시 `saveGameScore` API가 호출되어 Supabase에 최고 점수가 저장되며, 랭킹 API를 통해 상위권 및 개인 순위를 제공합니다.
5. 로그인 상태에서는 `AuthContext`가 로컬 스토리지와 Supabase를 동기화하여 사용자 정보·칭호 등을 관리합니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드 및 실행
npm run build
npm start
```

> 개발 서버는 기본적으로 `http://localhost:3000` 에서 동작합니다.

## 환경 변수 설정

루트 경로에 `.env.local` 파일을 생성하고 아래 항목을 설정합니다. 자세한 설명은 `ENVIRONMENT_SETUP.md`를 참고하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## API 라우트 요약

- `POST /api/auth/login` – 커스텀 로그인 (서비스 키로 Supabase 조회)
- `POST /api/auth/update-nickname` – 닉네임 변경
- `POST /api/auth/set-active-title` – 활성 칭호 업데이트
- `POST /api/save-score` – 점수 저장 및 최고 기록 업데이트
- `GET /api/rankings` – 모드별 상위 랭킹 조회
- `GET /api/user-ranking` – 로그인 사용자의 개인 순위 조회
- `POST /api/auth/titles` 등 – 칭호, 아이디/비밀번호 복구 관련 엔드포인트
- `POST /api/admin/*` – 관리자 전용 사용자 관리 기능 (비밀번호 초기화, 칭호 부여 등)

## 핵심 모듈 설명

- `useGameState` (`src/hooks/useGameState.ts`)
  - 리듀서를 사용해 게임 상태, 카운트다운, 점수 저장, 자동 셔플/힌트를 모두 관리
  - `saveGameScore`, `validateScoreSubmission` 등 보안/저장 로직과 연동

- `GameBoard` (`src/components/GameBoard/GameBoard.tsx`)
  - 드래그 영역 계산, 애니메이션 처리, 오버레이 렌더링 등 UI 중심 컴포넌트
  - `TileGrid`·`TypeHintedTile`과 함께 실제 게임 화면 구성

- `supabase.ts`
  - 클라이언트 SDK를 사용한 인증/랭킹/칭호 관련 함수 집합
  - 브라우저에서는 `anon key`, 서버 라우트에서는 `service role key`를 사용

- `shuffleLogic.ts`
  - 타입 매칭 탐색, 힌트 조합 계산, 시드 기반 셔플 알고리즘 제공

## 개발 참고 사항

- 게임 보드는 시드 기반으로 생성되며, 클라이언트에서만 랜덤 시드를 갱신하여 SSR과의 불일치를 방지합니다.
- 점수 저장은 클라이언트 검증(`validateScoreSubmission`)과 서버 검증을 모두 통과해야 처리됩니다.
- `AuthContext`는 로컬 스토리지에 사용자 정보를 유지하고, 새로 고침 시 Supabase와 동기화합니다.
- 관리자 기능은 `username === 'jumok'` 사용자에게만 노출됩니다.

## 향후 개선 아이디어

- 복수의 난이도 및 제한 조건 추가 (예: 시간단축 모드, 타일 장애물)
- 실시간 멀티플레이 혹은 주간 이벤트 랭킹
- 모바일 터치 제스처 최적화 및 반응형 UI 개선
- 보안 강화를 위한 해시/암호화 알고리즘 개선 (현재는 단순 base64 해시 사용)

## 라이선스

프로젝트 내 포켓몬 이미지 및 이름은 © Nintendo/Creatures Inc./GAME FREAK Inc.의 저작물입니다. 해당 저작권 정책을 준수하여 비상업적 용도로만 사용하십시오. 기타 소스 코드는 MIT 라이선스를 따릅니다.

---

이 프로젝트와 관련해 궁금한 점이나 피드백이 있다면 카카오톡 오픈채팅방(게임 내 QR 링크 참고) 또는 GitHub 이슈를 통해 전달해 주세요.

