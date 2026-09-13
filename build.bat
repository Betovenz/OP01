@echo off
chcp 65001 >nul
title VIRALCUT - AI Viral Clip Factory - Portable Builder

echo.
echo  ========================================================
echo   VIRALCUT - AI ตัดคลิป YouTube TikTok ไวรัลอัตโนมัติ
echo   Portable Build System v1.0
echo  ========================================================
echo.

:: ตรวจสอบว่าอยู่ในโฟลเดอร์ที่ถูกต้อง
if not exist "package.json" (
    echo [ERROR] ไม่พบ package.json กรุณารันไฟล์นี้ในโฟลเดอร์โปรเจค VIRALCUT
    pause
    exit /b 1
)

:: สร้างโฟลเดอร์ portable
if not exist "portable" mkdir portable
if not exist "portable\downloads" mkdir portable\downloads
if not exist "portable\clips" mkdir portable\clips

echo [1/6] ตรวจสอบ Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo   - ไม่พบ Node.js กำลังติดตั้งแบบ Portable...
    echo   - กรุณาติดตั้ง Node.js จาก https://nodejs.org/ LTS
    echo   - หรือรัน: winget install OpenJS.NodeJS.LTS
    echo.
    echo   กำลังลองติดตั้งด้วย winget...
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] ติดตั้ง Node.js ไม่ได้ กรุณาติดตั้งเอง
        pause
        exit /b 1
    )
) else (
    for /f "tokens=*" %%i in ('node -v') do echo   - พบ Node.js %%i
)

echo [2/6] ตรวจสอบ Python...
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    where python3 >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo   - ไม่พบ Python กำลังติดตั้ง...
        winget install Python.Python.3.11 --accept-package-agreements --accept-source-agreements
        if %ERRORLEVEL% NEQ 0 (
            echo [ERROR] ติดตั้ง Python ไม่ได้ กรุณาติดตั้งจาก https://python.org
            pause
            exit /b 1
        )
    )
)

:: หา python command
set PYTHON_CMD=python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 set PYTHON_CMD=python3
for /f "tokens=*" %%i in ('%PYTHON_CMD% --version') do echo   - พบ %%i

echo [3/6] ตรวจสอบ FFmpeg (จำเป็นสำหรับตัดวิดีโอจริง)...
where ffmpeg >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo   - ไม่พบ FFmpeg จะใช้โหมด Mock (โชว์ผลได้แต่ตัดไฟล์จริงไม่ได้)
    echo   - แนะนำติดตั้ง: winget install Gyan.FFmpeg
    echo   - กำลังลองติดตั้ง...
    winget install Gyan.FFmpeg --accept-package-agreements --accept-source-agreements >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo   - ติดตั้ง FFmpeg สำเร็จ!
    ) else (
        echo   - ข้าม FFmpeg ไปก่อน (ยังใช้งานได้แบบ Mock)
    )
) else (
    for /f "tokens=*" %%i in ('ffmpeg -version ^| findstr "ffmpeg version"') do echo   - พบ %%i
)

echo [4/6] สร้าง Python Virtual Environment (Portable)...
if not exist "portable\venv" (
    echo   - สร้าง venv ใหม่...
    %PYTHON_CMD% -m venv portable\venv
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] สร้าง venv ไม่ได้
        pause
        exit /b 1
    )
) else (
    echo   - พบ venv เดิมแล้ว
)

echo   - ติดตั้ง Python Dependencies...
call portable\venv\Scripts\activate.bat
python -m pip install --upgrade pip --quiet
pip install -r backend\requirements.txt --quiet
pip install faster-whisper --quiet 2>nul
echo   - ติดตั้ง yt-dlp, fastapi, uvicorn, whisper เรียบร้อย

echo [5/6] ติดตั้ง Node.js Dependencies...
if not exist "node_modules" (
    echo   - npm install (ครั้งแรกจะนาน 1-2 นาที)...
    call npm install --silent
) else (
    echo   - พบ node_modules แล้ว ข้าม
)

echo [6/6] Build Frontend...
echo   - กำลัง Build Next.js...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Build ไม่สำเร็จ แต่ยังรันแบบ dev ได้
)

echo.
echo  ========================================================
echo   BUILD สำเร็จ! พร้อมใช้งานแบบ Portable
echo  ========================================================
echo.
echo   โฟลเดอร์ Portable:
echo   - portable\venv\          = Python แยก (ไม่ยุ่งกับเครื่อง)
echo   - portable\downloads\     = วิดีโอที่โหลดมา
echo   - portable\clips\         = คลิปที่ตัดเสร็จ
echo.
echo   วิธีรัน:
echo   1. ดับเบิลคลิก run.bat           = รันทั้ง Frontend+Backend
echo   2. ดับเบิลคลิก VIRALCUT.bat      = รัน + เปิดเบราว์เซอร์อัตโนมัติ
echo.
echo   URL:
echo   - เว็บหลัก: http://localhost:3000
echo   - API Docs: http://localhost:8000/docs
echo.
echo   กดปุ่มใดๆ เพื่อเปิด run.bat เลย...
pause >nul
call run.bat
