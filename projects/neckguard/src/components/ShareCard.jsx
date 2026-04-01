import React, { useState } from 'react';

/**
 * 打卡卡片生成器
 * 生成可分享的打卡图片
 */
export function ShareCard({ stats, exercise }) {
  const [show, setShow] = useState(false);

  const handleShare = async () => {
    setShow(true);
  };

  const handleCopy = () => {
    const text = `
🦒 NeckGuard 颈椎卫士 - 今日打卡

📅 打卡时间：${new Date().toLocaleDateString('zh-CN')}
💪 运动项目：${exercise?.name || '康复训练'}
⏱ 运动时长：${exercise?.duration || '15分钟'}

🏆 累计打卡：${stats?.totalDays || 1} 天
🔥 连续打卡：${stats?.streakDays || 1} 天

关注颈椎健康，从每天15分钟开始！
#颈椎健康 #健康管理 #NeckGuard
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板，可以粘贴分享给朋友！');
    });
  };

  if (!show) {
    return (
      <button
        onClick={handleShare}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all"
      >
        🎉 分享打卡
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* 预览卡片 */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white text-center">
          <div className="text-4xl mb-2">🦒</div>
          <h3 className="text-xl font-bold mb-1">NeckGuard 打卡</h3>
          <p className="text-white/80 text-sm">今日运动完成！</p>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">运动项目</span>
            <span className="text-slate-800 dark:text-white font-medium">{exercise?.name || '康复训练'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">运动时长</span>
            <span className="text-slate-800 dark:text-white font-medium">{exercise?.duration || '15分钟'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">累计打卡</span>
            <span className="text-slate-800 dark:text-white font-medium">{stats?.totalDays || 1} 天</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">连续打卡</span>
            <span className="text-slate-800 dark:text-white font-medium">🔥 {stats?.streakDays || 1} 天</span>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-2">
            <button
              onClick={() => setShow(false)}
              className="flex-1 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              关闭
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              📋 复制文案
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareCard;
