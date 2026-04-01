import React, { useState, useEffect } from 'react';
import { loadData, saveData, getToday } from '../utils/storage';

export function PointsPanel() {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    // 从本地加载积分
    const savedPoints = loadData('USER_POINTS', 0);
    setPoints(savedPoints);
    
    // 计算等级
    const newLevel = Math.floor(savedPoints / 100) + 1;
    setLevel(newLevel);
  }, []);

  const pointsForNextLevel = level * 100;
  const currentLevelPoints = (level - 1) * 100;
  const progressToNextLevel = points - currentLevelPoints;
  const pointsNeeded = pointsForNextLevel - currentLevelPoints;
  const progressPercent = Math.round((progressToNextLevel / pointsNeeded) * 100);

  const getLevelName = (lv) => {
    if (lv <= 1) return '青铜会员';
    if (lv <= 3) return '白银会员';
    if (lv <= 5) return '黄金会员';
    if (lv <= 8) return '铂金会员';
    return '钻石会员';
  };

  const getLevelColor = (lv) => {
    if (lv <= 1) return 'from-amber-400 to-amber-600';
    if (lv <= 3) return 'from-slate-300 to-slate-500';
    if (lv <= 5) return 'from-yellow-400 to-yellow-600';
    if (lv <= 8) return 'from-blue-300 to-blue-500';
    return 'from-purple-400 to-purple-600';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-6">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">⭐ 我的等级</h3>

      {/* Level Display */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getLevelColor(level)} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
          {level}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-800 dark:text-white">{getLevelName(level)}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            总积分: <span className="font-bold text-slate-700 dark:text-slate-300">{points}</span>
          </div>
        </div>
      </div>

      {/* Progress to Next Level */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-600 dark:text-slate-400">升级进度</span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {progressToNextLevel} / {pointsNeeded}
          </span>
        </div>
        <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Level Benefits */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">🎁 当前特权</div>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <li>✓ 解锁所有康复方案</li>
          <li>✓ 每日任务奖励 +{Math.min(10 + level * 5, 50)} 积分</li>
          <li>✓ 数据导出功能</li>
          {level >= 3 && <li>✓ 高级分析报告</li>}
          {level >= 5 && <li>✓ 专属运动计划</li>}
        </ul>
      </div>
    </div>
  );
}

export default PointsPanel;
