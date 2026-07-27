/* Misja 4: Tor Przeszkód (Energuś) — runner: skacz nad pułapkami, zbieraj bonusy */
window.ASZ = window.ASZ || {};

ASZ.games.run = {
  start(api) {
    const { arena, stats } = api;
    const cv = ASZ.ui.createCanvas(arena);
    const { ctx, size } = cv;

    const bg = ASZ.ui.img(api.mission.bg);
    const runImg = ASZ.ui.img('assets/img/energus-run.webp');
    const jumpImg = ASZ.ui.img('assets/img/energus-jump.webp');

    const GOAL = 1500; // "metry"
    let dist = 0;
    let speed = 300;
    let hearts = 3;
    let collected = 0;
    let score = 0;
    let invuln = 0;
    let bgScroll = 0;
    let alive = true;
    let raf = 0;
    let last = performance.now();

    const player = { y: 0, vy: 0, jumping: false };
    let obstacles = [];
    let bonuses = [];
    let nextObstacle = 500;
    let nextBonus = 350;
    let particles = [];

    const G = 2300;
    const JUMP_V = -930;

    function groundY() { return size.h * 0.84; }
    function playerH() { return Math.max(96, Math.min(150, size.h * 0.26)); }

    function jump() {
      if (!alive) return;
      if (!player.jumping) {
        player.jumping = true;
        player.vy = JUMP_V * (playerH() / 130) * 0.92;
        api.audio.jump();
      }
    }
    function onKey(e) { if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); jump(); } }
    function onTap(e) { e.preventDefault(); jump(); }
    arena.addEventListener('pointerdown', onTap);
    window.addEventListener('keydown', onKey);

    stats.hearts(hearts);
    stats.progress('0 m');
    stats.score(score);
    api.message('Skacz nad pułapkami!', 1400);

    function spawnObstacle() {
      const key = ASZ.JUNK_KEYS[(Math.random() * ASZ.JUNK_KEYS.length) | 0];
      const w = Math.max(64, Math.min(92, size.w * 0.12));
      obstacles.push({ key, x: size.w + w, w });
      nextObstacle = 320 + Math.random() * 380 + speed * 0.45;
    }
    function spawnBonus() {
      const key = Math.random() < 0.5 ? 'woda' : 'owoce';
      const w = Math.max(52, Math.min(72, size.w * 0.09));
      const h = 120 + Math.random() * 90;
      bonuses.push({ key, x: size.w + w, w, h });
      nextBonus = 420 + Math.random() * 520;
    }

    function loop(now) {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      speed = Math.min(560, speed + 9 * dt);
      const dx = speed * dt;
      dist += dx / 6;
      bgScroll = (bgScroll + dx * 0.35);
      if (invuln > 0) invuln -= dt;

      // fizyka gracza
      const gy = groundY();
      const ph = playerH();
      if (player.jumping) {
        player.vy += G * dt * (ph / 130);
        player.y += player.vy * dt;
        if (player.y >= 0) {
          player.y = 0;
          player.vy = 0;
          player.jumping = false;
          api.audio.land();
          for (let i = 0; i < 6; i++) particles.push({ x: size.w * 0.22, y: gy, vx: -60 - Math.random() * 90, vy: -Math.random() * 60, t: 0.4 });
        }
      }

      // tło (parallax)
      ctx.clearRect(0, 0, size.w, size.h);
      drawScroll(ctx, bg, size.w, size.h, bgScroll);
      ctx.fillStyle = 'rgba(8,12,36,.18)';
      ctx.fillRect(0, 0, size.w, size.h);

      // ziemia — pas
      ctx.fillStyle = 'rgba(20,30,20,.4)';
      ctx.fillRect(0, gy + 4, size.w, size.h - gy);

      // przeszkody
      nextObstacle -= dx;
      if (nextObstacle <= 0) spawnObstacle();
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= dx;
        const img = ASZ.ui.img(ASZ.ITEMS[o.key].img);
        const h = o.w * (img.height / (img.width || 1) || 0.66);
        ctx.drawImage(img, o.x - o.w / 2, gy - h + 8, o.w, h);
        if (o.x < -o.w) { obstacles.splice(i, 1); continue; }
        // kolizja
        const px = size.w * 0.22, pw = ph * 0.32;
        const pBottom = gy + player.y;
        if (invuln <= 0 && Math.abs(o.x - px) < (o.w * 0.34 + pw) && pBottom > gy - h * 0.55) {
          hearts--;
          stats.hearts(hearts);
          invuln = 1.2;
          api.audio.bad();
          api.junkFlash();
          api.floatText(px, gy - ph, ASZ.ITEMS[o.key].name + '!', '#ff8a80');
          if (hearts <= 0) return end(false);
        }
      }

      // bonusy
      nextBonus -= dx;
      if (nextBonus <= 0) spawnBonus();
      for (let i = bonuses.length - 1; i >= 0; i--) {
        const b = bonuses[i];
        b.x -= dx;
        const img = ASZ.ui.img(ASZ.ITEMS[b.key].img);
        const h = b.w * (img.height / (img.width || 1) || 0.66);
        const by = gy - b.h - Math.sin(now / 300 + i) * 8;
        ctx.drawImage(img, b.x - b.w / 2, by - h / 2, b.w, h);
        if (b.x < -b.w) { bonuses.splice(i, 1); continue; }
        const px = size.w * 0.22;
        const pTop = gy + player.y - ph;
        const pBottom = gy + player.y;
        if (Math.abs(b.x - px) < b.w * 0.7 && by > pTop - 20 && by < pBottom + 10) {
          bonuses.splice(i, 1);
          collected++;
          score += 15;
          stats.score(score);
          api.audio.coin();
          api.floatText(px + 30, by - 30, '+15', '#8bf58f');
        }
      }

      // cząsteczki
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.t -= dt;
        if (p.t <= 0) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.fillStyle = `rgba(220,210,180,${p.t * 1.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.t + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // gracz
      {
        const px = size.w * 0.22;
        const img = player.jumping ? jumpImg : runImg;
        const iw = ph * (img.width / (img.height || 1) || 0.85);
        const bob = player.jumping ? 0 : Math.abs(Math.sin(now / 90)) * 6;
        ctx.save();
        if (invuln > 0 && Math.floor(now / 90) % 2 === 0) ctx.globalAlpha = 0.35;
        // cień
        ctx.fillStyle = 'rgba(0,0,0,.32)';
        ctx.beginPath();
        const shScale = Math.max(0.4, 1 + player.y / (ph * 2.2));
        ctx.ellipse(px, gy + 8, iw * 0.34 * shScale, 8 * shScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.drawImage(img, px - iw / 2, gy + player.y - ph - bob, iw, ph);
        ctx.restore();
      }

      // pasek postępu misji
      const frac = Math.min(1, dist / GOAL);
      ctx.fillStyle = 'rgba(10,16,44,.55)';
      roundedBar(ctx, 14, 12, size.w - 28, 14, 7);
      ctx.fill();
      ctx.fillStyle = '#ffc300';
      if (frac > 0.02) { roundedBar(ctx, 14, 12, (size.w - 28) * frac, 14, 7); ctx.fill(); }

      stats.progress(`${Math.round(dist)} m`);
      if (dist >= GOAL) return end(true);
      raf = requestAnimationFrame(loop);
    }

    function roundedBar(c, x, y, w, h, r) {
      w = Math.max(h, w);
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }

    function drawScroll(c, img, w, h, scroll) {
      if (!img.width) { c.fillStyle = '#16204e'; c.fillRect(0, 0, w, h); return; }
      const s = h / img.height;
      const iw = img.width * s;
      let n = Math.floor(scroll / iw);
      let x = -(scroll % iw);
      while (x < w) {
        // co drugi kafel lustrzany, żeby ukryć szew
        if (n % 2 === 1) {
          c.save();
          c.translate(x + iw, 0);
          c.scale(-1, 1);
          c.drawImage(img, 0, 0, iw, h);
          c.restore();
        } else {
          c.drawImage(img, x, 0, iw, h);
        }
        x += iw; n++;
      }
    }

    function end(success) {
      alive = false;
      cancelAnimationFrame(raf);
      cleanup();
      score += hearts * 40 + (success ? 60 : 0);
      let stars = 0;
      if (success) {
        stars = 1;
        if (collected >= 8) stars++;
        if (hearts >= 3) stars++;
        if (stars > 3) stars = 3;
      }
      setTimeout(() => api.onEnd({ success, stars, score }), success ? 350 : 600);
    }

    function cleanup() {
      arena.removeEventListener('pointerdown', onTap);
      window.removeEventListener('keydown', onKey);
      cv.destroy();
    }

    raf = requestAnimationFrame((t) => { last = t; loop(t); });

    return { stop() { alive = false; cancelAnimationFrame(raf); cleanup(); } };
  }
};
