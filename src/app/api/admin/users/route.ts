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

const formatError = (message: string, status = 500) =>
  NextResponse.json({ users: [], error: message }, { status })

type RawUserRow = Record<string, any>

type TitlesMap = Map<number, string[]>

const normaliseUserRow = (user: RawUserRow, titlesMap: TitlesMap): RawUserRow | null => {
  const rawId = user.id
  const parsedId = typeof rawId === 'number' ? rawId : Number(rawId)

  if (!rawId || Number.isNaN(parsedId)) {
    console.warn('Skipping user row due to invalid id:', rawId)
    return null
  }

  const username = typeof user.username === 'string' ? user.username : String(user.username ?? parsedId)
  const nickname = typeof user.nickname === 'string' && user.nickname.length > 0
    ? user.nickname
    : username

  let createdAt: string
  if (typeof user.created_at === 'string') {
    createdAt = user.created_at
  } else if (user.created_at instanceof Date) {
    createdAt = user.created_at.toISOString()
  } else if (typeof user.createdAt === 'string') {
    createdAt = user.createdAt
  } else {
    createdAt = new Date().toISOString()
  }

  let activeTitle: string | null = null
  if (typeof user.active_title === 'string' && user.active_title.trim().length > 0) {
    activeTitle = user.active_title
  }

  const relationTitles = Array.isArray(user.user_titles)
    ? user.user_titles
        .map((entry: { title?: string | null }) => entry?.title)
        .filter((title): title is string => typeof title === 'string' && title.length > 0)
    : undefined

  const mappedTitles = titlesMap.get(parsedId) ?? []
  const titles = relationTitles ?? mappedTitles

  return {
    id: parsedId,
    username,
    nickname,
    created_at: createdAt,
    active_title: activeTitle,
    titles
  }
}

const fetchUsersWithOrderFallback = async (supabase: ReturnType<typeof createClient>) => {
  const orderColumns = ['created_at', 'id']
  let lastError: PostgrestError | null = null

  for (const column of orderColumns) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order(column as any, { ascending: false })

    if (!error) {
      return { data: data ?? [], lastError: null }
    }

    lastError = error
    console.warn('Admin users base select failed, trying next column:', {
      column,
      code: error.code,
      message: error.message
    })
  }

  return { data: [], lastError }
}

const fetchTitlesMap = async (supabase: ReturnType<typeof createClient>) => {
  const titlesMap: TitlesMap = new Map()

  try {
    const { data, error } = await supabase
      .from('user_titles')
      .select('user_id, title')

    if (error) {
      throw error
    }

    data?.forEach((entry) => {
      const rawId = entry.user_id
      const parsedId = typeof rawId === 'number' ? rawId : Number(rawId)

      if (!rawId || Number.isNaN(parsedId)) {
        return
      }

      if (!titlesMap.has(parsedId)) {
        titlesMap.set(parsedId, [])
      }

      if (typeof entry.title === 'string' && entry.title.length > 0) {
        titlesMap.get(parsedId)!.push(entry.title)
      }
    })
  } catch (error) {
    const pgError = error as PostgrestError
    console.warn('Admin users titles fallback failed:', {
      code: pgError?.code,
      message: pgError?.message ?? String(error)
    })
  }

  return titlesMap
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminIdParam = searchParams.get('adminId')
    const adminUsernameParam = searchParams.get('adminUsername')
    const adminId = adminIdParam ? Number(adminIdParam) : null

    if (!adminId || Number.isNaN(adminId) || !adminUsernameParam) {
      return formatError('관리자 권한이 필요합니다', 403)
    }

    const supabase = createServerSupabase()
    if (!supabase) {
      return formatError('서버 환경 변수가 설정되지 않았습니다', 500)
    }

    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('id, username')
      .eq('id', adminId)
      .maybeSingle()

    if (adminError) {
      console.error('Admin lookup error:', adminError)
      return formatError('관리자 인증 중 오류가 발생했습니다', 500)
    }

    if (!adminData || adminData.username !== ADMIN_USERNAME || adminData.username !== adminUsernameParam) {
      return formatError('관리자 권한이 필요합니다', 403)
    }

    // 1차 시도: 칭호 관계 포함 쿼리
    const { data: primaryData, error: primaryError } = await supabase
      .from('users')
      .select('id, username, nickname, created_at, active_title, user_titles(title)')
      .order('created_at', { ascending: false })

    if (!primaryError && primaryData) {
      const titlesMap: TitlesMap = new Map()
      const formatted = primaryData
        .map((user) => normaliseUserRow(user, titlesMap))
        .filter((user): user is ReturnType<typeof normaliseUserRow> => user !== null)

      return NextResponse.json({ users: formatted })
    }

    if (primaryError) {
      console.warn('Admin users primary select failed, falling back to basic select:', {
        code: primaryError.code,
        message: primaryError.message
      })
    }

    // 2차 시도: 전체 컬럼을 가져온 뒤 별도 칭호 맵 구성
    const { data: fallbackUsers, lastError } = await fetchUsersWithOrderFallback(supabase)

    if (lastError && (!fallbackUsers || fallbackUsers.length === 0)) {
      console.error('Admin users fallback select failed:', lastError)
      return formatError('사용자 목록을 불러오는 중 오류가 발생했습니다', 500)
    }

    const titlesMap = await fetchTitlesMap(supabase)

    const formatted = (fallbackUsers ?? [])
      .map((user) => normaliseUserRow(user, titlesMap))
      .filter((user): user is ReturnType<typeof normaliseUserRow> => user !== null)

    if (formatted.length === 0) {
      console.warn('Admin users fallback succeeded but returned no rows. Fetching admin user directly.')

      const { data: singleAdmin, error: singleError } = await supabase
        .from('users')
        .select('*')
        .eq('id', adminId)
        .maybeSingle()

      if (singleError) {
        console.error('Admin direct fetch failed:', singleError)
      } else if (singleAdmin) {
        const adminOnly = normaliseUserRow(singleAdmin, titlesMap)
        if (adminOnly) {
          formatted.push(adminOnly)
        }
      }
    }

    return NextResponse.json({ users: formatted })
  } catch (error) {
    console.error('Admin fetch users unexpected error:', error)
    return formatError('사용자 목록을 불러오는 중 오류가 발생했습니다', 500)
  }
}

