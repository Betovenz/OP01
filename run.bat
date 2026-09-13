@echo off
chcp 65001 >nul
title VIRALCUT - Running...

echo.
echo  ========================================================
echo   VIRALCUT - กำลังรันระบบ...
echo  ========================================================
echo.

if not exist "portable\venv\Scripts\activate.bat" (
    echo [ERROR] ไม่พบ portable\venv กรุณารัน build.bat ก่อน
    echo กดปุ่มใดๆ เพื่อรัน build.bat...
    pause >nul
    call build.bat
    exit /b
)

if not exist "node_modules" (
    echo [ERROR] ไม่พบ node_modules กรุณารัน build.bat ก่อน
    pause
    exit /b
)

:: สร้างโฟลเดอร์ที่จำเป็น
if not exist "portable\downloads" mkdir portable\downloads
if not exist "portable\clips" mkdir portable\clips
if not exist "portable\logs" mkdir portable\logs

:: Kill process เก่าที่ค้าง
echo [1/3] เคลียร์พอร์ตเก่า...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>nul
timeout /t 1 /nobreak >nul

echo [2/3] รัน Backend API (Port 8000)...
start "VIRALCUT Backend" /min cmd /c "portable\venv\Scripts\activate.bat && set PYTHONPATH=. && python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload > portable\logs\backend.log 2>&1"

echo [3/3] รัน Frontend Website (Port 3000)...
start "VIRALCUT Frontend" /min cmd /c "npm run dev > portable\logs\frontend.log 2>&1"

echo.
echo   รอระบบบูต 5 วินาที...
timeout /t 5 /nobreak >nul

:: เช็คว่ารันสำเร็จไหม
netstat -an | findstr :8000 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Backend รันแล้ว http://localhost:8000
    echo        Docs: http://localhost:8000/docs
) else (
    echo   [WAIT] Backend กำลังบูต... ดู log ที่ portable\logs\backend.log
)

netstat -an | findstr :3000 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Frontend รันแล้ว http://localhost:3000
) else (
    echo   [WAIT] Frontend กำลังบูต... (ครั้งแรกนาน 10-20 วิ) ดู log ที่ portable\logs\frontend.log
)

echo.
echo  ========================================================
echo   พร้อมใช้งาน!
echo   - เว็บหลัก: http://localhost:3000
echo   - API: http://localhost:8000/docs
echo   - Logs: portable\logs\
echo   - คลิป: portable\clips\
echo  ========================================================
echo.
echo   คำสั่งเพิ่มเติม:
echo   - กด Ctrl+C ในหน้าต่าง Backend/Frontend เพื่อหยุด
echo   - รัน stop.bat เพื่อหยุดทั้งหมด
echo   - ดับเบิลคลิก VIRALCUT.bat เพื่อเปิดเบราว์เซอร์อัตโนมัติ
echo.
echo   กดปุ่มใดๆ เพื่อเปิดเบราว์เซอร์...
pause >nul
start http://localhost:3000
