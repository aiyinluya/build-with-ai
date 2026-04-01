# NeckGuard - OpenSpec 项目规范

本目录包含 NeckGuard 项目的所有需求、规范和追踪文档。

## 目录结构

```
openspec/
├── README.md              # 本文件 - 索引
├── SPEC.md                # 项目总规范
├── features/              # 功能需求
│   ├── F001-symptom-assessment.md
│   ├── F002-health-score.md
│   ├── F003-rehab-plans.md
│   ├── F004-exercise-library.md
│   ├── F005-daily-tracking.md
│   ├── F006-knowledge-base.md
│   ├── F007-reminders.md
│   ├── F008-dark-mode.md
│   ├── F009-data-export.md
│   ├── F010-achievements.md
│   └── F101-smart-recommend.md
├── bugs/                  # Bug追踪
│   └── TPL.md
├── releases/              # 发布版本
│   └── v1.0.0.md
└── CHANGELOG.md           # 变更日志
```

## 使用说明

### 添加新功能
1. 在 `features/` 创建新文件，命名格式：`F###-功能名.md`
2. 更新 `SPEC.md` 中的功能列表

### 记录Bug
1. 在 `bugs/` 创建文件，命名格式：`BUG###-简述.md`
2. 修复后移动到 `bugs/resolved/` 目录

### 发布版本
1. 在 `releases/` 创建版本文件
2. 更新 `CHANGELOG.md`

---

## 快速链接

- [项目总规范](./SPEC.md)
- [功能需求](./features/)
- [变更日志](./CHANGELOG.md)
