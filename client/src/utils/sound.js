// Accessible Web Audio API Sound Synthesizer
// Completely standalone, zero external audio asset dependencies

let audioCtx = null;
let isMuted = false;
let volume = 0.5;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundManager = {
  getMuted() {
    return isMuted;
  },
  setMuted(muted) {
    isMuted = muted;
    return isMuted;
  },
  toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  },
  getVolume() {
    return volume;
  },
  setVolume(vol) {
    volume = Math.max(0, Math.min(1, vol));
  },

  // Soft UI click
  playClick() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  },

  // Clock tick
  playTick(urgency = 1) {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const freq = urgency > 1 ? 800 : 520;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  },

  // Correct answer - Joyful ascending major triad
  playCorrect() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      const startTime = ctx.currentTime + idx * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume * 0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  },

  // Incorrect answer - Gentle minor drop
  playIncorrect() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [440, 370, 311]; // A4, F#4, D#4
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const startTime = ctx.currentTime + idx * 0.1;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume * 0.15, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  },

  // Fanfare / Podium celebration
  playFanfare() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const melody = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 523.25, d: 0.15 }, // C5
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.4 },  // E5
      { f: 587.33, d: 0.15 }, // D5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.6 }   // G5
    ];

    let time = ctx.currentTime + 0.05;
    melody.forEach(({ f, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume * 0.28, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + d);
      time += d;
    });
  },

  // Slot machine roll sound
  playSlotSpin() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      const time = ctx.currentTime + i * 0.06;
      osc.frequency.setValueAtTime(300 + (i % 3) * 150, time);

      gain.gain.setValueAtTime(volume * 0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.04);
    }
  },

  // Delegate drafted fanfare
  playDraftAlert() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const time = ctx.currentTime + idx * 0.07;
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume * 0.2, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.25);
    });
  },

  // Gold coin shower dividend
  playCoinShower() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const coinPitches = [987.77, 1318.51, 1567.98, 1975.53, 2637.02]; // B5, E6, G6, B6, E7
    for (let i = 0; i < 10; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const pitch = coinPitches[i % coinPitches.length];
      const time = ctx.currentTime + i * 0.05 + Math.random() * 0.02;

      osc.frequency.setValueAtTime(pitch, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume * 0.18, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.2);
    }
  },

  // Racing engine acceleration
  playEngineRev() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  },

  // Pit stop mechanical wrenches
  playPitStop() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      const time = ctx.currentTime + i * 0.08;
      osc.frequency.setValueAtTime(750 - i * 80, time);

      gain.gain.setValueAtTime(volume * 0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.05);
    }
  },

  // Spin out skid
  playSpinOut() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.45);

    gain.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  },

  // Drift boost bonus
  playDriftBoost() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [440, 659.25, 880, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const time = ctx.currentTime + idx * 0.06;
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume * 0.22, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.3);
    });
  }
};

