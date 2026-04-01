# F003 - 康复方案推荐

## 基本信息

| 属性 | 值 |
|------|-----|
| ID | F003 |
| 名称 | 康复方案推荐 |
| 状态 | ✅ DONE |
| 优先级 | P0 |
| 创建 | 2026-03-24 |

## 概述

提供4种预制的康复训练方案，根据用户的健康评估结果自动推荐最适合的方案。

## 设计

### 方案列表

| 方案 | 适用人群 | 运动数量 | 时长 |
|------|----------|----------|------|
| 预防保健方案 | 低风险用户 | 5个 | 10分钟 |
| 日常护理方案 | 中等风险 | 7个 | 15分钟 |
| 强化恢复方案 | 较高/高风险 | 9个 | 20分钟 |
| 体态矫正方案 | 姿势问题用户 | 6个 | 15分钟 |

### 方案结构

```javascript
{
  id: 'daily_care',
  name: '日常护理方案',
  description: '适合有轻微症状的用户',
  duration: '15分钟',
  difficulty: 'easy',
  exercises: [
    'chin_tuck',      // 收下巴
    'scapular_retraction', // 肩胛骨后缩
    'upper_trap_stretch',  // 上斜方肌拉伸
    // ...
  ],
  schedule: '每天早晚各一次',
}
```

### 推荐逻辑

```javascript
if (riskLevel === 'low') → 预防保健方案
if (riskLevel === 'medium') → 日常护理方案
if (riskLevel === 'high' || riskLevel === 'very-high') → 强化恢复方案
if (postureScore > threshold) → 体态矫正方案
```

## 验收标准

- [x] 4种方案数据完整
- [x] 根据评估结果自动推荐
- [x] 用户可查看所有方案
- [x] 方案详情页展示正确
- [x] 运动列表可点击查看

## 实现文件

```
src/data/plans.js
src/pages/ExercisePage.jsx
```
