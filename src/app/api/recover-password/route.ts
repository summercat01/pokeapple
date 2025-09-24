import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase environment variables missing for recovery endpoints')
}

const serverSupabase = supabaseUrl && serviceRoleKey
  ? () => {
      const client = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      })

      return client
    }
  : null

function decodePassword(hash: string) {
  try {
    const decoded = Buffer.from(hash, 'base64').toString('utf8')
    return decoded.replace('pokeapple_salt', '')
  } catch (error) {
    console.error('Failed to decode password hash:', error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { nickname, username } = await request.json()

    if (!nickname || typeof nickname !== 'string' || !username || typeof username !== 'string') {
      return NextResponse.json({ error: '유효한 닉네임과 아이디를 입력하세요' }, { status: 400 })
    }

    if (!serverSupabase) {
      return NextResponse.json({ error: '서버 설정이 올바르지 않습니다' }, { status: 500 })
    }

    const supabase = serverSupabase()

    const { data, error } = await supabase
      .from('users')
      .select('password_hash')
      .eq('nickname', nickname)
      .eq('username', username)
      .maybeSingle()

    if (error) {
      console.error('recover-password error:', error)
      return NextResponse.json({ error: '비밀번호를 찾는 중 오류가 발생했습니다' }, { status: 500 })
    }

    if (!data?.password_hash) {
      return NextResponse.json({ error: '입력한 정보와 일치하는 계정을 찾을 수 없습니다' }, { status: 404 })
    }

    const password = decodePassword(data.password_hash)

    if (!password) {
      return NextResponse.json({ error: '비밀번호를 복호화할 수 없습니다' }, { status: 500 })
    }

    return NextResponse.json({ password })
  } catch (error) {
    console.error('recover-password unexpected error:', error)
    return NextResponse.json({ error: '비밀번호를 찾는 중 오류가 발생했습니다' }, { status: 500 })
  }
}

