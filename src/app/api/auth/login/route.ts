import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase environment variables missing for auth login endpoint')
}

function hashPassword(password: string) {
  return Buffer.from(password + 'pokeapple_salt').toString('base64')
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
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
    const { username, password } = await request.json()

    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: '아이디와 비밀번호를 입력해주세요' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: '서버 설정이 올바르지 않습니다' }, { status: 500 })
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle()

    if (error) {
      console.error('Login user lookup error:', error)
      return NextResponse.json({ error: '로그인 중 오류가 발생했습니다' }, { status: 500 })
    }

    if (!userData) {
      return NextResponse.json({ error: '존재하지 않는 사용자명입니다' }, { status: 404 })
    }

    if (!verifyPassword(password, userData.password_hash)) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다' }, { status: 401 })
    }

    const { password_hash, ...publicUser } = userData

    return NextResponse.json({ user: publicUser })
  } catch (error) {
    console.error('Auth login unexpected error:', error)
    return NextResponse.json({ error: '로그인 중 오류가 발생했습니다' }, { status: 500 })
  }
}

