# VIRALCUT v2.0 - Portable System Guide

เอกสารระบบ Portable สำหรับใช้งาน VIRALCUT v2.0 โดยไม่ต้องตั้งค่า Environment ซับซ้อน

---

## 📦 โครงสร้างไฟล์ในชุด Portable v2.0

- `VIRALCUT.bat` - ตัวเปิดโปรแกรมคลิกเดียวจบสำหรับ Windows (Auto Build + Run)
- `VIRALCUT.sh` - ตัวเปิดโปรแกรมคลิกเดียวจบสำหรับ macOS / Linux
- `build.bat` / `build.sh` - ตรวจสอบ dependencies (Node.js, Python, FFmpeg) และติดตั้งแพ็กเกจ
- `run.bat` / `run.sh` - เริ่มต้นระบบ Backend FastAPI (พอร์ต 8000) และ Frontend Next.js (พอร์ต 3000)
- `stop.bat` / `stop.sh` - ปิดการทำงานของทุก Service
- `create_portable_zip.bat` - สคริปต์แพ็กไฟล์ Zip เพื่อนำไปแจกจ่าย

---

## ⚡ ขั้นตอนการทำงานเมื่อกด `VIRALCUT.bat`

1. ตรวจสอบว่าเคยติดตั้งระบบหรือยัง (`portable/` directory)
2. หากยังไม่เคยรัน จะเรียก `build.bat` เพื่อดาวน์โหลดและคอมไพล์ dependencies
3. ตรวจสอบและเคลียร์พอร์ต `3000` และ `8000` ไม่ให้ชนกับแอปอื่น
4. เริ่มต้น FastAPI backend และ Next.js frontend
5. เปิด Default Web Browser ไปที่ `http://localhost:3000`

---

## 🚀 ฟีเจอร์ใหม่ใน v2.0
- เพิ่มระบบ Safe Zone Cropping
- เพิ่มการ Export CapCut Draft JSON
- เพิ่ม Subtitle Animation Preview แบบเรียลไทม์
- อัปเกรด AI Retention Prediction Curve
