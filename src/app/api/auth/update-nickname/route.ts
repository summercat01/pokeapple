import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase environment variables missing for nickname update endpoint')
}

const createServerSupabase = () => {
  if (!supabaseUrl || !serviceRoleKey) return null

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
}

export async function POST(request: Request) {
  try {
    const { userId, nickname } = await request.json()

    if (!userId || typeof userId !== 'number') {
      return NextResponse.json({ error: '유효한 사용자 ID가 필요합니다' }, { status: 400 })
    }

    if (!nickname || typeof nickname !== 'string' || nickname.trim().length < 2) {
      return NextResponse.json({ error: '닉네임은 2자 이상이어야 합니다' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: '서버 설정이 올바르지 않습니다' }, { status: 500 })
    }

    // 닉네임 중복 체크
    const { data: existingNickname, error: nicknameCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname)
      .neq('id', userId)
      .maybeSingle()

    if (nicknameCheckError) {
      console.error('Nickname duplication check error:', nicknameCheckError)
      return NextResponse.json({ error: '닉네임 중복 확인 중 오류가 발생했습니다' }, { status: 500 })
    }

    if (existingNickname) {
      return NextResponse.json({ error: '이미 사용 중인 닉네임입니다' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('users')
      .update({ nickname })
      .eq('id', userId)
      .select('*')
      .maybeSingle()

    if (error) {
      console.error('Nickname update error:', error)
      return NextResponse.json({ error: '닉네임 변경 중 오류가 발생했습니다' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    const { password_hash, ...publicUser } = data

    return NextResponse.json({ user: publicUser })
  } catch (error) {
    console.error('Nickname update unexpected error:', error)
    return NextResponse.json({ error: '닉네임 변경 중 오류가 발생했습니다' }, { status: 500 })
  }
}

