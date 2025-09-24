import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase env vars missing for update-active-title endpoint')
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
    const { userId, title } = await request.json()

    if (!userId || typeof userId !== 'number') {
      return NextResponse.json({ error: '유효한 사용자 정보가 필요합니다' }, { status: 400 })
    }

    if (title !== null && typeof title !== 'string') {
      return NextResponse.json({ error: '유효한 칭호가 필요합니다' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: '서버 설정이 올바르지 않습니다' }, { status: 500 })
    }

    const updateValue = title && title.trim().length > 0 ? title.trim() : null

    const { data, error } = await supabase
      .from('users')
      .update({ active_title: updateValue })
      .eq('id', userId)
      .select('id, username, nickname, active_title')
      .maybeSingle()

    if (error) {
      console.error('Set active title error:', error)
      return NextResponse.json({ error: '칭호 설정 중 오류가 발생했습니다' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('Set active title unexpected error:', error)
    return NextResponse.json({ error: '칭호 설정 중 오류가 발생했습니다' }, { status: 500 })
  }
}
