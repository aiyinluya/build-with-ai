const STORAGE_KEYS = {
  DIAGNOSIS: 'neckguard_diagnosis',
  DAILY_LOGS: 'neckguard_daily_logs',
  EXERCISE_LOGS: 'neckguard_exercise_logs',
  REMINDER_SETTINGS: 'neckguard_reminders',
  USER_PROFILE: 'neckguard_profile',
};

export function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadData(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function removeData(key) {
  localStorage.removeItem(key);
}

export { STORAGE_KEYS };

// Date helpers
export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function getLastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

// Score calculation
export function calculateDiagnosis(answers) {
  const scores = { symptoms: 0, work: 0, sleep: 0, history: 0 };
  const counts = { symptoms: 0, work: 0, sleep: 0, history: 0 };

  for (const [questionId, answer] of Object.entries(answers)) {
    const question = questionsList.find(q => q.id === questionId);
    if (question && answer !== undefined) {
      scores[question.category] += answer;
      counts[question.category]++;
    }
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxPossible = 72; // 18 questions × 4 max score
  const percentage = Math.round((total / maxPossible) * 100);

  let riskLevel, riskLabel, riskColor;
  if (percentage <= 20) {
    riskLevel = 'low';
    riskLabel = '低风险';
    riskColor = '#22c55e';
  } else if (percentage <= 45) {
    riskLevel = 'medium';
    riskLabel = '中等风险';
    riskColor = '#f59e0b';
  } else if (percentage <= 70) {
    riskLevel = 'high';
    riskLabel = '较高风险';
    riskColor = '#f97316';
  } else {
    riskLevel = 'critical';
    riskLabel = '高风险';
    riskColor = '#ef4444';
  }

  // Identify problem areas
  const problemAreas = [];
  if (scores.symptoms > 10) problemAreas.push({ name: '症状明显', detail: '颈肩症状较严重，建议关注' });
  if (scores.work > 10) problemAreas.push({ name: '工作习惯需改善', detail: '工作姿势和习惯需要调整' });
  if (scores.sleep > 8) problemAreas.push({ name: '睡眠环境需优化', detail: '睡眠姿势和枕头需要调整' });
  if (scores.history > 8) problemAreas.push({ name: '长期问题', detail: '症状持续时间较长，需要持续管理' });

  // Recommend plan
  let recommendedPlan;
  if (percentage <= 20) recommendedPlan = 'prevention';
  else if (percentage <= 45) recommendedPlan = 'daily_care';
  else if (percentage <= 70) recommendedPlan = 'daily_care';
  else recommendedPlan = 'intensive_recovery';

  return {
    total,
    maxPossible,
    percentage,
    riskLevel,
    riskLabel,
    riskColor,
    scores,
    counts,
    problemAreas,
    recommendedPlan,
  };
}

// Inline questions for the calculation (circular dep avoidance)
const questionsList = [
  { id: 'neck_pain', category: 'symptoms' },
  { id: 'neck_location', category: 'symptoms' },
  { id: 'shoulder_pain', category: 'symptoms' },
  { id: 'shoulder_trigger', category: 'symptoms' },
  { id: 'back_pain', category: 'symptoms' },
  { id: 'arm_numbness', category: 'symptoms' },
  { id: 'headache', category: 'symptoms' },
  { id: 'work_hours', category: 'work' },
  { id: 'work_break', category: 'work' },
  { id: 'monitor_height', category: 'work' },
  { id: 'work_posture', category: 'work' },
  { id: 'stress_level', category: 'work' },
  { id: 'sleep_position', category: 'sleep' },
  { id: 'pillow_height', category: 'sleep' },
  { id: 'back_cold', category: 'sleep' },
  { id: 'sleep_quality', category: 'sleep' },
  { id: 'duration', category: 'history' },
  { id: 'exercise_frequency', category: 'history' },
];
