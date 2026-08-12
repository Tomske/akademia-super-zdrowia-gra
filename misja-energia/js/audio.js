/* dźwięki: WebAudio, syntetyczne (zero plików), przełącznik zapamiętywany */
window.ASZ = window.ASZ || {};

ASZ.audio = (function () {
  let ctx = null;
  let master = null;

  function ensure() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain();
        master.gain.value = 0.5;
        master.connect(ctx.destination);
      } catch (e) { return false; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  function on() { return ASZ.save.get().sound; }

  function tone(freq, dur, type, gain, when, slide) {
    if (!on() || !ensure()) return;
    const t = ctx.currentTime + (when || 0);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain || 0.25, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function noise(dur, gain, when) {
    if (!on() || !ensure()) return;
    const t = ctx.currentTime + (when || 0);
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = gain || 0.2;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 1200;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }

  const PENTA = [392, 440, 523, 587, 659];

  return {
    unlock() { ensure(); },
    tap() { tone(600, 0.07, 'triangle', 0.15); },
    good(combo) {
      const base = 523 + Math.min(combo || 0, 8) * 40;
      tone(base, 0.09, 'triangle', 0.22);
      tone(base * 1.5, 0.12, 'sine', 0.16, 0.05);
    },
    bad() { tone(160, 0.25, 'sawtooth', 0.2, 0, 90); noise(0.15, 0.12); },
    heart() { tone(660, 0.1, 'sine', 0.2); tone(880, 0.14, 'sine', 0.2, 0.09); tone(1100, 0.2, 'sine', 0.18, 0.18); },
    tile(i) { tone(PENTA[i % PENTA.length], 0.32, 'triangle', 0.24); },
    tileBad() { tone(140, 0.4, 'sawtooth', 0.22, 0, 80); },
    jump() { tone(300, 0.18, 'sine', 0.18, 0, 640); },
    land() { noise(0.08, 0.1); },
    coin() { tone(988, 0.07, 'square', 0.12); tone(1319, 0.16, 'square', 0.1, 0.06); },
    beamCharge() { tone(330, 0.12, 'sine', 0.14, 0, 520); },
    beamFire() { tone(220, 0.5, 'sawtooth', 0.24, 0, 880); noise(0.4, 0.16, 0.05); },
    bossHit() { tone(110, 0.4, 'square', 0.24, 0, 55); noise(0.3, 0.2); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.22, i * 0.13)); },
    lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.25, 'triangle', 0.2, i * 0.16)); },
    fanfare() {
      [523, 523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.2, 'triangle', 0.22, i * 0.14));
      noise(0.5, 0.1, 0.9);
    }
  };
})();
