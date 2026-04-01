# F009 - 暗色模式

## 基本信息

| 属性 | 值 |
|------|-----|
| ID | F009 |
| 名称 | 暗色模式 |
| 状态 | ✅ DONE |
| 优先级 | P1 |
| 创建 | 2026-03-24 |

## 概述

支持暗色/亮色主题切换，自动检测系统偏好，状态持久化保存。

## 设计

### 实现方式

- 使用 TailwindCSS `dark:` 前缀
- 通过 `dark` class 控制主题
- LocalStorage 持久化主题偏好

### 主题切换按钮

- 位置：页面右上角
- 图标：🌙 / ☀️
- 点击切换

### 颜色映射

| 元素 | 亮色模式 | 暗色模式 |
|------|----------|----------|
| 背景 | slate-50 | slate-900 |
| 卡片 | white | slate-800 |
| 边框 | slate-200 | slate-700 |
| 文字 | slate-800 | white |
| 次要文字 | slate-500 | slate-400 |

## 验收标准

- [x] 主题切换按钮正常
- [x] 自动检测系统偏好
- [x] 状态持久化保存
- [x] 所有页面适配
- [x] 图表适配暗色模式

## 实现文件

```
src/components/ThemeProvider.jsx
src/components/ThemeToggle.jsx
src/App.jsx
tailwind.config.js
```
