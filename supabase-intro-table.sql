-- 新站（intro）按设备指纹每日计数，与主站共用同一 Supabase 项目
-- 在 Supabase SQL Editor 中执行一次即可

CREATE TABLE IF NOT EXISTS intro_site_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT NOT NULL,
  the_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fingerprint, the_date)
);

CREATE INDEX IF NOT EXISTS idx_intro_site_daily_lookup
  ON intro_site_daily(fingerprint, the_date);

COMMENT ON TABLE intro_site_daily IS '新站按指纹每日同步次数，用于限制每设备每日前 N 次有效';
