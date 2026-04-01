import React, { useState, useEffect } from 'react';
import { loadData, STORAGE_KEYS, formatDate, getLastNDays } from '../utils/storage';

export default function ReportPage() {
  const [period, setPeriod] = useState('week'); // week | month
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const logs = loadData(STORAGE_KEYS.DAILY_LOGS, []);
    const exerciseLogs = loadData(STORAGE_KEYS.EXERCISE_LOGS, []);
    const diagnosis = loadData(STORAGE_KEYS.DIAGNOSIS);

    const days = period === 'week' ? 7 : 30;
    const dateRange = getLastNDays(days);

    const periodLogs = logs.filter(l => dateRange.includes(l.date));
    const periodExerciseLogs = exerciseLogs.filter(l => dateRange.includes(l.date));

    // 计算统计数据
    const avgScore = (key) => {
      if (periodLogs.length === 0) return 0;
      const sum = periodLogs.reduce((acc, l) => acc + (l.symptoms[key] || 0), 0);
      return (sum / periodLogs.length).toFixed(1);
    };

    // 计算趋势
    const firstHalf = periodLogs.slice(0, Math.floor(periodLogs.length / 2));
    const secondHalf = periodLogs.slice(Math.floor(periodLogs.length / 2));
    const firstAvg = firstHalf.length > 0 
      ? (firstHalf.reduce((a, b) => a + b.symptoms.neck, 0) / firstHalf.length).toFixed(1) 
      : 0;
    const secondAvg = secondHalf.length > 0 
      ? (secondHalf.reduce((a, b) => a + b.symptoms.neck, 0) / secondHalf.length).toFixed(1) 
      : 0;
    const trend = firstAvg - secondAvg;

    // 连续打卡
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (exerciseLogs.some(l => l.date === dateStr) || logs.some(l => l.date === dateStr)) {
        streak++;
      } else if (streak > 0) {
        break;
      }
    }

    setStats({
      periodLogs: periodLogs.length,
      periodExercises: periodExerciseLogs.length,
      avgNeck: avgScore('neck'),
      avgShoulder: avgScore('shoulder'),
      avgBack: avgScore('back'),
      avgSleep: avgScore('sleep'),
      avgStress: avgScore('stress'),
      trend: trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable',
      trendValue: Math.abs(trend).toFixed(1),
      streak,
      totalLogs: logs.length,
      totalExercises: exerciseLogs.length,
      hasDiagnosis: !!diagnosis,
      diagnosisScore: diagnosis?.percentage || 0,
    });
  }, [period]);

  if (!stats) return null;

  const getTrendIcon = () => {
    if (stats.trend === 'up') return '📈';
    if (stats.trend === 'down') return '📉';
    return '➡️';
  };

  const getTrendText = () => {
    if (stats.trend === 'up') return '症状加重';
    if (stats.trend === 'down') return '症状改善';
    return '症状稳定';
  };

  const getTrendColor = () => {
    if (stats.trend === 'up') return 'text-red-500';
    if (stats.trend === 'down') return 'text-green-500';
    return 'text-slate-500';
  };

  return (
    <div className="fade-in">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">📈 健康报告</h2>

      {/* Period Toggle */}
      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-6">
        <button
          onClick={() => setPeriod('week')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            period === 'week' 
              ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          📅 周报
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            period === 'month' 
              ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          📆 月报
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-2xl mb-1">{stats.periodLogs}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">记录天数</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-2xl mb-1">{stats.periodExercises}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">运动次数</div>
        </div>
      </div>

      {/* Trend */}
      {stats.periodLogs >= 3 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">📈 症状趋势</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl font-bold ${getTrendColor()}`}>
                {getTrendIcon()} {getTrendText()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                颈椎不适 {stats.trendValue} 分 {stats.trend === 'down' ? '好转' : stats.trend === 'up' ? '加重' : '不变'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl">🔥</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">连续 {stats.streak} 天</div>
            </div>
          </div>
        </div>
      )}

      {/* Average Scores */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">📊 平均症状评分</h3>
        <div className="space-y-3">
          {[
            { key: 'avgNeck', label: '颈椎不适', icon: '🦴' },
            { key: 'avgShoulder', label: '肩膀酸痛', icon: '💪' },
            { key: 'avgBack', label: '背部不适', icon: '🔙' },
            { key: 'avgSleep', label: '睡眠质量', icon: '😴' },
            { key: 'avgStress', label: '压力等级', icon: '😰' },
          ].map(item => (
            <div key={item.key} className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                  <span className="font-semibold" style={{
                    color: stats[item.key] <= 3 ? '#22c55e' : stats[item.key] <= 6 ? '#f59e0b' : '#ef4444'
                  }}>
                    {stats[item.key]}/10
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(stats[item.key] / 10) * 100}%`,
                      backgroundColor: stats[item.key] <= 3 ? '#22c55e' : stats[item.key] <= 6 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">💡 健康建议</h3>
        <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
          {stats.periodLogs < period * 0.5 && (
            <li>• 建议增加记录频率，以便更好地追踪健康状况</li>
          )}
          {stats.periodExercises < 5 && (
            <li>• 建议每周至少运动3-5次</li>
          )}
          {parseFloat(stats.avgSleep) < 5 && (
            <li>• 睡眠质量有待改善，注意侧睡姿势和枕头高度</li>
          )}
          {parseFloat(stats.avgStress) > 6 && (
            <li>• 压力较大，建议每天做腹式呼吸练习</li>
          )}
          {stats.periodLogs >= period * 0.7 && stats.periodExercises >= 5 && (
            <li>• 继续保持良好的生活习惯！</li>
          )}
        </ul>
      </div>
    </div>
  );
}
