import React, { useState } from 'react';
import { exercises, categories as exerciseCategories, difficultyLevels } from '../data/exercises';
import { plans } from '../data/plans';
import { STORAGE_KEYS, loadData, saveData, getToday } from '../utils/storage';
import ExerciseTimer from '../components/ExerciseTimer';
import SkeletonPlayer from '../components/SkeletonPlayer';

function ExerciseCard({ exercise, onSelect }) {
  const cat = exerciseCategories[exercise.category];
  const diff = difficultyLevels[exercise.difficulty];

  return (
    <button
      onClick={() => onSelect(exercise)}
      className="w-full text-left bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 card-hover"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cat.icon}</span>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{exercise.name}</h3>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: diff.color + '20', color: diff.color }}
        >
          {diff.label}
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">目标：{exercise.targetMuscle} · {exercise.duration}</p>
      <div className="flex flex-wrap gap-1">
        {exercise.tags && exercise.tags.map(tag => (
          <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

function ExerciseDetail({ exercise, onClose }) {
  const handleComplete = () => {
    const logs = loadData(STORAGE_KEYS.EXERCISE_LOGS, []);
    logs.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      date: getToday(),
      timestamp: new Date().toISOString(),
    });
    saveData(STORAGE_KEYS.EXERCISE_LOGS, logs);
    onClose();
  };

  return (
    <div className="fade-in">
      <button
        onClick={onClose}
        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 mb-4 flex items-center gap-1"
      >
        ← 返回列表
      </button>

      {/* 标题 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{exerciseCategories[exercise.category].icon}</span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{exercise.name}</h2>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span>🎯 {exercise.targetMuscle}</span>
          <span>⏱ {exercise.duration}</span>
          <span style={{ color: difficultyLevels[exercise.difficulty].color }}>
            {difficultyLevels[exercise.difficulty].label}
          </span>
        </div>
      </div>

      {/* 骨骼动画 */}
      <div className="mb-4">
        <SkeletonPlayer exerciseId={exercise.id} />
      </div>

      {/* 详细步骤 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">📍 详细步骤</h3>
        <ol className="space-y-3">
          {exercise.steps && exercise.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 要点 + 错误 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 要点提示</h3>
          <ul className="space-y-1">
            {exercise.tips && exercise.tips.map((tip, i) => (
              <li key={i} className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
          <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">⚠️ 常见错误</h3>
          <ul className="space-y-1">
            {exercise.mistakes && exercise.mistakes.map((m, i) => (
              <li key={i} className="text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 计时器 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">⏱️ 开始运动</h3>
        <ExerciseTimer exercise={exercise} onComplete={handleComplete} />
      </div>
    </div>
  );
}

function PlanDetail({ plan, onClose }) {
  return (
    <div className="fade-in">
      <button
        onClick={onClose}
        className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-4 flex items-center gap-1"
      >
        ← 返回方案
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">📋 {plan.name}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{plan.description}</p>
        <div className="flex gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <span>⏱ {plan.duration}</span>
          <span>🎯 {plan.targetScenario}</span>
          <span style={{ color: difficultyLevels[plan.difficulty].color }}>
            {difficultyLevels[plan.difficulty].label}
          </span>
        </div>

        {/* Exercise list */}
        <div className="space-y-2 mb-4">
          {plan.exercises && plan.exercises.map((item, i) => {
            const ex = exercises.find(e => e.id === item.exerciseId);
            if (!ex) return null;
            return (
              <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                <span className="text-sm font-bold text-slate-300 dark:text-slate-500 w-6 text-center">{i + 1}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{ex.name}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">{item.note} · {ex.duration} × {item.sets}组</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded" style={{
                  backgroundColor: exerciseCategories[ex.category].color + '20',
                  color: exerciseCategories[ex.category].color,
                }}>
                  {exerciseCategories[ex.category].label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">💡 温馨提示</h3>
          <ul className="space-y-1">
            {plan.tips && plan.tips.map((tip, i) => (
              <li key={i} className="text-sm text-green-700 dark:text-green-400">• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ExercisePage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [view, setView] = useState('plans'); // 'plans', 'exercises'

  if (selectedExercise) {
    return (
      <ExerciseDetail
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    );
  }

  if (selectedPlan) {
    return (
      <PlanDetail
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    );
  }

  return (
    <div className="fade-in">
      {/* View Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('plans')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === 'plans'
              ? 'bg-green-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          📋 康复方案
        </button>
        <button
          onClick={() => setView('exercises')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            view === 'exercises'
              ? 'bg-green-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          💪 运动库
        </button>
      </div>

      {/* Plans View */}
      {view === 'plans' && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">选择康复方案</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map(plan => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className="text-left bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 card-hover"
              >
                <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{plan.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>⏱ {plan.duration}</span>
                    <span>💪 {plan.exercises.length} 个动作</span>
                  </div>
                  <span className="text-green-600 dark:text-green-400">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Exercises View */}
      {view === 'exercises' && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">运动库 ({exercises.length} 个动作)</h2>
          <div className="space-y-3">
            {exercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onSelect={setSelectedExercise}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
