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

// 사용자 랭킹 조회 API
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
    const userId = searchParams.get('userId')
    const mode = searchParams.get('mode') as GameMode

    // 입력 검증
    if (!userId || !mode || !['normal', 'beginner'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400, headers: corsHeaders }
      )
    }

    // 사용자 정보 조회
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, normal_best_score, beginner_best_score, active_title')
      .eq('id', userId)
      .maybeSingle()

    if (userError) {
      console.error('User lookup error:', userError)
      return NextResponse.json(
        { ranking: null },
        { status: 200, headers: corsHeaders }
      )
    }

    if (!user) {
      return NextResponse.json(
        { ranking: null },
        { status: 200, headers: corsHeaders }
      )
    }

    const scoreField = mode === 'normal' ? 'normal_best_score' : 'beginner_best_score'
    const userScore = mode === 'normal' ? user.normal_best_score : user.beginner_best_score
    
    // 사용자 점수가 0이면 랭킹 없음
    if (userScore === 0) {
      return NextResponse.json(
        { ranking: null },
        { status: 200, headers: corsHeaders }
      )
    }

    // 내 점수보다 높은 점수를 가진 사용자 수를 계산하여 랭킹 구하기
    const { count: higherScoreCount, error: rankError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gt(scoreField, userScore)

    if (rankError) {
      console.error('Error calculating user rank:', rankError)
      return NextResponse.json(
        { error: 'Failed to calculate ranking' },
        { status: 500, headers: corsHeaders }
      )
    }

    // 전체 플레이어 수 (0점보다 큰 점수를 가진 사용자)
    const { count: totalPlayers, error: totalError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gt(scoreField, 0)

    if (totalError) {
      console.error('Error counting total players:', totalError)
      return NextResponse.json(
        { error: 'Failed to count total players' },
        { status: 500, headers: corsHeaders }
      )
    }

    const rank = (higherScoreCount || 0) + 1

    return NextResponse.json(
      { 
        ranking: {
          rank,
          score: userScore,
          totalPlayers: totalPlayers || 0,
          active_title: user.active_title || null
        }
      },
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
