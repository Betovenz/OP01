"""
FastAPI Backend for VIRALCUT v2.0
"""

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import uuid
import json

try:
    from .viral_detector import (
        find_viral_moments, 
        calculate_viral_score, 
        export_to_capcut_draft, 
        export_to_srt, 
        generate_broll_suggestions
    )
    from .clipper import download_video, transcribe_video, create_clip
except ImportError:
    from viral_detector import (
        find_viral_moments, 
        calculate_viral_score, 
        export_to_capcut_draft, 
        export_to_srt, 
        generate_broll_suggestions
    )
    from clipper import download_video, transcribe_video, create_clip

app = FastAPI(
    title="VIRALCUT API v2.0",
    version="2.0.0",
    description="VIRALCUT v2.0 - AI YouTube TikTok Viral Automation Engine"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    url: str
    clipCount: int = 4
    clipDuration: str = "30"
    style: str = "mrbeast"
    aspectRatio: str = "9:16"
    faceTracking: bool = True
    autoSubtitles: bool = True
    language: str = "th"

class CapcutExportRequest(BaseModel):
    clip: Dict

class SrtExportRequest(BaseModel):
    subtitles: List[Dict]
    startOffset: float = 0.0

# Projects in-memory storage
projects = {}

@app.get("/")
def root():
    return {
        "name": "VIRALCUT Engine",
        "version": "2.0.0",
        "status": "online",
        "features": [
            "smart_downloader_v2",
            "whisper_transcribe",
            "viral_hook_detection_v2",
            "retention_curve_prediction",
            "broll_ai_generator",
            "capcut_draft_exporter",
            "srt_vtt_exporter",
            "auto_916_crop_safezone",
            "animated_subtitles_engine"
        ]
    }

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    """
    วิเคราะห์และค้นหา Viral Moments ด้วย AI v2.0
    """
    try:
        # Download
        dl_res = download_video(req.url)
        video_path = dl_res.get("file_path")
        total_duration = dl_res.get("duration", 1847)
        title = dl_res.get("title", "Video")

        # Transcribe
        segments = transcribe_video(video_path or "mock.mp4", language=req.language)

        # Viral Detection
        duration_int = int(req.clipDuration) if str(req.clipDuration).isdigit() else 30
        clips = find_viral_moments(
            segments, 
            total_duration, 
            num_clips=req.clipCount, 
            clip_duration=duration_int
        )

        project_id = str(uuid.uuid4())
        projects[project_id] = {
            "title": title,
            "duration": total_duration,
            "video_path": video_path,
            "segments": segments,
            "clips": clips,
            "settings": req.dict()
        }

        # Format clips for frontend
        formatted_clips = []
        for i, c in enumerate(clips):
            formatted_clips.append({
                "id": str(i + 1),
                "start": c["start"],
                "end": c["end"],
                "duration": c["duration"],
                "viralScore": c["score"],
                "hook": c["hook"],
                "transcript": c["text"],
                "title": c["title"],
                "hashtags": c["hashtags"],
                "thumbnail": f"https://images.unsplash.com/photo-{1611162616805 + i * 1000}-6396b235a6a6?w=400",
                "views_prediction": c["views_prediction"],
                "hook_type": c.get("hook_type", "curiosity_gap"),
                "emotion": c.get("emotion", "excited"),
                "reasons": c.get("reasons", []),
                "hook_strength": c.get("hook_strength", 90),
                "retention_probability": c.get("retention_probability", 88),
                "shareability": c.get("shareability", 85),
                "retention_curve": c.get("retention_curve", []),
                "brolls": c.get("brolls", [])
            })

        return {
            "project_id": project_id,
            "title": title,
            "duration": total_duration,
            "clips": formatted_clips,
            "transcript": segments,
            "mock": dl_res.get("mock", False)
        }
    except Exception as e:
        print(f"Analyze error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/export/capcut")
def export_capcut(req: CapcutExportRequest):
    """
    ส่งออกคลิปเป็น CapCut Draft JSON
    """
    draft = export_to_capcut_draft(req.clip)
    return draft

@app.post("/export/srt")
def export_srt_file(req: SrtExportRequest):
    """
    ส่งออก Subtitles เป็นไฟล์ .srt
    """
    srt_text = export_to_srt(req.subtitles, req.startOffset)
    return Response(
        content=srt_text,
        media_type="text/plain; charset=utf-8",
        headers={"Content-Disposition": "attachment; filename=subtitles.srt"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0",端口=8000)
