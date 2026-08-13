/* dźwięki: syntetyczny WebAudio (zero plików), przełącznik zapamiętywany w zapisie */
window.ASZP = window.ASZP || {};

ASZP.audio = (function () {
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

  function on() { return ASZP.save.get().sound; }

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

  /* pentatonika: kafelki wzorów brzmią melodyjnie w dowolnej kolejności */
  const PENTA = [392, 440, 523, 587, 659, 784];

  return {
    unlock() { ensure(); },
    tap() { tone(600, 0.07, 'triangle', 0.15); },
    tile(i) { tone(PENTA[i % PENTA.length], 0.32, 'triangle', 0.24); },
    tileBad() { tone(140, 0.4, 'sawtooth', 0.22, 0, 80); },
    flip() { tone(500, 0.06, 'triangle', 0.12, 0, 700); },
    good(combo) {
      const base = 523 + Math.min(combo || 0, 8) * 40;
      tone(base, 0.09, 'triangle', 0.22);
      tone(base * 1.5, 0.12, 'sine', 0.16, 0.05);
    },
    bad() { tone(160, 0.25, 'sawtooth', 0.2, 0, 90); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.22, i * 0.13)); },
    lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.25, 'triangle', 0.2, i * 0.16)); },
    fanfare() { [523, 523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.2, 'triangle', 0.22, i * 0.14)); }
  };
})();
