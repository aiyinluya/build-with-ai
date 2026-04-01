import React, { useState } from 'react';
import { loadData, STORAGE_KEYS, getToday } from '../utils/storage';
import { getUserStats, achievements } from '../components/AchievementPanel';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const stats = getUserStats();
  const unlockedCount = achievements.filter(a => a.condition(stats)).length;

  // 计算连续天数
  const logs = loadData(STORAGE_KEYS.DAILY_LOGS, []);
  const exerciseLogs = loadData(STORAGE_KEYS.EXERCISE_LOGS, []);
  const diagnosis = loadData(STORAGE_KEYS.DIAGNOSIS);

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  const weekActivity = last7Days.map(date => ({
    date,
    hasLog: logs.some(l => l.date === date),
    hasExercise: exerciseLogs.some(l => l.date === date),
  }));

  const today = getToday();

  return (
    <div className="fade-in">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl">
            🦒
          </div>
          <div>
            <h1 className="text-xl font-bold">颈椎卫士用户</h1>
            <p className="text-green-100 text-sm">坚持健康每一天</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                🏆 {unlockedCount}/{achievements.length} 成就
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-green-600">{stats.streakDays}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">连续打卡天数</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-blue-600">{stats.totalExercises}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">累计运动次数</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-purple-600">{logs.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">记录天数</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-amber-600">
            {diagnosis ? diagnosis.percentage : '--'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">健康评分</div>
        </div>
      </div>

      {/* Week Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">📅 本周活动</h3>
        <div className="flex justify-between">
          {weekActivity.map((day, i) => {
            const dayName = ['日', '一', '二', '三', '四', '五', '六'][new Date(day.date).getDay()];
            const isToday = day.date === today;
            const hasActivity = day.hasLog || day.hasExercise;
            
            return (
              <div key={day.date} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                  isToday 
                    ? 'bg-green-500 text-white' 
                    : hasActivity 
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                }`}>
                  {hasActivity ? '✓' : ''}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{dayName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <button 
          onClick={() => setActiveTab('data')}
          className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📊</span>
            <span className="text-sm text-slate-700 dark:text-slate-300">我的数据</span>
          </div>
          <span className="text-slate-400">→</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">⚙️</span>
            <span className="text-sm text-slate-700 dark:text-slate-300">设置</span>
          </div>
          <span className="text-slate-400">→</span>
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50">
          <div className="flex items-center gap-3">
            <span className="text-lg">ℹ️</span>
            <span className="text-sm text-slate-700 dark:text-slate-300">关于</span>
          </div>
          <span className="text-slate-400">v1.0.0</span>
        </button>
      </div>
    </div>
  );
}
