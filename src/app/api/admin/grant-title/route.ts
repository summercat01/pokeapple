import { NextResponse } from 'next/server'
import { createClient, PostgrestError } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const ADMIN_USERNAME = 'jumok'

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

const handleMissingTitlesTable = () =>
  NextResponse.json(
    {
      error: '칭호 테이블(user_titles)이 아직 준비되지 않았습니다. Supabase에서 user_titles 테이블을 생성하거나 마이그레이션을 적용한 뒤 다시 시도해주세요.'
    },
    { status: 500 }
  )

export async function POST(request: Request) {
  try {
    const { adminId, userId, title } = await request.json()

    if (!adminId || typeof adminId !== 'number') {
      return NextResponse.json({ error: '유효한 관리자 정보가 필요합니다' }, { status: 400 })
    }

    if (!userId || typeof userId !== 'number') {
      return NextResponse.json({ error: '유효한 사용자 정보가 필요합니다' }, { status: 400 })
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: '칭호를 입력해주세요' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: '서버 설정이 올바르지 않습니다' }, { status: 500 })
    }

    const trimmedTitle = title.trim().slice(0, 50)

    // 관리자 검증
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('id, username')
      .eq('id', adminId)
      .maybeSingle()

    if (adminError) {
      console.error('Grant title admin lookup error:', adminError)
      return NextResponse.json({ error: '접근 권한 확인 중 문제가 발생했습니다' }, { status: 500 })
    }

    if (!adminData || adminData.username !== ADMIN_USERNAME) {
      return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 })
    }

    let userActiveTitle: string | null = null
    let userFound = false

    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('id, active_title')
      .eq('id', userId)
      .maybeSingle()

    if (!userError && targetUser) {
      userFound = true
      userActiveTitle = typeof targetUser.active_title === 'string' && targetUser.active_title.trim().length > 0
        ? targetUser.active_title
        : null
    } else {
      if (userError) {
        console.warn('Grant title user lookup error when selecting active_title, falling back to id only:', {
          code: userError.code,
          message: userError.message
        })
      }

      const { data: fallbackUser, error: fallbackError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (fallbackError) {
        console.error('Grant title fallback user lookup error:', fallbackError)
        return NextResponse.json({ error: '사용자 정보를 확인하는 중 오류가 발생했습니다' }, { status: 500 })
      }

      if (!fallbackUser) {
        return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
      }

      userFound = true
      userActiveTitle = null
    }

    if (!userFound) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    // 기존 칭호 보유 여부 확인
    const { data: existingTitle, error: existingError } = await supabase
      .from('user_titles')
      .select('id')
      .eq('user_id', userId)
      .eq('title', trimmedTitle)
      .maybeSingle()

    if (existingError) {
      const pgError = existingError as PostgrestError
      if (pgError.code === '42P01' || pgError.message.includes('user_titles')) {
        console.warn('user_titles relation missing when checking existing title.')
        return handleMissingTitlesTable()
      }

      console.error('Grant title existing check error:', existingError)
      return NextResponse.json({ error: '칭호 확인 중 오류가 발생했습니다' }, { status: 500 })
    }

    if (existingTitle) {
      return NextResponse.json({ success: true, alreadyHadTitle: true })
    }

    // 칭호 추가 (중복 방지용 upsert)
    const { error: upsertError } = await supabase
      .from('user_titles')
      .upsert({ user_id: userId, title: trimmedTitle }, { onConflict: 'user_id,title' })

    if (upsertError) {
      if (upsertError.code === '42P01' || upsertError.message.includes('user_titles')) {
        console.warn('user_titles relation missing during upsert.')
        return handleMissingTitlesTable()
      }

      if (upsertError.code === '23505') {
        console.warn('Duplicate title detected during upsert, treating as success.')
        return NextResponse.json({ success: true, alreadyHadTitle: true })
      }

      console.error('Title upsert error:', upsertError)
      return NextResponse.json({ error: '칭호 수여 중 오류가 발생했습니다' }, { status: 500 })
    }

    // 활성 칭호가 비어있다면 새 칭호로 설정
    if (!userActiveTitle) {
      const { error: activeUpdateError } = await supabase
        .from('users')
        .update({ active_title: trimmedTitle })
        .eq('id', userId)

      if (activeUpdateError) {
        console.warn('Failed to auto-set active title after grant:', activeUpdateError)
      }
    }

    return NextResponse.json({ success: true, alreadyHadTitle: false })
  } catch (error) {
    console.error('Grant title unexpected error:', error)
    return NextResponse.json({ error: '칭호 수여 중 오류가 발생했습니다' }, { status: 500 })
  }
}
