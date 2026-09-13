import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { type, clip, subtitles } = await req.json()

    if (type === 'capcut') {
      const capcutDraft = {
        version: "2.0",
        app_version: "VIRALCUT v2.0 Exporter",
        canvas_config: {
          width: 1080,
          height: 1920,
          ratio: "9:16"
        },
        tracks: [
          {
            type: "video",
            segments: [
              {
                source_start: Math.round((clip?.start || 0) * 1000000),
                source_duration: Math.round((clip?.duration || 30) * 1000000),
                target_start: 0,
                target_duration: Math.round((clip?.duration || 30) * 1000000),
                crop: { x: 0.28, y: 0, width: 0.44, height: 1.0 }
              }
            ]
          },
          {
            type: "text",
            style: "hormozi_bounce",
            text: clip?.transcript || ""
          }
        ],
        metadata: {
          title: clip?.title || "Viral Clip",
          viral_score: clip?.viralScore || 95,
          hashtags: clip?.hashtags || []
        }
      }
      return NextResponse.json(capcutDraft)
    }

    if (type === 'srt') {
      const text = clip?.transcript || "VIRALCUT Subtitle line"
      const srt = `1\n00:00:00,000 --> 00:00:05,000\n${clip?.hook || text}\n\n2\n00:00:05,100 --> 00:00:${Math.min(59, Math.round(clip?.duration || 25)).toString().padStart(2, '0')},000\n${text}\n`
      return new NextResponse(srt, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': 'attachment; filename=subtitles.srt'
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
