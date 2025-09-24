import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 서버 사이드 Supabase 클라이언트 (서비스 키 사용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

// 점수 저장 API
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { userId, score, mode } = body

    // 입력 검증
    if (!userId || typeof score !== 'number' || !mode) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400, headers: corsHeaders }
      )
    }

    // 점수 범위 검증 (0-999999)
    if (score < 0 || score > 999999) {
      return NextResponse.json(
        { error: 'Invalid score range' },
        { status: 400, headers: corsHeaders }
      )
    }

    // 게임 모드 검증
    if (!['normal', 'beginner'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid game mode' },
        { status: 400, headers: corsHeaders }
      )
    }

    // 사용자 존재 확인
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, normal_best_score, beginner_best_score')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    // 현재 최고점수 확인
    const currentBest = mode === 'normal' ? user.normal_best_score : user.beginner_best_score
    
    // 점수가 현재 최고점수보다 높을 때만 업데이트
    if (score > currentBest) {
      const updateField = mode === 'normal' ? 'normal_best_score' : 'beginner_best_score'
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          [updateField]: score,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Database update error:', updateError)
        return NextResponse.json(
          { error: 'Failed to update score' },
          { status: 500, headers: corsHeaders }
        )
      }

      return NextResponse.json(
        { 
          success: true, 
          isNewRecord: true, 
          score, 
          previousBest: currentBest 
        },
        { status: 200, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        isNewRecord: false, 
        score, 
        currentBest 
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
