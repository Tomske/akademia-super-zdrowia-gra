/* Misja 2: Laboratorium Mózgusia — sortowanie: Reaktor Energii vs Śmieciator */
window.ASZ = window.ASZ || {};

ASZ.games.sort = {
  start(api) {
    const { arena, stats } = api;
    const TOTAL = 20;

    const wrap = document.createElement('div');
    wrap.className = 'sort-wrap';
    wrap.style.backgroundImage = `url('${api.mission.bg}')`;
    wrap.innerHTML = `
      <div class="sort-dim"></div>
      <div class="sort-hint">Gdzie to trafia?</div>
      <div class="sort-zone sort-zone-left" id="zone-junk">
        <span class="zone-ico">🗑️</span>ŚMIECIATOR<br><small>pułapki Glutona</small>
      </div>
      <div class="sort-zone sort-zone-right" id="zone-good">
        <span class="zone-ico">⚡</span>REAKTOR ENERGII<br><small>daje moc</small>
        <div class="zone-fill" id="zone-fill"></div>
      </div>`;
    arena.appendChild(wrap);

    const zoneJunk = wrap.querySelector('#zone-junk');
    const zoneGood = wrap.querySelector('#zone-good');
    const zoneFill = wrap.querySelector('#zone-fill');

    // talia: zbalansowana i przetasowana
    const deck = [];
    for (let i = 0; i < TOTAL; i++) {
      const pool = (i % 2 === 0) ? ASZ.GOOD_KEYS : ASZ.JUNK_KEYS;
      deck.push(pool[(Math.random() * pool.length) | 0]);
    }
    for (let i = deck.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    let idx = 0;
    let correct = 0;
    let score = 0;
    let goodCount = 0;
    let card = null;
    let timer = null;
    let deadline = 0;
    let ringTimer = null;
    let alive = true;

    stats.score(score);
    stats.progress(`0/${TOTAL}`);

    function roundTime() { return Math.max(1.8, 3.4 - idx * 0.08); }

    function nextCard() {
      if (!alive) return;
      if (idx >= TOTAL) return end();
      const key = deck[idx];
      const item = ASZ.ITEMS[key];

      card = document.createElement('div');
      card.className = 'sort-card';
      card.innerHTML = `
        <svg class="sort-ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" stroke-dasharray="113" stroke-dashoffset="0" transform="rotate(-90 22 22)"/></svg>
        <img src="${item.img}" alt="${item.name}">
        <span class="card-name">${item.name}</span>`;
      wrap.appendChild(card);

      const ring = card.querySelector('circle');
      const t0 = performance.now();
      const dur = roundTime() * 1000;
      deadline = t0 + dur;
      ringTimer = setInterval(() => {
        const frac = Math.max(0, 1 - (performance.now() - t0) / dur);
        ring.style.strokeDashoffset = String(113 * (1 - frac));
        if (frac <= 0) resolve(null, key);
      }, 60);

      attachDrag(card, key);
    }

    function attachDrag(el, key) {
      let startX = 0, startY = 0, dx = 0, dy = 0, dragging = false;
      function down(e) {
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        el.setPointerCapture(e.pointerId);
      }
      function move(e) {
        if (!dragging) return;
        dx = e.clientX - startX; dy = e.clientY - startY;
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 14}deg)`;
        zoneJunk.classList.toggle('zone-hot', dx < -60);
        zoneGood.classList.toggle('zone-hot', dx > 60);
      }
      function up() {
        if (!dragging) return;
        dragging = false;
        zoneJunk.classList.remove('zone-hot');
        zoneGood.classList.remove('zone-hot');
        if (dx < -80) resolve('junk', key);
        else if (dx > 80) resolve('good', key);
        else { el.style.transform = ''; dx = dy = 0; }
      }
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      el._key = (e) => {
        if (e.key === 'ArrowLeft') resolve('junk', key);
        if (e.key === 'ArrowRight') resolve('good', key);
      };
      window.addEventListener('keydown', el._key);
    }

    function resolve(answer, key) {
      if (!alive || !card) return;
      clearInterval(ringTimer);
      window.removeEventListener('keydown', card._key);
      const item = ASZ.ITEMS[key];
      const correctAnswer = item.good ? 'good' : 'junk';
      const ok = answer === correctAnswer;
      const el = card;
      card = null;
      idx++;
      stats.progress(`${idx}/${TOTAL}`);

      if (ok) {
        correct++;
        const timeLeft = Math.max(0, (deadline - performance.now()) / 1000);
        const pts = 15 + Math.round(timeLeft * 4);
        score += pts;
        stats.score(score);
        api.audio.good(correct);
        el.style.transition = 'transform .28s ease, opacity .28s ease';
        el.style.transform = `translate(${answer === 'good' ? '46vw' : '-46vw'}, 16vh) rotate(${answer === 'good' ? 40 : -40}deg) scale(.4)`;
        el.style.opacity = '0';
        if (item.good) {
          goodCount++;
          zoneFill.style.height = Math.min(100, goodCount * 10) + '%';
          zoneGood.style.transform = 'scale(1.06)';
          setTimeout(() => { zoneGood.style.transform = ''; }, 160);
        } else {
          zoneJunk.style.transform = 'scale(1.06) rotate(-2deg)';
          setTimeout(() => { zoneJunk.style.transform = ''; }, 160);
        }
      } else {
        api.audio.bad();
        api.junkFlash();
        el.classList.add('bad');
        el.style.transition = 'opacity .5s ease .45s';
        el.style.opacity = '0';
        api.message(item.good
          ? `${item.name} <span style="color:#8bf58f">daje energię → Reaktor!</span>`
          : `${item.name} <span style="color:#ff8a80">to pułapka → Śmieciator!</span>`, 1500);
      }
      setTimeout(() => el.remove(), 900);
      setTimeout(nextCard, ok ? 260 : 1100);
    }

    function end() {
      alive = false;
      const stars = correct >= 18 ? 3 : correct >= 14 ? 2 : 1;
      setTimeout(() => api.onEnd({ success: true, stars, score }), 400);
    }

    api.message('Analiza Mózgusia: START!', 1200);
    setTimeout(nextCard, 600);

    return {
      stop() {
        alive = false;
        clearInterval(ringTimer);
        if (card) window.removeEventListener('keydown', card._key);
      }
    };
  }
};
