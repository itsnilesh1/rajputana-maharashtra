@echo off
title Rajputana Maharashtra - Setup
color 0A
echo.
echo  ==========================================
echo   RAJPUTANA MAHARASHTRA - AUTO SETUP
echo  ==========================================
echo.
echo  [1/3] Installing packages...
echo.
call npm install
if %errorlevel% neq 0 (
  echo.
  echo  ERROR: npm install failed. Make sure Node.js is installed.
  pause
  exit /b 1
)
echo.
echo  [2/3] Setting up database with sample data...
echo.
call npm run seed
if %errorlevel% neq 0 (
  echo.
  echo  ERROR: Seed failed. Check your .env.local MONGODB_URI
  pause
  exit /b 1
)
echo.
echo  [3/3] Starting development server...
echo.
echo  ==========================================
echo   Open browser: http://localhost:3000
echo  ==========================================
echo.
call npm run dev
