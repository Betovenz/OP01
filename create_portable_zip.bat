@echo off
chcp 65001 >nul
title Create Portable ZIP

echo สร้างไฟล์ ZIP สำหรับแจก...

:: สร้างโฟลเดอร์ dist
if not exist "dist" mkdir dist

:: ลบไฟล์เก่า
if exist "dist\VIRALCUT-Portable-Clean.zip" del "dist\VIRALCUT-Portable-Clean.zip"
if exist "dist\VIRALCUT-Portable-Full.zip" del "dist\VIRALCUT-Portable-Full.zip"

echo [1/2] สร้างแบบ Clean (เล็ก 5MB - ต้องติดตั้งตอนรัน)...
powershell -Command "Compress-Archive -Path 'VIRALCUT.bat','build.bat','run.bat','stop.bat','VIRALCUT.sh','build.sh','run.sh','stop.sh','package.json','package-lock.json','next.config.js','tailwind.config.js','postcss.config.js','tsconfig.json','Dockerfile','docker-compose.yml','README.md','PORTABLE_GUIDE.md','GUIDE_TH.md','src','backend','scripts','public' -DestinationPath 'dist\VIRALCUT-Portable-Clean.zip' -Force"

echo [2/2] สร้างแบบ Full (ใหญ่ 300MB - รันได้เลย)...
:: ต้องมี node_modules กับ portable ก่อน
if not exist "node_modules" (
    echo   - ไม่พบ node_modules ข้ามแบบ Full
) else (
    powershell -Command "Compress-Archive -Path 'VIRALCUT.bat','build.bat','run.bat','stop.bat','VIRALCUT.sh','build.sh','run.sh','stop.sh','package.json','next.config.js','tailwind.config.js','postcss.config.js','tsconfig.json','README.md','PORTABLE_GUIDE.md','GUIDE_TH.md','src','backend','scripts','public','node_modules','portable' -DestinationPath 'dist\VIRALCUT-Portable-Full.zip' -Force"
)

echo.
echo เสร็จแล้ว! ไฟล์อยู่ที่ dist\
dir dist\*.zip
pause
