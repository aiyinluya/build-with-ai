import React, { useState, useEffect, useRef } from 'react';
import {
  STORAGE_KEYS, loadData, saveData, getToday, formatDate, getLastNDays,
} from '../utils/storage';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function PainSlider({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold" style={{
          color: value <= 3 ? '#22c55e' : value <= 6 ? '#f59e0b' : '#ef4444',
        }}>
          {value} / 10
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>无感</span>
        <span>轻微</span>
        <span>中度</span>
        <span>严重</span>
      </div>
    </div>
  );
}

export default function TrackPage() {
  const [tab, setTab] = useState('log'); // log | chart | history
  const [symptoms, setSymptoms] = useState({
    neck: 0, shoulder: 0, back: 0, sleep: 0, stress: 0,
  });
  const [note, setNote] = useState('');
  const [logs, setLogs] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    setLogs(loadData(STORAGE_KEYS.DAILY_LOGS, []));
  }, []);

  const handleSave = () => {
    const entry = {
      date: getToday(),
      timestamp: new Date().toISOString(),
      symptoms,
      note,
    };
    const newLogs = [...logs.filter(l => l.date !== getToday()), entry];
    saveData(STORAGE_KEYS.DAILY_LOGS, newLogs);
    setLogs(newLogs);
    setNote('');
    setSymptoms({ neck: 0, shoulder: 0, back: 0, sleep: 0, stress: 0 });
  };

  const avgScore = (key) => {
    const vals = logs.filter(l => l.symptoms[key] !== undefined).map(l => l.symptoms[key]);
    if (vals.length === 0) return 0;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  // Render chart
  useEffect(() => {
    if (tab !== 'chart' || !chartRef.current) return;

    const days = getLastNDays(14);
    const datasets = [
      { label: '颈椎', key: 'neck', color: '#ef4444' },
      { label: '肩膀', key: 'shoulder', color: '#f59e0b' },
      { label: '背部', key: 'back', color: '#3b82f6' },
    ];

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: days.map(d => formatDate(d)),
        datasets: datasets.map(ds => ({
          label: ds.label,
          data: days.map(day => {
            const log = logs.find(l => l.date === day);
            return log && log.symptoms[ds.key] !== undefined ? log.symptoms[ds.key] : null;
          }),
          borderColor: ds.color,
          backgroundColor: ds.color + '20',
          tension: 0.3,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6,
          spanGaps: true,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 10,
            title: { display: true, text: '不适程度 (0-10)', font: { size: 11 } },
            grid: { color: '#f1f5f9' },
          },
          x: {
            grid: { display: false },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { size: 11 }, usePointStyle: true, padding: 15 },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [tab, logs]);

  // Exercise stats
  const exerciseLogs = loadData(STORAGE_KEYS.EXERCISE_LOGS, []);
  const todayExercises = exerciseLogs.filter(l => l.date === getToday());
  const streakDays = (() => {
    let streak = 0;
    const days = getLastNDays(365);
    for (const day of days) {
      const dayExercises = exerciseLogs.filter(l => l.date === day);
      const dayLog = logs.find(l => l.date === day);
      if (dayExercises.length > 0 || dayLog) {
        streak++;
      } else if (streak > 0) {
        break;
      }
    }
    return streak;
  })();

  return (
    <div className="fade-in">
      <h2 className="text-xl font-bold text-slate-800 mb-2">📊 追踪记录</h2>
      <p className="text-sm text-slate-500 mb-4">记录每日症状，追踪你的康复进度</p>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
          <div className="text-xl font-bold text-green-600">{streakDays}</div>
          <div className="text-xs text-slate-500">连续天数</div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
          <div className="text-xl font-bold text-blue-600">{logs.length}</div>
          <div className="text-xs text-slate-500">记录天数</div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
          <div className="text-xl font-bold text-purple-600">{todayExercises.length}</div>
          <div className="text-xs text-slate-500">今日运动</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-lg p-1 mb-4">
        {[
          { key: 'log', label: '📝 记录', },
          { key: 'chart', label: '📈 趋势' },
          { key: 'history', label: '📅 历史' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">今日症状记录</h3>
          <PainSlider label="🦴 颈椎不适" value={symptoms.neck} onChange={v => setSymptoms(s => ({ ...s, neck: v }))} />
          <PainSlider label="💪 肩膀酸痛" value={symptoms.shoulder} onChange={v => setSymptoms(s => ({ ...s, shoulder: v }))} />
          <PainSlider label="🔙 背部不适" value={symptoms.back} onChange={v => setSymptoms(s => ({ ...s, back: v }))} />
          <PainSlider label="😴 睡眠质量" value={symptoms.sleep} onChange={v => setSymptoms(s => ({ ...s, sleep: v }))} />
          <PainSlider label="😰 压力等级" value={symptoms.stress} onChange={v => setSymptoms(s => ({ ...s, stress: v }))} />

          <div className="mt-4">
            <label className="text-sm text-slate-600 mb-1 block">📝 备注</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="今天有什么特别的？比如做了哪些运动、姿势调整等..."
              className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors mt-4"
          >
            💾 保存今日记录
          </button>

          {/* Averages */}
          {logs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-medium text-slate-500 mb-2">历史平均值</h4>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div>
                  <div className="font-bold text-slate-700">{avgScore('neck')}</div>
                  <div className="text-slate-400">颈椎</div>
                </div>
                <div>
                  <div className="font-bold text-slate-700">{avgScore('shoulder')}</div>
                  <div className="text-slate-400">肩膀</div>
                </div>
                <div>
                  <div className="font-bold text-slate-700">{avgScore('back')}</div>
                  <div className="text-slate-400">背部</div>
                </div>
                <div>
                  <div className="font-bold text-slate-700">{avgScore('sleep')}</div>
                  <div className="text-slate-400">睡眠</div>
                </div>
                <div>
                  <div className="font-bold text-slate-700">{avgScore('stress')}</div>
                  <div className="text-slate-400">压力</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'chart' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">症状趋势（近14天）</h3>
          {logs.length < 2 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-3xl mb-2">📈</div>
              <p className="text-sm">至少需要2天的记录才能显示趋势图</p>
              <p className="text-xs mt-1">坚持每日记录，追踪你的康复进度</p>
            </div>
          ) : (
            <div style={{ height: 280 }}>
              <canvas ref={chartRef} />
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-sm text-slate-500">还没有任何记录</p>
              <p className="text-xs text-slate-400 mt-1">开始记录你的每日症状吧</p>
            </div>
          ) : (
            logs.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30).map(log => (
              <div key={log.date} className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{formatDate(log.date)}</span>
                  <div className="flex gap-2 text-xs">
                    {log.symptoms.neck > 0 && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded">
                        颈 {log.symptoms.neck}
                      </span>
                    )}
                    {log.symptoms.shoulder > 0 && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded">
                        肩 {log.symptoms.shoulder}
                      </span>
                    )}
                    {log.symptoms.back > 0 && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                        背 {log.symptoms.back}
                      </span>
                    )}
                  </div>
                </div>
                {log.note && (
                  <p className="text-xs text-slate-500">{log.note}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
