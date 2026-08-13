/* Ogród Par: klasyczne memory, im mniej ruchów tym więcej gwiazdek */
window.ASZP = window.ASZP || {};
ASZP.games = ASZP.games || {};

ASZP.games.pary = {
  start(api) {
    const cfg = api.level.cfg;
    const pairs = cfg.pairs;

    /* pula obrazków: itemy, a na najtrudniejszym poziomie także portrety bohaterów */
    const pool = cfg.mix ? [...ASZP.ITEM_KEYS, ...ASZP.CHAR_KEYS] : [...ASZP.ITEM_KEYS];
    const chosen = ASZP.shuffle(pool).slice(0, pairs);
    const deck = ASZP.shuffle([...chosen, ...chosen]);

    let openCard = null;      /* pierwsza odkryta karta w ruchu */
    let locked = false;       /* blokada podczas sprawdzania pary */
    let moves = 0;
    let found = 0;
    let alive = true;
    const timeouts = [];

    const threeAt = Math.ceil(pairs * 1.6) + 1;
    const twoAt = Math.ceil(pairs * 2.5);

    const wrap = document.createElement('div');
    wrap.className = 'pairs-wrap';
    wrap.innerHTML = `
      <div class="seq-status" id="pairs-status">Znajdź wszystkie pary!</div>
      <div class="pairs-grid pairs-${deck.length}" id="pairs-grid"></div>`;
    api.arena.appendChild(wrap);

    const statusEl = wrap.querySelector('#pairs-status');
    const grid = wrap.querySelector('#pairs-grid');

    const crest = `<svg viewBox="0 0 1000 1000" aria-hidden="true"><path d="M 200,50 L 800,50 C 910,50 950,120 950,210 L 950,440 C 950,720 780,880 500,990 C 220,880 50,720 50,440 L 50,210 C 50,120 90,50 200,50 Z" fill="#FFC300"/><path d="M 236,106.4 L 764,106.4 C 860.8,106.4 896,168 896,247.2 L 896,449.6 C 896,696 746.4,836.8 500,933.6 C 253.6,836.8 104,696 104,449.6 L 104,247.2 C 104,168 139.2,106.4 236,106.4 Z" fill="#14213D"/><polygon points="500,185 577.6,363.2 771.1,381.9 625.5,510.8 667.5,700.6 500,602 332.5,700.6 374.5,510.8 228.9,381.9 422.4,363.2" fill="#FFC300"/></svg>`;

    const cards = deck.map((key) => {
      const b = document.createElement('button');
      b.className = 'card';
      b.dataset.key = key;
      b.setAttribute('aria-label', 'Zakryta karta');
      b.innerHTML = `
        <span class="card-inner">
          <span class="card-back">${crest}</span>
          <span class="card-face"><img src="${ASZP.imgOf(key)}" alt="" draggable="false" /></span>
        </span>`;
      b.addEventListener('click', () => flip(b));
      grid.appendChild(b);
      return b;
    });

    api.lives(-1); /* w Ogrodzie nie ma iskier, liczą się ruchy */
    paintProgress();

    function later(fn, ms) { const t = setTimeout(() => { if (alive) fn(); }, ms); timeouts.push(t); }

    function paintProgress() { api.progress(`Pary: ${found}/${pairs} · Ruchy: ${moves}`); }

    function flip(card) {
      if (locked || card.classList.contains('open') || card.classList.contains('matched')) return;
      card.classList.add('open');
      card.setAttribute('aria-label', ASZP.nameOf(card.dataset.key));
      api.audio.flip();

      if (!openCard) { openCard = card; return; }

      /* druga karta w ruchu */
      moves++;
      const first = openCard;
      openCard = null;

      if (first.dataset.key === card.dataset.key) {
        found++;
        paintProgress();
        first.classList.add('matched');
        card.classList.add('matched');
        api.audio.good(found);
        statusEl.textContent = `Para: ${ASZP.nameOf(card.dataset.key)}!`;
        if (found >= pairs) { later(end, 600); }
      } else {
        locked = true;
        paintProgress();
        later(() => {
          [first, card].forEach(c => { c.classList.remove('open'); c.setAttribute('aria-label', 'Zakryta karta'); });
          locked = false;
        }, 800);
      }
    }

    function end() {
      alive = false;
      const stars = moves <= threeAt ? 3 : moves <= twoAt ? 2 : 1;
      const score = pairs * 30 + Math.max(0, pairs * 3 - moves) * 10 + stars * 20;
      statusEl.textContent = 'Wszystkie pary znalezione!';
      setTimeout(() => api.onEnd({ success: true, stars, score }), 700);
    }

    return { stop() { alive = false; timeouts.forEach(clearTimeout); } };
  }
};
