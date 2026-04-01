@echo off
chcp 65001 >nul
echo ========================================
echo   NeckGuard 项目初始化脚本
echo ========================================
echo.

echo [1/5] 正在复制项目文件...
if not exist "C:\Projects\neckguard" mkdir "C:\Projects\neckguard"
xcopy /E /Y /Q "%USERPROFILE%\.qclaw\workspace\projects\neckguard\*" "C:\Projects\neckguard\"

echo [2/5] 进入项目目录...
cd /d C:\Projects\neckguard

echo [3/5] 初始化 Git...
git init

echo [4/5] 添加远程仓库...
git remote add origin https://github.com/aiyinluya/neckguard.git

echo [5/5] 提交并推送...
git add .
git commit -m "feat: 初始版本 - 颈椎健康管理工具

- 症状自测 (18道问卷)
- 康复方案 (4方案 + 13运动)
- 追踪记录 (图表可视化)
- 知识库 (5篇科普文章)
- 提醒设置 (浏览器通知)

Built with React + Tailwind + Chart.js"
git branch -M main
git push -u origin main --force

echo.
echo ========================================
echo   完成！项目已推送到 GitHub
echo ========================================
echo.
pause
