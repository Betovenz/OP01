#!/bin/bash
echo " หยุดระบบ VIRALCUT..."
lsof -ti:8000 | xargs kill -9 2>/dev/null && echo " - หยุด Backend" || echo " - Backend ไม่ได้รัน"
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo " - หยุด Frontend" || echo " - Frontend ไม่ได้รัน"
echo " หยุดแล้ว!"
