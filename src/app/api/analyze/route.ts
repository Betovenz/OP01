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
      console.log('Python backend not available, using mock:', e)
    }

    // Fallback mock response
    const mockClips = [
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
        views_prediction: "500K-1M",
        hook_type: "curiosity_gap",
        emotion: "excited",
        reasons: ["เจอ Hook แบบ curiosity_gap", "มีคำไวรัล 3 คำ", "ความยาวเหมาะกับ TikTok"]
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
        views_prediction: "300K-600K",
        hook_type: "contrarian",
        emotion: "excited",
        reasons: ["เจอ Hook แบบ contrarian", "มีคำถามกระตุ้น curiosity"]
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
        views_prediction: "200K-400K",
        hook_type: "benefit",
        emotion: "excited",
        reasons: ["มีตัวเลขเฉพาะเจาะจง", "อารมณ์พีคสูง"]
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
        views_prediction: "400K-800K",
        hook_type: "shocking",
        emotion: "excited",
        reasons: ["เจอ Hook แบบ shocking", "มีคำไวรัล 2 คำ"]
      }
    ]

    const count = body.clipCount || 4
    return NextResponse.json({
      project_id: "mock_" + Date.now(),
      title: "How I Built a $10M Business in 1 Year - Full Podcast (Mock)",
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
