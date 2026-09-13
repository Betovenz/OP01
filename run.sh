#!/bin/bash
# VIRALCUT Run - Linux/Mac

echo ""
echo "========================================================"
echo " VIRALCUT - กำลังรันระบบ..."
echo "========================================================"
echo ""

if [ ! -d "portable/venv" ]; then
  echo "[ERROR] ไม่พบ portable/venv กรุณารัน ./build.sh ก่อน"
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "[ERROR] ไม่พบ node_modules กรุณารัน ./build.sh ก่อน"
  exit 1
fi

mkdir -p portable/downloads portable/clips portable/logs

echo "[1/3] เคลียร์พอร์ตเก่า..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

echo "[2/3] รัน Backend API (Port 8000)..."
source portable/venv/bin/activate
PYTHONPATH=. nohup python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload > portable/logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "  - Backend PID $BACKEND_PID log: portable/logs/backend.log"
deactivate

echo "[3/3] รัน Frontend Website (Port 3000)..."
nohup npm run dev > portable/logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "  - Frontend PID $FRONTEND_PID log: portable/logs/frontend.log"

echo ""
echo "  รอระบบบูต 5 วินาที..."
sleep 5

if lsof -i:8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "  [OK] Backend http://localhost:8000/docs"
else
  echo "  [WAIT] Backend กำลังบูต... tail -f portable/logs/backend.log"
fi

if lsof -i:3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "  [OK] Frontend http://localhost:3000"
else
  echo "  [WAIT] Frontend บูตครั้งแรกนาน 10-20 วิ... tail -f portable/logs/frontend.log"
fi

echo ""
echo "========================================================"
echo " พร้อมใช้งาน!"
echo "  - เว็บหลัก: http://localhost:3000"
echo "  - API: http://localhost:8000/docs"
echo "  - Logs: portable/logs/"
echo "  - คลิป: portable/clips/"
echo "========================================================"
echo ""
echo " หยุดระบบ: ./stop.sh"
echo ""

# เปิดเบราว์เซอร์ถ้าทำได้
if command -v xdg-open &> /dev/null; then
  xdg-open http://localhost:3000 2>/dev/null &
elif command -v open &> /dev/null; then
  open http://localhost:3000 2>/dev/null &
fi

echo "Press Ctrl+C to stop logs tail, system still running in background"
echo ""
tail -f portable/logs/frontend.log portable/logs/backend.log 2>/dev/null || sleep 10
