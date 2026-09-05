/**
 * Vgo 手艺人听单专属强提示音频引擎 (Web Audio API 物理合成，零外部依赖，绝不404)
 */
class VgoSoundAlert {
  constructor() {
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  // 播放新工单到达的高穿透力警报铃声
  playNewOrderBeep() {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // 模拟急促的双音清脆门铃/派单提醒 (880Hz -> 1760Hz)
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      osc.frequency.setValueAtTime(880, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.4);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);

      // 伴随硬件强震动
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([120, 80, 180]);
      }
    } catch (e) {
      console.warn('播放警报声失败:', e);
    }
  }
}
window.vgoSound = new VgoSoundAlert();
