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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    const userId = userIdParam ? Number(userIdParam) : null

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: '유효한 사용자 정보가 필요합니다' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: '서버 설정이 올바르지 않습니다' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('user_titles')
      .select('title')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      const missingTable = typeof error.message === 'string' && error.message.includes('user_titles')
      if (missingTable) {
        return NextResponse.json({ titles: [] })
      }

      console.error('Fetch user titles error:', error)
      return NextResponse.json({ error: '칭호 목록을 불러오는 중 오류가 발생했습니다' }, { status: 500 })
    }

    return NextResponse.json({ titles: data?.map(entry => entry.title) ?? [] })
  } catch (error) {
    console.error('Fetch user titles unexpected error:', error)
    return NextResponse.json({ error: '칭호 목록을 불러오는 중 오류가 발생했습니다' }, { status: 500 })
  }
}
