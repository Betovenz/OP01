"use client"
import { useState } from "react"
import { Clock, Calendar, Zap, Youtube, Music2, Repeat, Settings, CheckCircle2, ShieldAlert } from "lucide-react"

export default function AutomationPanel() {
  const [autoPost, setAutoPost] = useState(false)
  const [schedule, setSchedule] = useState("daily")
  const [selectedChannels, setSelectedChannels] = useState(["@TheSecretSauceTH", "@MissionToTheMoon"])

  return (
    <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff006e] to-[#ffbe0b] flex items-center justify-center">
          <Zap className="w-4 h-4 text-black" />
        </div>
        <div>
          <h2 className="font-bold text-base">Viral Automation Engine v2.0</h2>
          <p className="text-xs text-white/50">ระบบตรวจจับวิดีโอใหม่และตัดต่ออัตโนมัติ 24/7</p>
        </div>
        <span className="ml-auto text-[10px] px-2.5 py-1 rounded-full bg-[#ff006e] text-white font-black uppercase tracking-wider">
          v2.0 PRO
        </span>
      </div>

      <div className="space-y-4">
        {/* Channel Monitor */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-[#ffbe0b]" />
              <span className="text-sm font-bold">Auto Channel Monitoring</span>
            </div>
            <button 
              onClick={() => setAutoPost(!autoPost)}
              className={`w-11 h-6 rounded-full p-1 transition ${autoPost ? "bg-emerald-500" : "bg-white/20"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-black transition-transform ${autoPost ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            ติดตามช่อง YouTube / TikTok อัตโนมัติ เมื่อมีคลิปใหม่ ระบบจะดึงมาตัดเป็นคลิปสั้น 4 ช็อตและส่งแจ้งเตือนทันที
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedChannels.map((ch, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white/80 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* Schedule & Peak Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-white/60" />
              <span className="text-xs font-bold">ช่วงเวลาโพสต์พีค (Peak Slot)</span>
            </div>
            <select className="w-full h-9 rounded-xl bg-black border border-white/10 px-3 text-xs text-white/80">
              <option>19:00 - 21:00 (TikTok Peak)</option>
              <option>07:00 - 09:00 (Shorts Peak)</option>
              <option>12:00 - 13:00 (Reels Peak)</option>
              <option>AI Auto Select</option>
            </select>
          </div>

          <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <span className="text-xs font-bold">ความถี่ในการผลิต</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "daily", label: "วันละ 1" },
                { id: "3day", label: "วันละ 3" },
                { id: "weekly", label: "สัปดาห์ละ 5" },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSchedule(opt.id)}
                  className={`h-9 rounded-xl text-[11px] font-bold border transition ${schedule === opt.id ? "bg-white text-black border-white" : "bg-white/[0.04] border-white/10 text-white/60"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow Summary */}
        <div className="rounded-2xl bg-gradient-to-br from-[#ff006e]/10 to-[#3a86ff]/10 border border-white/10 p-4">
          <div className="text-xs font-bold mb-3 flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-[#ff006e]" />
            Workflow การทำงานอัตโนมัติ v2.0
          </div>
          <div className="space-y-2 text-xs">
            {[
              "1. ตรวจจับและดึงคลิปใหม่ความละเอียดสูงสุด 1080p 60fps",
              "2. Whisper AI ถอดเสียงคำต่อคำ + ระบุ Emotion Spike",
              "3. AI Hook Detector เลือก 4 ไวรัลมักเก็ตติ้งช็อต",
              "4. ครอป 9:16 Smart Face Tracking + ฝังซับไตเติล Hormozi",
              "5. สร้าง AI Title, Captions และ Hashtags พร้อมส่งออก CapCut Draft",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5 text-white/70">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                  {i+1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => alert("ระบบเปิดใช้งาน Auto-Monitoring เรียบร้อย")}
          className="w-full h-11 rounded-2xl bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] text-white font-black text-sm shadow-lg shadow-[#ff006e]/20 hover:opacity-90 transition"
        >
          บันทึกการตั้งค่า Automation →
        </button>
      </div>
    </div>
  )
}
