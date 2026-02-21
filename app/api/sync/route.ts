import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const COINS_PER_SYNC = 3
const MAX_CREDITS_PER_FINGERPRINT_PER_DAY = 3

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key.trim(), { auth: { persistSession: false } })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const fingerprint = typeof body.fingerprint === 'string' ? body.fingerprint.trim() : ''

    if (!fingerprint) {
      return NextResponse.json({ success: false, error: '缺少指纹' }, { status: 400 })
    }

    const supabase = getSupabase()
    const today = new Date().toISOString().split('T')[0]

    // 查或建当日记录
    const { data: row, error: fetchErr } = await supabase
      .from('intro_site_daily')
      .select('id, count')
      .eq('fingerprint', fingerprint)
      .eq('the_date', today)
      .maybeSingle()

    if (fetchErr) {
      console.error('intro_site_daily fetch:', fetchErr)
      return NextResponse.json({ success: false, error: '服务异常' }, { status: 500 })
    }

    let currentCount = row?.count ?? 0
    if (currentCount >= MAX_CREDITS_PER_FINGERPRINT_PER_DAY) {
      return NextResponse.json({
        success: true,
        valid: false,
        message: '今日已达上限',
      })
    }

    const nextCount = currentCount + 1
    if (!row) {
      const { error: insErr } = await supabase
        .from('intro_site_daily')
        .upsert(
          { fingerprint, the_date: today, count: nextCount, updated_at: new Date().toISOString() },
          { onConflict: 'fingerprint,the_date' }
        )
      if (insErr) {
        console.error('intro_site_daily upsert:', insErr)
        return NextResponse.json({ success: false, error: '服务异常' }, { status: 500 })
      }
    } else {
      const { error: upErr } = await supabase
        .from('intro_site_daily')
        .update({ count: nextCount, updated_at: new Date().toISOString() })
        .eq('id', row.id)
      if (upErr) {
        console.error('intro_site_daily update:', upErr)
        return NextResponse.json({ success: false, error: '服务异常' }, { status: 500 })
      }
    }

    // 本次有效，可发提示
    let message = '谢谢您的公益支持'
    if (username) {
      const { data: user, error: userErr } = await supabase
        .from('users')
        .select('id, sand_coins')
        .eq('username', username)
        .maybeSingle()

      if (!userErr && user) {
        const newCoins = (user.sand_coins ?? 0) + COINS_PER_SYNC
        const { error: coinsErr } = await supabase
          .from('users')
          .update({ sand_coins: newCoins })
          .eq('id', user.id)
        if (!coinsErr) message = '已同步'
      }
    }

    return NextResponse.json({
      success: true,
      valid: true,
      message,
    })
  } catch (e: any) {
    console.error('intro sync error:', e)
    return NextResponse.json({ success: false, error: e?.message || '服务异常' }, { status: 500 })
  }
}
