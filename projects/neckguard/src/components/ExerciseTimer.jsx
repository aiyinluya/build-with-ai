import React, { useState, useEffect } from 'react';
import ShareCard from './ShareCard';
import { loadData, STORAGE_KEYS } from '../utils/storage';
import voiceGuide from '../utils/voiceGuide';

export function ExerciseTimer({ exercise, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const steps = exercise.steps || [];
  const stepDuration = 30;

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            return stepDuration;
          } else {
            setIsRunning(false);
            setCompleted(true);
            onComplete?.();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, currentStep, steps.length, onComplete]);

  const startExercise = () => {
    setTimeLeft(stepDuration);
    setCurrentStep(0);
    setIsRunning(true);
    setCompleted(false);
    // 语音提示开始
    if (voiceEnabled) {
      voiceGuide.speak(`准备开始${exercise.name}`);
    }
  };

  const pauseExercise = () => {
    setIsRunning(false);
  };

  const resetExercise = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setCurrentStep(0);
    setCompleted(false);
  };

  // 获取统计信息
  const getStats = () => {
    const logs = loadData(STORAGE_KEYS.DAILY_LOGS, []);
    const exerciseLogs = loadData(STORAGE_KEYS.EXERCISE_LOGS, []);
    
    // 计算累计打卡天数
    const uniqueDays = new Set([
      ...logs.map(l => l.date),
      ...exerciseLogs.map(l => l.date)
    ]);
    
    return {
      totalDays: uniqueDays.size,
      streakDays: 1, // 简化计算
    };
  };

  // 完成后显示
  if (completed) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 border border-green-200 dark:border-green-800 text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-2">
          运动完成！
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          太棒了！坚持运动，颈椎会越来越好
        </p>
        <div className="space-y-2">
          <ShareCard stats={getStats()} exercise={exercise} />
          <button
            onClick={resetExercise}
            className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            再做一次
          </button>
        </div>
      </div>
    );
  }

  // 初始状态
  if (!isRunning && timeLeft === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
        <div className="text-4xl mb-3">⏱️</div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{exercise.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {steps.length} 个步骤 · 约 {Math.ceil(steps.length * stepDuration / 60)} 分钟
        </p>
        <button
          onClick={startExercise}
          className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          开始运动
        </button>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`mt-2 text-sm ${voiceEnabled ? 'text-green-600' : 'text-slate-400'}`}
        >
          {voiceEnabled ? '🔊 语音指导已开启' : '🔇 开启语音指导'}
        </button>
      </div>
    );
  }

  // 进行中
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 border border-green-200 dark:border-green-800">
      {/* 计时器 */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-green-600 dark:text-green-400 font-mono mb-2">
          {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          第 {currentStep + 1} / {steps.length} 步
        </div>
      </div>

      {/* 当前步骤 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-6 border border-slate-200 dark:border-slate-700">
        <div className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
          📍 当前步骤
        </div>
        <div className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {steps[currentStep]}
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-colors ${
                i < currentStep
                  ? 'bg-green-500'
                  : i === currentStep
                  ? 'bg-green-400 animate-pulse'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-2">
        {isRunning ? (
          <>
            <button
              onClick={pauseExercise}
              className="flex-1 bg-amber-500 text-white py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              ⏸ 暂停
            </button>
            <button
              onClick={resetExercise}
              className="flex-1 bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white py-2 rounded-lg font-medium hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
            >
              🔄 重置
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsRunning(true)}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              ▶ 继续
            </button>
            <button
              onClick={resetExercise}
              className="flex-1 bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white py-2 rounded-lg font-medium hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
            >
              🔄 重置
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ExerciseTimer;
