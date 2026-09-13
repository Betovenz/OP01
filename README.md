# VIRALCUT v2.0 - AI ตัดคลิป YouTube TikTok ไวรัลอัตโนมัติ

> เปลี่ยนวิดีโอยาว 1 ชั่วโมงเป็นคลิปสั้นไวรัล 4-8 ช็อตใน 30 วินาที ด้วย AI

![ViralCut](https://img.shields.io/badge/VIRALCUT-v2.0--PRO-ff006e?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge)
![CapCut](https://img.shields.io/badge/CapCut-Draft--Export-00f2fe?style=for-the-badge)

---

## 🔥 ไฮไลท์ฟีเจอร์ใหม่ใน v2.0

### 1. Studio Player & Safe Zone Cropper (v2.0)
- **Interactive Visual Canvas**: ดูพรีวิวคลิปแบบ 9:16 บนมือถือจำลองแบบเรียลไทม์
- **TikTok & Reels Safe Zone Guide**: เส้นไกด์โปร่งแสงป้องกันไม่ให้ซับไตเติลชนกับปุ่ม Like/Comment/Share หรือโปรไฟล์
- **Aspect Ratio Switcher**: สลับอัตราส่วน 9:16 (TikTok/Shorts), 1:1 (Instagram Feed), 16:9 (YouTube) ในคลิกเดียว
- **Dynamic Scrubber & Trim**: ปรับจังหวะเริ่มต้น-สิ้นสุดได้อย่างแม่นยำ

### 2. Subtitle Animation Engine v2.0
- **Hormozi Pop**: สไตล์คำเด้งสีเขียวนีออนและสีเหลือง ดึงดูดสายตา
- **MrBeast 2.0**: สไตล์ตัวหนังสือหนา ขอบดำคมชัด พร้อมอีโมจิและไฮไลท์คำสำคัญ
- **Cyberpunk Neon**: นีออนเรืองแสงสีฟ้า-ชมพูสไตล์ล้ำยุค
- **Podcast Minimal & Clean**: สไตล์ล่างสุดเรียบหรูสำหรับคอนเทนต์ให้ความรู้
- ปรับตำแหน่งซับไตเติล (Top, Center, Bottom) ได้ตามต้องการ

### 3. AI Retention Curve & Hook Analytics (v2.0)
- **Audience Retention Curve Prediction**: กราฟทำนายอัตราการดูจบและจุดสะดุดของคนดูตลอดทั้งคลิป
- **Hook Strength Meter**: วิเคราะห์ 3 วินาทีแรกว่าแรงพอจะหยุดนิ้วโป้งคนดูได้หรือไม่
- **Emotion & Shareability Score**: คำนวณความน่าจะเป็นในการกดแชร์และคอมเมนต์
- **AI Boost Recommendations**: คำแนะนำแทรก Sound Effect / B-Roll เพื่อเพิ่มยอดวิว +25%

### 4. B-Roll & Sound FX AI Studio (v2.0)
- **Smart Timestamp B-Roll**: ระบบวิเคราะห์ประโยคและแนะนำ Prompt สำหรับสร้าง B-Roll หรือฟุตเทจประกอบ
- **Sound Effects Triggers**: แนะนำเสียงประกอบ เช่น Whoosh, Cash Register, Glitch, Ding ในจุดพีค

### 5. Multi-Format Exporter & CapCut Bridge (v2.0)
- **CapCut Draft Exporter (`draft_content.json`)**: นำเข้าโปรเจกต์ตรงสู่ CapCut โดยยังคงแยกเลเยอร์วิดีโอและตัวหนังสือ
- **Export SRT / VTT Subtitles**: ดาวน์โหลดไฟล์ซับไตเติลแยกมาตรฐาน
- **AI Copywriting Ready**: คัดลอก Title, Social Caption และแฮชแท็กไวรัลในคลิกเดียว
- **Full HD 1080p MP4 Export**: เรนเดอร์ 9:16 พร้อมใช้

---

## 🚀 วิธีเริ่มใช้งาน

### 1. ใช้งานแบบ Portable One-Click (Windows)
ดับเบิลคลิกไฟล์:
```bat
VIRALCUT.bat
```
*(ระบบจะตรวจสอบ dependencies, รัน FastAPI Backend :8000 และ Next.js Frontend :3000 พร้อมเปิดเบราว์เซอร์ให้อัตโนมัติ)*

### 2. ใช้งานบน macOS / Linux
```bash
chmod +x VIRALCUT.sh
./VIRALCUT.sh
```

### 3. รันแบบ Manual (สำหรับ Developer)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
npm install
npm run dev
# เปิด http://localhost:3000
```

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
VIRALCUT-v2/
├── backend/
│   ├── main.py              # FastAPI Server v2.0 (Analytics, CapCut, SRT API)
│   ├── viral_detector.py    # AI Hook & Retention Curve Engine
│   ├── clipper.py           # ffmpeg & Whisper Multi-Style Subtitle Engine
│   └── requirements.txt
├── src/
│   ├── app/
│   │   ├── page.tsx         # v2.0 Studio Canvas, Timeline & Inspector UI
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       ├── analyze/     # AI Analysis endpoint with rich fallback
│   │       └── export/      # CapCut Draft & SRT download endpoint
│   ├── components/
│   │   └── AutomationPanel.tsx # Auto Channel Monitor & Scheduler v2.0
│   └── lib/
│       └── utils.ts
├── VIRALCUT.bat             # One-click Windows Launcher
├── VIRALCUT.sh              # One-click Linux/Mac Launcher
├── GUIDE_TH.md              # คู่มือการใช้งานภาษาไทยแบบละเอียด
├── PORTABLE_GUIDE.md        # คู่มือ Portable Build
└── package.json
```

---

## 📄 License
MIT License - Created for Creators & AI Automators.
