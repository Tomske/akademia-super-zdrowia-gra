/* Misja 5: Pojedynek z Glutonem X — łap zdrowe, ładuj Promień, unikaj śmieciowych pocisków */
window.ASZ = window.ASZ || {};

ASZ.games.boss = {
  start(api) {
    const { arena, stats } = api;
    const cv = ASZ.ui.createCanvas(arena);
    const { ctx, size } = cv;

    const bg = ASZ.ui.img(api.mission.bg);
    const glutonImg = ASZ.ui.img('assets/img/gluton.webp');

    const CHARGE_MAX = 5;
    let bossHp = 3;
    let hearts = 3;
    let charge = 0;
    let score = 0;
    let items = [];
    let spawnIn = 0.9;
    let elapsed = 0;
    let alive = true;
    let raf = 0;
    let last = performance.now();
    let beamT = 0;         // czas trwania animacji promienia
    let bossFlash = 0;
    let bossPhase = 0;     // 0..2 => szybciej z każdym trafieniem
    let shakeT = 0;

    const shield = { x: size.w / 2 };

    function onPointer(e) {
      const r = arena.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      shield.x = Math.max(shieldW() / 2, Math.min(size.w - shieldW() / 2, x));
    }
    let keyDir = 0;
    function onKey(e) {
      if (e.type === 'keydown') {
        if (e.key === 'ArrowLeft') keyDir = -1;
        if (e.key === 'ArrowRight') keyDir = 1;
        if (e.code === 'Space') { e.preventDefault(); tryFire(); }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') keyDir = 0;
    }
    function onTap(e) {
      onPointer(e);
      if (charge >= CHARGE_MAX) tryFire();
    }
    arena.addEventListener('pointermove', onPointer);
    arena.addEventListener('pointerdown', onTap);
    arena.addEventListener('touchmove', onPointer, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    function shieldW() { return Math.max(120, Math.min(180, size.w * 0.24)); }

    stats.hearts(hearts);
    stats.beam('⚡ 0/' + CHARGE_MAX);
    stats.bosshp('👾 ❤❤❤');
    api.message('Naładuj Promień Prawdziwej Energii!', 1600);

    function paintBossHp() {
      stats.bosshp('👾 ' + '❤'.repeat(bossHp) + '·'.repeat(3 - bossHp));
    }

    function spawn() {
      const junkChance = 0.42 + bossPhase * 0.08;
      const good = Math.random() >= junkChance;
      const pool = good ? ASZ.GOOD_KEYS : ASZ.JUNK_KEYS;
      const key = pool[(Math.random() * pool.length) | 0];
      const w = Math.max(70, Math.min(100, size.w * 0.14));
      const bossX = size.w / 2 + Math.sin(elapsed * 0.8) * size.w * 0.22;
      items.push({
        key, good,
        x: bossX,
        y: size.h * 0.3,
        vx: (Math.random() - 0.5) * 240,
        vy: 60,
        g: 320 + bossPhase * 90 + Math.random() * 80,
        w,
        rot: 0,
        vr: (Math.random() - 0.5) * 3
      });
    }

    function tryFire() {
      if (!alive || charge < CHARGE_MAX || beamT > 0) return;
      charge = 0;
      stats.beam('⚡ 0/' + CHARGE_MAX);
      beamT = 0.55;
      api.audio.beamFire();
    }

    function hitBoss() {
      bossHp--;
      paintBossHp();
      bossFlash = 0.5;
      shakeT = 0.4;
      bossPhase = 3 - bossHp;
      items = [];
      score += 150;
      api.audio.bossHit();
      api.message(bossHp > 0 ? 'TRAFIENIE! Gluton słabnie!' : 'GLUTON X POKONANY!', 1400);
      if (bossHp <= 0) return end(true);
    }

    function loop(now) {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      if (bossFlash > 0) bossFlash -= dt;
      if (shakeT > 0) shakeT -= dt;

      if (keyDir) shield.x = Math.max(shieldW() / 2, Math.min(size.w - shieldW() / 2, shield.x + keyDir * 540 * dt));

      spawnIn -= dt;
      const interval = Math.max(0.42, 0.9 - bossPhase * 0.16);
      if (spawnIn <= 0) { spawn(); spawnIn = interval; }

      ctx.clearRect(0, 0, size.w, size.h);
      ctx.save();
      if (shakeT > 0) ctx.translate((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12);
      drawCover(ctx, bg, size.w, size.h);
      ctx.fillStyle = 'rgba(8,12,36,.3)';
      ctx.fillRect(0, 0, size.w, size.h);

      // Gluton X
      const bw = Math.max(170, Math.min(260, size.w * 0.34));
      const bh = bw * (glutonImg.height / (glutonImg.width || 1) || 0.7);
      const bx = size.w / 2 + Math.sin(elapsed * 0.8) * size.w * 0.22;
      const by = size.h * 0.19 + Math.sin(elapsed * 1.7) * 8;
      ctx.save();
      ctx.translate(bx, by);
      const puls = 1 + Math.sin(elapsed * 3) * 0.03;
      ctx.scale(puls, puls);
      if (bossFlash > 0) ctx.globalAlpha = 0.55 + Math.sin(now / 30) * 0.4;
      ctx.drawImage(glutonImg, -bw / 2, -bh / 2, bw, bh);
      ctx.restore();

      // promień
      const shieldY = size.h - 46;
      if (beamT > 0) {
        beamT -= dt;
        const grad = ctx.createLinearGradient(0, shieldY, 0, by);
        grad.addColorStop(0, 'rgba(255,240,150,.95)');
        grad.addColorStop(1, 'rgba(255,195,0,.75)');
        ctx.fillStyle = grad;
        const bwd = 26 + Math.sin(now / 25) * 8;
        ctx.fillRect(shield.x - bwd / 2, by, bwd, shieldY - by);
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.fillRect(shield.x - 6, by, 12, shieldY - by);
        if (beamT <= 0.25 && beamT + dt > 0.25 && Math.abs(shield.x - bx) < bw * 0.55) {
          hitBoss();
        } else if (beamT <= 0.25 && beamT + dt > 0.25) {
          api.message('Pudło! Celuj prosto w Glutona!', 1100);
        }
      }

      // itemy
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.vy += it.g * dt;
        it.x += it.vx * dt;
        it.y += it.vy * dt;
        it.rot += it.vr * dt;
        if (it.x < it.w / 2 || it.x > size.w - it.w / 2) it.vx *= -1;

        const img = ASZ.ui.img(ASZ.ITEMS[it.key].img);
        const h = it.w * (img.height / (img.width || 1) || 0.66);
        ctx.save();
        ctx.translate(it.x, it.y);
        ctx.rotate(it.rot);
        if (it.good) {
          ctx.shadowColor = 'rgba(140,255,160,.9)';
          ctx.shadowBlur = 18;
        }
        ctx.drawImage(img, -it.w / 2, -h / 2, it.w, h);
        ctx.restore();

        // dotknął tarczy?
        if (it.y + h / 2 >= shieldY - 12 && it.y < shieldY + 20 && Math.abs(it.x - shield.x) < shieldW() / 2 + it.w * 0.2) {
          items.splice(i, 1);
          if (it.good) {
            charge = Math.min(CHARGE_MAX, charge + 1);
            score += 20;
            stats.beam('⚡ ' + charge + '/' + CHARGE_MAX);
            api.audio.beamCharge();
            api.floatText(it.x - 20, shieldY - 50, '+⚡', '#8bf58f');
            if (charge >= CHARGE_MAX) api.message('Promień gotowy! KLIKNIJ, by strzelić!', 1300);
          } else {
            hearts--;
            stats.hearts(hearts);
            api.audio.bad();
            api.junkFlash();
            api.floatText(it.x - 30, shieldY - 50, ASZ.ITEMS[it.key].name + '!', '#ff8a80');
            if (hearts <= 0) return end(false);
          }
          continue;
        }
        if (it.y - h / 2 > size.h) items.splice(i, 1);
      }

      // tarcza energii
      {
        const w = shieldW();
        ctx.save();
        ctx.translate(shield.x, shieldY);
        const ready = charge >= CHARGE_MAX;
        ctx.shadowColor = ready ? 'rgba(255,214,64,.95)' : 'rgba(110,170,255,.8)';
        ctx.shadowBlur = ready ? 30 : 16;
        const grad = ctx.createLinearGradient(0, -18, 0, 16);
        grad.addColorStop(0, ready ? '#ffe082' : '#9ec8ff');
        grad.addColorStop(1, ready ? '#ffb300' : '#3f7fdd');
        ctx.fillStyle = grad;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, w / 2, 18, 0, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // pasek ładowania w tarczy
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,.35)';
        ctx.fillRect(-w / 2 + 8, 6, w - 16, 6);
        ctx.fillStyle = '#fff';
        ctx.fillRect(-w / 2 + 8, 6, (w - 16) * (charge / CHARGE_MAX), 6);
        ctx.restore();
      }

      ctx.restore();
      raf = requestAnimationFrame(loop);
    }

    function drawCover(c, img, w, h) {
      if (!img.width) { c.fillStyle = '#100a2e'; c.fillRect(0, 0, w, h); return; }
      const s = Math.max(w / img.width, h / img.height);
      const iw = img.width * s, ih = img.height * s;
      c.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    }

    function end(success) {
      alive = false;
      cancelAnimationFrame(raf);
      cleanup();
      score += hearts * 60;
      const stars = !success ? 0 : hearts >= 3 ? 3 : hearts === 2 ? 2 : 1;
      setTimeout(() => api.onEnd({ success, stars, score }), success ? 900 : 600);
    }

    function cleanup() {
      arena.removeEventListener('pointermove', onPointer);
      arena.removeEventListener('pointerdown', onTap);
      arena.removeEventListener('touchmove', onPointer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      cv.destroy();
    }

    raf = requestAnimationFrame((t) => { last = t; loop(t); });

    return { stop() { alive = false; cancelAnimationFrame(raf); cleanup(); } };
  }
};
