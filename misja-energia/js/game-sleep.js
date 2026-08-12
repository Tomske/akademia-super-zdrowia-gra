/* Misja 3: Wieczorny Rytuał (Senek) — zapamiętaj i powtórz sekwencję rytuału snu */
window.ASZ = window.ASZ || {};

ASZ.games.sleep = {
  start(api) {
    const { arena, stats } = api;

    const STEPS = [
      { id: 0, label: 'Odłóż telefon', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="3" y1="3" x2="21" y2="21" stroke="#ff8a80" stroke-width="2.6"/></svg>' },
      { id: 1, label: 'Umyj zęby', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3 L7 14 a3 3 0 0 0 6 0 L13 3"/><path d="M7 6 h6"/><path d="M16 8 c3 0 4 2 4 5 s-1 8-3 8-2-5-2-8"/></svg>' },
      { id: 2, label: 'Przygaś światło', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="5"/><path d="M9 15 h6 M10 18 h4 M11 21 h2"/><path d="M12 2 v1 M4 10 h-1 M21 10 h-1"/></svg>' },
      { id: 3, label: 'Poczytaj książkę', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5 a2 2 0 0 1 2-2 h5 v16 h-5 a2 2 0 0 0-2 2 z"/><path d="M21 5 a2 2 0 0 0-2-2 h-5 v16 h5 a2 2 0 0 1 2 2 z"/></svg>' },
      { id: 4, label: 'Śpij smacznie', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13 A8 8 0 1 1 11 4 a6.5 6.5 0 0 0 9 9 z"/><path d="M14 3 h4 l-4 4 h4" stroke-width="1.6"/></svg>' }
    ];

    const ROUNDS = [2, 3, 4, 5, 6];
    let round = 0;
    let moons = 3;
    let seq = [];
    let inputPos = 0;
    let phase = 'idle'; // idle | playback | input
    let alive = true;
    const timeouts = [];

    const wrap = document.createElement('div');
    wrap.className = 'sleep-wrap';
    wrap.style.backgroundImage = `url('${api.mission.bg}')`;
    wrap.innerHTML = `
      <div class="sleep-dim"></div>
      <div class="sleep-status" id="sleep-status">Rytuał Senka: patrz uważnie…</div>
      <div class="sleep-tiles" id="sleep-tiles"></div>`;
    arena.appendChild(wrap);

    const tilesWrap = wrap.querySelector('#sleep-tiles');
    const statusEl = wrap.querySelector('#sleep-status');
    const tiles = STEPS.map((s) => {
      const b = document.createElement('button');
      b.className = 'tile';
      b.innerHTML = `${s.svg}<span>${s.label}</span>`;
      b.addEventListener('click', () => press(s.id));
      tilesWrap.appendChild(b);
      return b;
    });

    stats.moons(moons);
    stats.progress(`Runda 1/${ROUNDS.length}`);

    function later(fn, ms) { const t = setTimeout(() => { if (alive) fn(); }, ms); timeouts.push(t); }

    function startRound(repeat) {
      if (!alive) return;
      phase = 'playback';
      inputPos = 0;
      if (!repeat) {
        seq = [];
        const len = ROUNDS[round];
        let prev = -1;
        for (let i = 0; i < len; i++) {
          let n;
          do { n = (Math.random() * STEPS.length) | 0; } while (n === prev);
          seq.push(n);
          prev = n;
        }
      }
      statusEl.textContent = 'Patrz i zapamiętaj…';
      tiles.forEach(t => t.disabled = true);
      const gap = Math.max(430, 640 - round * 45);
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
        statusEl.textContent = 'Twoja kolej! Powtórz rytuał.';
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
          round++;
          stats.progress(`Runda ${Math.min(round + 1, ROUNDS.length)}/${ROUNDS.length}`);
          if (round >= ROUNDS.length) return end();
          statusEl.textContent = 'Pięknie! Rytuał się wydłuża…';
          api.audio.good(round * 3);
          later(() => startRound(false), 1000);
        }
      } else {
        phase = 'idle';
        tiles[id].classList.add('bad');
        api.audio.tileBad();
        later(() => tiles[id].classList.remove('bad'), 420);
        moons--;
        stats.moons(moons);
        if (moons <= 0) {
          alive = false;
          statusEl.textContent = 'Ojej, oczy same się kleją…';
          // goły setTimeout jak w end(): later() jest bramkowany przez alive, więc po
          // alive=false nigdy by nie odpalił i gra wisiała bez ekranu wyniku
          setTimeout(() => api.onEnd({ success: false, stars: 0, score: 0 }), 900);
          return;
        }
        statusEl.textContent = 'Prawie! Senek pokaże jeszcze raz…';
        later(() => startRound(true), 1100);
      }
    }

    function end() {
      alive = false;
      const score = 60 * ROUNDS.length + moons * 40;
      const stars = moons >= 3 ? 3 : moons === 2 ? 2 : 1;
      statusEl.textContent = 'Szszsz… wszyscy śpią. Brawo!';
      setTimeout(() => api.onEnd({ success: true, stars, score }), 800);
    }

    later(() => startRound(false), 900);

    return { stop() { alive = false; timeouts.forEach(clearTimeout); } };
  }
};
