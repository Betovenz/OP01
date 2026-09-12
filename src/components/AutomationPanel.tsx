"use client"
import { useState } from "react"
import { Clock, Calendar, Zap, Youtube, Music2, Repeat, Settings } from "lucide-react"

export default function AutomationPanel() {
  const [autoPost, setAutoPost] = useState(false)
  const [schedule, setSchedule] = useState("daily")

  return (
    <div className="rounded-[24px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff006e] to-[#ffbe0b] flex items-center justify-center">
          <Zap className="w-4 h-4 text-black" />
        </div>
        <h2 className="font-bold">Viral Automation</h2>
        <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-[#ff006e] text-white font-bold">PRO</span>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl bg-black border border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4" />
              <span className="text-sm font-bold">Auto Channel Monitoring</span>
            </div>
            <button 
              onClick={() => setAutoPost(!autoPost)}
              className={`w-11 h-6 rounded-full p-1 transition ${autoPost ? "bg-white" : "bg-white/20"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-black transition-transform ${autoPost ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            ติดตามช่อง YouTube อัตโนมัติ เมื่อมีวิดีโอใหม่ จะตัดเป็นคลิปไวรัลทันที
          </p>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center px-4 gap-2 text-sm">
              <Youtube className="w-4 h-4 text-[#ff0000]" />
              <span className="text-white/60">youtube.com/@...</span>
            </div>
            <button className="px-4 h-10 rounded-full bg-white text-black text-xs font-black">เพิ่ม</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-white/60" />
              <span className="text-xs font-bold">โพสต์เวลา</span>
            </div>
            <select className="w-full h-9 rounded-full bg-black border border-white/10 px-3 text-sm">
              <option>19:00-21:00 (ดีที่สุด)</option>
              <option>07:00-09:00</option>
              <option>12:00-13:00</option>
              <option>สุ่ม AI เลือก</option>
            </select>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <span className="text-xs font-bold">ความถี่</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "daily", label: "ทุกวัน" },
                { id: "3day", label: "3/วัน" },
                { id: "weekly", label: "รายสัปดาห์" },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSchedule(opt.id)}
                  className={`h-9 rounded-full text-xs font-bold border transition ${schedule === opt.id ? "bg-white text-black border-white" : "bg-white/[0.06] border-white/10 text-white/60"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#ff006e]/10 to-[#3a86ff]/10 border border-white/10 p-4">
          <div className="text-xs font-bold mb-2 flex items-center gap-2">
            <Settings className="w-3.5 h-3.5" />
            Workflow ที่ตั้งไว้
          </div>
          <div className="space-y-2 text-xs">
            {[
              "1. ตรวจจับวิดีโอใหม่ทุก 1 ชม.",
              "2. AI หา 4 ช็อตไวรัล + สร้าง Hook",
              "3. ตัดต่อ 9:16 + ใส่ซับ MrBeast",
              "4. สร้าง Title + Hashtags + Caption",
              "5. ส่งเข้า Draft รอ Approve → Auto Post",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-white/60">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">{i+1}</div>
                {step}
              </div>
            ))}
          </div>
        </div>

        <button className="w-full h-11 rounded-full bg-gradient-to-r from-[#ff006e] to-[#ffbe0b] text-black font-black text-sm">
          เปิดใช้งาน Automation →
        </button>
      </div>
    </div>
  )
}
