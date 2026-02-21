# Weavelink 官网介绍页（新站）

独立介绍页，与主站共用同一 Supabase，用于展示平台介绍并支持「确认」同步沙币。

## 部署前必做

1. **Supabase**：在主站使用的 Supabase 项目里执行一次 `supabase-intro-table.sql`，创建表 `intro_site_daily`。

2. **环境变量**：  
   - 已写在 `wrangler.toml`，与主站一致（同一 Supabase）。  
   - 若主站域名不是 `https://weavelink.pages.dev`，请改 `wrangler.toml` 里的 `NEXT_PUBLIC_MAIN_SITE_URL`。

3. **主站**：新站部署好后，在主站（Cloudflare Pages）环境变量里增加  
   `NEXT_PUBLIC_INTRO_SITE_URL` = 新站访问地址（如 `https://xxx.pages.dev`），  
   主站首页才会出现「官网介绍」链接。

## 本地开发

```bash
cd intro-site
npm install
npm run dev
```

访问 http://localhost:3001

## 构建与部署（Cloudflare Pages）

```bash
npm run build:cf
npm run deploy:cf
```

或把本目录推送到新 GitHub 仓库，在 Cloudflare Pages 里连该仓库，构建命令填 `npm run build:cf`，输出目录填 `.vercel/output/static`，环境变量从 wrangler.toml 里抄到 Pages 的 Variables。

## 逻辑说明

- 用户在新站输入账号名（选填）并点击「确认」→ 请求 `/api/sync`，带设备指纹。
- 同一指纹当日仅前 3 次记为有效；有效时：若账号存在则给该用户加 3 沙币并提示「已同步」，否则提示「谢谢您的公益支持」。
- 「去看看」跳转主站（新标签页）。
