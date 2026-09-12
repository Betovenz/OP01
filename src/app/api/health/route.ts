import { NextResponse } from 'next/server'

export async function GET() {
  let pythonStatus = false
  try {
    const res = await fetch('http://127.0.0.1:8000/health', { signal: AbortSignal.timeout(2000) })
    pythonStatus = res.ok
  } catch {}

  return NextResponse.json({
    status: 'ok',
    frontend: true,
    pythonBackend: pythonStatus,
    features: {
      download: true,
      transcribe: pythonStatus,
      viralDetection: true,
      clipping: pythonStatus
    }
  })
}
