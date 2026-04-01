# 🦒 NeckGuard — 颈椎卫士

> 专为程序员和伏案工作者设计的开源颈椎健康管理工具

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## ✨ 特性

- 🩺 **症状自测** — 18道专业问题快速评估颈椎健康状况
- 💪 **康复方案** — 4种预制方案 + 13个专业运动（拉伸/强化/放松）
- 📊 **追踪记录** — 每日症状记录 + 可视化趋势图表
- 📚 **知识库** — 颈椎健康科普知识，从解剖学到日常护理
- ⏰ **提醒系统** — 工作/运动/睡眠定时提醒
- 🔒 **隐私优先** — 所有数据存储在浏览器本地，不上传任何服务器
- 📱 **响应式设计** — 手机和电脑均可使用
- 🌍 **开源免费** — MIT 协议，社区驱动

## 🚀 在线预览

部署到 GitHub Pages / Vercel / Netlify 后即可在线使用。

## 🛠️ 本地开发

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装

```bash
git clone https://github.com/your-username/neck-guard.git
cd neck-guard
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建

```bash
npm run build
```

构建产物在 `dist/` 目录，可部署到任何静态文件服务器。

## 📁 项目结构

```
neck-guard/
├── public/
│   └── favicon.svg
├── src/
│   ├── data/
│   │   ├── questions.js      # 评估问卷数据
│   │   ├── exercises.js      # 运动库数据
│   │   ├── plans.js          # 训练方案数据
│   │   └── knowledge.js      # 知识库内容
│   ├── pages/
│   │   ├── HomePage.jsx      # 首页
│   │   ├── AssessmentPage.jsx # 诊断评估
│   │   ├── ExercisePage.jsx  # 康复方案
│   │   ├── TrackPage.jsx     # 追踪记录
│   │   ├── KnowledgePage.jsx # 知识库
│   │   └── ReminderPage.jsx  # 提醒设置
│   ├── utils/
│   │   └── storage.js        # 本地存储工具
│   ├── styles/
│   │   └── index.css         # 全局样式
│   ├── App.jsx               # 应用入口
│   └── main.jsx              # 渲染入口
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🤝 参与贡献

欢迎贡献！以下是参与方式：

1. 🐛 [提交 Issue](https://github.com/your-username/neck-guard/issues) — Bug 报告或功能建议
2. 🔀 提交 Pull Request — 代码贡献
3. 📝 完善知识库内容 — 在 `src/data/knowledge.js` 中添加文章
4. 🏋️ 添加运动数据 — 在 `src/data/exercises.js` 中添加运动
5. 🌍 多语言翻译 — 支持 i18n

详见 [CONTRIBUTING.md](CONTRIBUTING.md)

## 📋 贡献内容指南

### 添加知识库文章

在 `src/data/knowledge.js` 中添加对象：

```javascript
{
  id: 'your_article_id',
  category: 'basics', // basics | problems | work | sleep
  title: '文章标题',
  summary: '一句话摘要',
  content: `## 二级标题\n\n内容...`,
}
```

### 添加康复运动

在 `src/data/exercises.js` 中添加对象：

```javascript
{
  id: 'your_exercise_id',
  category: 'stretch', // stretch | strengthen | relax
  name: '运动名称',
  targetMuscle: '目标肌肉',
  difficulty: 'easy', // easy | medium | hard
  duration: '执行时间/组数',
  steps: ['步骤1', '步骤2', ...],
  tips: ['提示1', '提示2', ...],
  mistakes: ['错误1', '错误2', ...],
  tags: ['标签1', '标签2'],
}
```

## ⚠️ 免责声明

本项目仅供健康参考和教育用途，不构成任何医疗诊断或治疗建议。如果你有严重的颈肩问题（如持续麻木、无力），请及时就医，咨询专业医生。

## 📄 开源协议

[MIT License](LICENSE)

---

**⭐ 如果这个项目对你有帮助，请给一个 Star！**
