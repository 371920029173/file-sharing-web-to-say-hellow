import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Weavelink - 文件分享平台',
  description: '资源与你同频，信息予你无限。安全便捷的文件存储与分享。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
