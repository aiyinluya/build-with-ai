# F011 - PWA支持

## 基本信息

| 属性 | 值 |
|------|-----|
| ID | F011 |
| 名称 | PWA支持 |
| 状态 | ✅ DONE |
| 优先级 | P2 |
| 创建 | 2026-03-24 |

## 概述

支持 PWA（渐进式 Web 应用），用户可以将其添加到手机桌面，获得类似原生应用的体验。

## 设计

### Manifest配置

```json
{
  "name": "NeckGuard - 颈椎卫士",
  "short_name": "NeckGuard",
  "description": "开源颈椎健康管理工具",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#22c55e",
  "icons": [...]
}
```

### 功能特性

- 可添加到主屏幕
- 离线可用（Service Worker）
- 独立窗口运行
- 主题色适配

## 验收标准

- [x] manifest.json 配置正确
- [x] 可添加到主屏幕
- [x] 图标显示正常
- [x] 主题色正确

## 实现文件

```
public/manifest.json
index.html
```
