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
  Radio, RefreshCw, FileText, CheckCircle2, ExternalLink
} from "lucide-react"
import { cn, formatTime } from "@/lib/utils"
import AutomationPanel from "@/components/AutomationPanel"

type Platform = "youtube" | "upload"
type ProcessingStep = "idle" | "uploading" | "downloading" | "transcribing" | "analyzing" | "done"
type ClipStyle = "hormozi" | "mrbeast" | "cyberpunk" | "podcast"
type AspectRatio = "9:16" | "1:1" | "16:9"
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
  video_url?: string
  youtube_id?: string
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

const defaultMockClips: ViralClip[] = [
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
  }
]

export default function Home() {
  const [url, setUrl] = useState("")
  const [platform, setPlatform] = useState<Platform>("youtube")
  const [step, setStep] = useState<ProcessingStep>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string>("default_project")
  
  // Video sources
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null)
  const [localBlobUrl, setLocalBlobUrl] = useState<string | null>(null)
  const [currentYoutubeId, setCurrentYoutubeId] = useState<string | null>(null)
  
  const [clips, setClips] = useState<ViralClip[]>(defaultMockClips)
  const [selectedClip, setSelectedClip] = useState<ViralClip>(defaultMockClips[0])
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
  const [audioNormalize, setAudioNormalize] = useState(true)
  
  // Real Render State
  const [isRendering, setIsRendering] = useState(false)
  const [renderedClipUrl, setRenderedClipUrl] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Auto sync youtube id when URL changes
  useEffect(() => {
    const yid = extractYouTubeId(url)
    if (yid) {
      setCurrentYoutubeId(yid)
    }
  }, [url])

  // Handle local video time update
  const handleTimeUpdate = () => {
    if (videoRef.current && selectedClip) {
      const vTime = videoRef.current.currentTime
      if (vTime > selectedClip.end) {
        videoRef.current.currentTime = selectedClip.start
      }
      setCurrentTime(Math.max(0, +(vTime - selectedClip.start).toFixed(1)))
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        if (selectedClip && (videoRef.current.currentTime < selectedClip.start || videoRef.current.currentTime > selectedClip.end)) {
          videoRef.current.currentTime = selectedClip.start
        }
        videoRef.current.play()
        setIsPlaying(true)
      }
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedFile(file)
    setPlatform("upload")
    setErrorMessage(null)
    setRenderedClipUrl(null)

    // Create immediate local blob for smooth playback
    const blob = URL.createObjectURL(file)
    setLocalBlobUrl(blob)
    setCurrentYoutubeId(null)

    // Upload to backend
    setStep("uploading")
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        setUploadedFilePath(data.file_path)
      }
    } catch (err) {
      console.log("Uploaded locally, ready for analysis")
    } finally {
      setStep("idle")
    }
  }

  const handleStartProcess = async () => {
    setErrorMessage(null)
    setRenderedClipUrl(null)
    setStep("downloading")

    const yid = extractYouTubeId(url)
    if (yid) {
      setCurrentYoutubeId(yid)
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: platform === "youtube" ? (url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ") : undefined,
          file_path: platform === "upload" ? uploadedFilePath : undefined,
          clipCount,
          clipDuration,
          style: clipStyle,
          aspectRatio,
          faceTracking: true,
          autoSubtitles: true,
          language: "th"
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || "การประมวลผลล้มเหลว")
      }

      const data = await res.json()
      setProjectId(data.project_id || "proj_" + Date.now())
      
      if (data.clips && data.clips.length > 0) {
        const enhancedClips = data.clips.map((c: any) => ({
          ...c,
          thumbnail: yid ? `https://img.youtube.com/vi/${yid}/hqdefault.jpg` : c.thumbnail,
          youtube_id: yid || undefined
        }))
        setClips(enhancedClips)
        setSelectedClip(enhancedClips[0])
      }
      setStep("done")
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || "เกิดข้อผิดพลาดในการวิเคราะห์วิดีโอ")
      setStep("idle")
    }
  }

  const handleRenderRealClip = async (clip: ViralClip) => {
    setIsRendering(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          clip_id: clip.id,
          start: clip.start,
          end: clip.end,
          aspect_ratio: aspectRatio,
          style: clipStyle,
          face_tracking: true,
          audio_normalize: audioNormalize,
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || "FFmpeg Render Failed")
      }

      const data = await res.json()
      setRenderedClipUrl(data.clip_url)

      // Auto download
      const a = document.createElement("a")
      a.href = data.clip_url
      a.download = data.filename || `VIRALCUT_Clip_${clip.id}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err: any) {
      console.error(err)
      setErrorMessage("เกิดข้อผิดพลาดขณะเรนเดอร์ FFmpeg: " + err.message)
    } finally {
      setIsRendering(false)
    }
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
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobUrl
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
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobUrl
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

      {/* Clean Navbar */}
      <header className="relative z-10 border-b border-white/[0.08] backdrop-blur-xl bg-black/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff006e] via-[#8338ec] to-[#3a86ff] flex items-center justify-center shadow-lg shadow-[#ff006e]/25">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-wider bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                VIRALCUT
              </span>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff006e] to-[#ffbe0b] text-black font-extrabold shadow-sm">
                v2.0 PRO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Engine Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        {/* Top Input Section */}
        <section className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/80 mb-4 backdrop-blur-md">
            <Flame className="w-4 h-4 text-[#ff006e]" />
            <span>AI ตัดต่อคลิปสั้นไวรัล YouTube & TikTok อัตโนมัติใน 30 วินาที</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            สร้างคลิปสั้นไวรัลด้วย{" "}
            <span className="bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] bg-clip-text text-transparent">
              VIRALCUT v2.0
            </span>
          </h1>

          {/* Platform Toggle */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setPlatform("youtube")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2",
                platform === "youtube" ? "bg-red-500/20 border-red-500 text-white" : "bg-white/[0.03] border-white/10 text-white/60"
              )}
            >
              <Youtube className="w-4 h-4 text-red-500" />
              YouTube / TikTok URL
            </button>
            <button
              onClick={() => {
                setPlatform("upload")
                fileInputRef.current?.click()
              }}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2",
                platform === "upload" ? "bg-[#3a86ff]/20 border-[#3a86ff] text-white" : "bg-white/[0.03] border-white/10 text-white/60"
              )}
            >
              <Upload className="w-4 h-4 text-[#3a86ff]" />
              {uploadedFile ? uploadedFile.name : "อัปโหลดไฟล์วิดีโอจากเครื่อง"}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="video/mp4,video/quicktime,video/webm" 
              className="hidden" 
            />
          </div>

          {/* Input Box */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 backdrop-blur-2xl shadow-2xl shadow-black/50">
            <div className="flex flex-col sm:flex-row gap-2">
              {platform === "upload" ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 h-12 bg-black/40 border border-dashed border-white/20 hover:border-[#3a86ff] rounded-xl flex items-center justify-center gap-2 text-xs text-white/70 cursor-pointer transition px-4"
                >
                  <FileVideo className="w-4 h-4 text-[#3a86ff]" />
                  <span>{uploadedFile ? `เลือกไฟล์: ${uploadedFile.name} (${(uploadedFile.size / (1024*1024)).toFixed(1)} MB)` : "คลิกเพื่อเลือกไฟล์วิดีโอ (.mp4, .mov)"}</span>
                </div>
              ) : (
                <div className="flex-1 relative flex items-center">
                  <div className="absolute left-3.5 text-white/40">
                    <Youtube className="w-5 h-5 text-red-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="วางลิงก์ YouTube (เช่น https://www.youtube.com/watch?v=...)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#ff006e] text-white placeholder-white/30 transition"
                  />
                </div>
              )}

              <button
                onClick={handleStartProcess}
                disabled={step !== "idle" && step !== "done"}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] hover:opacity-90 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff006e]/25 transition active:scale-95 disabled:opacity-50"
              >
                {step !== "idle" && step !== "done" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังวิเคราะห์...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>ประมวลผลคลิป</span>
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
                  <span className="text-white/40">สไตล์ซับไตเติล:</span>
                  <select 
                    value={clipStyle} 
                    onChange={(e) => setClipStyle(e.target.value as ClipStyle)}
                    className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-white text-xs"
                  >
                    <option value="hormozi">Hormozi (เด้งเขียวเหลือง)</option>
                    <option value="mrbeast">MrBeast (ขอบดำหนา)</option>
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
                  <span>Audio Loudnorm</span>
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Processing Steps Indicator */}
          <AnimatePresence>
            {step !== "idle" && step !== "done" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin text-[#ff006e]" />
                  <span>
                    {step === "uploading" && "กำลังอัปโหลดวิดีโอเข้าสู่ระบบ..."}
                    {step === "downloading" && "กำลังดึงข้อมูลและเตรียมวิดีโอ..."}
                    {step === "transcribing" && "Whisper AI กำลังถอดเสียงและจับเวลาคำ..."}
                    {step === "analyzing" && "AI กำลังคำนวณ Viral Score และหาช่วง Hook..."}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Studio Workspace */}
        <div className="space-y-6">

          {/* Clean Sub-nav Tab Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
              {[
                { id: "editor", label: "Studio Player", icon: Film },
                { id: "analytics", label: "AI Retention Curve", icon: BarChart3 },
                { id: "broll", label: "B-Roll AI", icon: Wand2 },
                { id: "scheduler", label: "Automation", icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as StudioTab)}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition",
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

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">อัตราส่วน:</span>
              <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5 text-[11px]">
                {(["9:16", "1:1", "16:9"] as AspectRatio[]).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={cn(
                      "px-2.5 py-1 rounded-md font-bold transition",
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
          </div>

          {/* Studio Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Viral Clips List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#ff006e]" />
                  <h2 className="font-bold text-sm">คลิปไวรัลที่ประมวลผล ({clips.length})</h2>
                </div>
                <span className="text-xs text-white/40">เรียงตาม Viral Score</span>
              </div>

              <div className="space-y-3">
                {clips.map((clip) => {
                  const isSelected = selectedClip?.id === clip.id
                  const yid = clip.youtube_id || currentYoutubeId
                  const thumb = yid ? `https://img.youtube.com/vi/${yid}/hqdefault.jpg` : clip.thumbnail

                  return (
                    <motion.div
                      key={clip.id}
                      onClick={() => {
                        setSelectedClip(clip)
                        setRenderedClipUrl(null)
                        if (videoRef.current) {
                          videoRef.current.currentTime = clip.start
                        }
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
                        <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10 group">
                          <img 
                            src={thumb} 
                            alt={clip.title}
                            onError={(e) => {
                              // fallback
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611162616805-6396b235a6a6?w=400"
                            }}
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

                            <h3 className="text-sm font-bold line-clamp-1 text-white">
                              {clip.title}
                            </h3>

                            <p className="text-xs text-white/60 line-clamp-2 mt-1 leading-relaxed">
                              &ldquo;{clip.hook}&rdquo;
                            </p>
                          </div>

                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.04] text-[10px] text-white/50">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {clip.duration}s
                            </span>
                            <span>•</span>
                            <span className="text-white/80 font-medium truncate">
                              {clip.reasons?.[0] || "Hook แรง"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Studio Timeline & Inspector */}
            <div className="lg:col-span-7 space-y-4">

              {/* TAB 1: STUDIO PLAYER */}
              {activeTab === "editor" && selectedClip && (
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-5 backdrop-blur-xl space-y-5">
                  
                  {/* Visual Canvas Player Area */}
                  <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
                    
                    {/* Smartphone Frame (Interactive Player) */}
                    <div className="relative w-[240px] h-[426px] bg-black rounded-[36px] border-4 border-white/20 shadow-2xl overflow-hidden flex-shrink-0 flex items-center justify-center group">
                      
                      {/* 1. If rendered clip exists, play real rendered MP4 */}
                      {renderedClipUrl ? (
                        <video
                          ref={videoRef}
                          src={renderedClipUrl}
                          controls
                          autoPlay
                          loop
                          className="absolute inset-0 w-full h-full object-cover z-10"
                        />
                      ) : localBlobUrl ? (
                        /* 2. If uploaded local file, play HTML5 video */
                        <video
                          ref={videoRef}
                          src={localBlobUrl}
                          onTimeUpdate={handleTimeUpdate}
                          playsInline
                          loop
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (selectedClip.youtube_id || currentYoutubeId) ? (
                        /* 3. If YouTube URL, embed real interactive YouTube player */
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-black">
                          <iframe
                            key={`${selectedClip.youtube_id || currentYoutubeId}_${selectedClip.start}`}
                            src={`https://www.youtube.com/embed/${selectedClip.youtube_id || currentYoutubeId}?start=${Math.round(selectedClip.start)}&end=${Math.round(selectedClip.end)}&autoplay=0&controls=1&rel=0&playsinline=1`}
                            title="YouTube Player"
                            className="w-[300%] h-full pointer-events-auto"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        /* 4. Fallback thumbnail */
                        <img 
                          src={selectedClip.thumbnail} 
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover opacity-85"
                        />
                      )}

                      {/* Safe Zone Overlay Guide */}
                      {showSafeZone && (
                        <div className="absolute inset-0 pointer-events-none z-20 border border-dashed border-red-500/40 rounded-[32px] m-1">
                          <div className="absolute right-2 bottom-20 flex flex-col items-center gap-3 text-white/80">
                            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px]">❤️</div>
                            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px]">💬</div>
                            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px]">↗️</div>
                          </div>
                          <div className="absolute bottom-4 left-3 right-12 text-[9px] text-white/90">
                            <p className="font-bold truncate">@viralcut_creator</p>
                            <p className="text-white/60 truncate">{selectedClip.title}</p>
                          </div>
                          <div className="absolute top-3 left-3 px-1.5 py-0.5 rounded bg-red-500/80 text-[8px] font-bold text-white uppercase tracking-wider">
                            TikTok Safe Zone
                          </div>
                        </div>
                      )}

                      {/* Animated Subtitle Overlay (if not rendered yet) */}
                      {!renderedClipUrl && !selectedClip.youtube_id && !currentYoutubeId && (
                        <div className={cn(
                          "absolute left-3 right-3 text-center z-10 pointer-events-none transition-all",
                          subPosition === "bottom" ? "bottom-28" : subPosition === "center" ? "top-1/2 -translate-y-1/2" : "top-16"
                        )}>
                          {clipStyle === "hormozi" && (
                            <div className="inline-block bg-black/70 px-3 py-1.5 rounded-xl border border-white/20 shadow-xl backdrop-blur-sm">
                              <p className="text-sm font-black uppercase text-yellow-300 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] tracking-wide">
                                {currentTime < 3 ? "🔥 " + selectedClip.hook.slice(0, 20) : "⚡ " + selectedClip.transcript.slice(0, 28) + "..."}
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
                      )}
                    </div>

                    {/* Right Controls in Editor */}
                    <div className="flex-1 space-y-4 w-full">
                      
                      {/* Playback Controls & Safe Zone */}
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-white/70">
                            ช่วงเวลาคลิป: {formatTime(selectedClip.start)} - {formatTime(selectedClip.end)} ({selectedClip.duration}s)
                          </span>
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

                        {/* If local video, show time scrubber */}
                        {localBlobUrl && (
                          <input 
                            type="range"
                            min="0"
                            max={selectedClip.duration}
                            step="0.1"
                            value={currentTime}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value)
                              setCurrentTime(val)
                              if (videoRef.current) {
                                videoRef.current.currentTime = selectedClip.start + val
                              }
                            }}
                            className="w-full accent-[#ff006e] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                          />
                        )}

                        <div className="flex items-center justify-between pt-1">
                          {localBlobUrl ? (
                            <button
                              onClick={togglePlay}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black text-xs font-bold"
                            >
                              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              {isPlaying ? "Pause" : "Play Local Video"}
                            </button>
                          ) : (
                            <span className="text-[11px] text-white/60">
                              ▶️ กดปุ่ม Play บนหน้าจอจำลองเพื่อดูคลิปจริง
                            </span>
                          )}

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/40">ตำแหน่งซับ:</span>
                            <button 
                              onClick={() => setSubPosition("top")}
                              className={cn("text-[10px] px-2 py-0.5 rounded", subPosition === "top" ? "bg-white/20 text-white font-bold" : "text-white/40")}
                            >
                              บน
                            </button>
                            <button 
                              onClick={() => setSubPosition("center")}
                              className={cn("text-[10px] px-2 py-0.5 rounded", subPosition === "center" ? "bg-white/20 text-white font-bold" : "text-white/40")}
                            >
                              กลาง
                            </button>
                            <button 
                              onClick={() => setSubPosition("bottom")}
                              className={cn("text-[10px] px-2 py-0.5 rounded", subPosition === "bottom" ? "bg-white/20 text-white font-bold" : "text-white/40")}
                            >
                              ล่าง
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Subtitle Style Chooser */}
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                        <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                          <Subtitles className="w-3.5 h-3.5 text-[#ffbe0b]" />
                          สไตล์ Subtitle แอนิเมชัน (FFmpeg Burn)
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
                              onClick={() => {
                                setClipStyle(s.id as ClipStyle)
                                setRenderedClipUrl(null)
                              }}
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

                      {/* Export Draft & SRT */}
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

                      {/* Real FFmpeg Render & Download */}
                      <button
                        onClick={() => handleRenderRealClip(selectedClip)}
                        disabled={isRendering}
                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#ff006e] to-[#ffbe0b] font-black text-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff006e]/20 hover:opacity-90 transition disabled:opacity-50"
                      >
                        {isRendering ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>FFmpeg กำลังตัดต่อและเบิร์นซับ...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>เรนเดอร์และดาวน์โหลดคลิป MP4 จริง (1080x1920)</span>
                          </>
                        )}
                      </button>

                      {renderedClipUrl && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            เรนเดอร์ MP4 สำเร็จเรียบร้อย!
                          </span>
                          <a 
                            href={renderedClipUrl} 
                            download 
                            className="underline font-bold text-white hover:text-emerald-300"
                          >
                            คลิกดาวน์โหลดอีกครั้ง
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Viral Title & Social Copy Box */}
                  <div className="pt-4 border-t border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#ff006e]" />
                        AI Title & Social Caption
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

              {/* TAB 2: RETENTION ANALYTICS */}
              {activeTab === "analytics" && selectedClip && (
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
                </div>
              )}

              {/* TAB 3: B-ROLL */}
              {activeTab === "broll" && selectedClip && (
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SCHEDULER */}
              {activeTab === "scheduler" && (
                <AutomationPanel />
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
