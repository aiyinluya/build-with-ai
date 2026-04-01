import React from 'react';

/**
 * 简化版骨骼图 - 使用 HTML 表格而不是 SVG
 */
export function SimpleSkeletonDiagram({ exercise }) {
  if (!exercise) return null;

  const getDirectionText = () => {
    switch (exercise.category) {
      case 'stretch':
        return '↑ 拉伸 - 向上拉伸肌肉';
      case 'strengthen':
        return '← 收缩 - 肌肉向内收缩';
      case 'relax':
        return '↓ 放松 - 肌肉放松';
      default:
        return '运动方向';
    }
  };

  const getDirectionColor = () => {
    switch (exercise.category) {
      case 'stretch':
        return 'text-red-600 dark:text-red-400';
      case 'strengthen':
        return 'text-green-600 dark:text-green-400';
      case 'relax':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
        🦴 运动轨迹
      </h3>
      
      {/* 简化的骨骼图表示 */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 text-center mb-4">
        <div className="text-6xl mb-2">🧍</div>
        <div className={`text-lg font-bold ${getDirectionColor()}`}>
          {getDirectionText()}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          主要肌肉: <span className="font-semibold">{exercise.targetMuscle}</span>
        </p>
      </div>

      {/* 运动方向说明 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <span className="text-lg">📍</span>
          <span className="text-sm text-slate-700 dark:text-slate-300">
            {exercise.category === 'stretch' && '这是一个拉伸运动，会拉长肌肉纤维'}
            {exercise.category === 'strengthen' && '这是一个强化运动，会收缩肌肉'}
            {exercise.category === 'relax' && '这是一个放松运动，会缓解肌肉紧张'}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 改进的运动展示组件 - 简化版
 */
export function ImprovedExerciseDisplay({ exercise }) {
  if (!exercise) {
    return <div className="text-center text-slate-500 dark:text-slate-400">加载中...</div>;
  }

  return (
    <div className="space-y-4">
      {/* 运动概览 */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <span className="text-3xl">💪</span>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{exercise.name}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              目标肌肉: <span className="font-semibold">{exercise.targetMuscle}</span>
            </p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded">
                ⏱ {exercise.duration}
              </span>
              <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded">
                📊 {exercise.difficulty === 'easy' ? '简单' : exercise.difficulty === 'medium' ? '中等' : '困难'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 简化的骨骼图 */}
      <SimpleSkeletonDiagram exercise={exercise} />

      {/* 分步骤说明 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
          📍 详细步骤
        </h3>
        <ol className="space-y-3">
          {exercise.steps && exercise.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300 pt-0.5">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* 要点提示 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          💡 要点提示
        </h3>
        <ul className="space-y-1">
          {exercise.tips && exercise.tips.map((tip, i) => (
            <li key={i} className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 常见错误 */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
        <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
          ⚠️ 常见错误
        </h3>
        <ul className="space-y-1">
          {exercise.mistakes && exercise.mistakes.map((mistake, i) => (
            <li key={i} className="text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✗</span>
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 呼吸提示 */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
        <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
          🌬️ 呼吸指导
        </h3>
        <div className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
          <p>• <span className="font-semibold">吸气:</span> 准备动作时</p>
          <p>• <span className="font-semibold">呼气:</span> 用力时（拉伸/收缩）</p>
          <p>• <span className="font-semibold">保持:</span> 停顿时继续呼吸</p>
        </div>
      </div>
    </div>
  );
}

export default ImprovedExerciseDisplay;
