#!/bin/bash
# VIRALCUT Portable Builder - Linux/Mac

set -e

echo ""
echo "========================================================"
echo " VIRALCUT - AI ตัดคลิป YouTube TikTok ไวรัลอัตโนมัติ"
echo " Portable Build System v1.0 (Linux/Mac)"
echo "========================================================"
echo ""

# Check folder
if [ ! -f "package.json" ]; then
  echo "[ERROR] ไม่พบ package.json กรุณารันในโฟลเดอร์โปรเจค"
  exit 1
fi

mkdir -p portable/downloads
mkdir -p portable/clips
mkdir -p portable/logs

echo "[1/6] ตรวจสอบ Node.js..."
if ! command -v node &> /dev/null; then
  echo "  - ไม่พบ Node.js กรุณาติดตั้งจาก https://nodejs.org"
  echo "  Ubuntu: curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs"
  echo "  Mac: brew install node"
  exit 1
else
  echo "  - พบ Node.js $(node -v)"
fi

echo "[2/6] ตรวจสอบ Python..."
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
  if ! command -v python &> /dev/null; then
    echo "  - ไม่พบ Python"
    exit 1
  else
    PYTHON_CMD="python"
  fi
fi
echo "  - พบ $($PYTHON_CMD --version)"

echo "[3/6] ตรวจสอบ FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
  echo "  - ไม่พบ FFmpeg จะใช้โหมด Mock"
  echo "  Ubuntu: sudo apt install ffmpeg"
  echo "  Mac: brew install ffmpeg"
else
  echo "  - พบ $(ffmpeg -version | head -n1)"
fi

echo "[4/6] สร้าง Python Virtual Environment..."
if [ ! -d "portable/venv" ]; then
  echo "  - สร้าง venv ใหม่..."
  $PYTHON_CMD -m venv portable/venv
else
  echo "  - พบ venv เดิมแล้ว"
fi

echo "  - ติดตั้ง Python Dependencies..."
source portable/venv/bin/activate
pip install --upgrade pip --quiet
pip install -r backend/requirements.txt --quiet
pip install faster-whisper --quiet 2>/dev/null || echo "  - faster-whisper ข้าม (optional)"
deactivate

echo "[5/6] ติดตั้ง Node.js Dependencies..."
if [ ! -d "node_modules" ]; then
  echo "  - npm install (ครั้งแรก 1-2 นาที)..."
  npm install --silent
else
  echo "  - พบ node_modules แล้ว"
fi

echo "[6/6] Build Frontend..."
npm run build || echo "[WARNING] Build ไม่สำเร็จ แต่รัน dev ได้"

echo ""
echo "========================================================"
echo " BUILD สำเร็จ! พร้อมใช้งานแบบ Portable"
echo "========================================================"
echo ""
echo " วิธีรัน:"
echo "  ./run.sh              = รันทั้ง Frontend+Backend"
echo "  ./VIRALCUT.sh         = รัน + เปิดเบราว์เซอร์"
echo ""
echo " URL:"
echo "  - เว็บหลัก: http://localhost:3000"
echo "  - API Docs: http://localhost:8000/docs"
echo ""
echo " รันเลยไหม? (y/n)"
read -r ans
if [[ "$ans" == "y" ]]; then
  ./run.sh
fi
