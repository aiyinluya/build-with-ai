import React, { useState } from 'react';
import { questions, categories } from '../data/questions';
import { calculateDiagnosis } from '../utils/storage';
import { STORAGE_KEYS, saveData } from '../utils/storage';
import { ScoreCircle } from './HomePage';
import { plans } from '../data/plans';

export default function AssessmentPage() {
  const [currentCategory, setCurrentCategory] = useState('symptoms');
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [savedResult, setSavedResult] = useState(null);

  const categoryList = Object.entries(categories);
  const currentQuestions = questions.filter(q => q.category === currentCategory);
  const categoryIndex = categoryList.findIndex(([key]) => key === currentCategory);

  const handleAnswer = (questionId, score) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const isCategoryComplete = (cat) => {
    const catQuestions = questions.filter(q => q.category === cat);
    return catQuestions.every(q => answers[q.id] !== undefined);
  };

  const allComplete = categoryList.every(([cat]) => isCategoryComplete(cat));

  const handleSubmit = () => {
    const result = calculateDiagnosis(answers);
    result.answers = answers;
    result.timestamp = new Date().toISOString();
    saveData(STORAGE_KEYS.DIAGNOSIS, { answers, timestamp: result.timestamp });
    setSavedResult(result);
    setShowResult(true);
  };

  const progress = Object.keys(answers).length / questions.length;

  if (showResult && savedResult) {
    return (
      <div className="fade-in">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">🩺 评估结果</h2>

        {/* Score */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-4">
          <div className="flex flex-col items-center mb-4">
            <ScoreCircle
              score={savedResult.percentage}
              maxScore={100}
              size={150}
              strokeWidth={10}
              color={savedResult.riskColor}
            />
            <div className="mt-3 text-center">
              <span
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: savedResult.riskColor }}
              >
                {savedResult.riskLabel}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              健康评分 {savedResult.percentage} / 100（分数越低越健康）
            </p>
          </div>

          {/* Category scores */}
          <div className="grid grid-cols-2 gap-3">
            {categoryList.map(([key, cat]) => (
              <div key={key} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span>{cat.icon}</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.label}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (savedResult.scores[key] / (savedResult.counts[key] * 4)) * 100)}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {savedResult.scores[key]} / {savedResult.counts[key] * 4}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Problem Areas */}
        {savedResult.problemAreas.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-3">⚠️ 重点关注</h3>
            <div className="space-y-2">
              {savedResult.problemAreas.map((area, i) => (
                <div key={i} className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3">
                  <span className="text-amber-500 mt-0.5">●</span>
                  <div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{area.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{area.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Plan */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-4">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-3">📋 推荐方案</h3>
          {plans.filter(p => p.id === savedResult.recommendedPlan).map(plan => (
            <div key={plan.id} className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💪</span>
                <span className="text-sm font-semibold text-green-800 dark:text-green-300">{plan.name}</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400 mb-1">{plan.description}</p>
              <p className="text-xs text-green-600 dark:text-green-500">⏱ {plan.duration} · 适合：{plan.targetScenario}</p>
            </div>
          ))}
        </div>

        {/* Medical disclaimer */}
        <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 border border-red-200 dark:border-red-800 mb-4">
          <p className="text-sm text-red-700 dark:text-red-400">
            ⚠️ <strong>重要提示：</strong>本评估仅供参考，不能替代专业医疗诊断。如果你的症状严重（如手臂持续麻木、无力），请及时就医。
          </p>
        </div>

        <button
          onClick={() => { setShowResult(false); setAnswers({}); }}
          className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          🔄 重新评估
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">🩺 症状自测</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        回答以下18个问题，系统将为你评估颈椎健康状况并推荐个性化方案
      </p>

      {/* Progress bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>完成进度</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categoryList.map(([key, cat], idx) => (
          <button
            key={key}
            onClick={() => setCurrentCategory(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              currentCategory === key
                ? 'bg-green-600 text-white'
                : isCategoryComplete(key)
                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            {isCategoryComplete(key) && currentCategory !== key && (
              <span className="text-green-500">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-3 mb-6">
        {currentQuestions.map((q) => (
          <div key={q.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-800 dark:text-white mb-1">
              {q.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{q.question}</p>
            <div className="grid grid-cols-1 gap-1.5">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(q.id, opt.score)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    answers[q.id] === opt.score
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-2 border-green-400 font-medium'
                      : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {categoryIndex > 0 && (
          <button
            onClick={() => setCurrentCategory(categoryList[categoryIndex - 1][0])}
            className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            ← 上一步
          </button>
        )}
        {categoryIndex < categoryList.length - 1 ? (
          <button
            onClick={() => setCurrentCategory(categoryList[categoryIndex + 1][0])}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            下一步 →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allComplete}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
              allComplete
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            📊 查看评估结果
          </button>
        )}
      </div>
    </div>
  );
}
