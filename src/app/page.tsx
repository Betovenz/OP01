"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Youtube, Music2, Upload, Sparkles, Scissors, 
  Play, Download, Clock, Flame, Eye, 
  Settings2, Wand2, Subtitles, Smartphone,
  Zap, TrendingUp, Hash, Copy, Check,
  FileVideo, AlertCircle, Loader2, X,
  Volume2, Target, Brain, Layers
} from "lucide-react"
import { cn, formatTime } from "@/lib/utils"

type Platform = "youtube" | "tiktok" | "upload" | null
type ProcessingStep = "idle" | "downloading" | "transcribing" | "analyzing" | "clipping" | "done"
type ClipStyle = "mrbeast" | "hormozi" | "podcast" | "minimal"

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
}

const mockClips: ViralClip[] = [
  {
    id: "1",
    start: 42,
    end: 67,
    duration: 25,
    viralScore: 96,
    hook: "ความลับที่ไม่มีใครบอกคุณ...",
    transcript: "ความลับที่ไม่มีใครบอกคุณเกี่ยวกับการทำเงินออนไลน์ คือทุกคนโฟกัสผิดจุด คุณไม่ต้องมีสินค้า ไม่ต้องมีทุน แค่ต้องเข้าใจสิ่งนี้",
    title: "ความลับทำเงินออนไลน์ที่ไม่มีใครบอก 🤫",
    hashtags: ["#หาเงินออนไลน์", "#ธุรกิจ", "#เคล็ดลับ"],
    thumbnail: "https://images.unsplash.com/photo-1611162616805-6396b235a6a6?w=400",
    views_prediction: "500K-1M"
  },
  {
    id: "2",
    start: 128,
    end: 158,
    duration: 30,
    viralScore: 92,
    hook: "หยุดทำแบบนี้เดี๋ยวนี้!",
    transcript: "ถ้าคุณยังทำ 3 สิ่งนี้อยู่ คุณจะไม่มีวันรวย หยุดเดี๋ยวนี้เลย อันดับแรกคือการตื่นสาย อันดับสองคือ...",
    title: "หยุดทำ 3 สิ่งนี้ถ้าอยากรวย 💸",
    hashtags: ["#พัฒนาตัวเอง", "#ความสำเร็จ", "#mindset"],
    thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
    views_prediction: "300K-600K"
  },
  {
    id: "3",
    start: 245,
    end: 270,
    duration: 25,
    viralScore: 89,
    hook: "ผมลองแล้วได้ผลจริง 100%",
    transcript: "ผมลองวิธีนี้มา 30 วัน จาก 0 ผู้ติดตาม ตอนนี้มี 100K แล้ว วิธีคือการโพสต์วันละ 3 ครั้งในเวลาที่คนดูเยอะที่สุด",
    title: "0 ถึง 100K ใน 30 วัน ทำยังไง? 🚀",
    hashtags: ["#tiktok", "#grow", "#ไวรัล"],
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    views_prediction: "200K-400K"
  },
  {
    id: "4",
    start: 312,
    end: 335,
    duration: 23,
    viralScore: 87,
    hook: "AI จะมาแทนที่คุณใน 6 เดือน",
    transcript: "ถ้าคุณทำงานแบบนี้ AI จะมาแทนที่คุณแน่นอนใน 6 เดือนข้างหน้า ผมไม่ได้ขู่ แต่มันคือความจริงที่ต้องเตรียมตัว",
    title: "งานแบบไหน AI จะแทนที่? 😱",
    hashtags: ["#AI", "#อนาคต", "#เทคโนโลยี"],
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
    views_prediction: "400K-800K"
  }
]

export default function Home() {
  const [url, setUrl] = useState("")
  const [platform, setPlatform] = useState<Platform>(null)
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("idle")
  const [progress, setProgress] = useState(0)
  const [clips, setClips] = useState<ViralClip[]>([])
  const [selectedClip, setSelectedClip] = useState<ViralClip | null>(null)
  const [clipCount, setClipCount] = useState(4)
  const [clipDuration, setClipDuration] = useState("30")
  const [aspectRatio, setAspectRatio] = useState("9:16")
  const [style, setStyle] = useState<ClipStyle>("mrbeast")
  const [autoSubtitles, setAutoSubtitles] = useState(true)
  const [faceTracking, setFaceTracking] = useState(true)
  const [viralFilter, setViralFilter] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState("")
  const [videoDuration, setVideoDuration] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Detect platform from URL
  useEffect(() => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      setPlatform("youtube")
    } else if (url.includes("tiktok.com")) {
      setPlatform("tiktok")
    } else if (url.length > 5) {
      setPlatform(null)
    } else {
      setPlatform(null)
    }
  }, [url])

  const handleProcess = async () => {
    if (!url && platform !== "upload") return
    
    setProcessingStep("downloading")
    setProgress(0)
    setClips([])
    setVideoTitle("กำลังวิเคราะห์วิดีโอ...")
    
    // Simulate pipeline
    const steps: ProcessingStep[] = ["downloading", "transcribing", "analyzing", "clipping"]
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i])
      for (let p = 0; p <= 100; p += 5) {
        setProgress(p)
        await new Promise(r => setTimeout(r, 30 + Math.random() * 50))
      }
      if (i === 0) setVideoTitle("How I Built a $10M Business in 1 Year - Full Podcast")
      if (i === 1) setVideoDuration(1847)
    }
    
    setProcessingStep("done")
    setClips(mockClips.slice(0, clipCount))
    
    // Try real backend if available
    try {
      const res = await fetch("/api/python/analyze", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ url, clipCount, clipDuration, style })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.clips) setClips(data.clips)
      }
    } catch (e) {
      console.log("Backend not available, using mock")
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-[#00ff88] border-[#00ff88] bg-[#00ff88]/10"
    if (score >= 80) return "text-[#ffbe0b] border-[#ffbe0b] bg-[#ffbe0b]/10"
    return "text-[#ff006e] border-[#ff006e] bg-[#ff006e]/10"
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff006e]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3a86ff]/20 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] left-[50%] w-[30%] h-[30%] bg-[#ffbe0b]/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.08] backdrop-blur-xl bg-black/20">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff006e] to-[#ffbe0b] flex items-center justify-center">
              <Scissors className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight">VIRALCUT</h1>
              <p className="text-[10px] text-white/50 -mt-1 tracking-widest">AI CLIP FACTORY</p>
            </div>
            <div className="ml-6 hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08]">
              <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-xs text-white/70">AI Engine Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-6 text-sm text-white/60 mr-6">
              <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-[#ff006e]" /> 2,847 คลิปวันนี้</span>
              <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> 12.4M วิว</span>
            </div>
            <button className="px-4 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition">
              อัพเกรด PRO
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff006e]/20 to-[#3a86ff]/20 border border-white/10 text-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#ffbe0b]" />
            <span>AI ใหม่! ตรวจจับช็อตไวรัลแม่นยำ 94% + Auto Hook</span>
            <span className="px-2 py-0.5 rounded-full bg-[#ff006e] text-white text-xs font-bold ml-2">NEW</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-4"
          >
            เปลี่ยนวิดีโอยาว
            <br />
            <span className="gradient-text">เป็นคลิปไวรัล</span>
            <br />
            ใน 30 วินาที
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto text-lg"
          >
            วางลิงก์ YouTube หรือ TikTok → AI วิเคราะห์หา <span className="text-white font-bold">ช็อตเด็ด</span> → ตัดต่อ 9:16 + ซับไตเติ้ล + Hook อัตโนมัติ พร้อมโพสต์
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          {/* Left: Input & Settings */}
          <div className="space-y-6">
            {/* URL Input */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-[24px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <FileVideo className="w-4 h-4" />
                </div>
                <h2 className="font-bold">1. ใส่วิดีโอต้นฉบับ</h2>
                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30">รองรับ 4K</span>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {platform === "youtube" && <Youtube className="w-5 h-5 text-[#ff0000]" />}
                  {platform === "tiktok" && <Music2 className="w-5 h-5 text-white" />}
                  {!platform && <div className="w-5 h-5 rounded-full bg-white/20" />}
                </div>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="วางลิงก์ YouTube, TikTok หรือ youtu.be/..."
                  className="w-full h-[56px] pl-12 pr-[140px] rounded-full bg-black border border-white/10 focus:border-[#ff006e]/50 focus:outline-none text-white placeholder:text-white/30 transition"
                />
                <button
                  onClick={handleProcess}
                  disabled={!url && platform !== "upload"}
                  className="absolute right-2 top-2 h-[40px] px-6 rounded-full bg-white text-black font-black text-sm hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition"
                >
                  {processingStep !== "idle" && processingStep !== "done" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  ตัดคลิปเลย
                </button>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/30">หรือ</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <button 
                  onClick={() => setPlatform("youtube")}
                  className={cn("h-[72px] rounded-2xl border flex flex-col items-center justify-center gap-2 transition", 
                    platform === "youtube" ? "bg-[#ff0000]/10 border-[#ff0000]/30 text-white" : "bg-white/[0.03] border-white/[0.06] text-white/60 hover:bg-white/[0.06]"
                  )}
                >
                  <Youtube className="w-6 h-6" />
                  <span className="text-xs font-bold">YouTube</span>
                </button>
                <button 
                  onClick={() => setPlatform("tiktok")}
                  className={cn("h-[72px] rounded-2xl border flex flex-col items-center justify-center gap-2 transition", 
                    platform === "tiktok" ? "bg-white/10 border-white/20 text-white" : "bg-white/[0.03] border-white/[0.06] text-white/60 hover:bg-white/[0.06]"
                  )}
                >
                  <Music2 className="w-6 h-6" />
                  <span className="text-xs font-bold">TikTok</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-[72px] rounded-2xl border bg-white/[0.03] border-white/[0.06] text-white/60 hover:bg-white/[0.06] flex flex-col items-center justify-center gap-2 transition"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-xs font-bold">อัพโหลดไฟล์</span>
                  <input ref={fileInputRef} type="file" accept="video/*" className="hidden" />
                </button>
              </div>

              {/* Processing Pipeline */}
              <AnimatePresence>
                {processingStep !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 overflow-hidden"
                  >
                    <div className="rounded-2xl bg-black/50 border border-white/10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold flex items-center gap-2">
                          <Brain className="w-4 h-4 text-[#ffbe0b]" />
                          {processingStep === "downloading" && "กำลังดาวน์โหลดวิดีโอ..."}
                          {processingStep === "transcribing" && "AI กำลังถอดเสียง (Whisper)..."}
                          {processingStep === "analyzing" && "AI วิเคราะห์หาจุดไวรัล..."}
                          {processingStep === "clipping" && "กำลังตัดต่อคลิป + ใส่ซับ..."}
                          {processingStep === "done" && "เสร็จแล้ว! พร้อมไวรัล"}
                        </span>
                        <span className="text-xs text-white/50">{progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#ff006e] to-[#ffbe0b]"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {[
                          { id: "downloading", label: "ดาวน์โหลด", icon: Download },
                          { id: "transcribing", label: "ถอดเสียง", icon: Subtitles },
                          { id: "analyzing", label: "หาไวรัล", icon: Target },
                          { id: "clipping", label: "ตัดต่อ", icon: Scissors },
                        ].map((step, idx) => {
                          const isActive = processingStep === step.id
                          const isDone = ["downloading","transcribing","analyzing","clipping","done"].indexOf(processingStep) > idx || processingStep === "done"
                          return (
                            <div key={step.id} className={cn("rounded-xl border p-2.5 flex flex-col items-center gap-1.5 transition",
                              isActive ? "bg-white text-black border-white" : isDone ? "bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]" : "bg-white/[0.03] border-white/[0.06] text-white/40"
                            )}>
                              <step.icon className="w-4 h-4" />
                              <span className="text-[10px] font-bold">{step.label}</span>
                            </div>
                          )
                        })}
                      </div>
                      {videoTitle && (
                        <div className="mt-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ff006e] to-[#3a86ff] flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{videoTitle}</p>
                            <p className="text-xs text-white/50">{videoDuration ? formatTime(videoDuration) : "12:34"} • 1080p • 245MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Settings */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-[24px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <Settings2 className="w-5 h-5" />
                <h2 className="font-bold">2. ตั้งค่าคลิปไวรัล</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs text-white/50 mb-2 block">จำนวนคลิปที่ต้องการ</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1,2,4,8].map(n => (
                      <button
                        key={n}
                        onClick={() => setClipCount(n)}
                        className={cn("h-10 rounded-full border text-sm font-bold transition",
                          clipCount === n ? "bg-white text-black border-white" : "bg-white/[0.06] border-white/10 text-white/70 hover:bg-white/[0.10]"
                        )}
                      >
                        {n} คลิป
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">ความยาวคลิป</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["15","30","60"].map(d => (
                        <button
                          key={d}
                          onClick={() => setClipDuration(d)}
                          className={cn("h-10 rounded-full border text-sm font-bold transition",
                            clipDuration === d ? "bg-white text-black" : "bg-white/[0.06] border-white/10 text-white/70"
                          )}
                        >
                          {d}s
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">ขนาดวิดีโอ</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["9:16","16:9"].map(r => (
                        <button
                          key={r}
                          onClick={() => setAspectRatio(r)}
                          className={cn("h-10 rounded-full border text-sm font-bold flex items-center justify-center gap-1.5 transition",
                            aspectRatio === r ? "bg-white text-black" : "bg-white/[0.06] border-white/10 text-white/70"
                          )}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-2 block">สไตล์ซับไตเติ้ล</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "mrbeast", name: "MrBeast", desc: "ตัวใหญ่ เด้งๆ" },
                      { id: "hormozi", name: "Hormozi", desc: "เข้ม ตัวหนา" },
                      { id: "podcast", name: "Podcast", desc: "2 คน แยกสี" },
                      { id: "minimal", name: "Minimal", desc: "มินิมอล สะอาด" },
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => setStyle(s.id as ClipStyle)}
                        className={cn("rounded-2xl border p-3 text-left transition",
                          style === s.id ? "bg-white text-black border-white" : "bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.08]"
                        )}
                      >
                        <div className="font-bold text-sm">{s.name}</div>
                        <div className={cn("text-xs", style === s.id ? "text-black/60" : "text-white/40")}>{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10">
                  {[
                    { key: "sub", label: "Auto ซับไตเติ้ลไทย + อังกฤษ", desc: "Whisper AI แม่น 95%", value: autoSubtitles, setter: setAutoSubtitles, icon: Subtitles },
                    { key: "face", label: "Face Tracking 9:16", desc: "ตามหน้า ไม่ตัดหัว", value: faceTracking, setter: setFaceTracking, icon: Target },
                    { key: "viral", label: "Viral Filter + Hook", desc: "กรองแต่ช็อตเด็ด", value: viralFilter, setter: setViralFilter, icon: Flame },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">{item.label}</div>
                          <div className="text-xs text-white/40">{item.desc}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => item.setter(!item.value)}
                        className={cn("w-11 h-6 rounded-full p-1 transition", item.value ? "bg-white" : "bg-white/20")}
                      >
                        <div className={cn("w-4 h-4 rounded-full bg-black transition-transform", item.value ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-[24px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl p-6 min-h-[600px]"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff006e] to-[#ffbe0b] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-black" />
                  </div>
                  <h2 className="font-bold">3. คลิปไวรัลที่ AI หาให้</h2>
                </div>
                {clips.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/20">{clips.length} คลิป</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/60">{clips.reduce((a,b)=>a+b.duration,0)}s รวม</span>
                  </div>
                )}
              </div>

              {clips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-[24px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                    <Layers className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="font-bold mb-2">ยังไม่มีคลิป</h3>
                  <p className="text-sm text-white/40 max-w-[280px]">วางลิงก์ YouTube หรือ TikTok ด้านบน แล้วกดตัดคลิปเลย AI จะหาแต่ช็อตที่มีโอกาสไวรัลให้</p>
                  <div className="grid grid-cols-3 gap-2 mt-8 w-full max-w-[320px]">
                    {[
                      { icon: Brain, label: "วิเคราะห์อารมณ์" },
                      { icon: TrendingUp, label: "ทำนายยอดวิว" },
                      { icon: Hash, label: "สร้างแคปชั่น" },
                    ].map(f => (
                      <div key={f.label} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 flex flex-col items-center gap-2">
                        <f.icon className="w-5 h-5 text-white/30" />
                        <span className="text-[10px] text-white/40 font-bold">{f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {clips.map((clip, idx) => (
                    <motion.div
                      key={clip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative rounded-[20px] bg-black border border-white/[0.08] overflow-hidden hover:border-white/20 transition"
                    >
                      <div className="flex gap-4 p-4">
                        {/* Thumbnail */}
                        <div className="relative w-[120px] h-[160px] rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                          <img src={clip.thumbnail} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-white bg-black/60 backdrop-blur px-2 py-1 rounded-full w-fit">
                              <Clock className="w-3 h-3" />
                              {formatTime(clip.start)} - {formatTime(clip.end)}
                            </div>
                          </div>
                          <div className={cn("absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-black border backdrop-blur", getScoreColor(clip.viralScore))}>
                            {clip.viralScore}% VIRAL
                          </div>
                          <button 
                            onClick={() => setSelectedClip(clip)}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
                          >
                            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                              <Play className="w-5 h-5 ml-0.5" />
                            </div>
                          </button>
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-[15px] leading-tight line-clamp-2">{clip.title}</h3>
                            <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/60 whitespace-nowrap">{clip.duration}s</span>
                          </div>
                          
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff006e]/10 border border-[#ff006e]/20 text-[#ff8fab] text-xs font-bold mb-2.5">
                            <Flame className="w-3 h-3" />
                            HOOK: {clip.hook}
                          </div>

                          <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-3">
                            &quot;{clip.transcript}&quot;
                          </p>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {clip.hashtags.map(tag => (
                              <span key={tag} className="text-[11px] px-2 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60">
                                {tag}
                              </span>
                            ))}
                            <span className="text-[11px] px-2 py-1 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {clip.views_prediction}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => setSelectedClip(clip)}
                              className="flex-1 h-9 rounded-full bg-white text-black text-xs font-black flex items-center justify-center gap-1.5 hover:bg-white/90 transition"
                            >
                              <Play className="w-3.5 h-3.5" />
                              ดูตัวอย่าง
                            </button>
                            <button className="h-9 px-4 rounded-full bg-white/[0.08] border border-white/10 text-xs font-bold hover:bg-white/[0.12] transition flex items-center gap-1.5">
                              <Download className="w-3.5 h-3.5" />
                              โหลด
                            </button>
                            <button 
                              onClick={() => copyToClipboard(clip.title + "\n\n" + clip.hashtags.join(" "), clip.id)}
                              className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center hover:bg-white/[0.12] transition"
                            >
                              {copiedId === clip.id ? <Check className="w-4 h-4 text-[#00ff88]" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="h-12 rounded-full bg-white text-black font-black text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition">
                      <Download className="w-4 h-4" />
                      โหลดทั้งหมด ({clips.length})
                    </button>
                    <button className="h-12 rounded-full bg-[#ff006e] text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-[#ff006e]/90 transition">
                      <Sparkles className="w-4 h-4" />
                      สร้างโพสต์อัตโนมัติ
                    </button>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-br from-[#ff006e]/10 via-[#ffbe0b]/10 to-[#3a86ff]/10 border border-white/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                      <span className="text-sm font-bold">AI Insight</span>
                      <span className="ml-auto text-xs px-2 py-1 rounded-full bg-[#00ff88]/20 text-[#00ff88]">ทำนายแม่น 94%</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      คลิป #1 มีโอกาสไวรัลสูงสุด เพราะมี <span className="text-white font-bold">Hook แบบ Curiosity Gap</span> + คำว่า &quot;ความลับ&quot; ทำให้คนหยุดดู ควรโพสต์เวลา 19:00-21:00 และใช้เสียงเพลง trending
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Volume2, title: "ลบคำฟุ่มเฟือย", desc: "อืม เอ่อ อะไรนะ" },
                { icon: Scissors, title: "Jump Cut อัตโนมัติ", desc: "ตัดเงียบออก" },
                { icon: Sparkles, title: "B-Roll AI", desc: "ใส่ภาพประกอบ" },
              ].map(f => (
                <div key={f.title} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4">
                  <f.icon className="w-5 h-5 mb-2 text-white/60" />
                  <div className="text-xs font-bold">{f.title}</div>
                  <div className="text-[11px] text-white/40">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-[32px] bg-gradient-to-br from-white to-white/80 text-black p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-black tracking-tight leading-none mb-2">พร้อมทำคลิปไวรัล<br/>วันละ 10 คลิปไหม?</h3>
            <p className="text-black/60">ใช้โดยครีเอเตอร์กว่า 12,000 คน • ประหยัดเวลาตัดต่อ 90%</p>
          </div>
          <div className="flex gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-sm">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#ff006e] to-[#ffbe0b]" />
                ))}
              </div>
              <span className="font-bold">4.9/5 จาก 2.4k รีวิว</span>
            </div>
            <button className="h-12 px-8 rounded-full bg-black text-white font-black hover:bg-black/90 transition">
              เริ่มฟรีเลย →
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-white/20">
          รองรับ YouTube • TikTok • Instagram Reels • Facebook • Podcast • ไฟล์ MP4/MOV • 4K • Auto Thai/Eng Subtitles
        </div>
      </main>

      {/* Clip Preview Modal */}
      <AnimatePresence>
        {selectedClip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
            onClick={() => setSelectedClip(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-[960px] rounded-[24px] bg-[#111] border border-white/10 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={cn("px-3 py-1 rounded-full text-xs font-black border", getScoreColor(selectedClip.viralScore))}>
                    VIRAL SCORE {selectedClip.viralScore}%
                  </div>
                  <span className="text-sm font-bold">{selectedClip.title}</span>
                </div>
                <button onClick={() => setSelectedClip(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-[320px_1fr] gap-0">
                <div className="aspect-[9/16] bg-black relative overflow-hidden">
                  <img src={selectedClip.thumbnail} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    <div className="flex justify-between">
                      <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur text-xs font-bold">
                        {formatTime(selectedClip.start)} - {formatTime(selectedClip.end)}
                      </div>
                      <div className="px-2 py-1 rounded-full bg-[#ff006e] text-white text-xs font-black">9:16</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-center">
                        <div className="inline-block px-4 py-2 rounded-xl bg-[#ff006e] text-white font-black text-lg leading-none shadow-[0_0_20px_rgba(255,0,110,0.5)]">
                          {selectedClip.hook}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="inline-block px-3 py-2 rounded-lg bg-black/80 backdrop-blur text-white font-bold text-sm border border-white/20">
                          {selectedClip.transcript.slice(0, 60)}...
                        </div>
                      </div>
                      <div className="flex justify-center gap-2">
                        <div className="w-8 h-1 rounded-full bg-white" />
                        <div className="w-8 h-1 rounded-full bg-white/30" />
                        <div className="w-8 h-1 rounded-full bg-white/30" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <FileVideo className="w-4 h-4" />
                      สคริปต์ + ซับไตเติ้ล
                    </h4>
                    <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 text-sm leading-relaxed text-white/80">
                      {selectedClip.transcript}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                      <div className="text-xs text-white/40 mb-1">Hook Type</div>
                      <div className="font-bold text-sm">Curiosity Gap + Contrarian</div>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                      <div className="text-xs text-white/40 mb-1">Emotion</div>
                      <div className="font-bold text-sm">😱 Shock + 🤔 Curiosity</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-sm">แคปชั่นพร้อมโพสต์</h4>
                    <div className="rounded-xl bg-white text-black p-4 text-sm">
                      <div className="font-bold">{selectedClip.title}</div>
                      <div className="mt-2 text-black/60">{selectedClip.transcript.slice(0, 100)}... อ่านต่อ</div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {selectedClip.hashtags.map(t => (
                          <span key={t} className="text-[#3a86ff] font-bold">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 h-12 rounded-full bg-white text-black font-black flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      ดาวน์โหลด 1080p
                    </button>
                    <button className="h-12 px-6 rounded-full bg-white/[0.08] border border-white/10 font-bold flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      แก้ไข
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
