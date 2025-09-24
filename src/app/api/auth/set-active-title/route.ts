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

    const supabase = createServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: '서버 설정이 올바르지 않습니다' }, { status: 500 })
    }

    let validatedTitle: string | null = null

    if (title !== null) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json({ error: '유효한 칭호를 입력해주세요' }, { status: 400 })
      }

      // 해당 칭호가 사용자에게 부여된 것인지 확인
      const { data: existingTitle, error: titleError } = await supabase
        .from('user_titles')
        .select('title')
        .eq('user_id', userId)
        .eq('title', title.trim())
        .maybeSingle()

      if (titleError) {
        console.error('Validate title error:', titleError)
        return NextResponse.json({ error: '칭호를 확인하는 중 오류가 발생했습니다' }, { status: 500 })
      }

      if (!existingTitle) {
        return NextResponse.json({ error: '사용자에게 부여되지 않은 칭호입니다' }, { status: 400 })
      }

      validatedTitle = title.trim()
    }

    const { data, error } = await supabase
      .from('users')
      .update({ active_title: validatedTitle })
      .eq('id', userId)
      .select('*')
      .maybeSingle()

    if (error) {
      console.error('Set active title error:', error)
      return NextResponse.json({ error: '칭호를 설정하는 중 오류가 발생했습니다' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('Set active title unexpected error:', error)
    return NextResponse.json({ error: '칭호를 설정하는 중 오류가 발생했습니다' }, { status: 500 })
  }
}
