@echo off
chcp 65001 >nul
title VIRALCUT - One Click Launch

echo.
echo  ██╗   ██╗██╗██████╗  █████╗ ██╗      ██████╗██╗   ██╗████████╗
echo  ██║   ██║██║██╔══██╗██╔══██╗██║     ██╔════╝██║   ██║╚══██╔══╝
echo  ██║   ██║██║██████╔╝███████║██║     ██║     ██║   ██║   ██║   
echo  ╚██╗ ██╔╝██║██╔══██╗██╔══██║██║     ██║     ██║   ██║   ██║   
echo   ╚████╔╝ ██║██║  ██║██║  ██║███████╗╚██████╗╚██████╔╝   ██║   
echo    ╚═══╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝    ╚═╝   
echo.
echo  AI ตัดคลิป YouTube TikTok ไวรัลอัตโนมัติ - Portable Edition
echo  ========================================================
echo.

:: ตรวจสอบ build ครั้งแรกไหม
if not exist "portable\venv" (
    echo  ครั้งแรกที่รัน! กำลังติดตั้งระบบ (2-3 นาที)...
    echo.
    call build.bat
    exit /b
)

:: รันเลย
call run.bat

:: รอให้ frontend พร้อมแล้วเปิดเบราว์เซอร์
echo.
echo  รอ Frontend พร้อม...
:waitloop
timeout /t 2 /nobreak >nul
netstat -an | findstr :3000 | findstr LISTENING >nul
if %ERRORLEVEL% NEQ 0 goto waitloop

echo  เปิดเบราว์เซอร์...
timeout /t 2 /nobreak >nul
start http://localhost:3000
start http://localhost:8000/docs

echo.
echo  เปิดแล้ว! ถ้าเบราว์เซอร์ไม่เปิดให้เปิดเอง:
echo  http://localhost:3000
echo.
pause
