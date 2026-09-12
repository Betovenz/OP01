@echo off
chcp 65001 >nul
title VIRALCUT - Stop

echo  หยุดระบบ VIRALCUT...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo  - หยุด Backend PID %%a
    taskkill /f /pid %%a >nul 2>nul
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo  - หยุด Frontend PID %%a
    taskkill /f /pid %%a >nul 2>nul
)

taskkill /f /im "VIRALCUT Backend" >nul 2>nul
taskkill /f /im "VIRALCUT Frontend" >nul 2>nul

echo  หยุดแล้ว!
timeout /t 2 >nul
