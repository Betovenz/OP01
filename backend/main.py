"""
FastAPI Backend for ViralCut
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
import json
try:
    from .viral_detector import find_viral_moments, calculate_viral_score
    from .clipper import download_video, transcribe_video, create_clip
except ImportError:
    from viral_detector import find_viral_moments, calculate_viral_score
    from clipper import download_video, transcribe_video, create_clip

app = FastAPI(title="ViralCut API", version="1.0.0")

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

class ClipResponse(BaseModel):
    id: str
    start: float
    end: float
    duration: float
    viralScore: int
    hook: str
    transcript: str
    title: str
    hashtags: List[str]
    thumbnail: str
    views_prediction: str
    hook_type: str = "general"
    emotion: str = "neutral"
    reasons: List[str] = []

# In-memory storage for demo
projects = {}

@app.get("/")
def root():
    return {"message": "ViralCut API is running", "version": "1.0.0", "features": ["download", "transcribe", "viral_detection", "auto_clip"]}

@app.get("/health")
def health():
    return {"status": "ok", "ffmpeg": check_ffmpeg(), "yt_dlp": check_ytdlp()}

def check_ffmpeg():
    import subprocess
    try:
        r = subprocess.run(["ffmpeg", "-version"], capture_output=True, timeout=2)
        return r.returncode == 0
    except:
        return False

def check_ytdlp():
    import subprocess
    try:
        r = subprocess.run(["yt-dlp", "--version"], capture_output=True, timeout=2)
        return r.returncode == 0
    except:
        return False

@app.post("/analyze")
async def analyze_video(req: AnalyzeRequest):
    """
    Main pipeline: Download -> Transcribe -> Viral Detection
    """
    try:
        print(f"Analyzing: {req.url}")
        
        # 1. Download (mock if not available)
        download_result = download_video(req.url, output_dir="/tmp")
        print(f"Download result: {download_result}")

        # 2. Transcribe
        if download_result.get("file_path") and os.path.exists(download_result["file_path"]):
            segments = transcribe_video(download_result["file_path"])
        else:
            # Mock transcript
            segments = transcribe_video(None)
        
        total_duration = download_result.get("duration", 1800)
        if isinstance(total_duration, str):
            total_duration = 1800

        # 3. Find viral moments
        clip_duration = int(req.clipDuration) if req.clipDuration.isdigit() else 30
        viral_clips = find_viral_moments(segments, total_duration, num_clips=req.clipCount, clip_duration=clip_duration)

        # 4. Format response
        clips = []
        thumbnails = [
            "https://images.unsplash.com/photo-1611162616805-6396b235a6a6?w=400",
            "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
            "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
        ]

        for i, vc in enumerate(viral_clips):
            clips.append({
                "id": str(uuid.uuid4())[:8],
                "start": vc["start"],
                "end": vc["end"],
                "duration": vc["duration"],
                "viralScore": int(vc["score"]),
                "hook": vc["hook"][:60],
                "transcript": vc["text"][:200],
                "title": vc["title"],
                "hashtags": vc["hashtags"],
                "thumbnail": thumbnails[i % len(thumbnails)],
                "views_prediction": vc["views_prediction"],
                "hook_type": vc["hook_type"],
                "emotion": vc["emotion"],
                "reasons": vc["reasons"]
            })

        # Sort by viral score
        clips.sort(key=lambda x: x["viralScore"], reverse=True)

        project_id = str(uuid.uuid4())[:8]
        projects[project_id] = {
            "url": req.url,
            "title": download_result.get("title", "Unknown"),
            "duration": total_duration,
            "segments": segments,
            "clips": clips,
            "file_path": download_result.get("file_path")
        }

        return {
            "project_id": project_id,
            "title": download_result.get("title", "Video"),
            "duration": total_duration,
            "clips": clips,
            "transcript": segments[:10],  # preview
            "mock": download_result.get("mock", False)
        }

    except Exception as e:
        print(f"Analyze error: {e}")
        import traceback
        traceback.print_exc()
        # Return mock data as fallback so frontend still works
        mock_clips = [
            {
                "id": "1",
                "start": 42,
                "end": 67,
                "duration": 25,
                "viralScore": 96,
                "hook": "ความลับที่ไม่มีใครบอกคุณ...",
                "transcript": "ความลับที่ไม่มีใครบอกคุณเกี่ยวกับการทำเงินออนไลน์ คือทุกคนโฟกัสผิดจุด คุณไม่ต้องมีสินค้า ไม่ต้องมีทุน แค่ต้องเข้าใจสิ่งนี้",
                "title": "ความลับทำเงินออนไลน์ที่ไม่มีใครบอก 🤫",
                "hashtags": ["#หาเงินออนไลน์", "#ธุรกิจ", "#เคล็ดลับ"],
                "thumbnail": "https://images.unsplash.com/photo-1611162616805-6396b235a6a6?w=400",
                "views_prediction": "500K-1M",
                "hook_type": "curiosity_gap",
                "emotion": "excited",
                "reasons": ["เจอ Hook แบบ curiosity_gap", "มีคำไวรัล 3 คำ"]
            },
            {
                "id": "2",
                "start": 128,
                "end": 158,
                "duration": 30,
                "viralScore": 92,
                "hook": "หยุดทำแบบนี้เดี๋ยวนี้!",
                "transcript": "ถ้าคุณยังทำ 3 สิ่งนี้อยู่ คุณจะไม่มีวันรวย หยุดเดี๋ยวนี้เลย อันดับแรกคือการตื่นสาย อันดับสองคือ...",
                "title": "หยุดทำ 3 สิ่งนี้ถ้าอยากรวย 💸",
                "hashtags": ["#พัฒนาตัวเอง", "#ความสำเร็จ", "#mindset"],
                "thumbnail": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
                "views_prediction": "300K-600K",
                "hook_type": "contrarian",
                "emotion": "excited",
                "reasons": ["เจอ Hook แบบ contrarian"]
            }
        ]
        return {
            "project_id": "mock",
            "title": "Mock Video (Fallback)",
            "duration": 1847,
            "clips": mock_clips,
            "transcript": [],
            "mock": True,
            "error": str(e)
        }

@app.post("/generate-clips")
async def generate_clips(project_id: str, aspect_ratio: str = "9:16", style: str = "mrbeast"):
    """
    สร้างไฟล์คลิปจริงจาก project
    """
    if project_id not in projects:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects[project_id]
    input_file = project.get("file_path")
    
    if not input_file or not os.path.exists(input_file):
        return {"message": "No source file, mock generation", "clips": project["clips"], "mock": True}

    output_dir = f"/tmp/viralcut_{project_id}"
    os.makedirs(output_dir, exist_ok=True)

    generated = []
    for clip in project["clips"]:
        output_path = os.path.join(output_dir, f"clip_{clip['id']}_{clip['viralScore']}.mp4")
        success = create_clip(
            input_file=input_file,
            output_file=output_path,
            start=clip["start"],
            end=clip["end"],
            aspect_ratio=aspect_ratio,
            style=style,
            subtitles=project.get("segments", []),
            face_tracking=True
        )
        generated.append({
            "id": clip["id"],
            "file": output_path if success else None,
            "success": success
        })

    return {"project_id": project_id, "generated": generated, "output_dir": output_dir}

@app.get("/projects/{project_id}")
def get_project(project_id: str):
    if project_id not in projects:
        raise HTTPException(status_code=404, detail="Project not found")
    return projects[project_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
