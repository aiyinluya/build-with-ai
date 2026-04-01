import React, { useState, useEffect, useRef } from 'react';
import { STORAGE_KEYS, loadData, saveData } from '../utils/storage';

export default function ReminderPage() {
  const [settings, setSettings] = useState({
    workBreakEnabled: true,
    workBreakInterval: 90,
    exerciseEnabled: true,
    exerciseTime: '20:00',
    sleepEnabled: true,
    sleepTime: '22:30',
    morningEnabled: true,
    morningTime: '07:30',
  });
  const [notificationStatus, setNotificationStatus] = useState('default');
  const [testing, setTesting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const saved = loadData(STORAGE_KEYS.REMINDER_SETTINGS);
    if (saved) setSettings(saved);

    // Check notification permission
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveData(STORAGE_KEYS.REMINDER_SETTINGS, newSettings);
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
    }
  };

  const sendNotification = (title, body) => {
    if (notificationStatus === 'granted') {
      new Notification(title, {
        body,
        icon: './favicon.svg',
        badge: './favicon.svg',
      });
    }
  };

  const testNotification = () => {
    setTesting(true);
    sendNotification(
      '🦒 NeckGuard 提醒',
      '这是测试提醒！如果你看到了这个通知，说明提醒功能正常工作。'
    );
    setTimeout(() => setTesting(false), 3000);
  };

  // Simple timer-based reminders (runs while page is open)
  useEffect(() => {
    const checkInterval = 60000; // Check every minute

    const checkReminders = () => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (settings.exerciseEnabled && timeStr === settings.exerciseTime) {
        sendNotification('💪 该做运动了！', '每天坚持15分钟康复运动，让你的颈椎更健康。');
      }
      if (settings.sleepEnabled && timeStr === settings.sleepTime) {
        sendNotification('🛏️ 准备睡觉', '注意侧睡姿势，手臂不要压在身下。祝你晚安！');
      }
      if (settings.morningEnabled && timeStr === settings.morningTime) {
        sendNotification('🌅 早上好！', '新的一天开始了，记得做颈肩运动激活身体。');
      }
    };

    timerRef.current = setInterval(checkReminders, checkInterval);
    return () => clearInterval(timerRef.current);
  }, [settings, notificationStatus]);

  return (
    <div className="fade-in">
      <h2 className="text-xl font-bold text-slate-800 mb-2">⏰ 提醒设置</h2>
      <p className="text-sm text-slate-500 mb-4">设置定时提醒，帮助你养成健康习惯</p>

      {/* Notification permission */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 mb-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">🔔 通知权限</h3>
        <div className="flex items-center justify-between">
          <div>
            {notificationStatus === 'granted' ? (
              <p className="text-sm text-green-600">✅ 通知已开启</p>
            ) : notificationStatus === 'denied' ? (
              <p className="text-sm text-red-600">❌ 通知被阻止，请在浏览器设置中开启</p>
            ) : (
              <p className="text-sm text-amber-600">⚠️ 需要授权通知权限</p>
            )}
            <p className="text-xs text-slate-400 mt-1">浏览器需要通知权限才能发送提醒</p>
          </div>
          {notificationStatus !== 'granted' && (
            <button
              onClick={requestPermission}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              开启通知
            </button>
          )}
        </div>

        {notificationStatus === 'granted' && (
          <button
            onClick={testNotification}
            disabled={testing}
            className="mt-3 w-full bg-slate-100 text-slate-700 py-2 rounded-lg text-sm hover:bg-slate-200 transition-colors"
          >
            {testing ? '📤 测试通知已发送...' : '📤 发送测试通知'}
          </button>
        )}
      </div>

      {/* Work break reminder */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⏱️</span>
            <h3 className="text-sm font-semibold text-slate-700">工作间隙提醒</h3>
          </div>
          <button
            onClick={() => updateSetting('workBreakEnabled', !settings.workBreakEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              settings.workBreakEnabled ? 'bg-green-500' : 'bg-slate-300'
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              settings.workBreakEnabled ? 'translate-x-5.5 left-0' : 'left-0.5'
            }`} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-3">每工作一段时间提醒你起身活动</p>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">间隔时间：</span>
          <div className="flex gap-2">
            {[45, 60, 90, 120].map(min => (
              <button
                key={min}
                onClick={() => updateSetting('workBreakInterval', min)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  settings.workBreakInterval === min
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {min}分钟
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise reminder */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">💪</span>
            <h3 className="text-sm font-semibold text-slate-700">运动提醒</h3>
          </div>
          <button
            onClick={() => updateSetting('exerciseEnabled', !settings.exerciseEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              settings.exerciseEnabled ? 'bg-green-500' : 'bg-slate-300'
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              settings.exerciseEnabled ? 'translate-x-5.5 left-0' : 'left-0.5'
            }`} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-3">每天定时提醒你做康复运动</p>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">提醒时间：</span>
          <input
            type="time"
            value={settings.exerciseTime}
            onChange={e => updateSetting('exerciseTime', e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
      </div>

      {/* Sleep reminder */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛏️</span>
            <h3 className="text-sm font-semibold text-slate-700">睡眠提醒</h3>
          </div>
          <button
            onClick={() => updateSetting('sleepEnabled', !settings.sleepEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              settings.sleepEnabled ? 'bg-green-500' : 'bg-slate-300'
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              settings.sleepEnabled ? 'translate-x-5.5 left-0' : 'left-0.5'
            }`} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-3">提醒你准备睡觉，注意睡姿</p>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">提醒时间：</span>
          <input
            type="time"
            value={settings.sleepTime}
            onChange={e => updateSetting('sleepTime', e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
      </div>

      {/* Morning reminder */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌅</span>
            <h3 className="text-sm font-semibold text-slate-700">晨间提醒</h3>
          </div>
          <button
            onClick={() => updateSetting('morningEnabled', !settings.morningEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              settings.morningEnabled ? 'bg-green-500' : 'bg-slate-300'
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              settings.morningEnabled ? 'translate-x-5.5 left-0' : 'left-0.5'
            }`} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-3">早上提醒你做颈肩运动激活身体</p>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">提醒时间：</span>
          <input
            type="time"
            value={settings.morningTime}
            onChange={e => updateSetting('morningTime', e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
      </div>

      {/* Note */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <p className="text-sm text-amber-700">
          ⚠️ <strong>注意：</strong>提醒功能需要在浏览器中保持页面打开才能工作。关闭页面后提醒将不会触发。如果需要后台提醒，建议安装 PWA 版本。
        </p>
      </div>
    </div>
  );
}
