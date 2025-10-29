import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

const MAX_NAME_LENGTH = 8
const MAX_SCORE = 999999
const MAX_LIMIT = 50

function normalizeScope(rawScope: unknown): 'all' | 'today' {
  if (typeof rawScope !== 'string') return 'all'
  return rawScope.toLowerCase() === 'today' ? 'today' : 'all'
}

function normalizeLimit(rawLimit: unknown): number {
  const parsed = typeof rawLimit === 'string' ? Number.parseInt(rawLimit, 10) : NaN
  if (!Number.isFinite(parsed)) return 10
  return Math.min(Math.max(parsed, 1), MAX_LIMIT)
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: '랭킹 서비스를 사용할 수 없습니다' }, { status: 503 })
    }
    const { searchParams } = new URL(request.url)

    const scope = normalizeScope(searchParams.get('scope'))
    const limit = normalizeLimit(searchParams.get('limit'))

    let query = supabase
      .from('scores')
      .select('id, display_name, score, created_at')
      .order('score', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(limit)

    if (scope === 'today') {
      const now = new Date()
      const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
      query = query.gte('created_at', startOfTodayUTC.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error('Failed to fetch rankings:', error)
      return NextResponse.json({ error: '랭킹을 불러오지 못했습니다' }, { status: 500 })
    }

    const rankings = (data ?? []).map((entry, index) => ({
      rank: index + 1,
      name: entry.display_name,
      score: entry.score,
      submittedAt: entry.created_at
    }))

    return NextResponse.json({ rankings })
  } catch (error) {
    console.error('Unexpected rankings error:', error)
    return NextResponse.json({ error: '랭킹을 불러오는 중 오류가 발생했습니다' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: '점수 저장 서비스를 사용할 수 없습니다' }, { status: 503 })
    }
    const { name, score } = (await request.json().catch(() => ({}))) as {
      name?: unknown
      score?: unknown
    }

    if (typeof name !== 'string') {
      return NextResponse.json({ error: '이름을 입력해주세요' }, { status: 400 })
    }

    const trimmedName = name.trim()

    if (trimmedName.length === 0) {
      return NextResponse.json({ error: '이름을 입력해주세요' }, { status: 400 })
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: `이름은 최대 ${MAX_NAME_LENGTH}자까지 가능합니다` }, { status: 400 })
    }

    if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
      return NextResponse.json({ error: '유효한 점수가 아닙니다' }, { status: 400 })
    }

    const sanitizedName = trimmedName.replace(/\s+/g, ' ')

    const { error } = await supabase
      .from('scores')
      .insert({
        display_name: sanitizedName,
        score: Math.round(score)
      })

    if (error) {
      console.error('Failed to submit score:', error)
      return NextResponse.json({ error: '점수를 저장하지 못했습니다' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Unexpected score submission error:', error)
    return NextResponse.json({ error: '점수를 저장하는 중 오류가 발생했습니다' }, { status: 500 })
  }
}

