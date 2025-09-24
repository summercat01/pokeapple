# 환경 변수 설정 가이드

## .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# 앱 URL (CORS 설정용)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase 설정

1. Supabase 프로젝트에서 Settings > API로 이동
2. 다음 값들을 복사하여 환경 변수에 설정:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

## 프로덕션 배포 시

Vercel 등에 배포할 때는 환경 변수를 다음과 같이 설정하세요:

- `NEXT_PUBLIC_APP_URL` → 실제 도메인 (예: https://pokeapple.vercel.app)

## 보안 주의사항

- `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드에서만 사용되며 클라이언트에 노출되지 않습니다
- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다
- 프로덕션에서는 환경 변수를 안전하게 관리하세요
