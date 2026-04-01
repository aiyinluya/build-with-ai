import { loadData, STORAGE_KEYS, formatDate, getLastNDays } from '../utils/storage';
import { plans } from '../data/plans';
import { exercises } from '../data/exercises';

export function exportToCSV() {
  const logs = loadData(STORAGE_KEYS.DAILY_LOGS, []);
  const exerciseLogs = loadData(STORAGE_KEYS.EXERCISE_LOGS, []);
  const diagnosis = loadData(STORAGE_KEYS.DIAGNOSIS);

  let csv = 'NeckGuard 数据导出\n';
  csv += `导出时间,${new Date().toLocaleString('zh-CN')}\n\n`;

  // 诊断结果
  if (diagnosis && diagnosis.answers) {
    csv += '=== 诊断结果 ===\n';
    csv += `评估时间,${new Date(diagnosis.timestamp).toLocaleString('zh-CN')}\n`;
    csv += `总分,${diagnosis.total}/100\n`;
    csv += `风险等级,${diagnosis.riskLabel}\n`;
    csv += '\n';
  }

  // 症状记录
  if (logs.length > 0) {
    csv += '=== 每日症状记录 ===\n';
    csv += '日期,颈椎不适,肩膀酸痛,背部不适,睡眠质量,压力等级,备注\n';
    logs.sort((a, b) => b.date.localeCompare(a.date)).forEach(log => {
      csv += `${formatDate(log.date)},${log.symptoms.neck},${log.symptoms.shoulder},${log.symptoms.back},${log.symptoms.sleep},${log.symptoms.stress},"${log.note || ''}"\n`;
    });
    csv += '\n';
  }

  // 运动记录
  if (exerciseLogs.length > 0) {
    csv += '=== 运动记录 ===\n';
    csv += '日期,运动名称,完成时间\n';
    exerciseLogs.sort((a, b) => b.date.localeCompare(a.date)).forEach(log => {
      csv += `${formatDate(log.date)},${log.exerciseName},${new Date(log.timestamp).toLocaleTimeString('zh-CN')}\n`;
    });
  }

  // 下载
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `neckguard-export-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function generateReport() {
  const logs = loadData(STORAGE_KEYS.DAILY_LOGS, []);
  const exerciseLogs = loadData(STORAGE_KEYS.EXERCISE_LOGS, []);
  const diagnosis = loadData(STORAGE_KEYS.DIAGNOSIS);

  const last7Days = getLastNDays(7);
  const last30Days = getLastNDays(30);

  // 计算统计数据
  const recentLogs = logs.filter(l => last7Days.includes(l.date));
  const monthLogs = logs.filter(l => last30Days.includes(l.date));

  const avgScore = (key) => {
    if (recentLogs.length === 0) return 0;
    const sum = recentLogs.reduce((acc, l) => acc + (l.symptoms[key] || 0), 0);
    return (sum / recentLogs.length).toFixed(1);
  };

  const exerciseCount = exerciseLogs.filter(l => last7Days.includes(l.date)).length;
  const streakDays = (() => {
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (exerciseLogs.some(l => l.date === dateStr) || logs.some(l => l.date === dateStr)) {
        streak++;
      } else if (streak > 0) {
        break;
      }
    }
    return streak;
  })();

  // 生成报告
  let report = `# NeckGuard 健康报告

## 📅 报告生成时间
${new Date().toLocaleString('zh-CN')}

---

## 📊 整体评估

`;
  if (diagnosis) {
    report += `| 项目 | 数值 |
|------|------|
| 健康评分 | ${diagnosis.percentage}/100 |
| 风险等级 | ${diagnosis.riskLabel} |
| 评估时间 | ${new Date(diagnosis.timestamp).toLocaleString('zh-CN')} |

`;
  }

  report += `---

## 📈 近7天数据

| 指标 | 数值 |
|------|------|
| 记录天数 | ${recentLogs.length}/7 |
| 颈椎平均不适 | ${avgScore('neck')}/10 |
| 肩膀平均酸痛 | ${avgScore('shoulder')}/10 |
| 背部平均不适 | ${avgScore('back')}/10 |
| 睡眠平均质量 | ${avgScore('sleep')}/10 |
| 平均压力 | ${avgScore('stress')}/10 |

---

## 💪 运动情况

| 指标 | 数值 |
|------|------|
| 本周运动次数 | ${exerciseCount}次 |
| 连续打卡 | ${streakDays}天 |
| 总运动记录 | ${exerciseLogs.length}次 |

---

## 📝 建议

${getSuggestions(diagnosis, recentLogs, exerciseCount)}

---

*本报告由 NeckGuard 自动生成*
`;

  return report;
}

function getSuggestions(diagnosis, recentLogs, exerciseCount) {
  const suggestions = [];

  if (diagnosis && diagnosis.percentage > 45) {
    suggestions.push('• 你的颈椎健康评分较低，建议每天坚持康复运动');
  }

  if (exerciseCount < 5) {
    suggestions.push('• 建议每周至少运动3-5次，保持肌肉活跃');
  }

  const hasRecentLogs = recentLogs.filter(l => l.symptoms.shoulder > 5).length > 0;
  if (hasRecentLogs) {
    suggestions.push('• 最近肩膀不适感较强，建议增加上斜方肌拉伸');
  }

  const sleepAvg = recentLogs.length > 0 
    ? recentLogs.reduce((a, b) => a + b.symptoms.sleep, 0) / recentLogs.length 
    : 0;
  if (sleepAvg < 5) {
    suggestions.push('• 睡眠质量有待改善，注意侧睡姿势和枕头高度');
  }

  if (suggestions.length === 0) {
    suggestions.push('• 继续保持良好的生活习惯和运动习惯！');
  }

  return suggestions.join('\n');
}

export function exportToMarkdown() {
  const report = generateReport();
  
  const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `neckguard-report-${new Date().toISOString().split('T')[0]}.md`;
  link.click();
  URL.revokeObjectURL(link.href);
}
