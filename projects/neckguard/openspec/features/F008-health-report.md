# F008 - 健康报告

## 基本信息

| 属性 | 值 |
|------|-----|
| ID | F008 |
| 名称 | 健康报告 |
| 状态 | ✅ DONE |
| 优先级 | P1 |
| 创建 | 2026-03-25 |

## 概述

自动生成周报和月报，分析用户的症状趋势、运动打卡情况，并提供健康建议。

## 设计

### 报告类型

| 类型 | 时间范围 | 内容 |
|------|----------|------|
| 周报 | 最近7天 | 症状趋势、打卡统计 |
| 月报 | 最近30天 | 综合健康分析 |

### 报告内容

1. **症状趋势分析**
   - 期间平均分
   - 前半段 vs 后半段对比
   - 趋势判断（改善/稳定/恶化）

2. **运动打卡统计**
   - 打卡天数
   - 打卡率
   - 连续打卡天数

3. **健康建议**
   - 基于症状趋势的建议
   - 基于打卡情况的建议

### 趋势判断算法

```javascript
// 将期间分为前后两半
const midPoint = Math.floor(data.length / 2);
const firstHalf = data.slice(0, midPoint);
const secondHalf = data.slice(midPoint);

const firstAvg = average(firstHalf);
const secondAvg = average(secondHalf);

const change = secondAvg - firstAvg;

if (change < -1) return '改善';
if (change > 1) return '恶化';
return '稳定';
```

## 验收标准

- [x] 周报/月报切换正常
- [x] 症状趋势计算正确
- [x] 打卡统计正确
- [x] 健康建议合理
- [x] 暗色模式适配

## 实现文件

```
src/pages/ReportPage.jsx
```
