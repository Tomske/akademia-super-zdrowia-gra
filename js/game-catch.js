/* Misja 1: Zdrowa Stołówka (Witaminka) — łap zdrowe na tacę, unikaj pułapek */
window.ASZ = window.ASZ || {};

ASZ.games.catch = {
  start(api) {
    const { arena, stats } = api;
    const cv = ASZ.ui.createCanvas(arena);
    const { ctx, size } = cv;

    const bg = ASZ.ui.img(api.mission.bg);
    const kropelka = ASZ.ui.img(ASZ.CHARS.kropelka.img);

    const DUR = 60;
    let time = DUR;
    let hearts = 3;
    let score = 0;
    let streak = 0;
    let items = [];
    let spawnIn = 0.4;
    let elapsed = 0;
    let running = true;
    let raf = 0;
    let last = performance.now();

    const tray = { x: size.w / 2, w: 0, h: 0 };

    function trayDims() {
      tray.w = Math.max(110, Math.min(160, size.w * 0.22));
      tray.h = tray.w * 0.34;
    }
    trayDims();

    function multiplier() { return 1 + Math.min(2, Math.floor(streak / 4)); }

    function spawn() {
      const junkChance = Math.min(0.45, 0.3 + elapsed / 200);
      let key, special = false;
      if (hearts < 3 && Math.random() < 0.06) { key = 'kropelka'; special = true; }
      else if (Math.random() < junkChance) key = ASZ.JUNK_KEYS[(Math.random() * ASZ.JUNK_KEYS.length) | 0];
      else key = ASZ.GOOD_KEYS[(Math.random() * ASZ.GOOD_KEYS.length) | 0];
      const w = Math.max(74, Math.min(104, size.w * 0.15));
      items.push({
        key, special,
        good: special ? true : ASZ.ITEMS[key].good,
        x: w / 2 + Math.random() * (size.w - w),
        y: -w,
        w,
        vy: (130 + Math.random() * 60 + elapsed * 2.2) * (size.h / 640),
        rot: (Math.random() - 0.5) * 0.5,
        vr: (Math.random() - 0.5) * 1.2
      });
    }

    /* sterowanie */
    function onPointer(e) {
      const r = arena.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      tray.x = Math.max(tray.w / 2, Math.min(size.w - tray.w / 2, x));
    }
    let keyDir = 0;
    function onKey(e) {
      if (e.type === 'keydown') {
        if (e.key === 'ArrowLeft') keyDir = -1;
        if (e.key === 'ArrowRight') keyDir = 1;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') keyDir = 0;
    }
    arena.addEventListener('pointermove', onPointer);
    arena.addEventListener('pointerdown', onPointer);
    arena.addEventListener('touchmove', onPointer, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    stats.hearts(hearts);
    stats.timer(time);
    stats.score(score);
    api.message('Łap zdrowe jedzenie!', 1400);

    function drawTray() {
      const y = size.h - 34;
      ctx.save();
      ctx.translate(tray.x, y);
      // cień
      ctx.fillStyle = 'rgba(0,0,0,.3)';
      ctx.beginPath();
      ctx.ellipse(0, tray.h * 0.65, tray.w * 0.62, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      // taca
      const g = ctx.createLinearGradient(0, -tray.h, 0, tray.h * 0.4);
      g.addColorStop(0, '#ffd54d');
      g.addColorStop(1, '#e5a013');
      ctx.fillStyle = g;
      ctx.strokeStyle = '#8a5a00';
      ctx.lineWidth = 4;
      roundRect(ctx, -tray.w / 2, -tray.h * 0.5, tray.w, tray.h * 0.72, 12);
      ctx.fill(); ctx.stroke();
      // połysk
      ctx.fillStyle = 'rgba(255,255,255,.5)';
      roundRect(ctx, -tray.w / 2 + 8, -tray.h * 0.42, tray.w * 0.4, 7, 4);
      ctx.fill();
      // streak
      if (streak >= 4) {
        ctx.fillStyle = '#4a2f00';
        ctx.font = `800 ${Math.round(tray.h * 0.42)}px 'Baloo 2', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`x${multiplier()}`, 0, tray.h * 0.12);
      }
      ctx.restore();
      return y;
    }

    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }

    function loop(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      time -= dt;
      trayDims();

      if (keyDir) tray.x = Math.max(tray.w / 2, Math.min(size.w - tray.w / 2, tray.x + keyDir * 520 * dt));

      spawnIn -= dt;
      const interval = Math.max(0.48, 0.95 - elapsed / 90);
      if (spawnIn <= 0) { spawn(); spawnIn = interval; }

      // tło
      ctx.clearRect(0, 0, size.w, size.h);
      drawCover(ctx, bg, size.w, size.h);
      ctx.fillStyle = 'rgba(8,12,36,.25)';
      ctx.fillRect(0, 0, size.w, size.h);

      const trayY = drawTray();

      // itemy
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.vy * dt;
        it.rot += it.vr * dt;

        const img = it.special ? kropelka : ASZ.ui.img(ASZ.ITEMS[it.key].img);
        const h = it.special ? it.w : it.w * (img.height / (img.width || 1) || 0.66);
        ctx.save();
        ctx.translate(it.x, it.y);
        ctx.rotate(it.rot);
        if (it.special) {
          ctx.beginPath();
          ctx.arc(0, 0, it.w / 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(120,190,255,.9)';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 4;
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(img, -it.w / 2, -it.w / 2, it.w, it.w);
        } else {
          ctx.drawImage(img, -it.w / 2, -h / 2, it.w, h);
        }
        ctx.restore();

        // złapane?
        const hitY = trayY - tray.h * 0.5;
        if (it.y + h / 2 >= hitY && it.y < trayY + 14 && Math.abs(it.x - tray.x) < tray.w / 2 + it.w * 0.25) {
          items.splice(i, 1);
          if (it.special) {
            hearts = Math.min(3, hearts + 1);
            stats.hearts(hearts);
            api.audio.heart();
            api.floatText(it.x - 30, hitY - 40, '+1 ❤', '#7cd4ff');
          } else if (it.good) {
            streak++;
            const pts = 10 * multiplier();
            score += pts;
            stats.score(score);
            api.audio.good(streak);
            api.floatText(it.x - 20, hitY - 40, `+${pts}`, '#8bf58f');
          } else {
            streak = 0;
            hearts--;
            stats.hearts(hearts);
            api.audio.bad();
            api.junkFlash();
            api.floatText(it.x - 30, hitY - 40, ASZ.ITEMS[it.key].name + '!', '#ff8a80');
            if (hearts <= 0) return end(false);
          }
          continue;
        }
        // przeleciał
        if (it.y - h / 2 > size.h) {
          if (it.good && !it.special) streak = 0;
          items.splice(i, 1);
        }
      }

      stats.timer(time);
      if (time <= 0) return end(true);
      raf = requestAnimationFrame(loop);
    }

    function drawCover(c, img, w, h) {
      if (!img.width) { c.fillStyle = '#16204e'; c.fillRect(0, 0, w, h); return; }
      const s = Math.max(w / img.width, h / img.height);
      const iw = img.width * s, ih = img.height * s;
      c.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    }

    function end(success) {
      running = false;
      cancelAnimationFrame(raf);
      cleanup();
      const stars = !success ? 0 : (score >= 550 ? 3 : score >= 330 ? 2 : 1);
      setTimeout(() => api.onEnd({ success, stars, score }), success ? 350 : 600);
    }

    function cleanup() {
      arena.removeEventListener('pointermove', onPointer);
      arena.removeEventListener('pointerdown', onPointer);
      arena.removeEventListener('touchmove', onPointer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      cv.destroy();
    }

    raf = requestAnimationFrame((t) => { last = t; loop(t); });

    return { stop() { running = false; cancelAnimationFrame(raf); cleanup(); } };
  }
};
