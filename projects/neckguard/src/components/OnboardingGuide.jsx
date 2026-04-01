import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GUIDE_STEPS = [
  {
    title: '欢迎来到 NeckGuard',
    subtitle: '颈椎健康，从这里开始',
    description: '专为程序员和伏案工作者设计的开源颈椎健康管理工具',
    icon: '🦒',
    color: 'from-green-500 to-emerald-600',
  },
  {
    title: '症状自测',
    subtitle: '了解你的颈椎健康状况',
    description: '通过18道专业问题，快速评估你的颈椎健康，获取个性化建议',
    icon: '🩺',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    title: '康复运动',
    subtitle: '跟着动画做运动',
    description: '骨骼动画演示 + 计时器引导，每天15分钟改善颈椎问题',
    icon: '💪',
    color: 'from-purple-500 to-pink-600',
  },
  {
    title: '追踪进度',
    subtitle: '记录每一天的变化',
    description: '每日打卡、成就系统、健康报告，让进步看得见',
    icon: '📊',
    color: 'from-amber-500 to-orange-600',
  },
];

export function OnboardingGuide() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 检查是否首次访问
    const hasSeenGuide = localStorage.getItem('neckguard_guide_seen');
    if (!hasSeenGuide) {
      setShow(true);
    }
  }, []);

  const handleNext = () => {
    if (step < GUIDE_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    localStorage.setItem('neckguard_guide_seen', 'true');
    setShow(false);
  };

  if (!show) return null;

  const current = GUIDE_STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* 进度条 */}
        <div className="h-1 bg-slate-200 dark:bg-slate-700">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
            style={{ width: `${((step + 1) / GUIDE_STEPS.length) * 100}%` }}
          />
        </div>

        {/* 内容 */}
        <div className={`bg-gradient-to-br ${current.color} p-8 text-center text-white`}>
          <div className="text-6xl mb-4">{current.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{current.title}</h2>
          <p className="text-white/80 text-sm">{current.subtitle}</p>
        </div>

        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
            {current.description}
          </p>

          {/* 指示器 */}
          <div className="flex justify-center gap-2 mb-6">
            {GUIDE_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* 按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 rounded-lg text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              跳过
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              {step === GUIDE_STEPS.length - 1 ? '开始使用' : '下一步'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingGuide;
