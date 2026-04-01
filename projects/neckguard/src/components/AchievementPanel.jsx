import { loadData, STORAGE_KEYS, getLastNDays } from '../utils/storage';

export const achievements = [
  {
    id: 'first_diagnosis',
    name: '初次评估',
    description: '完成第一次健康评估',
    icon: '🩺',
    condition: (stats) => stats.hasDiagnosis,
  },
  {
    id: 'streak_3',
    name: '坚持3天',
    description: '连续3天记录或运动',
    icon: '🔥',
    condition: (stats) => stats.streakDays >= 3,
  },
  {
    id: 'streak_7',
    name: '一周坚持',
    description: '连续7天记录或运动',
    icon: '⭐',
    condition: (stats) => stats.streakDays >= 7,
  },
  {
    id: 'streak_30',
    name: '月度打卡',
    description: '连续30天记录或运动',
    icon: '🏆',
    condition: (stats) => stats.streakDays >= 30,
  },
  {
    id: 'exercise_10',
    name: '运动新手',
    description: '累计完成10次运动',
    icon: '💪',
    condition: (stats) => stats.totalExercises >= 10,
  },
  {
    id: 'exercise_50',
    name: '运动达人',
    description: '累计完成50次运动',
    icon: '🎯',
    condition: (stats) => stats.totalExercises >= 50,
  },
  {
    id: 'exercise_100',
    name: '运动冠军',
    description: '累计完成100次运动',
    icon: '🥇',
    condition: (stats) => stats.totalExercises >= 100,
  },
  {
    id: 'low_score',
    name: '改善明显',
    description: '健康评分降低20分以上',
    icon: '📉',
    condition: (stats) => stats.scoreImproved >= 20,
  },
  {
    id: 'all_plans',
    name: '方案达人',
    description: '完成所有4个训练方案',
    icon: '📋',
    condition: (stats) => stats.completedPlans >= 4,
  },
  {
    id: 'night_owl',
    name: '夜猫子',
    description: '在凌晨时段使用应用',
    icon: '🦉',
    condition: (stats) => stats.hasNightUsage,
  },
];

export function getUserStats() {
  const logs = loadData(STORAGE_KEYS.DAILY_LOGS, []);
  const exerciseLogs = loadData(STORAGE_KEYS.EXERCISE_LOGS, []);
  const diagnosis = loadData(STORAGE_KEYS.DIAGNOSIS);

  // 计算连续天数
  let streakDays = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (exerciseLogs.some(l => l.date === dateStr) || logs.some(l => l.date === dateStr)) {
      streakDays++;
    } else if (streakDays > 0) {
      break;
    }
  }

  // 检查是否有凌晨使用
  const allLogs = [...logs, ...exerciseLogs];
  const hasNightUsage = allLogs.some(l => {
    const hour = new Date(l.timestamp).getHours();
    return hour >= 0 && hour < 5;
  });

  // 计算评分改善（如果有历史记录的话，这里简化处理）
  const scoreImproved = 0; // 需要更复杂的历史记录来实现

  // 计算完成的方案数量（简化版）
  const completedPlans = 0; // 需要记录方案完成情况

  return {
    hasDiagnosis: !!diagnosis,
    streakDays,
    totalExercises: exerciseLogs.length,
    scoreImproved,
    completedPlans,
    hasNightUsage,
  };
}

export function getUnlockedAchievements() {
  const stats = getUserStats();
  return achievements.filter(a => a.condition(stats));
}

export function AchievementPanel() {
  const stats = getUserStats();
  const unlocked = getUnlockedAchievements();
  const locked = achievements.filter(a => !a.condition(stats));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        🏆 成就徽章 ({unlocked.length}/{achievements.length})
      </h3>
      
      {unlocked.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">已解锁</p>
          <div className="flex flex-wrap gap-2">
            {unlocked.map(achievement => (
              <div
                key={achievement.id}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-green-100 dark:bg-green-900/50 rounded-lg"
                title={achievement.description}
              >
                <span>{achievement.icon}</span>
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  {achievement.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">未解锁</p>
          <div className="flex flex-wrap gap-2">
            {locked.map(achievement => (
              <div
                key={achievement.id}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-lg opacity-50"
                title={achievement.description}
              >
                <span>🔒</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {achievement.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
