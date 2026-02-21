import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return { supabase: null, error: '缺少 Supabase 环境变量' }
  }
  try {
    const supabase = createClient(url, key.trim(), { auth: { persistSession: false } })
    return { supabase, error: null }
  } catch (e) {
    return { supabase: null, error: String(e) }
  }
}

/** GET：用于确认新站与 Supabase 是否连通 */
export async function GET() {
  const { supabase, error: envError } = getSupabase()
  if (envError || !supabase) {
    return NextResponse.json({ ok: false, error: envError ?? 'Supabase 未配置' }, { status: 503 })
  }
  try {
    const { error } = await supabase
      .from('intro_site_daily')
      .select('id')
      .limit(1)
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 503 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 503 })
  }
}
