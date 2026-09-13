# VIRALCUT - AI ตัดคลิป YouTube TikTok ไวรัลอัตโนมัติ

> เปลี่ยนวิดีโอยาวเป็นคลิปสั้นไวรัลใน 30 วินาที ด้วย AI

![ViralCut](https://img.shields.io/badge/AI-Powered-ff006e?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge)

## 🔥 ฟีเจอร์เด็ด

### 1. ดาวน์โหลดอัตโนมัติ
- รองรับ YouTube, TikTok, Instagram Reels, Facebook
- รองรับ 4K, ดาวน์โหลดเร็วด้วย yt-dlp
- อัพโหลดไฟล์ MP4/MOV ได้

### 2. AI วิเคราะห์หาไวรัล (Viral Detection Engine)
- **Whisper AI** ถอดเสียงไทย/อังกฤษ แม่น 95%
- **Hook Detection**: จับ 6 รูปแบบ Hook ที่ทำให้คนหยุดดู
  - Curiosity Gap (ความลับที่ไม่มีใครบอก...)
  - Contrarian (หยุดทำแบบนี้!)
  - Shocking (ช็อค! ไม่น่าเชื่อ)
  - Benefit (วิธี...ให้ได้ผล)
  - Story (ผมเคย...)
  - Controversy (ความจริงที่ไม่มีใครกล้าพูด)
- **Viral Score 0-100** ทำนายโอกาสไวรัล
- **Emotion Analysis** วิเคราะห์อารมณ์พีค

### 3. ตัดต่ออัตโนมัติ
- **Smart Crop 9:16** พร้อม Face Tracking ไม่ตัดหัว
- **Jump Cut อัตโนมัติ** ตัดช่วงเงียบ คำฟุ่มเฟือย (อืม เอ่อ)
- **Auto Subtitles** สไตล์ MrBeast / Hormozi / Podcast / Minimal
- **B-Roll AI** (coming soon) ใส่ภาพประกอบอัตโนมัติ

### 4. Viral Automation
- สร้าง 1-8 คลิปต่อวิดีโอ
- เลือกความยาว 15s / 30s / 60s
- Auto Generate Title + Hashtags + Caption
- ทำนายยอดวิว
- Export พร้อมโพสต์ TikTok/Reels/Shorts
- Batch Processing + Scheduler

## 🚀 วิธีรัน

### Frontend (Next.js)
```bash
npm install
npm run dev
# เปิด http://localhost:3000
```

### Backend (FastAPI)
```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
# API Docs: http://localhost:8000/docs
```

### ต้องการ FFmpeg (สำหรับตัดต่อจริง)
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# Mac
brew install ffmpeg
```

## 🧠 วิธีทำงานของ AI

```
YouTube URL → yt-dlp Download → Whisper Transcribe → Viral Detector → FFmpeg Clipper → 9:16 + Subs → พร้อมโพสต์
```

### Viral Score Algorithm
```python
score = 50 (base)
+ Hook detection (15+ points)
+ Viral keywords (4 per keyword)
+ Emotion high arousal (10 points)
+ Sweet spot duration 15-35s (10 points)
+ Question/Curiosity (7 points)
+ Numbers specificity (5 points)
```

## 📁 โครงสร้างโปรเจค

```
/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main ViralCut UI
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── analyze/      # วิเคราะห์วิดีโอ
│   │       └── health/
│   ├── components/           # UI Components
│   └── lib/utils.ts
├── backend/
│   ├── main.py               # FastAPI Server
│   ├── viral_detector.py     # AI หาไวรัล
│   ├── clipper.py            # ตัดต่อวิดีโอ
│   └── requirements.txt
├── public/
└── package.json
```

## 🎨 สไตล์ซับไตเติ้ล

| สไตล์ | เหมาะกับ | จุดเด่น |
|-------|----------|---------|
| **MrBeast** | คอนเทนต์ทั่วไป ไวรัล | ตัวใหญ่ เด้งๆ คำสำคัญสีเหลือง |
| **Hormozi** | ธุรกิจ ความรู้ | ตัวหนา เข้ม อ่านง่าย |
| **Podcast** | พอดแคสต์ สัมภาษณ์ | แยกสี 2 คน |
| **Minimal** | มินิมอล สะอาด | บาง เล็ก ดูโปร |

## 🔮 Roadmap

- [ ] Auto Post to TikTok / YouTube Shorts API
- [ ] AI B-Roll ใส่ภาพประกอบอัตโนมัติ
- [ ] Voice Enhancement ลบเสียงรบกวน
- [ ] Multi-language Dubbing
- [ ] Team Workspace
- [ ] Chrome Extension ตัดจาก YouTube โดยตรง
- [ ] Scheduler โพสต์อัตโนมัติทุกวัน

## 💡 Use Cases

1. **Podcaster**: ตัดพอดแคสต์ 2 ชม. เป็น 8 คลิป TikTok
2. **YouTuber**: รีไซเคิลวิดีโอยาวเป็น Shorts
3. **Agency**: ทำคลิปให้ลูกค้าวันละ 10+ คลิป
4. **Coach/ครู**: ตัดคอร์สยาวเป็นคลิปสั้นขายคอร์ส
5. **News**: ตัดข่าวเป็นคลิปสั้นไวรัล

## 🛠 Tech Stack

- **Frontend**: Next.js 14, Tailwind, Framer Motion, Lucide Icons
- **Backend**: FastAPI, yt-dlp, faster-whisper, ffmpeg
- **AI**: Whisper (STT), Custom Viral Scoring NLP
- **Deploy**: Vercel (frontend) + Railway/Fly.io (backend)

## 📄 License

MIT - ใช้ฟรี ทำเงินได้เลย

---

**สร้างโดย VIRALCUT Team** - ทำให้คนไทยทำคอนเทนต์ไวรัลง่ายขึ้น 10 เท่า 🚀

> "จากวิดีโอ 1 ชั่วโมง → คลิปไวรัล 8 คลิป ใน 30 วินาที"
