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

export async function POST(request: Request) {
  try {
    const { nickname } = await request.json()

    if (!nickname || typeof nickname !== 'string') {
      return NextResponse.json({ error: '유효한 닉네임을 입력하세요' }, { status: 400 })
    }

    if (!serverSupabase) {
      return NextResponse.json({ error: '서버 설정이 올바르지 않습니다' }, { status: 500 })
    }

    const supabase = serverSupabase()

    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('nickname', nickname)
      .maybeSingle()

    if (error) {
      console.error('recover-username error:', error)
      return NextResponse.json({ error: '아이디를 찾는 중 오류가 발생했습니다' }, { status: 500 })
    }

    if (!data?.username) {
      return NextResponse.json({ error: '해당 닉네임으로 등록된 아이디가 없습니다' }, { status: 404 })
    }

    return NextResponse.json({ username: data.username })
  } catch (error) {
    console.error('recover-username unexpected error:', error)
    return NextResponse.json({ error: '아이디를 찾는 중 오류가 발생했습니다' }, { status: 500 })
  }
}

