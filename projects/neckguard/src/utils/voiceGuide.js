/**
 * 语音指导服务
 * 使用 Web Speech API 进行语音提示
 */

class VoiceGuide {
  constructor() {
    this.synth = window.speechSynthesis;
    this.enabled = false;
    this.voice = null;
    this.rate = 0.9;
    this.pitch = 1;
    
    // 初始化语音
    this.initVoice();
  }

  initVoice() {
    // 获取中文语音
    const voices = this.synth.getVoices();
    this.voice = voices.find(v => v.lang.includes('zh')) || voices[0];
    
    // 某些浏览器需要等待 voices 加载
    if (!voices.length) {
      this.synth.onvoiceschanged = () => {
        const newVoices = this.synth.getVoices();
        this.voice = newVoices.find(v => v.lang.includes('zh')) || newVoices[0];
      };
    }
  }

  /**
   * 启用/禁用语音
   */
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  /**
   * 说话
   */
  speak(text, options = {}) {
    if (!this.enabled || !this.synth) return Promise.resolve();

    return new Promise((resolve) => {
      // 取消之前的语音
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.voice;
      utterance.rate = options.rate || this.rate;
      utterance.pitch = options.pitch || this.pitch;
      utterance.volume = options.volume || 1;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth.speak(utterance);
    });
  }

  /**
   * 运动语音指导
   */
  async exerciseGuide(exercise) {
    if (!this.enabled) return;

    // 开始提示
    await this.speak(`准备开始${exercise.name}`);
    await this.delay(500);

    // 逐步骤指导
    for (let i = 0; i < exercise.steps.length; i++) {
      const step = exercise.steps[i];
      await this.speak(`第${i + 1}步，${step}`);
      await this.delay(2000);
    }

    // 完成提示
    await this.speak('运动完成，做得很棒！');
  }

  /**
   * 简单倒计时
   */
  async countdown(seconds) {
    if (!this.enabled) return;

    for (let i = seconds; i > 0; i--) {
      await this.speak(String(i));
      await this.delay(1000);
    }
  }

  /**
   * 呼吸指导
   */
  async breathGuide(cycles = 3) {
    if (!this.enabled) return;

    for (let i = 0; i < cycles; i++) {
      await this.speak('吸气');
      await this.delay(4000);
      
      await this.speak('呼气');
      await this.delay(4000);
    }
  }

  /**
   * 延迟
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 停止
   */
  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

// 导出单例
export const voiceGuide = new VoiceGuide();
export default voiceGuide;
