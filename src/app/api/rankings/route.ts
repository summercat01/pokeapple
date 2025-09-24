import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GameMode } from '@/types/game'

// 서버 사이드 Supabase 클라이언트
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

// 랭킹 조회 API
export async function GET(request: NextRequest) {
  try {
    // CORS 검증
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'https://pokeapple.vercel.app', // 프로덕션 도메인
    ]
    
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403, headers: corsHeaders }
      )
    }

    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') as GameMode
    const limit = parseInt(searchParams.get('limit') || '10')

    // 입력 검증
    if (!mode || !['normal', 'beginner'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid game mode' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid limit (1-100)' },
        { status: 400, headers: corsHeaders }
      )
    }

    const scoreField = mode === 'normal' ? 'normal_best_score' : 'beginner_best_score'
    
    let query = supabase
      .from('users')
      .select('id, username, nickname, normal_best_score, beginner_best_score, active_title')
      .order(scoreField, { ascending: false })
      .gt(scoreField, 0)
      .limit(limit)

    let { data, error } = await query

    if (error) {
      const missingColumn = typeof error.message === 'string' && error.message.includes('active_title')
      if (missingColumn) {
        const fallback = await supabase
          .from('users')
          .select('id, username, nickname, normal_best_score, beginner_best_score')
          .order(scoreField, { ascending: false })
          .gt(scoreField, 0)
          .limit(limit)
        if (!fallback.error && fallback.data) {
          const rankings = fallback.data.map((user, index) => ({
            rank: index + 1,
            nickname: user.nickname,
            username: user.username,
            active_title: null,
            score: mode === 'normal' ? user.normal_best_score : user.beginner_best_score
          }))

          return NextResponse.json(
            { rankings },
            { status: 200, headers: corsHeaders }
          )
        }

        error = fallback.error
      }
    }

    if (error) {
      console.error('Database query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch rankings' },
        { status: 500, headers: corsHeaders }
      )
    }

    const rankings = data?.map((user, index) => ({
      rank: index + 1,
      nickname: user.nickname,
      username: user.username,
      active_title: 'active_title' in user ? user.active_title : null,
      score: mode === 'normal' ? user.normal_best_score : user.beginner_best_score
    })) ?? []

    return NextResponse.json(
      { rankings },
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
