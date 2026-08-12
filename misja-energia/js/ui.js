/* UI: ekrany, mapa misji, dialogi, wyniki, HUD, efekty, pomocnik canvas */
window.ASZ = window.ASZ || {};

ASZ.ui = (function () {
  const $ = (sel) => document.querySelector(sel);

  /* ---------- ekrany ---------- */
  let current = null;
  function show(id) {
    document.querySelectorAll('.screen').forEach(s => {
      if (s.id === id) {
        s.classList.add('visible');
      } else {
        s.classList.remove('visible');
      }
    });
    current = id;
  }

  /* ---------- dźwięk ---------- */
  function paintSoundBtns() {
    const onOff = ASZ.save.get().sound;
    document.querySelectorAll('.sound-btn').forEach(b => { b.textContent = onOff ? '🔊' : '🔇'; });
  }
  function toggleSound() {
    ASZ.save.set({ sound: !ASZ.save.get().sound });
    paintSoundBtns();
    ASZ.audio.tap();
  }

  /* ---------- dialogi ---------- */
  function showDialog(lines, onDone) {
    const box = $('#dialog');
    let i = 0;
    const img = $('#dialog-img');
    const name = $('#dialog-name');
    const text = $('#dialog-text');
    const btn = $('#btn-dialog-next');

    function render() {
      const line = lines[i];
      const ch = ASZ.CHARS[line.who];
      img.src = ch.img;
      img.alt = ch.name;
      name.textContent = ch.name;
      text.textContent = line.text;
      btn.textContent = (i === lines.length - 1) ? 'Start! ▶' : 'Dalej ▶';
    }
    function next() {
      ASZ.audio.tap();
      i++;
      if (i >= lines.length) {
        btn.removeEventListener('click', next);
        box.classList.add('hidden');
        onDone && onDone();
      } else {
        render();
      }
    }
    btn.addEventListener('click', next);
    render();
    box.classList.remove('hidden');
  }

  /* ---------- wynik misji ---------- */
  function showResult(opts) {
    // opts: {success, stars, score, wiedza, isBoss, onRetry, onNext}
    const box = $('#result');
    $('#result-title').textContent = opts.success
      ? (opts.stars >= 3 ? 'Perfekcyjnie!' : opts.stars === 2 ? 'Świetna robota!' : 'Misja zaliczona!')
      : 'Prawie się udało!';
    const starsEl = $('#result-stars');
    starsEl.innerHTML = '';
    for (let s = 1; s <= 3; s++) {
      const sp = document.createElement('span');
      sp.textContent = '★';
      if (!opts.success || s > opts.stars) sp.className = 'off';
      starsEl.appendChild(sp);
    }
    $('#result-score').textContent = opts.success ? `Zdrowomoc +${opts.score}` : 'Spróbuj jeszcze raz, drużyna w Ciebie wierzy!';
    const w = $('#result-wiedza');
    if (opts.success && opts.wiedza) { w.innerHTML = opts.wiedza; w.style.display = ''; }
    else { w.style.display = 'none'; }

    const btnRetry = $('#btn-result-retry');
    const btnNext = $('#btn-result-next');
    btnNext.textContent = opts.success ? (opts.isBoss ? 'Odbierz nagrodę! 🏆' : 'Do mapy ▶') : 'Do mapy';
    btnRetry.textContent = '↻ Jeszcze raz';

    function cleanup() {
      btnRetry.removeEventListener('click', onRetry);
      btnNext.removeEventListener('click', onNext);
      box.classList.add('hidden');
    }
    function onRetry() { ASZ.audio.tap(); cleanup(); opts.onRetry(); }
    function onNext() { ASZ.audio.tap(); cleanup(); opts.onNext(); }
    btnRetry.addEventListener('click', onRetry);
    btnNext.addEventListener('click', onNext);
    box.classList.remove('hidden');

    if (opts.success) { ASZ.audio.win(); confetti(opts.stars * 40 + 30); }
    else { ASZ.audio.lose(); }
  }

  /* ---------- modal ---------- */
  function showModal(html) {
    $('#modal-content').innerHTML = html;
    $('#modal').classList.remove('hidden');
  }

  /* ---------- mapa ---------- */
  function renderMap() {
    const wrap = $('#map-nodes');
    wrap.innerHTML = '';
    const st = ASZ.save.get();
    const unlocked = ASZ.save.unlockedCount();

    ASZ.MISSIONS.forEach((m, idx) => {
      const stars = st.stars[m.id] || 0;
      const locked = idx + 1 > unlocked;
      const node = document.createElement('button');
      node.className = 'node' + (locked ? ' locked' : '') + (m.boss ? ' node-boss' : '');
      const heroName = m.boss ? 'BOSS' : ASZ.CHARS[m.hero].name;
      node.innerHTML = `
        <span class="node-nr">${m.nr}</span>
        ${locked ? '<span class="node-lock">🔒</span>' : ''}
        <span class="node-portrait"><img src="${ASZ.CHARS[m.hero].img}" alt=""></span>
        <span class="node-name">${m.name}</span>
        <span class="node-hero">${heroName}</span>
        <span class="node-stars">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3 - stars)}</span></span>`;
      if (!locked) node.addEventListener('click', () => { ASZ.audio.tap(); startMission(m); });
      else node.addEventListener('click', () => toast('Najpierw ukończ poprzednią misję!'));
      wrap.appendChild(node);
    });

    if (st.comic) {
      const node = document.createElement('button');
      node.className = 'node node-comic';
      node.innerHTML = `
        <span class="node-portrait"><img src="assets/img/comic-cz1-cover.webp" alt=""></span>
        <span class="node-name">Twój komiks</span>
        <span class="node-hero">część 1 — odblokowany!</span>
        <span class="node-stars">🏆</span>`;
      node.addEventListener('click', () => { ASZ.audio.tap(); show('screen-reward'); });
      wrap.appendChild(node);
    }

    $('#hud-power').textContent = `⚡ ${st.zdrowomoc}`;
    $('#hud-stars').textContent = `★ ${ASZ.save.starsTotal()}/15`;

    const segs = ASZ.MISSIONS.filter(m => (st.stars[m.id] || 0) > 0).length;
    const crystal = $('#crystal-shape');
    const colors = ['#2b3b7a', '#3d55a8', '#5673cf', '#7f97e8', '#ffd54d', '#ffc300'];
    crystal.setAttribute('fill', colors[Math.min(segs, 5)]);
    $('#crystal').classList.toggle('lit', segs >= 5);
    $('#map-hint').textContent = segs >= 5
      ? 'Kryształ świeci! Możesz powtarzać misje po lepsze gwiazdki.'
      : `Naładowane segmenty Kryształu: ${segs}/5`;
    paintSoundBtns();
  }

  /* ---------- HUD w misji ---------- */
  function buildStats(kinds) {
    const wrap = $('#game-stats');
    wrap.innerHTML = '';
    const els = {};
    for (const k of kinds) {
      const el = document.createElement('div');
      el.className = 'stat-chip' + (k === 'timer' ? ' timer' : '');
      if (k === 'hearts' || k === 'moons') el.classList.add('hearts');
      wrap.appendChild(el);
      els[k] = el;
    }
    return {
      hearts(n, max = 3) { els.hearts.innerHTML = '❤'.repeat(n) + `<span class="off">${'❤'.repeat(Math.max(0, max - n))}</span>`; },
      moons(n, max = 3) { els.moons.innerHTML = '🌙'.repeat(n) + `<span class="off">${'🌙'.repeat(Math.max(0, max - n))}</span>`; },
      timer(sec) {
        els.timer.textContent = `⏱ ${Math.ceil(sec)}`;
        els.timer.classList.toggle('low', sec <= 10);
      },
      score(n) { els.score.textContent = `⚡ ${n}`; },
      progress(txt) { els.progress.textContent = txt; },
      beam(txt) { els.beam.textContent = txt; },
      bosshp(txt) { els.bosshp.textContent = txt; }
    };
  }

  /* ---------- misja: przepływ ---------- */
  let activeGame = null;

  function startMission(m, skipDialog) {
    show('screen-game');
    $('#game-title').textContent = `${m.nr}. ${m.name}`;
    const arena = $('#arena');
    arena.innerHTML = '';
    arena.className = 'arena';

    const begin = () => {
      const stats = buildStats(m.stats);
      const api = {
        arena, stats,
        audio: ASZ.audio,
        mission: m,
        floatText(x, y, txt, color) {
          const el = document.createElement('div');
          el.className = 'float-pt';
          el.style.left = x + 'px';
          el.style.top = y + 'px';
          el.style.color = color || '#fff';
          el.textContent = txt;
          arena.appendChild(el);
          setTimeout(() => el.remove(), 1000);
        },
        message(txt, ms) {
          let el = arena.querySelector('.game-msg');
          if (!el) { el = document.createElement('div'); el.className = 'game-msg'; arena.appendChild(el); }
          el.innerHTML = txt;
          el.classList.add('show');
          if (ms) setTimeout(() => el.classList.remove('show'), ms);
        },
        junkFlash() {
          arena.classList.add('junk-hit', 'shake');
          setTimeout(() => arena.classList.remove('junk-hit'), 420);
          setTimeout(() => arena.classList.remove('shake'), 400);
        },
        onEnd(result) { finishMission(m, result); }
      };
      activeGame = ASZ.games[m.game].start(api);
    };

    if (skipDialog) begin();
    else showDialog(m.dialogIn, () => {
      // krótka plansza "jak grać"
      showModal(`<h3>${m.nr}. ${m.name}</h3><p>${m.howto}</p><p style="text-align:center;margin-top:14px"><button class="btn btn-gold" id="btn-howto-go">Zaczynamy!</button></p>`);
      document.getElementById('btn-howto-go').addEventListener('click', () => {
        $('#modal').classList.add('hidden');
        ASZ.audio.tap();
        begin();
      }, { once: true });
    });
  }

  function stopActiveGame() {
    if (activeGame && activeGame.stop) activeGame.stop();
    activeGame = null;
  }

  function finishMission(m, result) {
    stopActiveGame();
    const firstWin = result.success && !(ASZ.save.get().stars[m.id] > 0);
    if (result.success) ASZ.save.recordResult(m.id, result.stars, result.score);

    const afterResult = () => {
      if (m.boss && result.success) {
        ASZ.save.set({ comic: true });
        showStoryOutro();
      } else {
        show('screen-map');
        renderMap();
      }
    };

    showResult({
      success: result.success,
      stars: result.stars,
      score: result.score,
      wiedza: m.wiedza,
      isBoss: !!m.boss,
      onRetry: () => startMission(m, true),
      onNext: () => {
        if (result.success && firstWin && m.dialogWin) {
          showDialog(m.dialogWin, afterResult);
        } else {
          afterResult();
        }
      }
    });
  }

  function showStoryOutro() {
    const s = ASZ.OUTRO_SCENE;
    show('screen-story');
    $('#story-img').src = s.img;
    $('#story-text').textContent = s.text;
    const btn = $('#btn-story-next');
    btn.textContent = 'Odbierz komiks! 🏆';
    const go = () => {
      btn.removeEventListener('click', go);
      ASZ.audio.fanfare();
      confetti(160);
      show('screen-reward');
    };
    btn.addEventListener('click', go);
  }

  /* ---------- intro ---------- */
  function playIntro(onDone) {
    const panels = ASZ.INTRO;
    let i = 0;
    show('screen-story');
    const btn = $('#btn-story-next');
    function render() {
      $('#story-img').src = panels[i].img;
      $('#story-text').textContent = panels[i].text;
      btn.textContent = (i === panels.length - 1) ? 'Do misji! ▶' : 'Dalej ▶';
    }
    function next() {
      ASZ.audio.tap();
      i++;
      if (i >= panels.length) {
        btn.removeEventListener('click', next);
        ASZ.save.set({ intro: true });
        onDone();
      } else render();
    }
    btn.addEventListener('click', next);
    render();
  }

  /* ---------- efekty ---------- */
  function confetti(n) {
    const layer = $('#fx-layer');
    const colors = ['#ffc300', '#e5641b', '#4caf50', '#42a5f5', '#ec407a', '#ab47bc'];
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = (1.6 + Math.random() * 1.8) + 's';
      c.style.animationDelay = (Math.random() * 0.6) + 's';
      c.style.width = c.style.height = (7 + Math.random() * 9) + 'px';
      layer.appendChild(c);
      setTimeout(() => c.remove(), 4200);
    }
  }

  function toast(msg) {
    ASZ.audio.tap();
    const el = document.createElement('div');
    el.className = 'float-pt';
    el.style.cssText = 'position:fixed;left:50%;top:20%;transform:translateX(-50%);z-index:70;font-size:17px;background:rgba(10,16,44,.9);padding:10px 20px;border-radius:999px;animation-duration:1.8s;';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }

  /* ---------- pomocnik canvas ---------- */
  function createCanvas(arena) {
    const canvas = document.createElement('canvas');
    arena.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const size = { w: 0, h: 0, dpr: 1 };
    function fit() {
      const r = arena.getBoundingClientRect();
      size.dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.w = Math.max(1, Math.round(r.width));
      size.h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(size.w * size.dpr);
      canvas.height = Math.round(size.h * size.dpr);
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
    }
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(arena);
    return { canvas, ctx, size, destroy: () => ro.disconnect() };
  }

  /* obrazki (cache) */
  const imgCache = {};
  function img(src) {
    if (!imgCache[src]) {
      const im = new Image();
      im.src = src;
      imgCache[src] = im;
    }
    return imgCache[src];
  }

  return {
    $, show, showDialog, showResult, showModal, renderMap, startMission,
    stopActiveGame, playIntro, confetti, toast, createCanvas, img,
    paintSoundBtns, toggleSound
  };
})();

ASZ.games = {};
