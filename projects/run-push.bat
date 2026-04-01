@echo off
chcp 65001 >nul
echo ========================================
echo   NeckGuard 项目推送
echo ========================================
echo.
echo 请确保已经以管理员身份运行
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0push-neckguard.ps1"
echo.
pause
