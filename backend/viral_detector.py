"""
Viral Moment Detector - AI วิเคราะห์หาช็อตไวรัล
ใช้ NLP + Emotion + Hook pattern detection
"""

import re
from typing import List, Dict
import math

VIRAL_HOOKS = {
    "curiosity_gap": [r"ความลับ", r"ไม่มีใครบอก", r"รู้ไหม", r"เคยสงสัย", r"ทำไม", r"secret", r"nobody tells"],
    "contrarian": [r"หยุด", r"เลิก", r"ผิด", r"อย่า", r"stop", r"wrong"],
    "shocking": [r"ช็อค", r"ตกใจ", r"เหลือเชื่อ", r"ไม่น่าเชื่อ", r"shocking", r"crazy"],
    "benefit": [r"วิธี", r"ทำยังไง", r"ได้ผล", r"รวย", r"สำเร็จ", r"how to"],
    "story": [r"ผมเคย", r"ตอนนั้น", r"วันหนึ่ง", r"ประสบการณ์", r"เคย"],
    "controversy": [r"ดราม่า", r"จริงๆแล้ว", r"ความจริง", r"หลอก", r"truth"],
}

EMOTION_WORDS = {
    "high_arousal": ["ว้าว", "สุดยอด", "บ้า", "โคตร", "มาก", "ที่สุด", "amazing", "insane", "wow"],
    "negative": ["แย่", "พลาด", "เจ๊ง", "ล้มเหลว", "เสียใจ", "โกรธ"],
}

VIRAL_KEYWORDS = [
    "เงิน", "รวย", "สำเร็จ", "AI", "ทำเงิน", "ธุรกิจ", "เคล็ดลับ", "วิธี", "ฟรี", "ง่าย",
    "tiktok", "youtube", "ไวรัล", "ผู้ติดตาม", "ยอดวิว"
]

def calculate_viral_score(text: str, duration: float, position: float, total_duration: float) -> Dict:
    """
    คำนวณ Viral Score 0-100
    """
    text_lower = text.lower()
    score = 50  # base
    reasons = []
    hook_type = "general"
    emotion = "neutral"

    # Hook detection
    max_hook_matches = 0
    for h_type, patterns in VIRAL_HOOKS.items():
        matches = sum(1 for p in patterns if re.search(p, text_lower))
        if matches > max_hook_matches:
            max_hook_matches = matches
            hook_type = h_type
    if max_hook_matches > 0:
        score += 15 + (max_hook_matches * 5)
        reasons.append(f"เจอ Hook แบบ {hook_type}")

    # Keyword boost
    keyword_count = sum(1 for kw in VIRAL_KEYWORDS if kw.lower() in text_lower)
    score += min(keyword_count * 4, 20)
    if keyword_count > 0:
        reasons.append(f"มีคำไวรัล {keyword_count} คำ")

    # Emotion
    high_arousal = sum(1 for w in EMOTION_WORDS["high_arousal"] if w in text_lower)
    if high_arousal > 0:
        score += 10
        emotion = "excited"
        reasons.append("อารมณ์พีคสูง")

    # Length sweet spot (20-35s is best for TikTok)
    if 15 <= duration <= 35:
        score += 10
        reasons.append("ความยาวเหมาะกับ TikTok")
    elif duration > 60:
        score -= 10

    # Position bias - beginnings and ends often more viral, but middle can be too
    # For long videos, early hooks are important
    if position < total_duration * 0.15:
        score += 5
        reasons.append("อยู่ช่วงต้น (Hook)")

    # Question = curiosity
    if "?" in text or "ไหม" in text or "หรือ" in text:
        score += 7
        reasons.append("มีคำถามกระตุ้น curiosity")

    # Numbers = specificity
    if re.search(r"\d+", text):
        score += 5
        reasons.append("มีตัวเลขเฉพาะเจาะจง")

    # Caps or exclamation
    if "!" in text or text.count("!") > 0:
        score += 3

    score = max(0, min(100, score))

    return {
        "score": score,
        "hook_type": hook_type,
        "emotion": emotion,
        "reasons": reasons
    }

def find_viral_moments(transcript_segments: List[Dict], total_duration: float, num_clips: int = 4, clip_duration: int = 30) -> List[Dict]:
    """
    หา viral moments จาก transcript
    transcript_segments: [{"start": 0.0, "end": 2.5, "text": "..."}]
    """
    # Group into potential clips
    candidates = []
    window_size = clip_duration
    
    # Sliding window
    step = 5  # 5 sec step
    for start in range(0, int(total_duration - window_size), step):
        end = start + window_size
        # Get text in this window
        texts = [s["text"] for s in transcript_segments if s["start"] >= start and s["end"] <= end]
        if not texts:
            continue
        combined_text = " ".join(texts)
        if len(combined_text.strip()) < 20:
            continue
            
        analysis = calculate_viral_score(combined_text, window_size, start, total_duration)
        
        # Avoid overlapping too much with higher scored clips later - we'll filter
        candidates.append({
            "start": start,
            "end": end,
            "duration": window_size,
            "text": combined_text,
            "score": analysis["score"],
            "hook_type": analysis["hook_type"],
            "emotion": analysis["emotion"],
            "reasons": analysis["reasons"]
        })

    # Sort by score descending
    candidates.sort(key=lambda x: x["score"], reverse=True)

    # Non-maximum suppression - avoid overlapping clips
    selected = []
    for cand in candidates:
        # Check overlap with already selected
        overlap = False
        for sel in selected:
            # If overlap > 50%
            if not (cand["end"] < sel["start"] or cand["start"] > sel["end"]):
                overlap_duration = min(cand["end"], sel["end"]) - max(cand["start"], sel["start"])
                if overlap_duration > window_size * 0.5:
                    overlap = True
                    break
        if not overlap:
            selected.append(cand)
        if len(selected) >= num_clips * 2:  # Get more then filter top
            break

    # Take top N
    selected = sorted(selected, key=lambda x: x["score"], reverse=True)[:num_clips]

    # Enhance with title generation
    for clip in selected:
        # Generate hook title
        text = clip["text"]
        # Simple hook extraction - first sentence with hook word
        sentences = re.split(r"[.!?]", text)
        hook_sentence = sentences[0] if sentences else text[:50]
        clip["hook"] = hook_sentence.strip()[:60]
        clip["title"] = generate_title(text, clip["hook_type"])
        clip["hashtags"] = generate_hashtags(text)
        clip["views_prediction"] = predict_views(clip["score"])

    return selected

def generate_title(text: str, hook_type: str) -> str:
    templates = {
        "curiosity_gap": ["ความลับที่ไม่มีใครบอกคุณเกี่ยวกับ {}", "รู้ไหมว่า {} ?", "ทำไม {} ถึง..."],
        "contrarian": ["หยุดทำ {} เดี๋ยวนี้!", "เลิกเชื่อเรื่อง {} ได้แล้ว", "{} ที่คุณเข้าใจผิดมาตลอด"],
        "shocking": ["ช็อค! {} จริงเหรอ?", "{} ที่ทำให้ผมอึ้ง", "ไม่น่าเชื่อว่า {}"],
        "benefit": ["วิธี {} ให้ได้ผล 100%", "ทำ {} ยังไงให้ปัง", "สูตรลับ {}"],
        "story": ["ผมเคย {} และนี่คือสิ่งที่ได้เรียนรู้", "จาก {} สู่ {}", "ประสบการณ์ {}"],
        "controversy": ["ความจริงเรื่อง {} ที่ไม่มีใครกล้าพูด", "{} หลอกลวงหรือเปล่า?"],
        "general": ["{} ที่คุณต้องรู้", "เรื่อง {} ที่กำลังไวรัล", "{}"]
    }
    # Extract keyword
    keywords = [kw for kw in VIRAL_KEYWORDS if kw in text]
    keyword = keywords[0] if keywords else "สิ่งนี้"
    import random
    template_list = templates.get(hook_type, templates["general"])
    template = random.choice(template_list)
    try:
        title = template.format(keyword)
    except:
        title = template.replace("{}", keyword)
    return title[:60]

def generate_hashtags(text: str) -> List[str]:
    tags = []
    for kw in VIRAL_KEYWORDS:
        if kw.lower() in text.lower() and len(tags) < 3:
            tags.append(f"#{kw}")
    # Always add some generic viral tags
    generic = ["#ไวรัล", "#tiktok", "#เคล็ดลับ", "#ฟัง", "#mindset"]
    import random
    while len(tags) < 3:
        t = random.choice(generic)
        if t not in tags:
            tags.append(t)
    return tags[:3]

def predict_views(score: int) -> str:
    if score >= 95:
        return "500K-2M"
    elif score >= 90:
        return "300K-800K"
    elif score >= 85:
        return "100K-400K"
    elif score >= 75:
        return "50K-200K"
    else:
        return "10K-50K"
