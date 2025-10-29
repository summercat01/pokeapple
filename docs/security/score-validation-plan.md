# 점수 저장 서버 검증 강화 설계 초안

## 목표
- 클라이언트 조작 가능성을 최소화하고 서버는 신뢰할 수 있는 세션과 데이터를 기반으로만 최고 점수를 갱신한다.
- 재생성 가능한 로그·감사를 통해 비정상 패턴을 탐지하고 관리자 대응 절차를 마련한다.

## 핵심 변경 사항
- **세션 토큰**: 게임 시작 시 서버가 서명된 `gameSessionId`를 발급하고, 점수 저장 시 이 토큰을 검증한다. 토큰에는 `userId`, `mode`, `startedAt`, `expiresAt`, `boardSeed`를 포함한다.
- **서버 타임스탬프 검증**: 토큰의 `startedAt`과 점수 저장 시각을 비교해 최소 플레이 시간(예: 20초)과 최대 세션 유지 시간(30분)을 만족하는지 확인한다.
- **보드 검증**: 초기 보드 시드와 선택 로그(선택된 타일 id 배열)를 받아서 서버에서 재현 가능한 검증 함수를 준비한다.
  - MVP 단계에서는 선택 로그를 해시로 요약(예: SHA-256)하여 저장하고, 의심 사례 발생 시 오프라인 재검증한다.
  - 차후에는 `serverRebuildBoard(seed, actions)` 로직을 도입해 실시간으로 점수 합이 가능한지 판단한다.
- **요청 빈도 제한**: 사용자별/세션별로 분당 점수 저장 횟수를 제한한다(예: 3회/분). Redis 또는 Supabase Edge Function의 KV를 사용할 수 있다.
- **장치 정보 서명**: 클라이언트에서 수집한 `userAgent`, `screenSize` 등 메타데이터를 토큰에 포함해 다른 환경에서 토큰 재사용을 어렵게 한다.

## API 플로우
1. `POST /api/save-score/start`
   - 인증된 사용자만 호출.
   - 서버가 무작위 `boardSeed`와 `gameSessionId`(JWT 혹은 HMAC 서명)를 발급.
   - 응답에 세션 만료 시간, 허용 동작 수를 포함.
2. 게임 종료 후 `POST /api/save-score`
   - 본문: `{ gameSessionId, finalScore, actionsDigest, clientMetrics }`
   - 서버 검증 순서:
     1. 세션 토큰 서명 및 만료 확인
     2. 토큰의 `userId`와 요청자의 인증 정보 일치 확인
     3. `finalScore` 숫자 범위 및 단조 증가 검사(기존 최고 점수 대비 +)
     4. 최소 플레이 시간·최대 지속 시간 검사
     5. `actionsDigest` 또는 전체 액션 로그 무결성 검사(추가 설계 필요)
     6. 중복 제출 방지: 세션 단위로 단 1회 허용
   - 검증 성공 시 최고 점수 갱신 및 감사 로그 저장

## 감사/모니터링
- Supabase `game_sessions` 테이블 신설:
  - 필드: `id`, `user_id`, `mode`, `score_submitted`, `started_at`, `ended_at`, `client_ip`, `actions_digest`, `status`, `created_at`
- 의심 패턴(너무 짧은 플레이, 반복된 동일 점수, 여러 IP) 자동 플래그 후 관리자 알림
- 관리자 대시보드에 최근 세션 기록과 상태 표시

## 구현 순서 제안
1. 세션 토큰 발급/검증과 `game_sessions` 테이블 도입
2. 클라이언트 `startGameSession` 로직을 API 호출 기반으로 변경 및 토큰 저장
3. 점수 저장 API에 토큰 검증·플레이 시간 검사 추가
4. 선택 로그 요약 및 감사 로그 저장 도입
5. Redis 또는 Supabase Rate Limit으로 서버 측 요청 빈도 제한 구성
6. 보드 재생성 검증 로직 연구 및 도입 단계적 진행
