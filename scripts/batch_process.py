#!/usr/bin/env python3
"""
Batch Viral Clip Generator
ใช้ตัดคลิปหลายวิดีโอพร้อมกัน
"""

import argparse
import json
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from backend.viral_detector import find_viral_moments
from backend.clipper import download_video, transcribe_video, create_clip

def process_video(url: str, num_clips: int = 4, duration: int = 30, style: str = "mrbeast"):
    print(f"\n🎬 Processing: {url}")
    
    # Download
    print("📥 Downloading...")
    dl = download_video(url)
    print(f"   Title: {dl.get('title')}")
    print(f"   Duration: {dl.get('duration')}s")
    
    # Transcribe
    print("🎙️ Transcribing...")
    if dl.get("file_path"):
        segments = transcribe_video(dl["file_path"])
    else:
        from backend.clipper import transcribe_video as mock_transcribe
        segments = mock_transcribe(None)
    print(f"   Segments: {len(segments)}")
    
    # Viral detection
    print("🧠 Finding viral moments...")
    total_dur = dl.get("duration", 1800)
    viral_clips = find_viral_moments(segments, total_dur, num_clips=num_clips, clip_duration=duration)
    
    for i, clip in enumerate(viral_clips):
        print(f"\n   [{i+1}] Score: {clip['score']}% - {clip['title']}")
        print(f"       {clip['start']}s - {clip['end']}s")
        print(f"       Hook: {clip['hook']}")
        print(f"       Hashtags: {', '.join(clip['hashtags'])}")
    
    return viral_clips

def main():
    parser = argparse.ArgumentParser(description="Batch Viral Clip Generator")
    parser.add_argument("urls", nargs="+", help="YouTube/TikTok URLs")
    parser.add_argument("--clips", type=int, default=4, help="Number of clips per video")
    parser.add_argument("--duration", type=int, default=30, help="Clip duration in seconds")
    parser.add_argument("--style", default="mrbeast", choices=["mrbeast", "hormozi", "podcast", "minimal"])
    parser.add_argument("--output", default="viral_report.json", help="Output JSON file")
    
    args = parser.parse_args()
    
    all_results = []
    
    for url in args.urls:
        try:
            clips = process_video(url, args.clips, args.duration, args.style)
            all_results.append({
                "url": url,
                "clips": clips
            })
        except Exception as e:
            print(f"❌ Error processing {url}: {e}")
            import traceback
            traceback.print_exc()
    
    # Save report
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Done! Report saved to {args.output}")
    print(f"   Total videos: {len(args.urls)}")
    print(f"   Total clips: {sum(len(r['clips']) for r in all_results)}")

if __name__ == "__main__":
    main()
