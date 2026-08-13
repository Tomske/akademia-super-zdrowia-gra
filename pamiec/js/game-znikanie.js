/* Jaskinia Zniknięć: zapamiętaj planszę i wskaż, który przedmiot zniknął */
window.ASZP = window.ASZP || {};
ASZP.games = ASZP.games || {};

ASZP.games.znikanie = {
  start(api) {
    const cfg = api.level.cfg;
    const POOL = [...ASZP.ITEM_KEYS, ...ASZP.CHAR_KEYS];

    let round = 0;
    let lives = 3;
    let alive = true;
    let answering = false;
    const timeouts = [];

    const wrap = document.createElement('div');
    wrap.className = 'van-wrap';
    wrap.innerHTML = `
      <div class="seq-status" id="van-status">Zapamiętaj przedmioty!</div>
      <div class="van-timer"><div class="van-timer-fill" id="van-fill"></div></div>
      <div class="van-board" id="van-board"></div>
      <div class="van-tray" id="van-tray"></div>`;
    api.arena.appendChild(wrap);

    const statusEl = wrap.querySelector('#van-status');
    const fillEl = wrap.querySelector('#van-fill');
    const boardEl = wrap.querySelector('#van-board');
    const trayEl = wrap.querySelector('#van-tray');

    api.lives(lives);
    paintProgress();

    function later(fn, ms) { const t = setTimeout(() => { if (alive) fn(); }, ms); timeouts.push(t); }
    function paintProgress() { api.progress(`Runda ${Math.min(round + 1, cfg.rounds)}/${cfg.rounds}`); }

    function itemCell(key, hidden) {
      return `<div class="van-item${hidden ? ' gone' : ''}" data-key="${key}">
        <img src="${ASZP.imgOf(key)}" alt="" draggable="false" /><span>${ASZP.nameOf(key)}</span></div>`;
    }

    function startRound() {
      if (!alive) return;
      answering = false;
      paintProgress();
      trayEl.innerHTML = '';
      const board = ASZP.shuffle(POOL).slice(0, cfg.count);
      boardEl.className = 'van-board cols-' + Math.min(4, Math.ceil(Math.sqrt(board.length + 1)));
      boardEl.innerHTML = board.map(k => itemCell(k, false)).join('');

      statusEl.textContent = 'Zapamiętaj przedmioty!';
      /* pasek czasu: transition szerokości przez czas podglądu */
      fillEl.style.transition = 'none';
      fillEl.style.width = '100%';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        fillEl.style.transition = `width ${cfg.view}s linear`;
        fillEl.style.width = '0%';
      }));

      later(() => hidePhase(board), cfg.view * 1000);
    }

    function hidePhase(board) {
      statusEl.textContent = 'Mózguś coś schował…';
      boardEl.classList.add('covered');
      api.audio.flip();

      const missing = board[(Math.random() * board.length) | 0];
      let remaining = board.filter(k => k !== missing);
      if (cfg.shuffle) remaining = ASZP.shuffle(remaining);

      later(() => {
        boardEl.classList.remove('covered');
        boardEl.innerHTML = remaining.map(k => itemCell(k, false)).join('') +
          `<div class="van-item gone" data-key="${missing}"><span class="qmark">?</span><span>Co tu było?</span></div>`;
        askPhase(board, missing);
      }, 1100);
    }

    function askPhase(board, missing) {
      answering = true;
      statusEl.textContent = 'Co zniknęło?';
      const distractors = ASZP.shuffle(POOL.filter(k => !board.includes(k))).slice(0, cfg.options - 1);
      const options = ASZP.shuffle([missing, ...distractors]);
      trayEl.innerHTML = '';
      options.forEach((key) => {
        const b = document.createElement('button');
        b.className = 'gtile small';
        b.innerHTML = `<img src="${ASZP.imgOf(key)}" alt="" draggable="false" /><span>${ASZP.nameOf(key)}</span>`;
        b.addEventListener('click', () => answer(b, key, missing));
        trayEl.appendChild(b);
      });
    }

    function answer(btn, key, missing) {
      if (!answering) return;
      if (key === missing) {
        answering = false;
        btn.classList.add('good');
        api.audio.good(round + 1);
        const gone = boardEl.querySelector('.gone');
        if (gone) gone.outerHTML = itemCell(missing, false);
        statusEl.textContent = `Tak! Zniknęły: ${ASZP.nameOf(missing)}.`;
        round++;
        if (round >= cfg.rounds) { later(() => end(true), 900); }
        else later(startRound, 1200);
      } else {
        btn.classList.add('bad');
        btn.disabled = true;
        api.audio.tileBad();
        lives--;
        api.lives(lives);
        if (lives <= 0) { answering = false; return end(false); }
        statusEl.textContent = 'To nie to… spójrz jeszcze raz!';
      }
    }

    function end(success) {
      alive = false;
      const stars = success ? (lives >= 3 ? 3 : lives === 2 ? 2 : 1) : 0;
      const score = success ? 60 * cfg.rounds + lives * 40 : 0;
      statusEl.textContent = success ? 'Nic się przed Tobą nie ukryje!' : 'Iskry zgasły… spróbuj jeszcze raz!';
      setTimeout(() => api.onEnd({ success, stars, score }), 900);
    }

    later(startRound, 700);

    return { stop() { alive = false; timeouts.forEach(clearTimeout); } };
  }
};
