'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

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

const features = [
  { title: '云盘存储', desc: '个人空间，文件分类管理', icon: '📁' },
  { title: '公开分享', desc: '一键生成链接，支持多格式', icon: '🔗' },
  { title: '论坛社区', desc: '发帖交流，资源与想法同频', icon: '💬' },
  { title: '安全可靠', desc: '稳定存储，隐私与安全兼顾', icon: '🔒' },
]

const navItems = [
  { id: 'intro', label: '简介' },
  { id: 'tech', label: '技术栈' },
  { id: 'features', label: '平台特色' },
  { id: 'browse', label: '选择浏览' },
  { id: 'article', label: '招牌文章' },
  { id: 'cta', label: '前往主站' },
]

// 顶部广告位：7 个，与底部不重复
const AD_TOP_SLIDES = [
  { id: 1, label: '广告位 1' }, { id: 2, label: '广告位 2' }, { id: 3, label: '广告位 3' },
  { id: 4, label: '广告位 4' }, { id: 5, label: '广告位 5' }, { id: 6, label: '广告位 6' }, { id: 7, label: '广告位 7' },
]
// 底部广告位：7 个，与顶部不重复
const AD_BOTTOM_SLIDES = [
  { id: 8, label: '广告位 8' }, { id: 9, label: '广告位 9' }, { id: 10, label: '广告位 10' },
  { id: 11, label: '广告位 11' }, { id: 12, label: '广告位 12' }, { id: 13, label: '广告位 13' }, { id: 14, label: '广告位 14' },
]

// 招牌文章：节选自 aaa.txt（长月烬明：烬揽星河 第1章）
const ARTICLE = {
  title: '长月烬明：烬揽星河（第1章）',
  paragraphs: [
    '魔渊之底，无天无日，连时间都似被这万年不散的阴气冻结。',
    '寒岩沁出的霜气穿透玄色衣料，像无数细针密密麻麻扎进肌理，澹台烬是被胸口那道蚀骨的痛感拽回意识的。他猛地睁开眼，漆黑的眸底先闪过一丝茫然，随即被翻涌的浊气与灵力绞杀的剧痛填满——左肩斜划至右腹的伤口深可见骨，边缘泛着死灰般的魔气，正与骨血里渗出的清冽仙力疯狂冲撞，每一次交锋都让他的神魂震颤，仿佛要被生生撕裂。',
    '"咳……咳咳……"',
    '他俯身咳出一口黑血，血珠落在粗糙的寒岩上，瞬间被地面蔓延的暗紫色魔气吞噬，只余下一点转瞬即逝的白痕，像从未存在过。撑着地面缓缓坐起时，指腹触到的岩石冰冷刺骨，掌心却不自觉凝聚起一缕灵力，金黑二色交织的光纹在指尖流转，比二百年前更显暴戾，也更显诡异——那是仙魔之力彻底交融的迹象，是他曾经最忌惮的存在，如今却成了支撑他残魂不散的枷锁。',
    '二百年了。',
    '这三个字在脑海中盘旋，碎片般的记忆随之汹涌而来：诛仙台的雷光劈碎他的魔核，天地间都是刺目的惨白；黎苏苏握剑的手微微颤抖，指尖泛白，剑尖最终还是毫不犹豫地刺穿他的胸口，那句"澹台烬，为了三界"轻飘飘的，却比任何利刃都锋利；荒渊裂隙崩塌前，那道藏在云层后、带着恶意与算计的目光，还有体内突然涌入的、不受控制的狂暴力量，将他推向万劫不复的深渊。',
    '他本应魂飞魄散。以自身魔核为引布下九转封印，镇压荒渊异动，神魂却在仙魔反噬与那股诡异力量的夹击下碎裂，坠入这三界遗弃的魔渊。可如今，他不仅活着，体内还多了一股陌生却强悍的混沌之力，正顺着经脉缓缓流淌，修复着他残缺的神魂，也在悄悄改写着他的灵力根基。',
    '"看来，九转封印没能彻底灭了你。"',
    '一道苍老沙哑的声音从黑暗中传来，带着浓浓的魔气，却又夹杂着一丝不易察觉的仙泽，打破了魔渊的死寂。澹台烬猛地抬眼，眸底寒光暴涨，周身气息瞬间绷紧，指尖的金黑灵力已然凝聚成刃，随时准备发难："谁？"',
    '黑影从岩缝的阴影里缓缓走出，身形佝偻，宽大的黑袍兜帽遮住了整张面容，只露出一双浑浊的幽绿眼眸，像两簇跳动的鬼火。他停在三丈外，周身气息若有若无，却与澹台烬体内的力量隐隐呼应，既非纯魔，亦非纯仙，更像是两种力量扭曲融合后的怪物。',
    '"老夫是谁不重要。"黑影轻笑一声，声音像砂砾摩擦石板，刺耳又沉闷，"重要的是，老夫能帮你稳住体内躁动的仙魔之力，还能让你找到当年害你神魂碎裂、坠入魔渊的真凶。"',
    '澹台烬神色未动，周身的威压却又冷了几分。二百年的背叛与算计，早已让他不信任何人，尤其是这种藏头露尾、目的不明的存在。他指尖的灵力又凝实了几分，语气冰冷无温，没有半分多余的情绪："你想要什么？天下没有免费的午餐。"',
    '"果然是前魔主，性子还是这般通透。"黑影抬手，掌心缓缓浮现一枚灰黑色的令牌，令牌上刻着诡异的魔神纹路，纹路间流淌着淡淡的混沌气息，与澹台烬体内的陌生力量隐隐共鸣，"帮老夫找到散落在三界的三枚魔神残片，老夫便给你融合仙魔之力的完整法门，再告诉你当年荒渊异动的全部真相——你以为，真的是你失控才开启荒渊？那股突然涌入你体内的狂暴力量，又来自何处？"',
    '最后一句话像一道惊雷，狠狠炸在澹台烬的脑海中。当年他失控开启荒渊，一直是他心中的刺，哪怕他身为魔主，也始终认为是自己的魔性没能压制，才险些酿成三界浩劫。可如今想来，那股力量太过诡异，带着不属于仙也不属于魔的暴戾，更像是有人刻意注入他体内，就是为了逼他失控，逼他走向毁灭。',
    '他沉默了片刻，漆黑的眸底翻涌着复杂的情绪，有恨意，有不甘，还有一丝不易察觉的疑惑。最终，他缓缓颔首，语气坚定，带着不容置疑的决绝："好。我帮你找残片。但我要你保证，不得耍花样，若是敢欺瞒我半分，我定将你挫骨扬灰，让你永世不得超生。"',
    '黑影眼中闪过一丝得逞的光芒，快得让人抓不住，他抬手将令牌抛给澹台烬："这枚引魂令能感知残片气息，你先收好。魔渊之上，衡阳宗的人已经在寻你了——那位黎掌门，可是对你\'念念不忘\'，这二百年里，没少派人来魔渊探查你的踪迹。"',
    '黎苏苏。',
    '这个名字落在心底，像一把冰锥狠狠扎入，泛起密密麻麻的疼，疼过之后，便是蚀骨的寒意。澹台烬握紧引魂令，指节泛白，骨缝间因用力而微微泛青，漆黑的眸底翻涌着恨意与不甘，还有一丝连他自己都不愿承认的复杂情绪，最终尽数沉淀为冰冷的漠然。',
    '"走吧。"他缓缓站起身，玄色衣袍在魔气中无风自动，衣摆扫过地面的碎石，发出细微的声响，"先离开魔渊。"',
    '黑影紧随其后，两人踏着冰冷的寒岩，朝着魔渊出口缓缓走去。黑暗中，澹台烬的侧脸冷硬如石，线条凌厉得没有一丝温度，只有他自己知道，那句"为了三界"，还在他的神魂深处反复回响，像一道永远无法愈合的伤疤。',
  ],
}

// 节选自 bbb.txt：乡村振兴与农村电商
const ARTICLE_BBB = {
  title: '乡村振兴战略下农村电商发展模式创新与路径优化研究',
  paragraphs: [
    '乡村振兴战略是新时代解决 "三农" 问题的核心举措，而农村电商作为数字经济与乡村经济深度融合的重要载体，已成为激活农村产业活力、拓宽农产品流通渠道、增加农民收入的关键引擎。',
    '本文基于产业融合理论、价值链理论与可持续发展理论，采用文献研究法、实地调研法、案例分析法与比较研究法，系统梳理乡村振兴战略下农村电商的发展内涵与政策背景，深入分析我国农村电商的发展现状、现存模式与面临的瓶颈。',
    '构建 "产业融合型、区域协同型、科技赋能型、生态循环型" 四大创新发展模式，并从基础设施建设、主体培育、品牌打造、政策支持等方面提出针对性优化路径，为推动农村电商高质量发展、助力乡村全面振兴提供理论参考与实践指导。',
    '关键词：乡村振兴；农村电商；发展模式；创新路径；产业融合。',
  ],
}

// 节选自 ccc.txt：人工智能与中小企业数字化
const ARTICLE_CCC = {
  title: '人工智能在中小企业数字化转型中的应用路径与实践策略',
  paragraphs: [
    '在数字经济加速渗透的背景下，中小企业数字化转型已成为提升核心竞争力的必然选择，但资金短缺、技术储备不足、人才匮乏等问题制约了转型进程。',
    '人工智能作为新一代信息技术的核心，为中小企业突破转型瓶颈提供了全新解决方案。本文基于中小企业数字化转型的现实痛点，系统分析人工智能技术的适配性应用场景。',
    '构建 "需求诊断 - 技术选型 - 分步落地 - 迭代优化" 的全流程应用路径，并结合典型案例总结可复制的实践策略，同时预判应用过程中的潜在风险与应对方案。',
    '关键词：人工智能；中小企业；数字化转型；应用路径；实践策略。',
  ],
}

const DOC_OPTIONS = [
  { id: 'aaa', label: '长月烬明', short: '烬揽星河' },
  { id: 'bbb', label: '农村电商', short: '乡村振兴' },
  { id: 'ccc', label: '中小企业', short: 'AI 转型' },
] as const

const ARTICLES_MAP = { aaa: ARTICLE, bbb: ARTICLE_BBB, ccc: ARTICLE_CCC } as const

export default function HomePage() {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dbStatus, setDbStatus] = useState<'idle' | 'checking' | 'ok' | 'fail'>('idle')
  const [dbError, setDbError] = useState<string | null>(null)
  const [topAdIndex, setTopAdIndex] = useState(0)
  const [bottomAdIndex, setBottomAdIndex] = useState(0)
  const [sideNavOpen, setSideNavOpen] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['intro']))
  const [activeDocIndex, setActiveDocIndex] = useState(0)
  const [slideOffset, setSlideOffset] = useState(0)
  const [slideDragging, setSlideDragging] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const slideStart = useRef({ x: 0, offset: 0 })

  const CARD_WIDTH = 152
  const CARD_GAP = 12
  const STEP = CARD_WIDTH + CARD_GAP
  const SNAP_DURATION = 300

  useEffect(() => {
    const ids = ['intro', 'tech', 'features', 'browse', 'article', 'cta']
    let rafId = 0
    let pending: Set<string> | null = null
    const observer = new IntersectionObserver(
      (entries) => {
        const toAdd = new Set<string>()
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id) toAdd.add(e.target.id)
        })
        if (toAdd.size === 0) return
        pending = toAdd
        if (rafId) return
        rafId = requestAnimationFrame(() => {
          rafId = 0
          const next = pending
          pending = null
          if (!next) return
          setVisibleSections((prev) => {
            const merged = new Set(prev)
            next.forEach((id) => merged.add(id))
            if (merged.size === prev.size) return prev
            return merged
          })
        })
      },
      { rootMargin: '-8% 0px -12% 0px', threshold: 0 }
    )
    const tim = setTimeout(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 100)
    return () => {
      clearTimeout(tim)
      if (rafId) cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    setDbStatus('checking')
    fetch('/api/db-check')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setDbStatus('ok')
        else {
          setDbStatus('fail')
          setDbError(data.error || '未知错误')
        }
      })
      .catch(() => {
        setDbStatus('fail')
        setDbError('请求失败')
      })
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTopAdIndex((i) => (i + 1) % AD_TOP_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    const t = setInterval(() => setBottomAdIndex((i) => (i + 1) % AD_BOTTOM_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

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
      if (data.success && data.message) setMessage(data.message)
    } catch {
      setMessage('网络异常，请稍后再试')
    } finally {
      setLoading(false)
    }
  }, [username])

  const scrollTo = (id: string) => {
    setSideNavOpen(false)
    const el = sectionRefs.current[id] ?? document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const selectDoc = useCallback((index: number) => {
    setActiveDocIndex(index)
    setSlideOffset(0)
    scrollTo('article')
  }, [])

  const onSlidePointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    setSlideDragging(true)
    slideStart.current = { x: e.clientX, offset: slideOffset }
  }, [slideOffset])

  const onSlidePointerMove = useCallback((e: React.PointerEvent) => {
    if (!slideDragging) return
    const dx = e.clientX - slideStart.current.x
    setSlideOffset(slideStart.current.offset + dx)
  }, [slideDragging])

  const onSlidePointerUp = useCallback(() => {
    if (!slideDragging) return
    setSlideDragging(false)
    const totalOffset = -activeDocIndex * STEP + slideOffset
    const targetIndex = Math.round(-totalOffset / STEP)
    const clamped = Math.max(0, Math.min(DOC_OPTIONS.length - 1, targetIndex))
    setActiveDocIndex(clamped)
    setSlideOffset(0)
  }, [slideDragging, activeDocIndex, slideOffset])

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* 侧边导航 - Dropbox 风格 */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-56 bg-white border-r border-slate-200/80
          transition-transform duration-200 ease-out md:translate-x-0
          ${sideNavOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="sticky top-0 pt-6 pb-6 pl-6 pr-4">
          <div className="flex items-center justify-between mb-6 md:mb-4">
            <span className="font-semibold text-slate-800">Weavelink</span>
            <button
              type="button"
              className="md:hidden p-2 -mr-2 text-slate-500 hover:text-slate-700"
              onClick={() => setSideNavOpen(false)}
              aria-label="关闭导航"
            >
              ✕
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* 移动端侧栏遮罩 */}
      {sideNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          aria-hidden
          onClick={() => setSideNavOpen(false)}
        />
      )}

      {/* 移动端打开侧栏按钮 */}
      <button
        type="button"
        className="fixed top-4 left-4 z-30 md:hidden px-3 py-2 rounded-lg bg-white/90 border border-slate-200 shadow-sm text-slate-700 text-sm"
        onClick={() => setSideNavOpen(true)}
        aria-label="打开导航"
      >
        目录
      </button>

      <main className="flex-1 md:ml-56 min-h-screen relative overflow-hidden">
        {/* Stripe 风格：背景渐变光斑 */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <div className="absolute top-[-20%] right-[-10%] w-[80vw] max-w-[600px] h-[60vh] rounded-full bg-gradient-to-br from-blue-200/40 via-indigo-100/30 to-transparent animate-blob-float" />
          <div className="absolute bottom-[-10%] left-[-15%] w-[70vw] max-w-[500px] h-[50vh] rounded-full bg-gradient-to-tr from-violet-200/35 via-slate-100/25 to-transparent animate-blob-float" style={{ animationDelay: '-5s', animationDuration: '25s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[800px] h-[80vh] rounded-full bg-gradient-to-r from-sky-100/20 to-indigo-100/15 animate-glow-pulse" />
        </div>

        {/* 顶部循环广告位 */}
        <section className="relative z-10 h-20 md:h-24 bg-slate-100/80 backdrop-blur border-b border-slate-200 overflow-hidden" aria-label="广告">
          {AD_TOP_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
              style={{
                opacity: topAdIndex === i ? 1 : 0,
                pointerEvents: topAdIndex === i ? 'auto' : 'none',
              }}
            >
              <div className="text-slate-400 text-sm">
                {slide.label}（此处可放置 AdSense 等）
              </div>
            </div>
          ))}
        </section>

        <div className="relative z-10 max-w-2xl mx-auto px-6 py-10 md:py-14">
          {/* Hero - Stripe 风格渐变标题 + 入场动画 */}
          <section
            id="intro"
            ref={(el) => { sectionRefs.current.intro = el }}
            className={`mb-16 section-reveal ${visibleSections.has('intro') ? 'is-visible' : ''}`}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 leading-tight">
              资源与你同频，
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-slate-700 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                信息予你无限。
              </span>
            </h1>
            <p className="text-slate-600 text-lg mt-4">
              Weavelink 文件分享平台 · 安全便捷的云盘、分享与论坛
            </p>
          </section>

          {/* 简介 */}
          <section className={`mb-16 section-reveal ${visibleSections.has('intro') ? 'is-visible' : ''}`} style={{ transitionDelay: '80ms' }}>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">简介</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              我们提供安全、便捷的文件存储与分享，支持云盘、公开分享、私信传输与论坛社区。
              上传文件最大 50MB，支持图片、视频、音频、文档等多种格式。
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              当前整个产品体系包含三个互相关联的站点：主站{' '}
              <span className="font-medium">weavelink.pages.dev</span> 提供实际的云盘、分享与论坛功能；
              本页面 <span className="font-medium">hiweave.pages.dev</span> 作为面向访客的「官网介绍」，
              说明平台定位、技术栈与安全策略；同时我们还有一个独立的轻量应用集合站{' '}
              <span className="font-medium">warehous.pages.dev</span>，用于按分类展示若干独立的小工具与实验性页面，
              方便用户在不登录主站的情况下体验部分功能或周边应用。
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              介绍页本身不会存储用户文件，只负责说明与引导：您可以通过顶部和侧边导航了解产品特点，
              在下方「招牌文章」区阅读三篇不同主题的长文示例（长月烬明节选、农村电商研究、中小企业数字化转型），
              对平台支持的内容类型与排版效果有直观感受。
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              若您已在主站注册，可在下方填写账号名以便同步；未填写或账号不存在则视为公益支持，感谢您。
            </p>
          </section>

          {/* 技术栈 - 一页过审 */}
          <section
            id="tech"
            ref={(el) => { sectionRefs.current.tech = el }}
            className={`mb-16 scroll-mt-6 section-reveal ${visibleSections.has('tech') ? 'is-visible' : ''}`}
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">技术栈</h2>
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200/80 p-6 shadow-sm card-hover">
              <ul className="space-y-3 text-slate-700 text-sm">
                <li><strong>前端</strong>：Next.js 15、React 18、TypeScript、Tailwind CSS</li>
                <li><strong>后端 / 数据</strong>：Supabase（PostgreSQL、Auth、Row Level Security）</li>
                <li><strong>部署</strong>：Cloudflare Pages（@cloudflare/next-on-pages）</li>
              </ul>
            </div>
          </section>

          {/* 应用与工具集合说明：warehous 站点 */}
          <section
            className={`mb-16 scroll-mt-6 section-reveal ${visibleSections.has('tech') ? 'is-visible' : ''}`}
            style={{ transitionDelay: '80ms' }}
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">应用与工具集合</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              为了不把所有实验性功能都堆到主站，我们在 <span className="font-medium">warehous.pages.dev</span>{' '}
              上整理了一批轻量的小工具和演示页面，可以理解为围绕 Weavelink 的「应用商场」或实验仓库。
              这些页面通常体量较小，聚焦于某一个具体场景，方便单独迭代与测试。
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              典型的工具类型包括：文件相关的小工具（如示例性压缩/拆分流程演示、命名规则建议）、文本与格式化工具、
              简单的计时与笔记类页面等。它们不要求用户一定登录主站账号，在浏览器中即可体验，适合当作辅助工具或灵感实验室。
            </p>
            <p className="text-slate-700 leading-relaxed">
              应用集合站与主站、介绍页共享同一套设计语言与隐私原则：页面会尽量说明用途与数据范围，
              涉及账号或存储的操作仍回到主站完成，避免让用户在多个域名之间重复登记敏感信息。
            </p>
          </section>

          {/* 平台特色 - Framer 风格卡片悬停 + 交错入场 */}
          <section
            id="features"
            ref={(el) => { sectionRefs.current.features = el }}
            className={`mb-16 scroll-mt-6 section-reveal ${visibleSections.has('features') ? 'is-visible' : ''}`}
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">平台特色</h2>
            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`card-hover bg-white/90 backdrop-blur rounded-xl border border-slate-200/80 px-4 py-4 text-center shadow-sm section-reveal ${visibleSections.has('features') ? 'is-visible' : ''}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span className="text-2xl block mb-1 transition-transform duration-200 hover:scale-110 inline-block" aria-hidden>{f.icon}</span>
                  <div className="font-medium text-slate-800 text-sm">{f.title}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 选择浏览：水平滑动，带滑动动画 */}
          <section
            id="browse"
            className={`mb-16 scroll-mt-6 section-reveal ${visibleSections.has('features') ? 'is-visible' : ''}`}
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">选择浏览</h2>
            <p className="text-slate-600 text-sm mb-4">左右滑动或点击要阅读的文档</p>
            <div
              className="overflow-hidden touch-pan-y select-none"
              onPointerDown={onSlidePointerDown}
              onPointerMove={onSlidePointerMove}
              onPointerUp={onSlidePointerUp}
              onPointerLeave={onSlidePointerUp}
            >
              <div
                className="flex gap-3"
                style={{
                  transform: `translateX(calc(50% - ${CARD_WIDTH / 2}px + ${-activeDocIndex * STEP + slideOffset}px))`,
                  transition: slideDragging ? 'none' : `transform ${SNAP_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                }}
              >
                {DOC_OPTIONS.map((doc, i) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => selectDoc(i)}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 flex-shrink-0 px-6 py-4 w-[140px] transition-colors ${
                      activeDocIndex === i
                        ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                    style={{ width: CARD_WIDTH, minWidth: CARD_WIDTH }}
                    aria-label={`选择 ${doc.label}`}
                  >
                    <span className="text-2xl mb-1" aria-hidden>
                      {doc.id === 'aaa' ? '📜' : doc.id === 'bbb' ? '🌾' : '🤖'}
                    </span>
                    <span className="font-semibold text-sm">{doc.label}</span>
                    <span className="text-xs opacity-80 mt-0.5">{doc.short}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 招牌文章：与上方选择同步，和卡片同款入场+悬停动画 */}
          <section
            id="article"
            ref={(el) => { sectionRefs.current.article = el }}
            className={`mb-16 scroll-mt-6 section-reveal ${visibleSections.has('article') ? 'is-visible' : ''}`}
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">招牌文章</h2>
            <article
              className={`card-hover bg-white/90 backdrop-blur rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm section-reveal ${visibleSections.has('article') ? 'is-visible' : ''}`}
              style={{ transitionDelay: '80ms' }}
            >
              {(() => {
                const docId = DOC_OPTIONS[activeDocIndex].id
                const art = ARTICLES_MAP[docId]
                return (
                  <>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{art.title}</h3>
                    <div className="space-y-4 text-slate-700 leading-relaxed text-sm md:text-base">
                      {art.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </>
                )
              })()}
            </article>
          </section>

          {/* 常见问题：介绍页、主站与应用集合的关系 */}
          <section
            className={`mb-16 scroll-mt-6 section-reveal ${visibleSections.has('article') ? 'is-visible' : ''}`}
            style={{ transitionDelay: '120ms' }}
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">常见问题</h2>
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-5 text-sm text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Q：这个介绍页会单独收集账号或文件吗？</h3>
                <p>
                  A：不会。介绍页只在您自愿填写主站账号名并点击「确认」时，把账号名与设备指纹一并发送到同一套后端，
                  用于按规则记录每日支持与奖励次数；文件上传、下载和管理都只在主站完成。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Q：应用集合站上的小工具是否必须登录？</h3>
                <p>
                  A：多数工具不需要登录，它们更像是围绕主站场景设计的辅助页面或原型展示。
                  若某个功能真正涉及文件持久化或账号操作，会清楚标明并跳转回主站执行。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Q：我应该从哪里开始体验整套产品？</h3>
                <p>
                  A：如果您只是想快速了解平台，可以在本页浏览技术栈说明与三篇示例文章；
                  若需要实际使用云盘与分享功能，请前往主站 weavelink.pages.dev 注册并登录；
                  想尝试更多周边工具时，再访问 warehous.pages.dev 按需选择小工具使用即可。
                </p>
              </div>
            </div>
          </section>

          {/* CTA：同步 + 去看看主站 */}
          <section
            id="cta"
            ref={(el) => { sectionRefs.current.cta = el }}
            className={`mb-16 scroll-mt-6 section-reveal ${visibleSections.has('cta') ? 'is-visible' : ''}`}
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-4">前往主站</h2>
            <div className="card-hover bg-white/90 backdrop-blur rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
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
              <a
                href={MAIN_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-xl bg-slate-800 text-white text-center font-medium hover:bg-slate-900 transition-colors"
              >
                去看看主站 →
              </a>
            </div>
          </section>
        </div>

        {/* 底部循环广告位 */}
        <section className="relative z-10 h-20 md:h-24 bg-slate-100/80 backdrop-blur border-t border-slate-200 overflow-hidden" aria-label="广告">
          {AD_BOTTOM_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
              style={{
                opacity: bottomAdIndex === i ? 1 : 0,
                pointerEvents: bottomAdIndex === i ? 'auto' : 'none',
              }}
            >
              <div className="text-slate-400 text-sm">
                {slide.label}（此处可放置 AdSense 等）
              </div>
            </div>
          ))}
        </section>

        <footer className="border-t border-slate-200/80 bg-white/80 py-4">
          <div className="max-w-2xl mx-auto px-6 text-center space-y-1">
            <div className="text-xs text-slate-400">
              Supabase：
              {dbStatus === 'checking' && <span>检查中…</span>}
              {dbStatus === 'ok' && <span className="text-green-600 font-medium">已连接</span>}
              {dbStatus === 'fail' && (
                <span className="text-red-600" title={dbError ?? undefined}>
                  未连接{dbError ? `（${dbError}）` : ''}
                </span>
              )}
              {dbStatus === 'idle' && <span>—</span>}
            </div>
            <a
              href={MAIN_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700 text-sm"
            >
              Weavelink 主站
            </a>
            <span className="text-slate-300 mx-2">·</span>
            <span className="text-slate-400 text-sm">官网介绍页</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
