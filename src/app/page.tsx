"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Youtube, Music2, Upload, Sparkles, Scissors, 
  Play, Pause, Download, Clock, Flame, Eye, 
  Settings2, Wand2, Subtitles, Smartphone,
  Zap, TrendingUp, Hash, Copy, Check,
  FileVideo, AlertCircle, Loader2, X,
  Volume2, VolumeX, Target, Brain, Layers,
  ChevronRight, ArrowUpRight, Share2, Shield,
  Film, Music, Sliders, BarChart3, Calendar,
  Radio, RefreshCw, FileText
} from "lucide-react"
import { cn, formatTime } from "@/lib/utils"
import AutomationPanel from "@/components/AutomationPanel"

type Platform = "youtube" | "tiktok" | "upload" | null
type ProcessingStep = "idle" | "downloading" | "transcribing" | "analyzing" | "clipping" | "done"
type ClipStyle = "mrbeast" | "hormozi" | "cyberpunk" | "podcast" | "minimal"
type AspectRatio = "9:16" | "1:1" | "4:5" | "16:9"
type StudioTab = "editor" | "analytics" | "broll" | "scheduler"

interface BrollItem {
  timestamp: string
  type: string
  prompt: string
  sfx: string
  suggestion: string
}

interface RetentionPoint {
  time: number
  retention: number
}

interface ViralClip {
  id: string
  start: number
  end: number
  duration: number
  viralScore: number
  hook: string
  transcript: string
  title: string
  hashtags: string[]
  thumbnail: string
  views_prediction: string
  hook_type?: string
  emotion?: string
  reasons?: string[]
  hook_strength?: number
  retention_probability?: number
  shareability?: number
  retention_curve?: RetentionPoint[]
  brolls?: BrollItem[]
}

const mockClips: ViralClip[] = [
  {
    id: "1",
    start: 42,
    end: 67,
    duration: 25,
    viralScore: 98,
    hook: "ความลับที่ไม่มีใครบอกคุณเกี่ยวกับการทำเงินออนไลน์...",
    transcript: "ความลับที่ไม่มีใครบอกคุณเกี่ยวกับการทำเงินออนไลน์ คือทุกคนโฟกัสผิดจุด คุณไม่ต้องมีสินค้า ไม่ต้องมีทุน แค่ต้องเข้าใจสิ่งนี้สิ่งเดียวเท่านั้น",
    title: "ความลับทำเงินออนไลน์ที่ไม่มีใครบอก 🤫",
    hashtags: ["#หาเงินออนไลน์", "#ธุรกิจ", "#เคล็ดลับ", "#TikTokUni", "#mindset"],
    thumbnail: "https://images.unsplash.com/photo-1611162616805-6396b235a6a6?w=400",
    views_prediction: "800K - 2.5M",
    hook_type: "curiosity_gap",
    emotion: "excited",
    reasons: ["เจอ Hook ทรงพลัง (curiosity_gap)", "มีคีย์เวิร์ดยอดฮิต 4 คำ", "ความยาวสมบูรณ์แบบสำหรับ TikTok & Reels (25s)", "อารมณ์ตื่นเต้นพีคสูง"],
    hook_strength: 96,
    retention_probability: 94,
    shareability: 92,
    retention_curve: [
      { time: 0, retention: 100 },
      { time: 3, retention: 94 },
      { time: 7, retention: 90 },
      { time: 12, retention: 87 },
      { time: 18, retention: 85 },
      { time: 22, retention: 89 },
      { time: 25, retention: 81 }
    ],
    brolls: [
      {
        timestamp: "0:02 - 0:05",
        type: "video",
        prompt: "4k macro shot of money counting machine with neon lighting",
        sfx: "cash_register.mp3",
        suggestion: "ฟุตเทจนับเงินสด + เสียง Cash Register"
      },
      {
        timestamp: "0:12 - 0:15",
        type: "overlay",
        prompt: "highlight text badge with glowing border",
        sfx: "ding_success.mp3",
        suggestion: "แอนิเมชันกรอบไฟนีออนเน้นคีย์เวิร์ด + เสียง Ding"
      }
    ]
  },
  {
    id: "2",
    start: 128,
    end: 158,
    duration: 30,
    viralScore: 94,
    hook: "หยุดทำ 3 สิ่งนี้เดี๋ยวนี้ถ้าอยากรวย!",
    transcript: "ถ้าคุณยังทำ 3 สิ่งนี้อยู่ คุณจะไม่มีวันรวย หยุดเดี๋ยวนี้เลย อันดับแรกคือการตื่นสาย อันดับสองคือการใช้เงินไปกับของที่ไม่สร้างรายได้ อันดับสามคือการไม่ลงทุนในตัวเอง",
    title: "หยุดทำ 3 สิ่งนี้ถ้าอยากรวย 💸",
    hashtags: ["#พัฒนาตัวเอง", "#ความสำเร็จ", "#mindset", "#การเงิน", "#ชีวิตเปลี่ยน"],
    thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
    views_prediction: "500K - 1.2M",
    hook_type: "contrarian",
    emotion: "alert",
    reasons: ["เจอ Hook แบบ contrarian (หยุด/เลิก)", "มีตัวเลขเฉพาะเจาะจง (3 สิ่ง)", "กระตุ้น Loss Aversion"],
    hook_strength: 92,
    retention_probability: 90,
    shareability: 88,
    retention_curve: [
      { time: 0, retention: 100 },
      { time: 4, retention: 92 },
      { time: 10, retention: 87 },
      { time: 18, retention: 85 },
      { time: 25, retention: 86 },
      { time: 30, retention: 76 }
    ],
    brolls: [
      {
        timestamp: "0:00 - 0:03",
        type: "overlay",
        prompt: "red neon warning sign glitching on black screen",
        sfx: "whoosh_impact.mp3",
        suggestion: "ป้ายเตือนสีแดงกะพริบ + เสียงเบสบูม Whoosh"
      }
    ]
  },
  {
    id: "3",
    start: 245,
    end: 270,
    duration: 25,
    viralScore: 90,
    hook: "ผมลองวิธีนี้มา 30 วัน จาก 0 ผู้ติดตาม สู่ 100K...",
    transcript: "ผมลองวิธีนี้มา 30 วัน จาก 0 ผู้ติดตาม ตอนนี้มี 100K แล้ว วิธีคือการโพสต์วันละ 3 ครั้งในเวลาที่คนดูเยอะที่สุดคือ 7 โมงเช้า เที่ยง และ 2 ทุ่ม",
    title: "0 ถึง 100K ใน 30 วัน ทำยังไง? 🚀",
    hashtags: ["#tiktok", "#สร้างตัวตน", "#ไวรัล", "#ยอดวิว", "#เทคนิค"],
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    views_prediction: "300K - 700K",
    hook_type: "story",
    emotion: "excited",
    reasons: ["มีตัวเลขการเติบโตชัดเจน (0 -> 100K)", "ระบุเวลาและขั้นตอนทำตามได้ทันที"],
    hook_strength: 88,
    retention_probability: 87,
    shareability: 89,
    retention_curve: [
      { time: 0, retention: 100 },
      { time: 3, retention: 90 },
      { time: 8, retention: 85 },
      { time: 15, retention: 83 },
      { time: 20, retention: 85 },
      { time: 25, retention: 74 }
    ],
    brolls: [
      {
        timestamp: "0:00 - 0:03",
        type: "video",
        prompt: "dramatic zoom in on speaker with dynamic bokeh lights",
        sfx: "pop_hook.mp3",
        suggestion: "Dynamic Zoom-in 1.2x + เสียง Pop เพื่อดึงสายตา"
      }
    ]
  },
  {
    id: "4",
    start: 312,
    end: 335,
    duration: 23,
    viralScore: 88,
    hook: "AI จะมาแทนที่คุณใน 6 เดือน ถ้าคุณยังทำงานแบบเดิม...",
    transcript: "ถ้าคุณทำงานแบบนี้ AI จะมาแทนที่คุณแน่นอนใน 6 เดือนข้างหน้า ผมไม่ได้ขู่ แต่มันคือความจริงที่ต้องเตรียมตัวตั้งแต่วันนี้",
    title: "งานแบบไหน AI จะแทนที่ใน 6 เดือน? 😱",
    hashtags: ["#AI", "#อนาคต", "#เทคโนโลยี", "#ChatGPT", "#งาน"],
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
    views_prediction: "400K - 900K",
    hook_type: "shocking",
    emotion: "excited",
    reasons: ["เจอ Hook แบบ shocking", "คีย์เวิร์ด AI กำลังเป็นกระแสไวรัล"],
    hook_strength: 89,
    retention_probability: 86,
    shareability: 85,
    retention_curve: [
      { time: 0, retention: 100 },
      { time: 3, retention: 91 },
      { time: 7, retention: 86 },
      { time: 14, retention: 82 },
      { time: 19, retention: 84 },
      { time: 23, retention: 75 }
    ],
    brolls: [
      {
        timestamp: "0:04 - 0:08",
        type: "video",
        prompt: "futuristic AI neural network glowing interface, cinematic",
        sfx: "digital_glitch.mp3",
        suggestion: "กราฟิกโครงข่าย AI นิวรอน + เสียง Sci-fi Glitch"
      }
    ]
  }
]

export default function Home() {
  const [url, setUrl] = useState("")
  const [platform, setPlatform] = useState<Platform>("youtube")
  const [step, setStep] = useState<ProcessingStep>("idle")
  const [progress, setProgress] = useState(0)
  const [clips, setClips] = useState<ViralClip[]>(mockClips)
  const [selectedClip, setSelectedClip] = useState<ViralClip>(mockClips[0])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<StudioTab>("editor")
  
  // v2.0 Controls
  const [clipCount, setClipCount] = useState(4)
  const [clipDuration, setClipDuration] = useState("30")
  const [clipStyle, setClipStyle] = useState<ClipStyle>("hormozi")
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16")
  const [showSafeZone, setShowSafeZone] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [subPosition, setSubPosition] = useState<"bottom" | "center" | "top">("bottom")
  const [fontSize, setFontSize] = useState<number>(24)
  const [audioNormalize, setAudioNormalize] = useState(true)
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [audioMuted, setAudioMuted] = useState(false)

  // Simulation timer for video preview
  useEffect(() => {
    let interval: any
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= (selectedClip?.duration || 25)) {
            return 0
          }
          return +(prev + 0.1).toFixed(1)
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, selectedClip])

  const handleStartProcess = async () => {
    if (!url && platform !== "upload") {
      setUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    }

    setStep("downloading")
    setProgress(15)

    setTimeout(() => {
      setStep("transcribing")
      setProgress(40)
    }, 1200)

    setTimeout(() => {
      setStep("analyzing")
      setProgress(75)
    }, 2400)

    setTimeout(async () => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            clipCount,
            clipDuration,
            style: clipStyle,
            aspectRatio,
            faceTracking: true,
            autoSubtitles: true,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.clips && data.clips.length > 0) {
            setClips(data.clips)
            setSelectedClip(data.clips[0])
          }
        }
      } catch (e) {
        console.error(e)
      }
      setStep("done")
      setProgress(100)
    }, 3600)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const exportCapCut = async (clip: ViralClip) => {
    setIsExporting("capcut")
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "capcut", clip })
      })
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `VIRALCUT_${clip.id}_CapCut_Draft.json`
      a.click()
    } catch (e) {
      console.error(e)
    } finally {
      setIsExporting(null)
    }
  }

  const exportSRT = async (clip: ViralClip) => {
    setIsExporting("srt")
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "srt", clip })
      })
      const text = await res.text()
      const blob = new Blob([text], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `VIRALCUT_${clip.id}_Subtitles.srt`
      a.click()
    } catch (e) {
      console.error(e)
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#07090e] text-white selection:bg-[#ff006e] selection:text-white font-sans">
      {/* Background Neon Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#ff006e]/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-[#3a86ff]/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-[#ffbe0b]/10 rounded-full blur-[160px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.08] backdrop-blur-xl bg-black/40 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff006e] via-[#8338ec] to-[#3a86ff] flex items-center justify-center shadow-lg shadow-[#ff006e]/25">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-wider bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  VIRALCUT
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff006e] to-[#ffbe0b] text-black font-extrabold shadow-sm">
                  v2.0 PRO
                </span>
              </div>
              <p className="text-[10px] text-white/40 hidden sm:block">AI YouTube & TikTok Viral Studio</p>
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="hidden md:flex items-center bg-white/[0.04] border border-white/[0.08] rounded-full p-1">
            {[
              { id: "editor", label: "Studio Editor", icon: Film },
              { id: "analytics", label: "Retention Analytics", icon: BarChart3 },
              { id: "broll", label: "B-Roll AI", icon: Wand2 },
              { id: "scheduler", label: "Automation", icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as StudioTab)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#ff006e] to-[#3a86ff] text-white shadow-md shadow-[#ff006e]/20"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Engine Ready</span>
            </div>
            <button 
              onClick={() => {
                const sample = "https://www.youtube.com/watch?v=sample123"
                setUrl(sample)
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffbe0b]" />
              Demo Clip
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        {/* Top Hero Input Section */}
        <section className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/80 mb-4 backdrop-blur-md">
            <Flame className="w-4 h-4 text-[#ff006e]" />
            <span>เปลี่ยนวิดีโอยาว 1 ชั่วโมง เป็น 4-8 คลิปสั้นไวรัลใน 30 วินาที</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            ตัดต่อคลิปไวรัลอัตโนมัติด้วย{" "}
            <span className="bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] bg-clip-text text-transparent">
              VIRALCUT v2.0
            </span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 mb-8 max-w-xl mx-auto">
            Whisper ถอดเสียงไทย 99% • AI คัดเฉพาะช่วง Hook • Subtitle สไตล์ MrBeast/Hormozi • สเกล 9:16 Auto Face Tracking
          </p>

          {/* Input Box */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-2 sm:p-3 backdrop-blur-2xl shadow-2xl shadow-black/50">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative flex items-center">
                <div className="absolute left-3.5 text-white/40">
                  {platform === "youtube" ? <Youtube className="w-5 h-5 text-red-500" /> : <Music2 className="w-5 h-5 text-[#00f2fe]" />}
                </div>
                <input
                  type="text"
                  placeholder="วางลิงก์ YouTube, TikTok หรือ Podcast ที่นี่..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#ff006e] text-white placeholder-white/30 transition"
                />
              </div>

              <button
                onClick={handleStartProcess}
                disabled={step !== "idle" && step !== "done"}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] hover:opacity-90 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff006e]/25 transition active:scale-95 disabled:opacity-50"
              >
                {step !== "idle" && step !== "done" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังประมวลผล...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>สร้างคลิปไวรัลทันที</span>
                  </>
                )}
              </button>
            </div>

            {/* Config quick toggles */}
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs text-white/60 px-1">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-white/40">จำนวนคลิป:</span>
                  <select 
                    value={clipCount} 
                    onChange={(e) => setClipCount(Number(e.target.value))}
                    className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-white text-xs"
                  >
                    <option value={2}>2 คลิป</option>
                    <option value={4}>4 คลิป</option>
                    <option value={6}>6 คลิป</option>
                    <option value={8}>8 คลิป</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-white/40">ความยาว:</span>
                  <select 
                    value={clipDuration} 
                    onChange={(e) => setClipDuration(e.target.value)}
                    className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-white text-xs"
                  >
                    <option value="15">15s (Shorts)</option>
                    <option value="30">30s (TikTok)</option>
                    <option value="60">60s (Reels)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-white/40">ซับไตเติล:</span>
                  <select 
                    value={clipStyle} 
                    onChange={(e) => setClipStyle(e.target.value as ClipStyle)}
                    className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-white text-xs"
                  >
                    <option value="hormozi">Hormozi (เด้งเขียวเหลือง)</option>
                    <option value="mrbeast">MrBeast (ขอบหนา)</option>
                    <option value="cyberpunk">Cyberpunk Neon</option>
                    <option value="podcast">Podcast Minimal</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={audioNormalize} 
                    onChange={(e) => setAudioNormalize(e.target.checked)}
                    className="rounded accent-[#ff006e]" 
                  />
                  <span>AI Audio Boost</span>
                </label>
              </div>
            </div>
          </div>

          {/* Progress bar when processing */}
          <AnimatePresence>
            {step !== "idle" && step !== "done" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md text-left"
              >
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ff006e]" />
                    {step === "downloading" && "1/4 กำลังดึงข้อมูลวิดีโอระดับความชัด 1080p..."}
                    {step === "transcribing" && "2/4 Whisper AI กำลังถอดเสียงภาษาไทยและจับเวลาคำต่อคำ..."}
                    {step === "analyzing" && "3/4 AI วิเคราะห์หาช่วง Hook, Emotional Peak และ Viral Score..."}
                    {step === "clipping" && "4/4 ตัดต่อ Smart 9:16 พร้อมฝังซับไตเติลสไตล์ Hormozi..."}
                  </span>
                  <span className="text-[#ffbe0b]">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff]"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Viral Clips List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#ff006e]" />
                <h2 className="font-bold text-sm">คลิปไวรัลที่ AI คัดเลือก ({clips.length})</h2>
              </div>
              <span className="text-xs text-white/40">เรียงตาม Viral Score</span>
            </div>

            <div className="space-y-3">
              {clips.map((clip) => {
                const isSelected = selectedClip?.id === clip.id
                return (
                  <motion.div
                    key={clip.id}
                    onClick={() => {
                      setSelectedClip(clip)
                      setCurrentTime(0)
                      setIsPlaying(false)
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-md",
                      isSelected
                        ? "bg-gradient-to-r from-white/[0.08] to-white/[0.03] border-[#ff006e]/80 shadow-lg shadow-[#ff006e]/10"
                        : "bg-white/[0.02] border-white/[0.06] hover:border-white/20"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ff006e] to-[#ffbe0b]" />
                    )}

                    <div className="flex gap-3">
                      {/* Thumbnail with Score badge */}
                      <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-black/60 flex-shrink-0 border border-white/10 group">
                        <img 
                          src={clip.thumbnail} 
                          alt={clip.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-black text-[#ffbe0b] flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 text-[#ff006e]" />
                          {clip.viralScore}
                        </div>
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] text-white/80 font-mono bg-black/60 px-1 py-0.5 rounded text-center">
                          {formatTime(clip.start)} - {formatTime(clip.end)}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#ff006e]/20 text-[#ff006e] border border-[#ff006e]/30">
                              {clip.hook_type || "viral hook"}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {clip.views_prediction}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold line-clamp-1 text-white group-hover:text-[#ffbe0b] transition">
                            {clip.title}
                          </h3>

                          <p className="text-xs text-white/60 line-clamp-2 mt-1 leading-relaxed">
                            &ldquo;{clip.hook}&rdquo;
                          </p>
                        </div>

                        {/* Badges / Reasons */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.04] text-[10px] text-white/50">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {clip.duration}s
                          </span>
                          <span>•</span>
                          <span className="text-white/80 font-medium">
                            {clip.reasons?.[0] || "Hook แรง"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Batch automation shortcut */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#ff006e]/10 via-[#8338ec]/10 to-[#3a86ff]/10 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#ffbe0b]" />
                  <span className="text-xs font-bold">Auto Batch Export</span>
                </div>
                <button 
                  onClick={() => alert("ระบบกำลัง Render ทุกคลิปเป็นไฟล์ MP4 1080x1920 ในพื้นหลัง")}
                  className="px-3 py-1 rounded-full bg-white text-black text-xs font-black hover:bg-white/90 transition"
                >
                  Export All ({clips.length})
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Studio Timeline & Inspector */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Tab Navigation */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                {[
                  { id: "editor", label: "Studio Player & Cropper", icon: Smartphone },
                  { id: "analytics", label: "AI Retention Curve", icon: TrendingUp },
                  { id: "broll", label: "B-Roll & Sound FX", icon: Wand2 },
                  { id: "scheduler", label: "Auto Schedule", icon: Calendar },
                ].map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as StudioTab)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition",
                        activeTab === t.id
                          ? "bg-white/[0.08] text-white border border-white/10"
                          : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  )
                })}
              </div>

              {/* Aspect Ratio Selector */}
              <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5 text-[11px]">
                {(["9:16", "1:1", "16:9"] as AspectRatio[]).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={cn(
                      "px-2 py-0.5 rounded font-bold transition",
                      aspectRatio === ratio
                        ? "bg-[#ff006e] text-white"
                        : "text-white/50 hover:text-white"
                    )}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT: 1. EDITOR */}
            {activeTab === "editor" && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-5 backdrop-blur-xl space-y-5">
                
                {/* Visual Canvas Player Area */}
                <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
                  
                  {/* Smartphone 9:16 Frame */}
                  <div className="relative w-[240px] h-[426px] bg-black rounded-[36px] border-4 border-white/20 shadow-2xl overflow-hidden flex-shrink-0 flex items-center justify-center group">
                    {/* Background image mockup */}
                    <img 
                      src={selectedClip.thumbnail} 
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Safe Zone Overlay */}
                    {showSafeZone && (
                      <div className="absolute inset-0 pointer-events-none z-20 border border-dashed border-red-500/40 rounded-[32px] m-1">
                        {/* Right sidebar icons simulation */}
                        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-3 text-white/80">
                          <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px]">❤️</div>
                          <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px]">💬</div>
                          <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px]">↗️</div>
                        </div>
                        {/* Bottom caption simulation */}
                        <div className="absolute bottom-4 left-3 right-12 text-[9px] text-white/90">
                          <p className="font-bold truncate">@viralcut_official</p>
                          <p className="text-white/60 truncate">{selectedClip.title}</p>
                        </div>
                        {/* Safe zone label */}
                        <div className="absolute top-3 left-3 px-1.5 py-0.5 rounded bg-red-500/80 text-[8px] font-bold text-white uppercase tracking-wider">
                          TikTok Safe Zone
                        </div>
                      </div>
                    )}

                    {/* Subtitle Animated Overlay */}
                    <div className={cn(
                      "absolute left-3 right-3 text-center z-10 pointer-events-none transition-all",
                      subPosition === "bottom" ? "bottom-28" : subPosition === "center" ? "top-1/2 -translate-y-1/2" : "top-16"
                    )}>
                      {clipStyle === "hormozi" && (
                        <div className="inline-block bg-black/70 px-3 py-1.5 rounded-xl border border-white/20 shadow-xl backdrop-blur-sm">
                          <p className="text-sm font-black uppercase text-yellow-300 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] tracking-wide">
                            {currentTime < 4 ? "🔥 " + selectedClip.hook.slice(0, 20) : "⚡ " + selectedClip.transcript.slice(0, 28) + "..."}
                          </p>
                        </div>
                      )}
                      {clipStyle === "mrbeast" && (
                        <div className="text-sm font-black uppercase text-[#ffe600] drop-shadow-[0_4px_0_#000] tracking-wider transform -rotate-1">
                          {selectedClip.hook.slice(0, 25)}!
                        </div>
                      )}
                      {clipStyle === "cyberpunk" && (
                        <div className="text-xs font-mono font-black text-cyan-300 drop-shadow-[0_0_8px_#00f2fe] bg-black/80 px-2 py-1 rounded border border-cyan-400">
                          &gt; {selectedClip.hook.slice(0, 25)}
                        </div>
                      )}
                      {clipStyle === "podcast" && (
                        <div className="text-xs font-medium text-white/95 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-md">
                          {selectedClip.transcript.slice(0, 35)}...
                        </div>
                      )}
                    </div>

                    {/* Play/Pause Button on Hover */}
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition z-30"
                    >
                      <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </div>
                    </button>
                  </div>

                  {/* Right Controls in Editor */}
                  <div className="flex-1 space-y-4 w-full">
                    
                    {/* Playback Scrubber & Timer */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-white/70">
                          {currentTime}s / {selectedClip.duration}s
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setShowSafeZone(!showSafeZone)}
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded border transition",
                              showSafeZone ? "bg-red-500/20 border-red-500/40 text-red-300" : "bg-white/5 border-white/10 text-white/40"
                            )}
                          >
                            Safe Zone Guide
                          </button>
                        </div>
                      </div>

                      {/* Scrubber track */}
                      <input 
                        type="range"
                        min="0"
                        max={selectedClip.duration}
                        step="0.1"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                        className="w-full accent-[#ff006e] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black text-xs font-bold"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          {isPlaying ? "Pause" : "Play Preview"}
                        </button>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSubPosition("top")}
                            className={cn("text-[10px] px-2 py-1 rounded", subPosition === "top" ? "bg-white/20 text-white" : "text-white/40")}
                          >
                            Top
                          </button>
                          <button 
                            onClick={() => setSubPosition("center")}
                            className={cn("text-[10px] px-2 py-1 rounded", subPosition === "center" ? "bg-white/20 text-white" : "text-white/40")}
                          >
                            Center
                          </button>
                          <button 
                            onClick={() => setSubPosition("bottom")}
                            className={cn("text-[10px] px-2 py-1 rounded", subPosition === "bottom" ? "bg-white/20 text-white" : "text-white/40")}
                          >
                            Bottom
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Subtitle Style Chooser */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                      <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                        <Subtitles className="w-3.5 h-3.5 text-[#ffbe0b]" />
                        สไตล์ Subtitle แอนิเมชัน
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { id: "hormozi", name: "Hormozi Pop", desc: "คำเด้งเขียวเหลือง" },
                          { id: "mrbeast", name: "MrBeast Bold", desc: "เหลืองขอบดำหนา" },
                          { id: "cyberpunk", name: "Cyberpunk Glow", desc: "นีออนฟ้าชมพู" },
                          { id: "podcast", name: "Podcast Clean", desc: "มินิมอลขาวโปร่งใส" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setClipStyle(s.id as ClipStyle)}
                            className={cn(
                              "p-2 rounded-xl text-left border transition",
                              clipStyle === s.id
                                ? "bg-gradient-to-r from-[#ff006e]/20 to-[#8338ec]/20 border-[#ff006e] text-white"
                                : "bg-white/[0.02] border-white/[0.06] text-white/60 hover:bg-white/[0.04]"
                            )}
                          >
                            <div className="font-bold">{s.name}</div>
                            <div className="text-[10px] text-white/40">{s.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Export Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => exportCapCut(selectedClip)}
                        disabled={isExporting === "capcut"}
                        className="p-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-white/40 font-bold text-xs flex items-center justify-center gap-2 transition"
                      >
                        {isExporting === "capcut" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4 text-cyan-400" />}
                        <span>Export CapCut Draft</span>
                      </button>

                      <button
                        onClick={() => exportSRT(selectedClip)}
                        disabled={isExporting === "srt"}
                        className="p-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-white/40 font-bold text-xs flex items-center justify-center gap-2 transition"
                      >
                        {isExporting === "srt" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-[#ffbe0b]" />}
                        <span>Download .SRT</span>
                      </button>
                    </div>

                    <button
                      onClick={() => alert(`กำลังดาวน์โหลดคลิป MP4 ความชัด 1080x1920 (9:16) สำหรับ Clip #${selectedClip.id}`)}
                      className="w-full h-11 rounded-2xl bg-gradient-to-r from-[#ff006e] to-[#ffbe0b] font-black text-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff006e]/20 hover:opacity-90 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Clip #{selectedClip.id} (MP4 1080p)</span>
                    </button>
                  </div>
                </div>

                {/* Viral Title & Social Copy Box */}
                <div className="pt-4 border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#ff006e]" />
                      AI Title & Social Caption ที่พร้อมโพสต์
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${selectedClip.title}\n\n${selectedClip.transcript}\n\n${selectedClip.hashtags.join(" ")}`, "full-caption")}
                      className="text-xs text-white/60 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 transition"
                    >
                      {copiedId === "full-caption" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedId === "full-caption" ? "คัดลอกแล้ว!" : "คัดลอกทั้งหมด"}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-2">
                    <div className="font-bold text-white text-sm">{selectedClip.title}</div>
                    <p className="text-white/60 leading-relaxed">{selectedClip.transcript}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedClip.hashtags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.06] text-[#3a86ff] font-medium text-[11px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. RETENTION ANALYTICS */}
            {activeTab === "analytics" && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      AI Retention & Viral Probability Curve
                    </h3>
                    <p className="text-xs text-white/50">วิเคราะห์อัตราคนดูจบ (Audience Retention) และจุดเสี่ยงคนกดเลื่อนผ่าน</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#ffbe0b]">{selectedClip.viralScore}/100</div>
                    <div className="text-[10px] text-white/40">Viral Index</div>
                  </div>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                    <div className="text-[11px] text-white/50 mb-1">Hook Strength</div>
                    <div className="text-xl font-black text-[#ff006e]">{selectedClip.hook_strength || 94}%</div>
                    <div className="text-[10px] text-emerald-400 mt-1">3 วินาทีแรกทรงพลัง</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                    <div className="text-[11px] text-white/50 mb-1">Retention Rate</div>
                    <div className="text-xl font-black text-[#3a86ff]">{selectedClip.retention_probability || 90}%</div>
                    <div className="text-[10px] text-white/40 mt-1">คาดการณ์ดูจบ &gt; 80%</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                    <div className="text-[11px] text-white/50 mb-1">Shareability</div>
                    <div className="text-xl font-black text-emerald-400">{selectedClip.shareability || 88}%</div>
                    <div className="text-[10px] text-white/40 mt-1">กระตุ้นการแชร์สูง</div>
                  </div>
                </div>

                {/* SVG Retention Curve Graph */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>100% (เริ่มต้นคลิป)</span>
                    <span className="text-emerald-400 font-bold">จุดพีคอารมณ์ (+4%)</span>
                    <span>75% (จบ)</span>
                  </div>

                  <div className="h-32 w-full relative flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ff006e" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#ff006e" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 5 Q 60 25, 140 32 T 260 28 Q 320 30, 400 48 L 400 100 L 0 100 Z"
                        fill="url(#retentionGrad)"
                      />
                      <path
                        d="M 0 5 Q 60 25, 140 32 T 260 28 Q 320 30, 400 48"
                        fill="none"
                        stroke="#ff006e"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40 font-mono">
                    <span>0:00</span>
                    <span>0:10</span>
                    <span>0:20</span>
                    <span>0:{selectedClip.duration}</span>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-white/80">คำแนะนำจาก AI เพิ่มยอดวิว (+25%):</div>
                  <div className="space-y-1.5">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2 text-white/70">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>ใส่ Sound Effect "Whoosh" ในวินาทีที่ 0:02 ช่วยดึงความสนใจเพิ่มขึ้น 14%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2 text-white/70">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>ใช้คำถามกระตุ้นความอยากรู้ในแคปชันเพื่อเพิ่มอัตราการคอมเมนต์ใน TikTok</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. B-ROLL & SOUND FX */}
            {activeTab === "broll" && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 backdrop-blur-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-[#ffbe0b]" />
                      B-Roll & Overlay AI Generator
                    </h3>
                    <p className="text-xs text-white/50">AI วิเคราะห์จังหวะคำพูดและแนะนำภาพตัดสลับ (B-Roll) + Sound FX อัตโนมัติ</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(selectedClip.brolls || []).map((broll, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                          ⏱️ {broll.timestamp}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#ffbe0b] px-2 py-0.5 rounded bg-[#ffbe0b]/10 border border-[#ffbe0b]/20">
                          {broll.type}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white">{broll.suggestion}</div>
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-white/60">
                        Prompt: "{broll.prompt}"
                      </div>
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                          🔊 SFX: {broll.sfx}
                        </span>
                        <button 
                          onClick={() => alert(`จำลองการแทรก B-Roll: "${broll.suggestion}" ลงใน Timeline เรียบร้อย`)}
                          className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold hover:bg-white/90"
                        >
                          Auto Insert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 4. SCHEDULER & AUTOMATION */}
            {activeTab === "scheduler" && (
              <AutomationPanel />
            )}

          </div>
        </div>
      </div>
    </main>
  )
}
