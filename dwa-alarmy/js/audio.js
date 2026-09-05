/* dźwięk: syntetyczny WebAudio, zero plików (jak w Krainie Pamięci).
   Oryginał Andrzeja generował tony zastępcze, bo nie miał plików audio.
   Tutaj to świadomy wybór: gra zostaje lekka i działa offline. */
window.ASZD = window.ASZD || {};

ASZD.audio = (function () {
  let ctx = null, master = null, musicGain = null;
  let musicTimer = null, musicStep = 0;

  function ensure() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain();
        master.gain.value = 0.5;
        master.connect(ctx.destination);
        musicGain = ctx.createGain();
        musicGain.gain.value = 0.13;
        musicGain.connect(master);
      } catch (e) { return false; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  function sfxOn() { return ASZD.save.get().dzwiek; }

  function tone(freq, dur, type, gain, when, slide, dest) {
    if (!ensure()) return;
    const t = ctx.currentTime + (when || 0);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain || 0.22, t + 0.018);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function sfx() { if (sfxOn()) tone.apply(null, arguments); }

  /* pentatonika durowa: cokolwiek zagramy, brzmi zgodnie */
  const PENTA = [392, 440, 523, 587, 659, 784, 880];
  /* spokojna fraza tła, dużo pauz (null) żeby nie męczyć przy dłuższej grze */
  const FRAZA = [0, 2, 4, null, 2, 5, null, 3, 1, null, 4, 2, null, null, 3, null];

  function musicTick() {
    if (!ASZD.save.get().muzyka || !ensure()) return;
    const i = FRAZA[musicStep % FRAZA.length];
    musicStep++;
    if (i === null) return;
    const f = PENTA[i];
    tone(f, 1.1, 'sine', 0.16, 0, null, musicGain);
    tone(f / 2, 1.6, 'triangle', 0.07, 0.02, null, musicGain);
  }

  return {
    odblokuj() { ensure(); },

    startMuzyki() {
      if (musicTimer) return;
      musicTimer = setInterval(musicTick, 640);
    },
    stopMuzyki() {
      if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    },
    odswiezMuzyke() {
      if (ASZD.save.get().muzyka) this.startMuzyki(); else this.stopMuzyki();
    },

    klik() { sfx(600, 0.06, 'triangle', 0.14); },
    dotyk() { sfx(760, 0.05, 'triangle', 0.1); },

    /* cichy impuls: miękkie, niskie, spokojne. Głośny alarm: ostry, dwutonowy. */
    cichy() { sfx(320, 0.5, 'sine', 0.16, 0, 300); },
    glosny() {
      sfx(720, 0.16, 'square', 0.14);
      sfx(560, 0.2, 'square', 0.14, 0.18);
    },

    dobrze(seria) {
      const base = 523 + Math.min(seria || 0, 6) * 45;
      sfx(base, 0.09, 'triangle', 0.2);
      sfx(base * 1.5, 0.13, 'sine', 0.15, 0.05);
    },
    zle() { sfx(180, 0.28, 'sawtooth', 0.16, 0, 100); },
    wskazowka() { sfx(440, 0.14, 'sine', 0.13, 0, 520); },

    rozdzial() { [523, 659, 784].forEach((f, i) => sfx(f, 0.2, 'triangle', 0.2, i * 0.12)); },
    fanfara() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => sfx(f, 0.24, 'triangle', 0.21, i * 0.15)); }
  };
})();
