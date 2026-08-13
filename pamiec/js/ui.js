/* UI: ekrany, mapa świata, przepływ poziomów, ekran wyniku, konfetti */
window.ASZP = window.ASZP || {};

ASZP.ui = (function () {
  const $ = (s) => document.querySelector(s);
  let activeGame = null;
  let currentLevel = null; /* obiekt poziomu albo 'turniej' */

  /* ---------- pomocnicze ---------- */
  function show(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    $('#' + id).classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  let toastT = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.add('hidden'), 2600);
  }

  function modal(html, actions) {
    $('#modal-body').innerHTML = html;
    const box = $('#modal-actions');
    box.innerHTML = '';
    (actions || [{ label: 'OK', cls: 'btn-gold' }]).forEach(a => {
      const b = document.createElement('button');
      b.className = 'btn ' + (a.cls || 'btn-ghost');
      b.textContent = a.label;
      b.addEventListener('click', () => { ASZP.audio.tap(); closeModal(); if (a.fn) a.fn(); });
      box.appendChild(b);
    });
    $('#modal').classList.remove('hidden');
  }
  function closeModal() { $('#modal').classList.add('hidden'); }

  function starSvg(filled) {
    return `<svg class="star${filled ? ' on' : ''}" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,2 15,9 22,9 16.5,13.5 18.5,21 12,16.5 5.5,21 7.5,13.5 2,9 9,9"/></svg>`;
  }

  function avatarHtml(p) {
    return `<span class="avatar" style="background:${p.color}">${(p.name[0] || '?').toUpperCase()}</span>`;
  }

  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = $('#confetti');
    box.innerHTML = '';
    const colors = ['#FFC300', '#4FC3F7', '#81C784', '#FF8A80', '#B39DDB', '#fff'];
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('i');
      s.style.left = Math.random() * 100 + 'vw';
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = Math.random() * 0.6 + 's';
      s.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
      box.appendChild(s);
    }
    box.classList.remove('hidden');
    setTimeout(() => box.classList.add('hidden'), 3400);
  }

  /* ---------- ekran graczy ---------- */
  let pickedColor = ASZP.COLORS[0];

  function renderPlayers() {
    const st = ASZP.save.get();
    const list = $('#players-list');
    list.innerHTML = '';
    st.players.forEach(p => {
      const row = document.createElement('div');
      row.className = 'player-row';
      const btn = document.createElement('button');
      btn.className = 'player-pick';
      btn.innerHTML = `${avatarHtml(p)}<span class="pname">${escapeHtml(p.name)}</span>
        <span class="pmeta">${starSvg(true)} ${ASZP.save.starsTotal(p)} · ${p.points} pkt</span>`;
      btn.addEventListener('click', () => {
        ASZP.audio.unlock(); ASZP.audio.tap();
        ASZP.save.setActive(p.id);
        enterMap();
      });
      const del = document.createElement('button');
      del.className = 'player-del';
      del.setAttribute('aria-label', `Usuń gracza ${p.name}`);
      del.textContent = '×';
      del.addEventListener('click', () => {
        modal(`<h3>Usunąć gracza ${escapeHtml(p.name)}?</h3><p>Zniknie razem ze wszystkimi gwiazdkami i punktami. Tego nie da się cofnąć.</p>`, [
          { label: 'Usuń', cls: 'btn-danger', fn: () => { ASZP.save.removePlayer(p.id); renderPlayers(); } },
          { label: 'Zostaw', cls: 'btn-gold' }
        ]);
      });
      row.appendChild(btn);
      row.appendChild(del);
      list.appendChild(row);
    });

    const picks = $('#color-picks');
    picks.innerHTML = '';
    ASZP.COLORS.forEach(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'color-dot' + (c === pickedColor ? ' picked' : '');
      b.style.background = c;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', c === pickedColor ? 'true' : 'false');
      b.setAttribute('aria-label', 'Kolor gracza');
      b.addEventListener('click', () => { pickedColor = c; renderPlayers(); });
      picks.appendChild(b);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  /* ---------- mapa świata ---------- */
  function enterMap() {
    show('screen-map');
    renderMap();
  }

  function paintHeader() {
    const p = ASZP.save.active();
    if (!p) return;
    $('#chip-player').innerHTML = `${avatarHtml(p)}<span>${escapeHtml(p.name)}</span>`;
    $('#stat-stars').innerHTML = `${starSvg(true)} ${ASZP.save.starsTotal(p)}/${ASZP.MAX_STARS}`;
    $('#stat-points').innerHTML = `<svg viewBox="0 0 24 24" class="brainic" aria-hidden="true"><path d="M9 3 a4 4 0 0 0-4 4 a3.5 3.5 0 0 0-2 3.2 A3.6 3.6 0 0 0 5 13.5 A4 4 0 0 0 9 21 h1 V3 Z" fill="currentColor" opacity=".85"/><path d="M15 3 a4 4 0 0 1 4 4 a3.5 3.5 0 0 1 2 3.2 A3.6 3.6 0 0 1 19 13.5 A4 4 0 0 1 15 21 h-1 V3 Z" fill="currentColor"/></svg> ${p.points} pkt`;
    paintSound();
  }

  function paintSound() {
    const on = ASZP.save.get().sound;
    $('#btn-sound').textContent = on ? '🔊' : '🔇';
    $('#btn-sound').setAttribute('aria-label', on ? 'Wyłącz dźwięk' : 'Włącz dźwięk');
  }

  function nodeHtml(level, p) {
    const stars = p.stars[level.id] || 0;
    const unlocked = ASZP.save.isLevelUnlocked(level.id);
    const starsRow = [1, 2, 3].map(n => starSvg(stars >= n)).join('');
    const lock = `<svg viewBox="0 0 24 24" class="lockic" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 10 V7 a4 4 0 0 1 8 0 v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
    return `<button class="node${unlocked ? '' : ' locked'}${stars ? ' done' : ''}" data-level="${level.id}"
      aria-label="Poziom ${level.nr}${unlocked ? '' : ', zablokowany'}">
      <span class="node-nr">${unlocked ? level.nr : lock}</span>
      <span class="node-stars">${starsRow}</span>
    </button>`;
  }

  function renderMap() {
    paintHeader();
    const p = ASZP.save.active();
    if (!p) return;
    const world = $('#world');

    let html = '';
    ASZP.ZONES.forEach((zone, zi) => {
      const levels = ASZP.levelsOf(zone.id);
      const got = levels.reduce((s, l) => s + (p.stars[l.id] || 0), 0);
      html += `
      <section class="zone zone-${zone.id}">
        <div class="zone-head">
          <span class="zone-emblem zone-host"><img src="${ASZP.PIMG + ASZP.CHARS[zone.host].img}" alt="${ASZP.CHARS[zone.host].name}" /></span>
          <div>
            <h2>${zone.name}</h2>
            <p>${zone.desc}</p>
          </div>
          <span class="zone-score">${starSvg(true)} ${got}/${levels.length * 3}</span>
        </div>
        <div class="zone-path">
          <svg class="path-line" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path d="M2 5 C 20 ${zi % 2 ? 0 : 10}, 40 ${zi % 2 ? 10 : 0}, 60 5 S 90 ${zi % 2 ? 0 : 10}, 98 5" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.6" stroke-dasharray="3 2.4" stroke-linecap="round"/></svg>
          ${levels.map(l => nodeHtml(l, p)).join('')}
        </div>
        <p class="zone-tip">${zone.tip}</p>
      </section>`;
    });

    /* turniej */
    const open = ASZP.save.tournamentUnlocked();
    const badge = ASZP.save.badgeFor(p.record || 0);
    html += `
    <section class="zone zone-turniej${open ? '' : ' locked'}">
      <div class="zone-head">
        <span class="zone-emblem">${ASZP.TROPHY}</span>
        <div>
          <h2>${ASZP.TURNIEJ.name}</h2>
          <p>${open ? ASZP.TURNIEJ.desc : `Zdobądź ${ASZP.TURNIEJ.unlockStars} gwiazdki w krainach, aby otworzyć turniej. Masz ${ASZP.save.starsTotal(p)}.`}</p>
        </div>
        ${open ? `<span class="zone-score">Rekord: ${p.record || 0}</span>` : ''}
      </div>
      ${open ? `<div class="turniej-row">
          <button class="btn btn-gold" data-level="turniej">Stań do turnieju</button>
          ${badge ? `<span class="badge">🏆 ${badge.name}</span>` : ''}
        </div>` : ''}
    </section>`;

    world.innerHTML = html;
    world.querySelectorAll('[data-level]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.dataset.level;
        ASZP.audio.unlock(); ASZP.audio.tap();
        openLevel(id);
      });
    });
  }

  /* ---------- przepływ poziomu ---------- */
  function openLevel(id) {
    if (id === 'turniej') {
      if (!ASZP.save.tournamentUnlocked()) { toast('Turniej jeszcze zamknięty. Zbieraj gwiazdki!'); return; }
      modal(`<h3>${ASZP.TURNIEJ.name}</h3><p>${ASZP.TURNIEJ.howto}</p>`, [
        { label: 'Start!', cls: 'btn-gold', fn: () => startGame('turniej') },
        { label: 'Wróć', cls: 'btn-ghost', fn: enterMap }
      ]);
      return;
    }
    const level = ASZP.levelById(id);
    if (!ASZP.save.isLevelUnlocked(id)) { toast('Najpierw zdobądź gwiazdkę na wcześniejszym poziomie.'); return; }
    const zone = ASZP.zoneById(level.zone);
    modal(`<h3>${zone.name} · Poziom ${level.nr}</h3><p>${zone.howto}</p>`, [
      { label: 'Start!', cls: 'btn-gold', fn: () => startGame(level) },
      { label: 'Wróć', cls: 'btn-ghost', fn: enterMap }
    ]);
  }

  function startGame(level) {
    stopActiveGame();
    currentLevel = level;
    const isT = level === 'turniej';
    const zone = isT ? null : ASZP.zoneById(level.zone);
    $('#game-title').textContent = isT ? ASZP.TURNIEJ.name : `${zone.name} · Poziom ${level.nr}`;
    const arena = $('#arena');
    arena.innerHTML = '';
    arena.className = 'arena arena-' + (isT ? 'turniej' : level.zone);
    show('screen-game');

    const api = {
      arena,
      level: isT ? null : level,
      audio: ASZP.audio,
      lives(n) {
        const el = $('#game-lives');
        if (n < 0) { el.innerHTML = ''; return; }
        el.innerHTML = 'Iskry: ' + [1, 2, 3].map(i => `<span class="spark${i <= n ? ' on' : ''}">⚡</span>`).join('');
      },
      progress(text) { $('#game-progress').textContent = text; },
      onEnd(result) { onGameEnd(result); }
    };
    activeGame = ASZP.games[isT ? 'turniej' : zone.game].start(api);
  }

  function stopActiveGame() {
    if (activeGame && activeGame.stop) activeGame.stop();
    activeGame = null;
  }

  function onGameEnd(result) {
    stopActiveGame();
    const p = ASZP.save.active();
    const isT = currentLevel === 'turniej';
    const titleEl = $('#result-title');
    const starsEl = $('#result-stars');
    const detailEl = $('#result-detail');
    const actions = $('#result-actions');
    actions.innerHTML = '';

    if (isT) {
      const res = ASZP.save.recordTournament(result.record || 0);
      const badge = ASZP.save.badgeFor(p.record || 0);
      titleEl.textContent = res.newRecord ? 'NOWY REKORD!' : 'Dobry trening!';
      starsEl.innerHTML = `<span class="bigrecord">${result.record || 0}</span><span class="reclabel">długość wzoru</span>`;
      detailEl.innerHTML = `Rekord: <b>${res.record}</b> · +${res.gained} pkt (razem ${p.points})` +
        (badge ? `<div class="badge">🏆 ${badge.name}</div>` : '');
      if (res.newRecord) { ASZP.audio.fanfare(); confetti(); } else { ASZP.audio.win(); }
      addBtn(actions, 'Jeszcze raz', 'btn-gold', () => startGame('turniej'));
      addBtn(actions, 'Mapa', 'btn-ghost', enterMap);
    } else if (result.success) {
      const saved = ASZP.save.recordResult(currentLevel.id, result.stars, result.score);
      titleEl.textContent = ASZP.PRAISE[(Math.random() * ASZP.PRAISE.length) | 0];
      starsEl.innerHTML = [1, 2, 3].map(n => starSvg(result.stars >= n)).join('');
      detailEl.innerHTML = `Wynik: <b>${result.score}</b> · +${saved.gained} pkt (razem ${p.points})`;
      if (result.stars >= 3) { ASZP.audio.fanfare(); confetti(); } else { ASZP.audio.win(); }
      const next = ASZP.levelsOf(currentLevel.zone).find(l => l.nr === currentLevel.nr + 1);
      if (next) addBtn(actions, 'Następny poziom', 'btn-gold', () => openLevel(next.id));
      else addBtn(actions, 'Wybierz krainę', 'btn-gold', enterMap);
      addBtn(actions, 'Jeszcze raz', 'btn-ghost', () => startGame(currentLevel));
      addBtn(actions, 'Mapa', 'btn-ghost', enterMap);
    } else {
      titleEl.textContent = 'Nie szkodzi, trening czyni mistrza!';
      starsEl.innerHTML = [1, 2, 3].map(() => starSvg(false)).join('');
      detailEl.textContent = 'Mózguś wierzy w Ciebie. Spróbuj jeszcze raz!';
      ASZP.audio.lose();
      addBtn(actions, 'Jeszcze raz', 'btn-gold', () => startGame(currentLevel));
      addBtn(actions, 'Mapa', 'btn-ghost', enterMap);
    }
    $('#result').classList.remove('hidden');
  }

  function addBtn(box, label, cls, fn) {
    const b = document.createElement('button');
    b.className = 'btn ' + cls;
    b.textContent = label;
    b.addEventListener('click', () => {
      ASZP.audio.tap();
      $('#result').classList.add('hidden');
      fn();
    });
    box.appendChild(b);
  }

  function toggleSound() {
    ASZP.save.set({ sound: !ASZP.save.get().sound });
    paintSound();
    ASZP.audio.tap();
  }

  function getPickedColor() { return pickedColor; }

  return { show, toast, modal, renderPlayers, enterMap, renderMap, openLevel, startGame, stopActiveGame, toggleSound, getPickedColor };
})();
