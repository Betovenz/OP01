import { NextRequest, NextResponse } from 'next/server'

function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const url = body.url || ""
    const yid = extractYouTubeId(url)

    // Try to call Python backend
    try {
      const pythonRes = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      
      if (pythonRes.ok) {
        const data = await pythonRes.json()
        if (yid && data.clips) {
          data.clips = data.clips.map((c: any) => ({
            ...c,
            youtube_id: yid,
            thumbnail: `https://img.youtube.com/vi/${yid}/hqdefault.jpg`
          }))
        }
        return NextResponse.json(data)
      }
    } catch (e) {
      // Fallback
    }

    // Default Fallback response
    const mockClips = [
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
        thumbnail: yid ? `https://img.youtube.com/vi/${yid}/hqdefault.jpg` : "https://images.unsplash.com/photo-1611162616805-6396b235a6a6?w=400",
        youtube_id: yid || undefined,
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
        thumbnail: yid ? `https://img.youtube.com/vi/${yid}/hqdefault.jpg` : "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
        youtube_id: yid || undefined,
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

    const count = body.clipCount || 4
    return NextResponse.json({
      project_id: "viralcut_v2_" + Date.now(),
      title: "YouTube Viral Clip Project",
      duration: 1847,
      clips: mockClips.slice(0, count),
      transcript: [],
      mock: true
    })

  } catch (error: any) {
    console.error('Analyze error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
