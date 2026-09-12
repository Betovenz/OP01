# VIRALCUT Portable Edition - คู่มือฉบับพกพา

## 📦 คืออะไร?

Portable Edition = แตกไฟล์แล้วดับเบิลคลิกใช้งานได้เลย ไม่ต้องติดตั้งอะไรเยอะ ไม่ยุ่งกับระบบเครื่อง

- Python แยกอยู่ใน `portable/venv/` ไม่ยุ่งกับ Python เครื่อง
- Node modules แยก
- วิดีโอที่โหลดมาเก็บใน `portable/downloads/`
- คลิปที่ตัดเสร็จเก็บใน `portable/clips/`
- ลบโฟลเดอร์ทิ้ง = ลบโปรแกรมหมด ไม่ทิ้งขยะ

---

## 🪟 สำหรับ Windows

### วิธีใช้แบบ 1 คลิก (แนะนำ)

1. **แตกไฟล์ ZIP** ไปไว้ที่ไหนก็ได้ เช่น `D:\VIRALCUT\`
2. **ดับเบิลคลิก `VIRALCUT.bat`** ครั้งแรก
   - มันจะตรวจสอบ Node.js, Python, FFmpeg
   - ถ้าไม่มีจะติดตั้งให้อัตโนมัติผ่าน winget
   - สร้าง venv + ติดตั้ง dependencies (2-3 นาทีครั้งแรก)
   - Build frontend
   - รันระบบ + เปิดเบราว์เซอร์ http://localhost:3000 อัตโนมัติ

3. **ครั้งต่อไป** ดับเบิลคลิก `VIRALCUT.bat` อีกที = รันเลยใน 5 วิ

### ไฟล์ .bat แต่ละไฟล์ทำอะไร?

| ไฟล์ | ทำอะไร |
|------|--------|
| `VIRALCUT.bat` | **ตัวนี้เลย!** 1 คลิก รันทั้งหมด + เปิดเบราว์เซอร์ |
| `build.bat` | ติดตั้งครั้งแรก / อัพเดท dependencies |
| `run.bat` | รัน Backend+Frontend อย่างเดียว ไม่เปิดเบราว์เซอร์ |
| `stop.bat` | หยุดระบบทั้งหมด (kill port 3000, 8000) |

### ถ้า winget ติดตั้งไม่ได้?

ติดตั้งเอง:
- Node.js LTS: https://nodejs.org/ → โหลด LTS
- Python 3.11: https://python.org/ → ติ๊ก Add to PATH ตอนติดตั้ง
- FFmpeg: `winget install Gyan.FFmpeg` หรือโหลดจาก https://ffmpeg.org/ แล้วแตกไว้ `C:\ffmpeg` เพิ่ม PATH

แล้วรัน `build.bat` ใหม่

---

## 🍎 สำหรับ Mac / Linux

```bash
# ให้สิทธิ์รัน
chmod +x *.sh

# ครั้งแรก
./VIRALCUT.sh
# หรือ
./build.sh

# ครั้งต่อไป
./VIRALCUT.sh
# หรือ
./run.sh

# หยุด
./stop.sh
```

ถ้าไม่มี Node/Python/FFmpeg:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm python3 python3-venv ffmpeg -y
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Mac (brew)
brew install node python ffmpeg
```

---

## 📁 โครงสร้างหลังติดตั้ง

```
VIRALCUT/
├── VIRALCUT.bat          ← ดับเบิลคลิกนี้!
├── build.bat
├── run.bat
├── stop.bat
├── VIRALCUT.sh
├── build.sh
├── run.sh
├── stop.sh
├── portable/             ← ทุกอย่างเก็บตรงนี้ ไม่ยุ่งเครื่อง
│   ├── venv/             ← Python แยก
│   ├── downloads/        ← วิดีโอต้นฉบับที่โหลดมา
│   ├── clips/            ← คลิปที่ตัดเสร็จ
│   └── logs/             ← log backend/frontend
├── src/                  ← โค้ดเว็บ
├── backend/              ← โค้ด AI
├── node_modules/         ← lib เว็บ
└── package.json
```

---

## 🚀 วิธีใช้งานหลังรัน

1. เปิด http://localhost:3000
2. วางลิงก์ YouTube/TikTok
3. ตั้งค่า 4 คลิป 30วิ 9:16 MrBeast
4. กดตัดคลิปเลย
5. ได้คลิป + โหลดจาก `portable/clips/` หรือกดโหลดในเว็บ

---

## ❓ แก้ปัญหา

**Q: ดับเบิลคลิกแล้วหน้าต่างปิดทันที**
- คลิกขวา → Run as Administrator
- หรือเปิด cmd ในโฟลเดอร์แล้วพิมพ์ `VIRALCUT.bat` ดู error

**Q: Port 3000/8000 ถูกใช้งาน**
- รัน `stop.bat` ก่อน
- หรือ `netstat -ano | findstr :3000` แล้ว `taskkill /f /pid XXXX`

**Q: Build นานมาก**
- ครั้งแรก `npm install` โหลด 200MB นาน 2-3 นาทีปกติ
- ครั้งต่อไปเร็วแล้ว

**Q: อยากย้ายเครื่อง**
- ก็อปทั้งโฟลเดอร์ VIRALCUT ไปเครื่องใหม่ได้เลย แบบ USB
- ไปเครื่องใหม่รัน `build.bat` ใหม่ครั้งเดียว

**Q: ลบยังไง**
- ลบโฟลเดอร์ VIRALCUT ทิ้ง = ลบหมด ไม่ทิ้ง registry

---

## 📦 สร้างไฟล์ ZIP แจกเพื่อน

```bash
# Windows (ใน PowerShell)
Compress-Archive -Path * -DestinationPath VIRALCUT-Portable-v1.0-Windows.zip -Force

# แต่ไม่ต้องรวม:
# - node_modules (ให้เพื่อนรัน build.bat เอา)
# - portable/venv (ให้สร้างใหม่)
# - .next
# - portable/downloads/*, portable/clips/*
```

แจกแบบ Clean (เล็ก 5MB):
- รวมแค่โค้ด + .bat/.sh + package.json + backend/ + src/
- เพื่อนแตกแล้วรัน `VIRALCUT.bat` จะติดตั้งเอง

แจกแบบ Full (ใหญ่ 300MB):
- รวม node_modules + portable/venv ไปด้วย → แตกแล้วรันได้เลยไม่ต้องติดตั้ง

---

## 🎯 One-Click Flow

```
ดับเบิลคลิก VIRALCUT.bat
  → เช็ค Node/Python/FFmpeg → ถ้าไม่มีติดตั้งให้
  → เช็ค portable/venv → ถ้าไม่มีสร้างใหม่
  → pip install backend/requirements.txt
  → npm install (ถ้าไม่มี node_modules)
  → npm run build
  → รัน uvicorn backend.main:app :8000
  → รัน next dev :3000
  → เปิด http://localhost:3000
  → พร้อมตัดคลิป!
```

---

สร้างโดย VIRALCUT Team - พกใส่ USB ไปตัดคลิปที่ไหนก็ได้ 🚀
