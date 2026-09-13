import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Try to call Python backend
    try {
      const pythonRes = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      
      if (pythonRes.ok) {
        const data = await pythonRes.json()
        return NextResponse.json(data)
      }
    } catch (e) {
      // Fallback
    }

    // Fallback mock response for VIRALCUT v2.0
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
        thumbnail: "https://images.unsplash.com/photo-1611162616805-6396b235a6a6?w=400",
        views_prediction: "800K - 2.5M",
        hook_type: "curiosity_gap",
        emotion: "excited",
        reasons: ["เจอ Hook แบบ curiosity_gap", "มีคีย์เวิร์ดยอดฮิต 4 คำ", "ความยาวสมบูรณ์แบบสำหรับ TikTok (25s)", "อารมณ์ตื่นเต้นพีคสูง"],
        hook_strength: 96,
        retention_probability: 94,
        shareability: 92,
        retention_curve: [
          { time: 0, retention: 100 },
          { time: 3, retention: 93 },
          { time: 6, retention: 89 },
          { time: 10, retention: 86 },
          { time: 15, retention: 84 },
          { time: 20, retention: 88 },
          { time: 25, retention: 79 }
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

    const count = body.clipCount || 4
    return NextResponse.json({
      project_id: "viralcut_v2_" + Date.now(),
      title: "How I Built a $10M Business in 1 Year - Full Masterclass (VIRALCUT v2.0)",
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
