# F005 - 每日追踪记录

## 基本信息

| 属性 | 值 |
|------|-----|
| ID | F005 |
| 名称 | 每日追踪记录 |
| 状态 | ✅ DONE |
| 优先级 | P1 |
| 创建 | 2026-03-24 |

## 概述

用户可以每天记录颈椎症状评分和运动完成情况，追踪健康变化趋势。

## 设计

### 症状评分项

| 症状 | 范围 | 说明 |
|------|------|------|
| 颈椎不适 | 1-10 | 1=无不适，10=严重疼痛 |
| 肩膀酸痛 | 1-10 | 1=无酸痛，10=严重酸痛 |
| 后背不适 | 1-10 | 1=无不适，10=严重不适 |
| 睡眠质量 | 1-10 | 1=很好，10=很差 |
| 工作压力 | 1-10 | 1=无压力，10=压力很大 |

### 数据结构

```javascript
// 症状记录
{
  date: '2026-03-24',
  symptoms: {
    neck: 5,
    shoulder: 4,
    back: 3,
    sleep: 6,
    stress: 7,
  },
  note: '今天工作较累',
  timestamp: Date,
}

// 运动记录
{
  exerciseId: 'chin_tuck',
  exerciseName: '收下巴训练',
  date: '2026-03-24',
  timestamp: Date,
}
```

### 连续打卡计算

```javascript
function calculateStreak(logs) {
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (logs.some(log => log.date === dateStr)) {
      streak++;
    } else if (i === 0) {
      continue; // 今天还没记录
    } else {
      break;
    }
  }
  
  return streak;
}
```

## 验收标准

- [x] 症状评分滑块正常
- [x] 评分颜色随数值变化
- [x] 运动打卡可记录
- [x] 历史记录列表显示
- [x] 连续打卡天数计算正确

## 实现文件

```
src/pages/TrackPage.jsx
src/utils/storage.js
```
