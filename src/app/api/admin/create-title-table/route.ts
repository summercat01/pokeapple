import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const createServerSupabase = () => {
  if (!supabaseUrl || !serviceRoleKey) return null

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

export async function POST() {
  const supabase = createServerSupabase()

  if (!supabase) {
    return NextResponse.json({ error: '서버 설정이 올바르지 않습니다' }, { status: 500 })
  }

  try {
    const { error } = await supabase.rpc('ensure_user_titles_table_exists')

    if (error) {
      console.error('Failed to ensure user_titles table:', error)
      return NextResponse.json({ error: '칭호 테이블 생성 중 오류가 발생했습니다' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error ensuring user_titles table:', error)
    return NextResponse.json({ error: '칭호 테이블 생성 중 오류가 발생했습니다' }, { status: 500 })
  }
}
