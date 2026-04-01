# NeckGuard Git 推送脚本
# 以管理员身份运行 PowerShell，然后复制粘贴整个脚本执行

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NeckGuard 项目推送脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 创建目标目录
$targetDir = "C:\Projects\neckguard"
if (-not (Test-Path $targetDir)) {
    Write-Host "[1/6] 创建目录..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
} else {
    Write-Host "[1/6] 目录已存在，跳过..." -ForegroundColor Gray
}

# 2. 复制文件
Write-Host "[2/6] 复制项目文件..." -ForegroundColor Yellow
$sourceDir = "$env:USERPROFILE\.qclaw\workspace\projects\neckguard"
Copy-Item -Path "$sourceDir\*" -Destination $targetDir -Recurse -Force

# 3. 进入目录
Set-Location $targetDir

# 4. 初始化 Git（如果需要）
if (-not (Test-Path ".git")) {
    Write-Host "[3/6] 初始化 Git..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "[3/6] Git 已初始化，跳过..." -ForegroundColor Gray
}

# 5. 配置 Git（如果需要）
Write-Host "[4/6] 配置 Git..." -ForegroundColor Yellow
git config user.email "your-email@example.com"
git config user.name "Your Name"

# 6. 添加远程仓库并推送
Write-Host "[5/6] 添加远程仓库..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/aiyinluya/neckguard.git

Write-Host "[6/6] 提交并推送..." -ForegroundColor Yellow
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

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  完成！请检查 GitHub 仓库" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
