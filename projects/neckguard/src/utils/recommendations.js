/**
 * 智能推荐引擎
 * 根据用户诊断结果、症状、工作习惯等生成个性化推荐
 */

import { plans } from '../data/plans';
import { exercises } from '../data/exercises';
import { knowledge } from '../data/knowledge';

/**
 * 生成推荐内容
 * @param {Object} diagnosis - 诊断结果
 * @param {Object} options - 可选配置
 * @returns {Object} 推荐结果
 */
export function generateRecommendations(diagnosis, options = {}) {
  if (!diagnosis || !diagnosis.answers) {
    return getDefaultRecommendations();
  }

  const { scores, riskLevel, problemAreas } = analyzeDiagnosis(diagnosis);

  return {
    // 推荐方案
    plan: recommendPlan(riskLevel, problemAreas),
    
    // 推荐运动（针对性）
    exercises: recommendExercises(problemAreas, scores),
    
    // 推荐知识文章
    articles: recommendArticles(problemAreas, scores),
    
    // 健康建议
    tips: generateTips(scores, problemAreas),
    
    // 警告提示
    warnings: generateWarnings(scores),
  };
}

/**
 * 分析诊断结果
 */
function analyzeDiagnosis(diagnosis) {
  const answers = diagnosis.answers;
  
  // 计算各维度得分
  const scores = {
    symptoms: 0,    // 症状严重程度
    work: 0,        // 工作习惯问题
    sleep: 0,       // 睡眠问题
    history: 0,     // 病史风险
  };

  // 症状评估
  const symptomQuestions = ['neck_pain', 'shoulder_pain', 'back_pain', 'arm_numbness', 'headache'];
  symptomQuestions.forEach(q => {
    if (answers[q]) scores.symptoms += answers[q];
  });

  // 工作习惯
  const workQuestions = ['work_hours', 'work_break', 'monitor_height', 'work_posture', 'stress_level'];
  workQuestions.forEach(q => {
    if (answers[q]) scores.work += answers[q];
  });

  // 睡眠问题
  const sleepQuestions = ['sleep_position', 'pillow_height', 'back_cold', 'sleep_quality'];
  sleepQuestions.forEach(q => {
    if (answers[q]) scores.sleep += answers[q];
  });

  // 病史风险
  const historyQuestions = ['duration', 'exercise_frequency', 'previous_treatment'];
  historyQuestions.forEach(q => {
    if (answers[q]) scores.history += answers[q];
  });

  // 计算总分和风险等级
  const totalScore = scores.symptoms + scores.work + scores.sleep + scores.history;
  const maxScore = 72; // 18题 × 4分
  const percentage = Math.round((totalScore / maxScore) * 100);

  let riskLevel;
  if (percentage <= 20) riskLevel = 'low';
  else if (percentage <= 45) riskLevel = 'medium';
  else if (percentage <= 70) riskLevel = 'high';
  else riskLevel = 'very-high';

  // 识别问题区域
  const problemAreas = [];
  if (scores.symptoms >= 10) problemAreas.push('symptoms');
  if (scores.work >= 10) problemAreas.push('work');
  if (scores.sleep >= 8) problemAreas.push('sleep');
  if (scores.history >= 8) problemAreas.push('history');

  // 特定症状识别
  if (answers.arm_numbness >= 3) problemAreas.push('nerve');
  if (answers.headache >= 3) problemAreas.push('headache');
  if (answers.neck_pain >= 3) problemAreas.push('neck');

  return { scores, riskLevel, problemAreas, percentage };
}

/**
 * 推荐康复方案
 */
function recommendPlan(riskLevel, problemAreas) {
  // 根据风险等级推荐
  const planMap = {
    'low': 'daily_care',           // 日常护理
    'medium': 'daily_care',        // 日常护理
    'high': 'strength_recovery',   // 强化恢复
    'very-high': 'strength_recovery', // 强化恢复
  };

  const planId = planMap[riskLevel] || 'daily_care';
  const plan = plans.find(p => p.id === planId);

  // 如果有体态问题，推荐体态矫正
  if (problemAreas.includes('work') && riskLevel !== 'very-high') {
    return plans.find(p => p.id === 'posture_correction') || plan;
  }

  return plan;
}

/**
 * 推荐运动
 */
function recommendExercises(problemAreas, scores) {
  const recommended = [];

  // 症状明显：推荐拉伸和放松
  if (problemAreas.includes('symptoms')) {
    recommended.push(
      ...exercises.filter(e => 
        e.category === 'stretch' || e.category === 'relax'
      ).slice(0, 5)
    );
  }

  // 工作习惯差：推荐肩胛骨后缩等
  if (problemAreas.includes('work')) {
    recommended.push(
      ...exercises.filter(e => 
        e.id === 'scapular_retraction' || 
        e.id === 'chin_tuck' ||
        e.targetMuscle.includes('斜方肌')
      ).slice(0, 3)
    );
  }

  // 睡眠问题：推荐放松运动
  if (problemAreas.includes('sleep')) {
    recommended.push(
      ...exercises.filter(e => 
        e.category === 'relax'
      ).slice(0, 3)
    );
  }

  // 去重
  const unique = [...new Map(recommended.map(e => [e.id, e])).values()];
  return unique.slice(0, 8);
}

/**
 * 推荐知识文章
 */
function recommendArticles(problemAreas, scores) {
  const recommended = [];

  // 症状相关
  if (problemAreas.includes('symptoms') || problemAreas.includes('neck')) {
    recommended.push(
      knowledge.find(a => a.id === 'straight_neck'),
      knowledge.find(a => a.id === 'trigger_points'),
      knowledge.find(a => a.id === 'faq_symptoms')
    );
  }

  // 工作习惯
  if (problemAreas.includes('work')) {
    recommended.push(
      knowledge.find(a => a.id === 'work_posture'),
      knowledge.find(a => a.id === 'faq_programmer')
    );
  }

  // 睡眠问题
  if (problemAreas.includes('sleep')) {
    recommended.push(
      knowledge.find(a => a.id === 'sleep_guide'),
      knowledge.find(a => a.id === 'faq_pillow'),
      knowledge.find(a => a.id === 'faq_sleep_arm')
    );
  }

  // 神经压迫症状
  if (problemAreas.includes('nerve')) {
    recommended.push(
      knowledge.find(a => a.id === 'faq_symptoms')
    );
  }

  // 去重并过滤
  return recommended.filter(Boolean).slice(0, 5);
}

/**
 * 生成健康建议
 */
function generateTips(scores, problemAreas) {
  const tips = [];

  // 症状相关
  if (scores.symptoms >= 12) {
    tips.push({
      type: 'warning',
      icon: '⚠️',
      text: '您的症状较为严重，建议尽快就医进行专业诊断',
    });
  } else if (scores.symptoms >= 8) {
    tips.push({
      type: 'info',
      icon: '💡',
      text: '坚持每天做康复运动，症状会在2-4周内明显改善',
    });
  }

  // 工作习惯
  if (scores.work >= 12) {
    tips.push({
      type: 'action',
      icon: '🖥️',
      text: '调整工作环境：显示器与视线平齐，每45分钟起身活动',
    });
  }

  // 睡眠
  if (scores.sleep >= 10) {
    tips.push({
      type: 'action',
      icon: '🛏️',
      text: '改善睡眠：侧卧时枕头高度12-15cm，避免手臂压在身下',
    });
  }

  // 运动
  tips.push({
    type: 'action',
    icon: '💪',
    text: '每天15分钟康复运动，早晚各一次效果最佳',
  });

  return tips;
}

/**
 * 生成警告提示
 */
function generateWarnings(scores) {
  const warnings = [];

  if (scores.symptoms >= 15) {
    warnings.push({
      level: 'danger',
      text: '症状严重，可能存在神经压迫，请立即就医',
    });
  }

  if (scores.history >= 12) {
    warnings.push({
      level: 'warning',
      text: '您有较长的病史记录，建议定期复查',
    });
  }

  return warnings;
}

/**
 * 默认推荐（未诊断时）
 */
function getDefaultRecommendations() {
  return {
    plan: plans.find(p => p.id === 'daily_care'),
    exercises: exercises.slice(0, 5),
    articles: knowledge.slice(0, 3),
    tips: [
      {
        type: 'info',
        icon: '🩺',
        text: '完成症状自测，获取个性化推荐方案',
      },
      {
        type: 'action',
        icon: '💪',
        text: '每天15分钟康复运动，预防颈椎问题',
      },
    ],
    warnings: [],
  };
}

export default generateRecommendations;
