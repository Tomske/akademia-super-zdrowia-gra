/* Wieża Wzorów: zapamiętaj i powtórz sekwencję kafelków (mechanika z Rytuału Senka) */
window.ASZP = window.ASZP || {};
ASZP.games = ASZP.games || {};

/* wspólny silnik sekwencji: używa go poziom Wieży i Turniej (tryb bez końca) */
ASZP.sequenceEngine = function (api, opts) {
  const tilesCount = opts.tiles;
  const endless = !!opts.endless;
  const rounds = opts.rounds || [];

  /* stały losowy zestaw obrazków na całą rozgrywkę */
  const pool = ASZP.shuffle([...ASZP.SEQ_POOL]).slice(0, tilesCount);

  let round = 0;             /* w trybie endless: numer rundy od 0 */
  let lives = 3;
  let seq = [];
  let inputPos = 0;
  let phase = 'idle';        /* idle | playback | input */
  let alive = true;
  let bestLen = 0;           /* najdłuższa w pełni powtórzona sekwencja */
  const timeouts = [];

  const wrap = document.createElement('div');
  wrap.className = 'seq-wrap';
  wrap.innerHTML = `
    <div class="seq-status" id="seq-status">Patrz uważnie…</div>
    <div class="seq-tiles tiles-${tilesCount}" id="seq-tiles"></div>`;
  api.arena.appendChild(wrap);

  const statusEl = wrap.querySelector('#seq-status');
  const tilesWrap = wrap.querySelector('#seq-tiles');
  const tiles = pool.map((key, i) => {
    const b = document.createElement('button');
    b.className = 'gtile';
    b.innerHTML = `<img src="${ASZP.imgOf(key)}" alt="" draggable="false" /><span>${ASZP.nameOf(key)}</span>`;
    b.addEventListener('click', () => press(i));
    tilesWrap.appendChild(b);
    return b;
  });

  api.lives(lives);
  paintProgress();

  function paintProgress() {
    if (endless) api.progress(`Wzór: ${seqLen()} · Rekord: ${bestLen}`);
    else api.progress(`Runda ${Math.min(round + 1, rounds.length)}/${rounds.length}`);
  }

  function seqLen() { return endless ? opts.start + round : rounds[Math.min(round, rounds.length - 1)]; }

  function later(fn, ms) { const t = setTimeout(() => { if (alive) fn(); }, ms); timeouts.push(t); }

  function startRound(repeat) {
    if (!alive) return;
    phase = 'playback';
    inputPos = 0;
    if (!repeat) {
      seq = [];
      const len = seqLen();
      let prev = -1;
      for (let i = 0; i < len; i++) {
        let n;
        do { n = (Math.random() * tilesCount) | 0; } while (n === prev);
        seq.push(n);
        prev = n;
      }
    }
    paintProgress();
    statusEl.textContent = 'Patrz i zapamiętaj…';
    tiles.forEach(t => t.disabled = true);
    const gap = Math.max(400, (opts.gap || 640) - round * 40);
    seq.forEach((id, i) => {
      later(() => {
        tiles[id].classList.add('lit');
        api.audio.tile(id);
        later(() => tiles[id].classList.remove('lit'), gap * 0.62);
      }, 500 + i * gap);
    });
    later(() => {
      if (!alive) return;
      phase = 'input';
      tiles.forEach(t => t.disabled = false);
      statusEl.textContent = 'Twoja kolej! Powtórz wzór.';
    }, 500 + seq.length * gap + 200);
  }

  function press(id) {
    if (phase !== 'input') return;
    const expected = seq[inputPos];
    if (id === expected) {
      tiles[id].classList.add('good');
      api.audio.tile(id);
      later(() => tiles[id].classList.remove('good'), 260);
      inputPos++;
      if (inputPos >= seq.length) {
        phase = 'idle';
        bestLen = Math.max(bestLen, seq.length);
        round++;
        if (!endless && round >= rounds.length) return end(true);
        statusEl.textContent = endless ? 'Pięknie! Wzór rośnie…' : 'Pięknie! Jeszcze trochę…';
        api.audio.good(round * 3);
        later(() => startRound(false), 1000);
      }
    } else {
      phase = 'idle';
      tiles[id].classList.add('bad');
      api.audio.tileBad();
      later(() => tiles[id].classList.remove('bad'), 420);
      lives--;
      api.lives(lives);
      if (lives <= 0) return end(false);
      statusEl.textContent = 'Prawie! Mózguś pokaże jeszcze raz…';
      later(() => startRound(true), 1100);
    }
  }

  function end(success) {
    alive = false;
    statusEl.textContent = success ? 'Wzór opanowany do perfekcji!' : (endless ? `Koniec! Twój wzór: ${bestLen}` : 'Iskry zgasły… spróbuj jeszcze raz!');
    /* goły setTimeout: later() jest bramkowany przez alive i po alive=false by nie odpalił */
    if (endless) {
      setTimeout(() => api.onEnd({ success: bestLen > 0, stars: 0, score: bestLen * 10, record: bestLen }), 900);
    } else if (success) {
      const stars = lives >= 3 ? 3 : lives === 2 ? 2 : 1;
      const score = 60 * rounds.length + lives * 40;
      setTimeout(() => api.onEnd({ success: true, stars, score }), 900);
    } else {
      setTimeout(() => api.onEnd({ success: false, stars: 0, score: 0 }), 900);
    }
  }

  later(() => startRound(false), 900);

  return { stop() { alive = false; timeouts.forEach(clearTimeout); } };
};

ASZP.games.wzory = {
  start(api) {
    const cfg = api.level.cfg;
    return ASZP.sequenceEngine(api, { tiles: cfg.tiles, rounds: cfg.rounds, gap: 640 - (api.level.nr - 1) * 30 });
  }
};
