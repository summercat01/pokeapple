import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const ADMIN_USERNAME = 'jumok'

function hashPassword(password: string) {
  return Buffer.from(password + 'pokeapple_salt').toString('base64')
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
    const { adminId, userId, newPassword } = await request.json()

    if (!adminId || typeof adminId !== 'number') {
      return NextResponse.json({ error: '유효한 관리자 정보가 필요합니다' }, { status: 400 })
    }

    if (!userId || typeof userId !== 'number') {
      return NextResponse.json({ error: '유효한 사용자 정보가 필요합니다' }, { status: 400 })
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 4) {
      return NextResponse.json({ error: '새 비밀번호는 4자 이상이어야 합니다' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: '서버 설정이 올바르지 않습니다' }, { status: 500 })
    }

    // 관리자 검증
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('id, username')
      .eq('id', adminId)
      .maybeSingle()

    if (adminError || !adminData || adminData.username !== ADMIN_USERNAME) {
      return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 })
    }

    const hashed = hashPassword(newPassword)

    const { error } = await supabase
      .from('users')
      .update({ password_hash: hashed })
      .eq('id', userId)

    if (error) {
      console.error('Admin reset password error:', error)
      return NextResponse.json({ error: '비밀번호 재설정 중 오류가 발생했습니다' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin reset password unexpected error:', error)
    return NextResponse.json({ error: '비밀번호 재설정 중 오류가 발생했습니다' }, { status: 500 })
  }
}

