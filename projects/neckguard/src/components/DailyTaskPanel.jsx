import React, { useState, useEffect } from 'react';
import { loadData, STORAGE_KEYS, saveData, getToday } from '../utils/storage';

export function DailyTaskPanel() {
  const [tasks, setTasks] = useState([]);
  const today = getToday();

  useEffect(() => {
    // 初始化今日任务
    const savedTasks = loadData('DAILY_TASKS', {});
    const todayTasks = savedTasks[today] || [
      {
        id: 'assessment',
        title: '完成症状评估',
        description: '评估你的颈椎健康状况',
        icon: '🩺',
        points: 10,
        completed: false,
        link: '/assessment',
      },
      {
        id: 'exercise',
        title: '做一组康复运动',
        description: '完成推荐的运动方案',
        icon: '💪',
        points: 20,
        completed: false,
        link: '/exercise',
      },
      {
        id: 'track',
        title: '记录今日症状',
        description: '记录颈椎、肩膀、睡眠等状况',
        icon: '📊',
        points: 10,
        completed: false,
        link: '/track',
      },
    ];

    setTasks(todayTasks);
  }, [today]);

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);

    // 保存到本地
    const savedTasks = loadData('DAILY_TASKS', {});
    savedTasks[today] = updatedTasks;
    saveData('DAILY_TASKS', savedTasks);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalPoints = tasks.reduce((sum, t) => sum + (t.completed ? t.points : 0), 0);
  const progress = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">📋 今日任务</h3>
        <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
          {completedCount}/{tasks.length} 完成
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">进度</span>
          <span className="text-xs font-semibold text-green-600 dark:text-green-400">{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2 mb-4">
        {tasks.map(task => (
          <button
            key={task.id}
            onClick={() => completeTask(task.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              task.completed
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <div className="text-lg">{task.completed ? '✅' : task.icon}</div>
            <div className="flex-1 text-left">
              <div className={`text-sm font-medium ${task.completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                {task.title}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{task.description}</div>
            </div>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">+{task.points}</div>
          </button>
        ))}
      </div>

      {/* Reward */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">完成奖励</div>
            <div className="text-sm font-bold text-amber-600 dark:text-amber-400">+{totalPoints} 积分</div>
          </div>
          <div className="text-2xl">🎁</div>
        </div>
      </div>
    </div>
  );
}

export default DailyTaskPanel;
