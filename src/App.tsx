import { useState, useRef, useEffect } from 'react'

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:         '#0C0906',
  card:       'rgba(26,18,10,0.88)',
  cardBorder: 'rgba(217,119,6,0.12)',
  sidebar:    'rgba(14,9,4,0.97)',
  grad:       'linear-gradient(135deg,#D97706,#C2490E)',
  amber:      '#F59E0B',
  terracotta: '#C2490E',
  brown:      '#92400E',
  sage:       '#6D9B72',
  coral:      '#E07A5F',
  textPri:    '#FDF4E8',
  textSec:    '#A8906A',
  textMute:   '#6B5540',
  blob1:      'rgba(217,119,6,0.16)',
  blob2:      'rgba(194,73,14,0.12)',
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = 'home' | 'journal' | 'insights' | 'chat' | 'streaks'
type IconProps = { size?: number; color?: string; className?: string }
type JournalEntry = { date: string; mi: number; text: string }
type ChatMessage = { role: 'ai' | 'user'; text: string }

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function Icon({ size = 20, color = 'currentColor', children, strokeWidth = 1.6 }: {
  size?: number; color?: string; children: React.ReactNode; strokeWidth?: number
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

// Face icons for moods
function FaceIcon({ level, size = 28, color = 'currentColor' }: { level: number } & IconProps) {
  const mouths = [
    'M8 16Q12 13 16 16',           // rough  — deep frown
    'M8.5 15.5Q12 13.5 15.5 15.5', // low    — slight frown
    'M8.5 14.5H15.5',               // okay   — straight
    'M8.5 14Q12 16.5 15.5 14',     // good   — slight smile
    'M7.5 13.5Q12 17.5 16.5 13.5', // great  — wide smile
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9.5" cy="9.8" r="0.8" fill={color} stroke="none" />
      <circle cx="14.5" cy="9.8" r="0.8" fill={color} stroke="none" />
      <path d={mouths[level]} />
      {level === 0 && (
        <>
          <path d="M9 7L8 5.5" strokeWidth="1.2" />
          <path d="M15 7L16 5.5" strokeWidth="1.2" />
        </>
      )}
      {level === 4 && (
        <>
          <line x1="19" y1="4" x2="19" y2="5.5" strokeWidth="1.1" />
          <line x1="18.25" y1="4.75" x2="19.75" y2="4.75" strokeWidth="1.1" />
          <line x1="21" y1="7.5" x2="21" y2="8.6" strokeWidth="1.1" />
          <line x1="20.45" y1="8.05" x2="21.55" y2="8.05" strokeWidth="1.1" />
        </>
      )}
    </svg>
  )
}

function FlameIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.6}>
      <path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </Icon>
  )
}

function StarIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.6}>
      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </Icon>
  )
}

function LightningIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.6}>
      <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </Icon>
  )
}

function MoonIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.6}>
      <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </Icon>
  )
}

function SparklesIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.5}>
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </Icon>
  )
}

function DropletIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.6}>
      <path d="M12 2.25s-7.5 8.5-7.5 12.5a7.5 7.5 0 0015 0C19.5 10.75 12 2.25 12 2.25z" />
    </Icon>
  )
}

function BookIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.6}>
      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </Icon>
  )
}

function ActivityIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.8}>
      <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </Icon>
  )
}

function SunIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.6}>
      <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </Icon>
  )
}

function ShieldIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.6}>
      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </Icon>
  )
}

function TargetIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill={color} stroke="none" />
    </svg>
  )
}

function AnchorIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.8}>
      <path d="M12 8v13m0-13a4 4 0 100-8 4 4 0 000 8z" />
      <path d="M5.636 18.364A9 9 0 003 12h18a9 9 0 01-2.636 6.364" />
    </Icon>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SLEEP_DATA  = [7.2,6.1,8.0,5.5,6.8,7.4,6.2,7.0,5.8,6.5,7.1,6.2,8.1,6.9]
const STUDY_DATA  = [3.5,5.0,4.2,6.5,3.0,2.5,4.5,5.5,4.8,6.0,3.8,4.5,5.2,4.0]
const MOOD_DATA   = [3.8,3.2,4.1,2.9,3.5,4.5,3.8,3.0,3.7,4.2,3.6,3.8,4.4,3.9]
const SCREEN_DATA = [2.5,3.8,2.1,4.5,5.0,3.2,3.1,4.0,2.8,3.5,4.1,3.2,2.9,3.5]

const HEATMAP: number[][] = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 18 }, (_, week) => {
    const base = day < 5 ? 0.48 : 0.22
    return Math.max(0.05, Math.min(0.98, base + Math.sin(week * 0.9 + day * 0.6) * 0.28 + (Math.random() * 0.22 - 0.11)))
  })
)

const MOODS = [
  { label: 'Rough', level: 0 },
  { label: 'Low',   level: 1 },
  { label: 'Okay',  level: 2 },
  { label: 'Good',  level: 3 },
  { label: 'Great', level: 4 },
]

const GNODES = [
  { id: 'stress',    label: 'Stress',     x: 210, y: 155, r: 28, hue: 1.0  },
  { id: 'sleep',     label: 'Sleep',      x: 80,  y: 88,  r: 21, hue: 0.85 },
  { id: 'deadlines', label: 'Deadlines',  x: 318, y: 72,  r: 20, hue: 0.9  },
  { id: 'exams',     label: 'Exams',      x: 375, y: 168, r: 18, hue: 0.78 },
  { id: 'social',    label: 'Social',     x: 60,  y: 215, r: 17, hue: 0.32 },
  { id: 'exercise',  label: 'Exercise',   x: 290, y: 262, r: 17, hue: 0.25 },
  { id: 'caffeine',  label: 'Caffeine',   x: 152, y: 268, r: 16, hue: 0.52 },
  { id: 'study',     label: 'Study Load', x: 396, y: 108, r: 18, hue: 0.72 },
]
const GEDGES = [
  { from: 'sleep',     to: 'stress',    w: 0.85 },
  { from: 'deadlines', to: 'stress',    w: 0.9  },
  { from: 'exams',     to: 'stress',    w: 0.78 },
  { from: 'social',    to: 'stress',    w: 0.28 },
  { from: 'exercise',  to: 'stress',    w: 0.22 },
  { from: 'caffeine',  to: 'stress',    w: 0.5  },
  { from: 'study',     to: 'stress',    w: 0.72 },
  { from: 'sleep',     to: 'deadlines', w: 0.55 },
  { from: 'exercise',  to: 'sleep',     w: 0.42 },
  { from: 'caffeine',  to: 'sleep',     w: 0.58 },
]

const INIT_CHAT = [
  { role: 'ai',   text: "Hey Maya. I'm Anchor — here whenever you need to talk. How are you holding up today?" },
  { role: 'user', text: "Feeling pretty overwhelmed. Two exams this week and I barely slept." },
  { role: 'ai',   text: "That combination hits hard. When sleep and deadlines collide, everything feels heavier. Want to try a 2-minute breathing reset, or talk through what's on your plate?" },
]

const BADGES: { Icon: (p: IconProps) => React.ReactElement; label: string; earned: boolean }[] = [
  { Icon: LightningIcon, label: 'Consistency',   earned: true  },
  { Icon: MoonIcon,      label: 'Night Owl Fix', earned: true  },
  { Icon: SparklesIcon,  label: 'Mindful Week',  earned: true  },
  { Icon: DropletIcon,   label: 'Hydration Pro', earned: false },
  { Icon: BookIcon,      label: 'Study Master',  earned: false },
  { Icon: ActivityIcon,  label: 'On the Move',   earned: false },
  { Icon: SunIcon,       label: 'Early Bird',    earned: false },
  { Icon: ShieldIcon,    label: 'Resilience',    earned: false },
  { Icon: TargetIcon,    label: 'Goal Setter',   earned: false },
]

const HABIT_DEFAULTS = [
  { id: 1, label: 'Drink 8 glasses of water',      color: '#5B8FBF',    done: true  },
  { id: 2, label: 'Morning stretch — 10 min',       color: C.sage,       done: false },
  { id: 3, label: 'Study break every 90 min',       color: C.amber,      done: true  },
  { id: 4, label: 'Screen-free 30 min before bed',  color: C.terracotta, done: false },
  { id: 5, label: 'Check in with a friend',         color: C.brown,      done: false },
]

// ─── Shared primitives ────────────────────────────────────────────────────────
function Glass({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl ${className}`}
      style={{ background: C.card, border: `1px solid ${C.cardBorder}`, backdropFilter: 'blur(16px)', ...style }}>
      {children}
    </div>
  )
}

function Mono({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <span className={className} style={{ fontFamily: "'DM Mono', monospace", ...style }}>{children}</span>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] mb-3"
      style={{ color: C.textMute, fontFamily: "'DM Mono', monospace" }}>
      {children}
    </p>
  )
}

function Sparkline({ data, color = C.amber, w = 72, h = 26 }: { data: number[]; color?: string; w?: number; h?: number }) {
  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / rng) * (h - 2) - 1}`).join(' ')
  return (
    <svg width={w} height={h} className="opacity-75">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function Ring({ score, size = 124 }: { score: number; size?: number }) {
  const r = (size - 20) / 2
  const circ = 2 * Math.PI * r, off = circ - (score / 100) * circ
  const color = score < 35 ? C.sage : score < 65 ? C.amber : C.coral
  const label = score < 35 ? 'Low' : score < 65 ? 'Medium' : 'High'
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="55%" stopColor="#D97706" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#rg)" strokeWidth="9"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Mono className="font-bold leading-none" style={{ fontSize: size * 0.23, color: C.textPri }}>{score}</Mono>
        <span className="text-[9px] font-semibold tracking-[0.14em] uppercase mt-1" style={{ color }}>{label}</span>
      </div>
    </div>
  )
}

function NetworkGraph({ viewW = 440, viewH = 290, svgH = 220 }: { viewW?: number; viewH?: number; svgH?: number }) {
  const map = Object.fromEntries(GNODES.map(n => [n.id, n]))
  const nodeColor = (hue: number) =>
    hue > 0.75 ? C.terracotta : hue > 0.5 ? C.amber : hue > 0.3 ? C.brown : C.sage
  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full" style={{ height: svgH }}>
      <defs>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {GEDGES.map((e, i) => {
        const f = map[e.from], t = map[e.to]
        return <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
          stroke={`rgba(217,119,6,${e.w * 0.5})`} strokeWidth={e.w * 3.2} strokeLinecap="round" />
      })}
      {GNODES.map(n => {
        const c = nodeColor(n.hue), isCenter = n.id === 'stress'
        return (
          <g key={n.id} filter="url(#glow)">
            <circle cx={n.x} cy={n.y} r={n.r + 9} fill="none" stroke={c} strokeWidth="1" opacity={0.22} />
            <circle cx={n.x} cy={n.y} r={n.r} fill={c} opacity={isCenter ? 0.9 : 0.78} />
            {isCenter && <circle cx={n.x} cy={n.y} r={n.r - 7} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />}
            <text x={n.x} y={n.y + n.r + 13} textAnchor="middle"
              fill="rgba(253,244,232,0.62)" fontSize={isCenter ? 10 : 9}
              fontFamily="Inter, sans-serif" fontWeight={isCenter ? '600' : '400'}>
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function Heatmap({ weeks = 14 }: { weeks?: number }) {
  return (
    <div className="flex gap-1.5">
      <div className="flex flex-col gap-[5px] mt-0.5 mr-1">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} className="text-[8px] h-3 flex items-center"
            style={{ color: C.textMute, fontFamily: "'DM Mono', monospace" }}>{d}</div>
        ))}
      </div>
      <div className="flex gap-[5px] flex-1 overflow-hidden">
        {Array.from({ length: weeks }, (_, wk) => (
          <div key={wk} className="flex flex-col gap-[5px] flex-1">
            {HEATMAP.map((row, day) => {
              const v = row[wk % 18]
              const a = v < 0.2 ? 0.08 : v < 0.4 ? 0.25 : v < 0.6 ? 0.48 : v < 0.8 ? 0.7 : 0.92
              return <div key={day} className="h-3 rounded-[2px]" style={{ background: `rgba(217,119,6,${a})` }} />
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Shared data helpers ──────────────────────────────────────────────────────
function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved ? JSON.parse(saved) as T : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // The app remains usable when browser storage is unavailable.
    }
  }, [key, value])

  return [value, setValue] as const
}

const DEFAULT_RECENTS: JournalEntry[] = [
  { date: 'Yesterday',   mi: 3, text: 'Managed to finish my stats assignment early. Feeling a bit more in control of the week.' },
  { date: 'Mon, Sep 1',  mi: 1, text: 'Group project meeting went sideways. Nobody did their parts and now it falls on me.' },
  { date: 'Sun, Aug 31', mi: 4, text: 'Good rest day. Caught up on sleep and took a long walk outside — actually needed that.' },
]

function useJournalState() {
  const [mood, setMood] = useStoredState('anchor:mood', 2)
  const [entry, setEntry] = useStoredState('anchor:draft', '')
  const [saved, setSaved] = useState(false)
  const [recents, setRecents] = useStoredState<JournalEntry[]>('anchor:journal-entries', DEFAULT_RECENTS)

  const save = () => {
    const text = entry.trim()
    if (!text) return false
    setRecents(previous => [{ date: 'Today', mi: mood, text }, ...previous])
    setEntry('')
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
    return true
  }

  return { mood, setMood, entry, setEntry, saved, recents, save }
}

function useHabits() {
  return useStoredState('anchor:habits', HABIT_DEFAULTS.map(h => ({ ...h })))
}

const FACTORS = [
  { label: 'Upcoming Deadlines', pct: 88, color: C.terracotta },
  { label: 'Sleep Quality',      pct: 82, color: C.amber      },
  { label: 'Study Load',         pct: 71, color: C.brown      },
  { label: 'Caffeine Intake',    pct: 54, color: C.coral      },
  { label: 'Exercise',           pct: 28, color: C.sage       },
]

// ─── Reusable section blocks ──────────────────────────────────────────────────
function FactorBars({ compact = false }: { compact?: boolean }) {
  return (
    <>
      {FACTORS.map(f => (
        <div key={f.label} className={compact ? 'mb-3 last:mb-0' : 'mb-4 last:mb-0'}>
          <div className="flex justify-between mb-1.5">
            <span className={compact ? 'text-xs' : 'text-sm'} style={{ color: C.textSec }}>{f.label}</span>
            <Mono className="text-[10px]" style={{ color: C.textMute }}>{f.pct}%</Mono>
          </div>
          <div className="h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: f.color, opacity: 0.85 }} />
          </div>
        </div>
      ))}
    </>
  )
}

function PatternCard() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(217,119,6,0.18)' }}>
        <Icon size={16} color={C.amber} strokeWidth={2}>
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </Icon>
      </div>
      <div>
        <Mono className="text-[9px] font-semibold uppercase tracking-[0.14em] block mb-1.5" style={{ color: C.amber }}>Pattern detected</Mono>
        <p className="text-sm leading-relaxed" style={{ color: C.textSec }}>Your stress spikes most when sleep drops below 6 hours with upcoming deadlines. The two together are significantly more disruptive than either alone.</p>
      </div>
    </div>
  )
}

function HabitList({ habits, toggle, dense = false }: {
  habits: typeof HABIT_DEFAULTS; toggle: (id: number) => void; dense?: boolean
}) {
  return (
    <>
      {habits.map((h, idx) => (
        <div key={h.id} onClick={() => toggle(h.id)}
          className={`flex items-center gap-3 cursor-pointer ${dense ? 'py-2.5' : 'py-3.5'}`}
          style={{ borderBottom: idx < habits.length - 1 ? '1px solid rgba(217,119,6,0.08)' : 'none' }}>
          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
            style={h.done ? { background: h.color } : { border: '1px solid rgba(255,255,255,0.15)' }}>
            {h.done && (
              <Icon size={12} color="white" strokeWidth={3}>
                <path d="M5 13l4 4L19 7" />
              </Icon>
            )}
          </div>
          <p className="flex-1 text-sm"
            style={{ color: h.done ? C.textMute : C.textPri, textDecoration: h.done ? 'line-through' : 'none' }}>
            {h.label}
          </p>
          <div className="w-1 h-7 rounded-full flex-shrink-0" style={{ background: h.color, opacity: 0.5 }} />
        </div>
      ))}
    </>
  )
}

function BadgeGrid({ cols = 3 }: { cols?: number }) {
  return (
    <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {BADGES.map((b, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl"
          style={b.earned
            ? { background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.2)' }
            : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ opacity: b.earned ? 1 : 0.25, filter: b.earned ? 'none' : 'grayscale(1)' }}>
            <b.Icon size={24} color={b.earned ? C.amber : C.textMute} />
          </div>
          <span className="text-[8px] text-center leading-tight"
            style={{ color: b.earned ? C.amber : C.textMute }}>{b.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Chat pane ────────────────────────────────────────────────────────────────
function ChatPane({ compact = false }: { compact?: boolean }) {
  const [msgs, setMsgs] = useStoredState<ChatMessage[]>('anchor:chat', INIT_CHAT)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const quick: Record<string, string> = {
    'Breathing exercise': "Box breathing — 4 counts in, hold 4, out 4, hold 4. Repeat 4 times. Want me to guide you?",
    'Talk it out':        "Of course. What's the heaviest thing on your mind right now?",
    'Just venting':       "Go ahead — I'm listening. No advice unless you ask.",
  }

  const send = (text: string) => {
    const t = text.trim()
    if (!t) return
    setMsgs(m => [...m, { role: 'user', text: t }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const res = quick[t] ?? "That makes sense. What would feel most useful right now — talking through it, or something to bring the level down?"
      setMsgs(m => [...m, { role: 'ai', text: res }])
      setTyping(false)
    }, 1100)
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-3 flex-shrink-0 ${compact ? 'px-4 py-4' : 'px-4 pt-14 pb-4'}`}
        style={{ borderBottom: '1px solid rgba(217,119,6,0.1)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: C.grad }}>
          <AnchorIcon size={16} color="white" />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: C.textPri }}>Anchor</p>
          <p className="text-[10px]" style={{ color: C.sage }}>Here for you · private</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${compact ? 'max-w-[88%]' : 'max-w-[80%]'}`}
              style={m.role === 'user'
                ? { background: C.grad, color: '#fff', borderRadius: '18px 18px 4px 18px' }
                : { background: C.card, border: `1px solid ${C.cardBorder}`, color: C.textSec, borderRadius: '18px 18px 18px 4px' }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl"
              style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '18px 18px 18px 4px' }}>
              <div className="flex gap-1 items-center">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: C.amber, animation: `dot-bounce 1s ${i * 0.18}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto flex-shrink-0">
        {Object.keys(quick).map(r => (
          <button key={r} onClick={() => send(r)}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-full text-[10px] whitespace-nowrap"
            style={{ color: C.amber, border: `1px solid rgba(217,119,6,0.3)`, background: 'rgba(217,119,6,0.08)' }}>
            {r}
          </button>
        ))}
      </div>

      <div className="mx-3 mb-2 px-3 py-2 rounded-xl flex items-center gap-2 flex-shrink-0"
        style={{ background: 'rgba(224,122,95,0.08)', border: '1px solid rgba(224,122,95,0.16)' }}>
        <Icon size={13} color={C.coral} strokeWidth={2}>
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </Icon>
        <p className="text-[9px]" style={{ color: C.coral }}>
          Need more support? <button type="button" onClick={() => window.alert('In an emergency, contact your local emergency number or a crisis service. For ongoing support, use your campus counseling service.')} className="underline cursor-pointer font-medium">Find support options</button>
        </p>
      </div>

      <div className="px-3 pb-4 flex gap-2 flex-shrink-0">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
          placeholder="Type something..."
          className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none"
          style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.textPri }} />
        <button onClick={() => send(input)}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
          style={{ background: C.grad }}>
          <Icon size={16} color="white" strokeWidth={2}>
            <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </Icon>
        </button>
      </div>
    </div>
  )
}

// ─── MOBILE SCREENS ───────────────────────────────────────────────────────────
function MobileHome({ go }: { go: (s: Screen) => void }) {
  const metrics = [
    { label: 'Sleep',  value: '6.2h',   sub: '−0.8 avg', data: SLEEP_DATA,  color: C.amber      },
    { label: 'Study',  value: '4.5h',   sub: '+0.5 avg', data: STUDY_DATA,  color: C.sage       },
    { label: 'Mood',   value: '3.8/5',  sub: 'Stable',   data: MOOD_DATA,   color: C.terracotta },
    { label: 'Screen', value: '3h 12m', sub: '+42m avg', data: SCREEN_DATA, color: C.coral      },
  ]
  return (
    <div className="relative px-4 pt-14 pb-8 min-h-full overflow-x-hidden">
      <div className="blob-a absolute -top-16 -right-12 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: C.blob1, filter: 'blur(56px)' }} />
      <div className="blob-b absolute top-44 -left-16 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: C.blob2, filter: 'blur(64px)' }} />

      <div className="relative mb-6">
        <p className="text-xs font-medium" style={{ color: C.textMute }}>Wednesday, Sep 3</p>
        <h1 className="text-2xl font-semibold leading-snug mt-0.5" style={{ color: C.textPri }}>Good morning, Maya.</h1>
      </div>

      <Glass className="p-4 mb-3 flex items-center gap-4">
        <Ring score={42} size={120} />
        <div className="flex-1 min-w-0">
          <SectionLabel>Today's stress</SectionLabel>
          <p className="text-sm leading-relaxed" style={{ color: C.textSec }}>Moderate. Sleep dipped last night — wrap up before midnight.</p>
          <div className="mt-3 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[3px] flex-1 rounded-full"
                style={{ background: i < 2 ? C.amber : 'rgba(255,255,255,0.07)' }} />
            ))}
          </div>
        </div>
      </Glass>

      <div className="flex gap-2.5 overflow-x-auto -mx-4 px-4 pb-1 mb-3">
        {metrics.map(m => (
          <Glass key={m.label} className="flex-shrink-0 p-3.5" style={{ width: 128 }}>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] mb-1.5"
              style={{ color: C.textMute, fontFamily: "'DM Mono', monospace" }}>{m.label}</p>
            <p className="text-base font-semibold mb-0.5" style={{ color: C.textPri }}>{m.value}</p>
            <p className="text-[10px] mb-2.5" style={{ color: C.textMute }}>{m.sub}</p>
            <Sparkline data={m.data} color={m.color} />
          </Glass>
        ))}
      </div>

      <Glass className="p-4 mb-20">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium" style={{ color: C.textPri }}>Weekly Stress</p>
          <Mono className="text-[10px]" style={{ color: C.textMute }}>14 weeks</Mono>
        </div>
        <Heatmap weeks={14} />
        <div className="flex items-center gap-1.5 mt-3">
          <span className="text-[8px]" style={{ color: C.textMute }}>Low</span>
          {[0.08,0.25,0.48,0.7,0.92].map((a, i) => (
            <div key={i} className="w-3 h-3 rounded-[2px]" style={{ background: `rgba(217,119,6,${a})` }} />
          ))}
          <span className="text-[8px]" style={{ color: C.textMute }}>High</span>
        </div>
      </Glass>

      <button onClick={() => go('chat')}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center z-20 active:scale-95 transition-transform"
        style={{ background: C.grad, boxShadow: `0 0 28px rgba(217,119,6,0.45)` }}>
        <Icon size={22} color="white" strokeWidth={2}>
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </Icon>
      </button>
    </div>
  )
}

function MobileJournal() {
  const { mood, setMood, entry, setEntry, saved, recents, save } = useJournalState()
  return (
    <div className="relative px-4 pt-14 pb-8 min-h-full">
      <div className="blob-a absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-56 rounded-full pointer-events-none"
        style={{ background: C.blob2, filter: 'blur(72px)' }} />
      <div className="relative">
        <h1 className="text-2xl font-semibold mb-0.5" style={{ color: C.textPri }}>Check In</h1>
        <p className="text-sm mb-5" style={{ color: C.textSec }}>How are you right now?</p>

        <Glass className="p-4 mb-3">
          <SectionLabel>Today's mood</SectionLabel>
          <div className="flex justify-between">
            {MOODS.map((m, i) => (
              <button key={i} onClick={() => setMood(i)}
                className="flex flex-col items-center gap-1.5 px-2 py-2 rounded-xl transition-all"
                style={mood === i ? { background: 'rgba(217,119,6,0.18)', transform: 'scale(1.1)' } : { opacity: 0.42 }}>
                <FaceIcon level={m.level} size={28} color={mood === i ? C.amber : C.textSec} />
                <span className="text-[8px] font-medium" style={{ color: C.textSec }}>{m.label}</span>
              </button>
            ))}
          </div>
        </Glass>

        <Glass className="p-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlameIcon size={22} color={C.amber} />
            <div>
              <p className="text-sm font-semibold" style={{ color: C.textPri }}>7-day streak</p>
              <p className="text-[10px]" style={{ color: C.textSec }}>Keep it going</p>
            </div>
          </div>
          <div className="flex gap-1">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-medium"
                style={{ background: 'rgba(217,119,6,0.22)', color: C.amber }}>{d}</div>
            ))}
          </div>
        </Glass>

        <Glass className="p-4 mb-4">
          <SectionLabel>Journal</SectionLabel>
          <textarea value={entry} onChange={e => setEntry(e.target.value)}
            placeholder="What's been on your mind today?" rows={5}
            className="w-full bg-transparent text-sm placeholder-[#6B5540] resize-none outline-none leading-relaxed"
            style={{ color: C.textPri }} />
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(217,119,6,0.1)' }}>
            <Mono className="text-[10px]" style={{ color: C.textMute }}>{entry.length} chars</Mono>
            <button onClick={save} disabled={!entry.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white active:scale-95 transition-transform"
              style={{ background: C.grad, opacity: entry.trim() ? 1 : 0.45 }}>
              {saved ? 'Saved ✓' : 'Save entry'}
            </button>
          </div>
        </Glass>

        <p className="text-sm font-medium mb-3" style={{ color: C.textPri }}>Recent entries</p>
        {recents.map((e, i) => (
          <Glass key={i} className="p-4 mb-2">
            <div className="flex items-center gap-2 mb-1.5">
              <FaceIcon level={MOODS[e.mi].level} size={18} color={C.textSec} />
              <Mono className="text-[10px]" style={{ color: C.textMute }}>{e.date}</Mono>
            </div>
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: C.textSec }}>{e.text}</p>
          </Glass>
        ))}
      </div>
    </div>
  )
}

function MobileInsights() {
  return (
    <div className="px-4 pt-14 pb-8 min-h-full">
      <h1 className="text-2xl font-semibold mb-0.5" style={{ color: C.textPri }}>Insights</h1>
      <p className="text-sm mb-5" style={{ color: C.textSec }}>What's driving your stress</p>
      <Glass className="p-4 mb-3 overflow-hidden">
        <SectionLabel>Correlation network</SectionLabel>
        <NetworkGraph svgH={210} />
      </Glass>
      <Glass className="p-4 mb-3"><PatternCard /></Glass>
      <Glass className="p-4">
        <SectionLabel>Top factors this week</SectionLabel>
        <FactorBars compact />
      </Glass>
    </div>
  )
}

function MobileStreaks() {
  const [habits, toggle] = (() => {
    const [h, setH] = useHabits()
    return [h, (id: number) => setH(prev => prev.map(x => x.id === id ? { ...x, done: !x.done } : x))]
  })()
  const done = habits.filter(h => h.done).length

  return (
    <div className="px-4 pt-14 pb-8 min-h-full">
      <h1 className="text-2xl font-semibold mb-0.5" style={{ color: C.textPri }}>Wellness</h1>
      <p className="text-sm mb-5" style={{ color: C.textSec }}>Build habits that stick</p>

      <Glass className="p-4 mb-3 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(217,119,6,0.18)' }}>
          <StarIcon size={28} color={C.amber} />
        </div>
        <div className="flex-1 min-w-0">
          <Mono className="text-[9px] font-semibold uppercase tracking-[0.14em] block" style={{ color: C.textMute }}>Total points</Mono>
          <Mono className="text-3xl font-bold leading-tight block" style={{ color: C.textPri }}>480</Mono>
          <div className="mt-1.5 h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div className="h-full rounded-full" style={{ width: '48%', background: C.grad }} />
          </div>
          <p className="text-[10px] mt-0.5" style={{ color: C.textMute }}>520 to next level</p>
        </div>
      </Glass>

      <Glass className="p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium" style={{ color: C.textPri }}>Today</p>
          <Mono className="text-[10px]" style={{ color: C.textMute }}>{done}/{habits.length}</Mono>
        </div>
        <HabitList habits={habits} toggle={toggle} dense />
      </Glass>

      <Glass className="p-4">
        <p className="text-sm font-medium mb-3" style={{ color: C.textPri }}>Badges</p>
        <BadgeGrid cols={3} />
      </Glass>
    </div>
  )
}

// ─── DESKTOP SCREENS ──────────────────────────────────────────────────────────
const NAV_ITEMS: { id: Screen; label: string; path: string }[] = [
  { id: 'home',     label: 'Home',     path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'journal',  label: 'Journal',  path: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'insights', label: 'Insights', path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'streaks',  label: 'Streaks',  path: 'M13 10V3L4 14h7v7l9-11h-7z' },
]

function DesktopSidebar({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  return (
    <aside className="flex flex-col h-full py-7 px-5"
      style={{ width: 220, background: C.sidebar, borderRight: `1px solid ${C.cardBorder}`, flexShrink: 0 }}>
      <div className="flex items-center gap-2.5 mb-10 px-1">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: C.grad }}>
          <AnchorIcon size={16} color="white" />
        </div>
        <span className="text-base font-bold tracking-tight" style={{ color: C.textPri }}>Anchor</span>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] px-3 mb-2"
          style={{ color: C.textMute, fontFamily: "'DM Mono', monospace" }}>Navigation</p>
        {NAV_ITEMS.map(item => {
          const active = screen === item.id
          return (
            <button key={item.id} onClick={() => setScreen(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              style={active ? { background: 'rgba(217,119,6,0.16)', color: C.amber } : { color: C.textMute }}>
              <Icon size={16} color={active ? C.amber : C.textMute} strokeWidth={active ? 2 : 1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
              </Icon>
              {item.label}
              {active && <div className="ml-auto w-1 h-4 rounded-full" style={{ background: C.amber }} />}
            </button>
          )
        })}
      </div>

      <div className="mt-auto px-3 pt-6" style={{ borderTop: '1px solid rgba(217,119,6,0.08)' }}>
        <div className="w-8 h-8 rounded-full mb-2 flex items-center justify-center text-xs font-bold text-white"
          style={{ background: C.grad }}>M</div>
        <p className="text-xs font-medium" style={{ color: C.textSec }}>Maya Chen</p>
        <p className="text-[10px]" style={{ color: C.textMute }}>Computer Science · Year 2</p>
        <div className="mt-2 flex items-center gap-1.5">
          <FlameIcon size={14} color={C.amber} />
          <Mono className="text-[10px]" style={{ color: C.amber }}>7-day streak</Mono>
        </div>
      </div>
    </aside>
  )
}

function DesktopHome() {
  const metrics = [
    { label: 'Sleep',  value: '6.2h',   trend: '−0.8 avg', data: SLEEP_DATA,  color: C.amber      },
    { label: 'Study',  value: '4.5h',   trend: '+0.5 avg', data: STUDY_DATA,  color: C.sage       },
    { label: 'Mood',   value: '3.8/5',  trend: 'Stable',   data: MOOD_DATA,   color: C.terracotta },
    { label: 'Screen', value: '3h 12m', trend: '+42m avg', data: SCREEN_DATA, color: C.coral      },
  ]
  return (
    <div className="h-full overflow-y-auto px-8 py-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: C.textMute }}>Wednesday, September 3, 2026</p>
          <h1 className="text-3xl font-semibold" style={{ color: C.textPri }}>Good morning, Maya.</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(109,155,114,0.12)', border: '1px solid rgba(109,155,114,0.25)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.sage }} />
          <span className="text-xs font-medium" style={{ color: C.sage }}>Low activity period</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-4">
        <Glass className="col-span-2 p-6 flex items-center gap-6">
          <Ring score={42} size={140} />
          <div className="flex-1 min-w-0">
            <SectionLabel>Today's stress index</SectionLabel>
            <p className="text-base font-medium mb-1" style={{ color: C.textPri }}>Moderate</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: C.textSec }}>Sleep dipped to 6.2h last night. Try to wrap up before midnight to recover the baseline.</p>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full"
                  style={{ background: i < 4 ? C.amber : 'rgba(255,255,255,0.07)' }} />
              ))}
            </div>
          </div>
        </Glass>

        {metrics.map(m => (
          <Glass key={m.label} className="p-5 flex flex-col justify-between">
            <div>
              <SectionLabel>{m.label}</SectionLabel>
              <p className="text-2xl font-bold mb-0.5" style={{ color: C.textPri }}>{m.value}</p>
              <p className="text-[11px]" style={{ color: C.textMute }}>{m.trend}</p>
            </div>
            <Sparkline data={m.data} color={m.color} w={100} h={36} />
          </Glass>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Glass className="col-span-3 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: C.textPri }}>Weekly Stress Calendar</p>
            <Mono className="text-[10px]" style={{ color: C.textMute }}>18 weeks</Mono>
          </div>
          <Heatmap weeks={18} />
          <div className="flex items-center gap-2 mt-4">
            <span className="text-[9px]" style={{ color: C.textMute }}>Low stress</span>
            {[0.08,0.2,0.4,0.6,0.82].map((a, i) => (
              <div key={i} className="w-4 h-4 rounded-sm" style={{ background: `rgba(217,119,6,${a})` }} />
            ))}
            <span className="text-[9px]" style={{ color: C.textMute }}>High stress</span>
          </div>
        </Glass>
        <Glass className="col-span-2 p-6">
          <SectionLabel>Top stress factors</SectionLabel>
          <p className="text-[11px] leading-relaxed mb-5" style={{ color: C.textSec }}>Sleep drops below 6h combined with upcoming deadlines account for 78% of your high-stress days.</p>
          <FactorBars />
        </Glass>
      </div>
    </div>
  )
}

function DesktopJournal() {
  const { mood, setMood, entry, setEntry, saved, recents, save } = useJournalState()
  return (
    <div className="h-full overflow-y-auto px-8 py-8">
      <h1 className="text-3xl font-semibold mb-1" style={{ color: C.textPri }}>Check In</h1>
      <p className="text-sm mb-8" style={{ color: C.textSec }}>How are you doing today, Maya?</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <Glass className="p-6">
            <SectionLabel>Today's mood</SectionLabel>
            <div className="flex gap-3">
              {MOODS.map((m, i) => (
                <button key={i} onClick={() => setMood(i)}
                  className="flex flex-col items-center gap-2 flex-1 py-3 rounded-xl transition-all"
                  style={mood === i ? { background: 'rgba(217,119,6,0.18)', transform: 'scale(1.05)' } : { opacity: 0.42 }}>
                  <FaceIcon level={m.level} size={36} color={mood === i ? C.amber : C.textSec} />
                  <span className="text-[9px] font-medium" style={{ color: C.textSec }}>{m.label}</span>
                </button>
              ))}
            </div>
          </Glass>

          <Glass className="p-6 flex-1">
            <SectionLabel>Journal entry</SectionLabel>
            <textarea value={entry} onChange={e => setEntry(e.target.value)}
              placeholder="What's been on your mind today?"
              className="w-full bg-transparent text-sm placeholder-[#6B5540] resize-none outline-none leading-relaxed"
              style={{ color: C.textPri, minHeight: 200 }} />
            <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(217,119,6,0.1)' }}>
              <div className="flex items-center gap-3">
                <FlameIcon size={20} color={C.amber} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: C.textPri }}>7-day streak</p>
                  <p className="text-[10px]" style={{ color: C.textMute }}>Keep it going</p>
                </div>
              </div>
              <button onClick={save} disabled={!entry.trim()}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white active:scale-95 transition-transform"
                style={{ background: C.grad, opacity: entry.trim() ? 1 : 0.45 }}>
                {saved ? 'Saved ✓' : 'Save entry'}
              </button>
            </div>
          </Glass>
        </div>

        <div>
          <p className="text-sm font-medium mb-3" style={{ color: C.textPri }}>Recent entries</p>
          {recents.map((e, i) => (
            <Glass key={i} className="p-5 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <FaceIcon level={MOODS[e.mi].level} size={22} color={C.textSec} />
                <Mono className="text-[10px]" style={{ color: C.textMute }}>{e.date}</Mono>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.textSec }}>{e.text}</p>
            </Glass>
          ))}
        </div>
      </div>
    </div>
  )
}

function DesktopInsights() {
  return (
    <div className="h-full overflow-y-auto px-8 py-8">
      <h1 className="text-3xl font-semibold mb-1" style={{ color: C.textPri }}>Insights</h1>
      <p className="text-sm mb-8" style={{ color: C.textSec }}>What's driving your stress this semester</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Glass className="p-6">
          <SectionLabel>Correlation network</SectionLabel>
          <NetworkGraph viewW={440} viewH={300} svgH={260} />
        </Glass>
        <div className="flex flex-col gap-4">
          <Glass className="p-6"><PatternCard /></Glass>
          <Glass className="p-6 flex-1">
            <SectionLabel>Top factors this week</SectionLabel>
            <FactorBars />
          </Glass>
        </div>
      </div>
    </div>
  )
}

function DesktopStreaks() {
  const [habits, setHabits] = useHabits()
  const toggle = (id: number) => setHabits(prev => prev.map(x => x.id === id ? { ...x, done: !x.done } : x))
  const done = habits.filter(h => h.done).length

  return (
    <div className="h-full overflow-y-auto px-8 py-8">
      <h1 className="text-3xl font-semibold mb-1" style={{ color: C.textPri }}>Wellness</h1>
      <p className="text-sm mb-8" style={{ color: C.textSec }}>Build habits that stick, earn points for showing up</p>

      <Glass className="p-6 mb-4 flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(217,119,6,0.18)' }}>
          <StarIcon size={32} color={C.amber} />
        </div>
        <div className="flex-1">
          <SectionLabel>Total points</SectionLabel>
          <Mono className="text-4xl font-bold block" style={{ color: C.textPri }}>480</Mono>
        </div>
        <div className="flex-1">
          <div className="h-2 rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div className="h-full rounded-full" style={{ width: '48%', background: C.grad }} />
          </div>
          <p className="text-xs" style={{ color: C.textMute }}>520 points to Level 2</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium" style={{ color: C.textSec }}>This week</p>
          <p className="text-2xl font-bold" style={{ color: C.amber }}>+120</p>
        </div>
      </Glass>

      <div className="grid grid-cols-2 gap-4">
        <Glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: C.textPri }}>Today's habits</p>
            <Mono className="text-[10px]" style={{ color: C.textMute }}>{done}/{habits.length} done</Mono>
          </div>
          <HabitList habits={habits} toggle={toggle} />
        </Glass>
        <Glass className="p-6">
          <p className="text-sm font-medium mb-4" style={{ color: C.textPri }}>Badges</p>
          <BadgeGrid cols={3} />
        </Glass>
      </div>
    </div>
  )
}

function DesktopApp({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  return (
    <div className="h-full flex overflow-hidden" style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <DesktopSidebar screen={screen} setScreen={setScreen} />
      <main className="flex-1 min-w-0 overflow-hidden">
        {screen === 'home'     && <DesktopHome />}
        {screen === 'journal'  && <DesktopJournal />}
        {screen === 'insights' && <DesktopInsights />}
        {screen === 'streaks'  && <DesktopStreaks />}
      </main>
      <div className="flex-shrink-0 flex flex-col" style={{ width: 310, borderLeft: `1px solid ${C.cardBorder}` }}>
        <ChatPane compact />
      </div>
    </div>
  )
}

// ─── MOBILE layout ────────────────────────────────────────────────────────────
const MOBILE_NAV: { id: Screen; label: string; path: string }[] = [
  { id: 'home',     label: 'Home',     path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'journal',  label: 'Journal',  path: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'insights', label: 'Insights', path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'chat',     label: 'Chat',     path: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { id: 'streaks',  label: 'Streaks',  path: 'M13 10V3L4 14h7v7l9-11h-7z' },
]

function MobileApp({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  return (
    <div className="h-full flex items-center justify-center" style={{ background: '#060402' }}>
      <div className="relative flex flex-col overflow-hidden w-full"
        style={{ maxWidth: 430, height: '100%', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
        <div className="flex-1 min-h-0 relative overflow-hidden">
          {screen !== 'chat' && (
            <div className="absolute inset-0 overflow-y-auto">
              {screen === 'home'     && <MobileHome go={setScreen} />}
              {screen === 'journal'  && <MobileJournal />}
              {screen === 'insights' && <MobileInsights />}
              {screen === 'streaks'  && <MobileStreaks />}
            </div>
          )}
          {screen === 'chat' && (
            <div className="absolute inset-0"><ChatPane /></div>
          )}
        </div>
        <nav className="flex-shrink-0 flex"
          style={{ background: 'rgba(10,7,4,0.96)', borderTop: '1px solid rgba(217,119,6,0.1)', backdropFilter: 'blur(20px)' }}>
          {MOBILE_NAV.map(item => {
            const active = screen === item.id
            return (
              <button key={item.id} onClick={() => setScreen(item.id as Screen)}
                className="flex-1 flex flex-col items-center gap-1 py-3">
                <Icon size={20} color={active ? C.amber : C.textMute} strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                </Icon>
                <span className="text-[9px] font-medium" style={{ color: active ? C.amber : C.textMute }}>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function useIsDesktop() {
  const [desk, setDesk] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024)
  useEffect(() => {
    const handler = () => setDesk(window.innerWidth >= 1024)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return desk
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const isDesktop = useIsDesktop()
  if (isDesktop) return <DesktopApp screen={screen} setScreen={setScreen} />
  return <MobileApp screen={screen} setScreen={setScreen} />
}
