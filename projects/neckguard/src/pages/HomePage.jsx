import React from 'react';
import { Link } from 'react-router-dom';
import { loadData, STORAGE_KEYS, calculateDiagnosis } from '../utils/storage';
import { AchievementPanel } from '../components/AchievementPanel';
import { ExportPanel } from '../components/ExportPanel';
import { DailyTaskPanel } from '../components/DailyTaskPanel';
import { PointsPanel } from '../components/PointsPanel';
import SmartRecommendations from '../components/SmartRecommendations';

function ScoreCircle({ score, maxScore, size = 120, strokeWidth = 8, color = '#22c55e' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.round((score / maxScore) * 100);
  const offset = circumference - (score / maxScore) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          className="dark:stroke-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-circle"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{percentage}</span>
        <span className="text-xs text-slate-400 dark:text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, link, linkText }) {
  return (
    <Link
      to={link}
      className="block bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 card-hover"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{description}</p>
      <span className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
        {linkText || '查看 →'}
      </span>
    </Link>
  );
}

export default function HomePage() {
  const diagnosis = loadData(STORAGE_KEYS.DIAGNOSIS);
  const hasDiagnosis = diagnosis && diagnosis.answers;
  const result = hasDiagnosis ? calculateDiagnosis(diagnosis.answers) : null;

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-6 mb-6 relative overflow-hidden">
        {/* 装饰背景 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 dark:bg-green-700/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/30 dark:bg-emerald-700/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl animate-bounce-slow">🦒</div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                NeckGuard
              </h1>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">颈椎卫士</p>
            </div>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            专为<span className="font-medium text-green-700 dark:text-green-300">程序员</span>和<span className="font-medium text-green-700 dark:text-green-300">伏案工作者</span>设计的颈椎健康管理工具
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1 bg-white/60 dark:bg-slate-700/60 px-3 py-1 rounded-full text-xs text-slate-600 dark:text-slate-300">
              🩺 智能诊断
            </span>
            <span className="inline-flex items-center gap-1 bg-white/60 dark:bg-slate-700/60 px-3 py-1 rounded-full text-xs text-slate-600 dark:text-slate-300">
              💪 康复运动
            </span>
            <span className="inline-flex items-center gap-1 bg-white/60 dark:bg-slate-700/60 px-3 py-1 rounded-full text-xs text-slate-600 dark:text-slate-300">
              📊 进度追踪
            </span>
          </div>
          
          {!hasDiagnosis ? (
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 dark:shadow-green-900/30"
            >
              <span>🩺</span>
              <span>开始症状自测</span>
              <span className="text-green-200">→</span>
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/exercise"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                💪 开始训练
              </Link>
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-green-700 dark:text-green-300 px-5 py-2.5 rounded-lg text-sm font-medium border border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
              >
                🔄 重新评估
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Diagnosis Summary */}
      {hasDiagnosis && result && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-4">📋 上次评估结果</h2>
          <div className="flex items-center gap-6">
            <ScoreCircle
              score={result.percentage}
              maxScore={100}
              color={result.riskColor}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: result.riskColor }}
                >
                  {result.riskLabel}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                健康评分：<span className="font-semibold">{result.percentage}</span> / 100
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                  🩺 症状：<span className="font-medium text-slate-700 dark:text-slate-300">{result.scores.symptoms} 分</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                  💻 工作习惯：<span className="font-medium text-slate-700 dark:text-slate-300">{result.scores.work} 分</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                  🛏️ 睡眠：<span className="font-medium text-slate-700 dark:text-slate-300">{result.scores.sleep} 分</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                  📋 病史：<span className="font-medium text-slate-700 dark:text-slate-300">{result.scores.history} 分</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-3">快速开始</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <FeatureCard
          icon="🩺"
          title="症状自测"
          description="通过18道专业问题快速评估你的颈椎健康状况"
          link="/assessment"
          linkText="开始测试 →"
        />
        <FeatureCard
          icon="💪"
          title="康复方案"
          description="4种预制方案 + 专业运动，针对性解决你的问题"
          link="/exercise"
          linkText="查看方案 →"
        />
        <FeatureCard
          icon="📊"
          title="追踪记录"
          description="记录每日症状和运动，可视化追踪康复进度"
          link="/track"
          linkText="开始记录 →"
        />
        <FeatureCard
          icon="📚"
          title="知识库"
          description="了解颈椎健康知识，从根本上预防和管理问题"
          link="/knowledge"
          linkText="阅读文章 →"
        />
      </div>

      {/* 智能推荐 */}
      <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-3">🎯 为你推荐</h2>
      <SmartRecommendations />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-2xl mb-1">🩺</div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">18</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">评估问题</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-2xl mb-1">💪</div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">13</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">康复运动</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">4</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">训练方案</div>
        </div>
      </div>

      {/* Achievement & Export */}
      <div className="space-y-4 mb-6">
        <PointsPanel />
        <DailyTaskPanel />
        <AchievementPanel />
        <ExportPanel />
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8 pb-4">
        <p>NeckGuard 是开源项目，数据完全存储在你的浏览器本地</p>
        <p className="mt-1">⚠️ 本工具仅供参考，不能替代专业医疗建议</p>
      </div>
    </div>
  );
}

export { ScoreCircle };
