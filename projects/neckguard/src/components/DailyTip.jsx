import React, { useState, useEffect } from 'react';
import { loadData, STORAGE_KEYS, getToday } from '../utils/storage';

const tips = [
  { icon: '🧘', title: '定时休息', content: '每工作45-90分钟，站起来活动5分钟' },
  { icon: '📱', title: '正确用手机', content: '手机举到视线高度，避免低头看' },
  { icon: '🛏️', title: '侧睡注意', content: '侧睡时手臂不要压在身下，枕头要高12-15cm' },
  { icon: '💪', title: '坚持运动', content: '每天15分钟康复运动，预防颈椎问题' },
  { icon: '🌡️', title: '注意保暖', content: '颈部保暖很重要，避免受凉' },
  { icon: '😴', title: '优质睡眠', content: '选对枕头，让颈椎在睡眠中得到修复' },
  { icon: '🖥️', title: '显示器高度', content: '屏幕顶端与视线平齐，减少颈椎压力' },
  { icon: '深呼吸', title: '腹式呼吸', content: '压力大时做10次腹式呼吸，缓解紧张' },
];

export function DailyTip() {
  const [showTip, setShowTip] = useState(false);
  const [tip, setTip] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 检查是否今天已经显示过
    const lastShown = localStorage.getItem('neckguard_tip_date');
    const today = getToday();
    
    if (lastShown !== today) {
      // 随机选择一个提示
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setTip(randomTip);
      setShowTip(true);
      localStorage.setItem('neckguard_tip_date', today);
    }
  }, []);

  const handleDismiss = () => {
    setShowTip(false);
    setDismissed(true);
  };

  if (!showTip || !tip) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 md:hidden">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 max-w-xs border border-slate-200 dark:border-slate-700 animate-slide-up">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{tip.icon}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{tip.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tip.content}</p>
          </div>
          <button onClick={handleDismiss} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default DailyTip;
