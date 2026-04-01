import React from 'react';
import { Link } from 'react-router-dom';
import { loadData, STORAGE_KEYS, calculateDiagnosis } from '../utils/storage';
import { generateRecommendations } from '../utils/recommendations';

export function SmartRecommendations() {
  const diagnosis = loadData(STORAGE_KEYS.DIAGNOSIS);
  const hasDiagnosis = diagnosis && diagnosis.answers;
  
  let recommendations;
  if (hasDiagnosis) {
    const result = calculateDiagnosis(diagnosis.answers);
    recommendations = generateRecommendations(diagnosis, result);
  } else {
    recommendations = generateRecommendations(null);
  }

  const { plan, exercises, articles, tips, warnings } = recommendations;

  return (
    <div className="space-y-4">
      {/* 警告提示 */}
      {warnings && warnings.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 border border-red-200 dark:border-red-800">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <span className="font-medium">{w.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* 健康建议 */}
      {tips && tips.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3">
            💡 个性化建议
          </h3>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                <span>{tip.icon}</span>
                <span>{tip.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 推荐方案 */}
      {plan && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
              🎯 推荐方案
            </h3>
            <Link to="/exercise" className="text-xs text-green-600 dark:text-green-400 hover:underline">
              查看全部 →
            </Link>
          </div>
          <Link 
            to="/exercise" 
            className="block bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow"
          >
            <div className="font-semibold text-slate-800 dark:text-white">{plan.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {plan.description} · {plan.duration}
            </div>
          </Link>
        </div>
      )}

      {/* 推荐运动 */}
      {exercises && exercises.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
              💪 推荐运动
            </h3>
            <Link to="/exercise" className="text-xs text-green-600 dark:text-green-400 hover:underline">
              更多 →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {exercises.slice(0, 4).map(ex => (
              <Link
                key={ex.id}
                to="/exercise"
                className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="text-sm font-medium text-slate-800 dark:text-white truncate">
                  {ex.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {ex.targetMuscle}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 推荐文章 */}
      {articles && articles.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
              📚 推荐阅读
            </h3>
            <Link to="/knowledge" className="text-xs text-green-600 dark:text-green-400 hover:underline">
              更多 →
            </Link>
          </div>
          <div className="space-y-2">
            {articles.slice(0, 3).map(article => (
              <Link
                key={article.id}
                to="/knowledge"
                className="block bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="text-sm font-medium text-slate-800 dark:text-white">
                  {article.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {article.summary}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 未诊断提示 */}
      {!hasDiagnosis && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🩺</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                完成症状自测
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                获取个性化推荐方案，了解你的颈椎健康状况
              </p>
              <Link
                to="/assessment"
                className="inline-block mt-3 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                开始自测
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartRecommendations;
