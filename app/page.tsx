'use client'

import { useState, useCallback } from 'react'

const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://weavelink.pages.dev'

function getFingerprint(): string {
  if (typeof window === 'undefined') return ''
  const s = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ].join('|')
  let h = 0
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    h = (h << 5) - h + c
    h |= 0
  }
  return 'fp_' + Math.abs(h).toString(36)
}

export default function HomePage() {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState< string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSync = useCallback(async () => {
    setMessage(null)
    setLoading(true)
    try {
      const fp = getFingerprint()
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() || undefined, fingerprint: fp }),
      })
      const data = await res.json()
      if (data.success && data.valid && data.message) {
        setMessage(data.message)
      } else if (data.success && !data.valid && data.message) {
        setMessage(data.message)
      }
    } catch {
      setMessage('网络异常，请稍后再试')
    } finally {
      setLoading(false)
    }
  }, [username])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-3">
          Weavelink
        </h1>
        <p className="text-slate-600 text-center mb-2">文件分享平台</p>
        <p className="text-slate-500 text-sm text-center mb-12">
          资源与你同频，信息予你无限
        </p>

        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-slate-200/60 p-8 mb-8">
          <p className="text-slate-700 leading-relaxed mb-6">
            我们提供安全、便捷的文件存储与分享，支持云盘、公开分享、私信传输与论坛社区。
            上传文件最大 50MB，支持图片、视频、音频、文档等多种格式。
          </p>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            若您已在主站注册，可在此填写账号名以便同步；未填写或账号不存在则视为公益支持，感谢您。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="输入主站账号名（选填）"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 placeholder-slate-400"
            />
            <button
              type="button"
              onClick={handleSync}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading ? '处理中…' : '确认'}
            </button>
          </div>
          {message && (
            <p className="text-center text-slate-700 font-medium py-2">{message}</p>
          )}

          <div className="pt-6 border-t border-slate-200">
            <a
              href={MAIN_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 rounded-xl bg-slate-800 text-white text-center font-medium hover:bg-slate-900 transition-colors"
            >
              去看看 →
            </a>
          </div>
        </div>

        <p className="text-slate-400 text-xs text-center">
          前往主站使用云盘、分享与论坛等功能
        </p>
      </div>
    </div>
  )
}
