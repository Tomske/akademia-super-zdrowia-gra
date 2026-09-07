/* Sześć mechanik gry w jednym miejscu, sterowanych danymi.
   Używają ich rozdziały kampanii, Dyżur (codzienne sytuacje) i Trening.
   Każda funkcja: (ctx, cfg, cb) -> { podpowiedz, stop }
     ctx.panel  główny panel, minigra sama wypełnia go treścią
     ctx.root   scena, gdy trzeba dołożyć planszę pod panelem
     cb.blad()            pomyłka (host liczy gwiazdki)
     cb.dobrze(seria)     trafienie
     cb.karta(id)         odblokowanie karty do albumu
     cb.koniec(dane)      zadanie zaliczone
     cb.licznik()         widget gwiazdek albo null
     cfg.moc              { nazwa, dostepna(), uzyj() } moc bohatera, opcjonalna */
window.ASZD = window.ASZD || {};

ASZD.minigry = (function () {
  const ui = ASZD.ui;
  const T = ASZD.T;

  function tasuj(a) {
    const t = a.slice();
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
    return t;
  }

  function wyczyscPanel(panel) { while (panel.firstChild) panel.removeChild(panel.firstChild); }

  function naglowek(panel, cfg) {
    if (cfg.etykieta) panel.appendChild(ui.el('p', 'etykieta', cfg.etykieta));
    if (cfg.tytul) panel.appendChild(ui.el('h2', null, cfg.tytul));
    if (cfg.opis) panel.appendChild(ui.el('p', 'opis', cfg.opis));
    if (cfg.sytuacja) {
      const box = ui.el('div', 'sytuacja');
      if (cfg.sytuacja.naglowek) box.appendChild(ui.el('p', 'sytuacja-naglowek', cfg.sytuacja.naglowek));
      const p = ui.el('p', null);
      ui.wieloliniowy(p, cfg.sytuacja.tresc);
      box.appendChild(p);
      panel.appendChild(box);
    }
    if (cfg.dialog) panel.appendChild(ui.kartaDialogu(cfg.dialog[0], cfg.dialog[1]));
  }

  /* wiersz pod zadaniem: postęp, gwiazdki i przycisk mocy bohatera */
  function pasek(cfg, cb, postep, gra) {
    const w = ui.el('div', 'pasek-zadania');
    if (postep) w.appendChild(postep);
    const l = cb.licznik && cb.licznik();
    if (l) w.appendChild(l);
    if (cfg.moc && cfg.moc.dostepna()) {
      const b = ui.el('button', 'moc');
      b.appendChild(ui.el('span', 'moc-ikona', '✦'));
      b.appendChild(ui.el('span', null, cfg.moc.nazwa));
      b.title = cfg.moc.opis || '';
      b.addEventListener('click', () => {
        ASZD.audio.wskazowka();
        cfg.moc.uzyj();
        b.remove();
        gra.podpowiedz();
      });
      w.appendChild(b);
      gra._mocBtn = b;
    }
    return w;
  }

  function odswiezMoc(cfg, gra, kontener) {
    /* moc pojawia się dopiero po pierwszej pomyłce: ma ratować, nie zastępować myślenie */
    if (!cfg.moc || gra._mocBtn || !cfg.moc.dostepna()) return;
    const b = ui.el('button', 'moc moc-nowa');
    b.appendChild(ui.el('span', 'moc-ikona', '✦'));
    b.appendChild(ui.el('span', null, cfg.moc.nazwa));
    b.title = cfg.moc.opis || '';
    b.addEventListener('click', () => {
      ASZD.audio.wskazowka();
      cfg.moc.uzyj();
      b.remove();
      gra.podpowiedz();
    });
    kontener.appendChild(b);
    gra._mocBtn = b;
  }

  /* ---------------------------------------------------------------
     1. HOTSPOTY: szukanie punktów na ilustracji
     cfg: obraz, punkty[{id, etykieta, x, y, r, dobry, tekst}], potrzeba, licznik,
          powtorka, pokazEtykiety
     --------------------------------------------------------------- */
  function hotspoty(ctx, cfg, cb) {
    const gra = {};
    const znalezione = [];
    let post, fb, pod, pas;

    naglowek(ctx.panel, cfg);

    const plansza = ui.planszaHotspotow(cfg.obraz, cfg.punkty, (p, node) => {
      if (znalezione.indexOf(p.id) !== -1) { fb.pokaz('info', cfg.powtorka); return; }
      if (!p.dobry) {
        ASZD.audio.zle(); cb.blad();
        node.classList.add('hotspot-zly');
        fb.pokaz('zle', p.tekst);
        odswiezMoc(cfg, gra, pas);
        return;
      }
      znalezione.push(p.id);
      node.classList.add('hotspot-znaleziony');
      node.dataset.zablokowany = '1';
      node.querySelector('.hotspot-etykieta').textContent = node._nazwa;
      const znak = node.querySelector('.hotspot-znak');
      if (znak) znak.textContent = '✓';
      ASZD.audio.dobrze(znalezione.length);
      cb.dobrze(znalezione.length);
      if (p.karta) cb.karta(p.karta);
      post.aktualizuj(znalezione.length);
      fb.pokaz('dobrze', p.tekst);
      if (znalezione.length >= cfg.potrzeba) setTimeout(() => cb.koniec({ znalezione }), 1400);
    }, cfg.pokazEtykiety);
    ctx.root.appendChild(plansza);

    pod = ui.panelPod();
    post = ui.postep(cfg.licznik, 0, cfg.potrzeba);
    fb = ui.feedback();
    pas = pasek(cfg, cb, post, gra);
    pod.appendChild(pas);
    pod.appendChild(fb);

    gra.podpowiedz = () => {
      /* przygaś jeden mylny punkt, którego jeszcze nie kliknięto */
      const kandydat = cfg.punkty.find((p) => !p.dobry && p._el && !p._el.classList.contains('hotspot-zly')
        && !p._el.classList.contains('hotspot-przygaszony'));
      if (!kandydat) return;
      kandydat._el.classList.add('hotspot-przygaszony');
      kandydat._el.dataset.zablokowany = '1';
      fb.pokaz('info', T.mocPodpowiedz);
    };
    gra.stop = () => {};
    return gra;
  }

  /* ---------------------------------------------------------------
     2. RYTM: znajdź panele pulsujące regularnie
     cfg: ile, rytmicznych, obserwacja (s), okres (ms), dystraktor 'skok'|'plynny'|'imitator',
          tloBlyski (bool), licznik, status{obserwuj,zapisany,potwierdz}, powtorka, dobry, zly,
          komplet, opisObserwacji
     --------------------------------------------------------------- */
  function rytm(ctx, cfg, cb) {
    const gra = {};
    const okres = cfg.okres || 1500;
    const rytmiczne = tasuj(Array.from({ length: cfg.ile }, (_, i) => i)).slice(0, cfg.rytmicznych);
    const znalezione = [];
    let raf = null, gotowe = false;

    naglowek(ctx.panel, cfg);
    const post = ui.postep(cfg.licznik, 0, cfg.rytmicznych);
    ctx.panel.appendChild(pasek(cfg, cb, post, gra));
    const status = ui.el('p', 'status', cfg.status.obserwuj);
    ctx.panel.appendChild(status);

    const siatka = ui.el('div', 'panele czekaja' + (cfg.ile > 6 ? ' panele-gesto' : ''));
    const zegar = ui.odliczanie(cfg.obserwacja, () => {
      gotowe = true;
      status.textContent = T.terazWybierz;
      siatka.classList.remove('czekaja');
      siatka.classList.add('panele-aktywne');
    });
    ctx.panel.appendChild(zegar);

    const panele = [];
    for (let i = 0; i < cfg.ile; i++) {
      const rytmiczny = rytmiczne.indexOf(i) !== -1;
      const p = ui.el('button', 'panelik');
      p.appendChild(ui.el('span', 'panelik-kropka', '●'));
      p.appendChild(ui.el('span', 'panelik-nazwa', 'PANEL ' + (i + 1)));
      const stan = ui.el('span', 'panelik-stan', '');
      p.appendChild(stan);
      const d = { el: p, stan, rytmiczny, i, faza: rytmiczny ? i * 220 : Math.random() * 3000 };
      if (rytmiczny) d.okres = okres;
      else if (cfg.dystraktor === 'imitator') d.okres = okres * (Math.random() < 0.5 ? 0.72 : 1.35);
      else d.okres = 900 + Math.random() * 1800;
      p.addEventListener('click', () => kliknij(d));
      panele.push(d);
      siatka.appendChild(p);
    }
    ctx.panel.appendChild(siatka);

    const fb = ui.feedback();
    ctx.panel.appendChild(fb);

    const potwierdz = ui.przycisk(cfg.status.potwierdz, () => {
      gra.stop();
      cb.koniec({ znalezione });
    });
    potwierdz.disabled = true;
    potwierdz.classList.add('btn-nieaktywny');
    ctx.panel.appendChild(potwierdz);

    function kliknij(d) {
      if (!gotowe) { ASZD.audio.wskazowka(); fb.pokaz('info', cfg.opisObserwacji || cfg.opis); return; }
      if (d.el.dataset.zablokowany === '1') { fb.pokaz('info', cfg.powtorka); return; }
      if (!d.rytmiczny) {
        ASZD.audio.zle(); cb.blad();
        d.el.classList.add('panelik-zly');
        setTimeout(() => d.el.classList.remove('panelik-zly'), 600);
        fb.pokaz('zle', cfg.zly);
        odswiezMoc(cfg, gra, ctx.panel.querySelector('.pasek-zadania'));
        return;
      }
      d.el.dataset.zablokowany = '1';
      d.el.classList.add('panelik-ok');
      d.stan.textContent = '✓';
      znalezione.push(d.i);
      ASZD.audio.cichy();
      cb.dobrze(znalezione.length);
      post.aktualizuj(znalezione.length);
      if (znalezione.length >= cfg.rytmicznych) {
        status.textContent = cfg.status.zapisany;
        fb.pokaz('dobrze', cfg.komplet);
        potwierdz.disabled = false;
        potwierdz.classList.remove('btn-nieaktywny');
        if (cfg.karta) cb.karta(cfg.karta);
      } else {
        fb.pokaz('dobrze', cfg.dobry);
      }
    }

    /* Rytmiczne: gładka fala o stałym okresie. Dystraktory:
       skok = pojedyncze błyśnięcie w nieregularnych odstępach,
       plynny = gładka fala, ale okres zmienia się po każdym cyklu,
       imitator = gładka fala o stałym, lecz innym okresie (najtrudniej odróżnić). */
    const start = performance.now();
    function klatka(t) {
      const czas = t - start;
      panele.forEach((d) => {
        if (d.el.dataset.zablokowany === '1') { d.el.style.setProperty('--blask', 1); return; }
        const faza = ((czas + d.faza) % d.okres) / d.okres;
        let j;
        if (d.rytmiczny || cfg.dystraktor === 'imitator') {
          j = 0.25 + 0.75 * Math.pow(Math.sin(faza * Math.PI), 3);
        } else if (cfg.dystraktor === 'plynny') {
          j = 0.25 + 0.75 * Math.pow(Math.sin(faza * Math.PI), 3);
          if (faza > 0.985) d.okres = 700 + Math.random() * 2400;
        } else {
          j = faza < 0.08 ? 1 : 0.18;
          if (faza > 0.98) d.okres = 700 + Math.random() * 2200;
        }
        d.el.style.setProperty('--blask', j.toFixed(3));
      });
      if (cfg.tloBlyski && Math.random() < 0.012) {
        ctx.panel.classList.add('panel-blysk');
        setTimeout(() => ctx.panel.classList.remove('panel-blysk'), 120);
      }
      raf = requestAnimationFrame(klatka);
    }
    raf = requestAnimationFrame(klatka);

    gra.podpowiedz = () => {
      const d = panele.find((x) => x.rytmiczny && x.el.dataset.zablokowany !== '1');
      if (!d) return;
      d.el.classList.add('panelik-podpowiedz');
      setTimeout(() => d.el.classList.remove('panelik-podpowiedz'), 2200);
      fb.pokaz('info', T.mocPodpowiedz);
    };
    gra.stop = () => { if (raf) { cancelAnimationFrame(raf); raf = null; } };
    return gra;
  }

  /* ---------------------------------------------------------------
     3. WYBÓR: jedna dobra odpowiedź z kilku
     cfg: opcje[{id, tekst, dobry}], zle (tekst | {id: tekst}), dobrze (tekst | {id: tekst}),
          tasuj (bool), karta
     --------------------------------------------------------------- */
  function wybor(ctx, cfg, cb) {
    const gra = {};
    naglowek(ctx.panel, cfg);
    const pas = pasek(cfg, cb, null, gra);
    if (pas.childNodes.length) ctx.panel.appendChild(pas);
    const fb = ui.feedback();
    ctx.panel.appendChild(fb);
    const opcje = cfg.tasuj ? tasuj(cfg.opcje) : cfg.opcje;
    const siatka = ui.siatkaWyborow(opcje, (o, node) => {
      if (node.classList.contains('wybor-dobry')) return;
      if (!o.dobry) {
        ASZD.audio.zle(); cb.blad();
        node.classList.add('wybor-zly');
        fb.pokaz('zle', typeof cfg.zle === 'string' ? cfg.zle : (cfg.zle[o.id] || ''));
        odswiezMoc(cfg, gra, pas.parentNode ? pas : ctx.panel);
        return;
      }
      node.classList.add('wybor-dobry');
      ASZD.audio.dobrze(1);
      cb.dobrze(1);
      if (cfg.karta) cb.karta(cfg.karta);
      const tekst = typeof cfg.dobrze === 'string' ? cfg.dobrze : (cfg.dobrze && cfg.dobrze[o.id]);
      if (tekst) { fb.pokaz('dobrze', tekst); setTimeout(() => cb.koniec({ id: o.id }), 1300); }
      else cb.koniec({ id: o.id });
    });
    ctx.panel.appendChild(siatka);
    if (!pas.parentNode && cfg.moc) ctx.panel.insertBefore(pas, fb);

    gra.podpowiedz = () => {
      const przyciski = [...siatka.querySelectorAll('.wybor')];
      const idx = opcje.findIndex((o, i) => !o.dobry && !przyciski[i].classList.contains('wybor-zly')
        && !przyciski[i].classList.contains('wybor-przygaszony'));
      if (idx === -1) return;
      przyciski[idx].classList.add('wybor-przygaszony');
      przyciski[idx].disabled = true;
      fb.pokaz('info', T.mocPodpowiedz);
    };
    gra.stop = () => {};
    return gra;
  }

  /* ---------------------------------------------------------------
     4. KARTY: przeciągnij każdą kartę do właściwej kategorii
     cfg: karty[{id, tekst, kat, karta}], kategorie[{id, tytul, opis, echo}], zle,
          naglowekKarty, instrukcja(i, n), licznik, tasuj
     --------------------------------------------------------------- */
  function karty(ctx, cfg, cb) {
    const gra = { _mocBtn: null };
    const pula = cfg.tasuj === false ? cfg.karty : tasuj(cfg.karty);
    const wynik = {};
    cfg.kategorie.forEach((k) => { wynik[k.id] = 0; });
    let i = 0, strefy = [], token = null, fb = null;

    function krok() {
      if (i >= pula.length) { cb.koniec({ wynik }); return; }
      const karta = pula[i];
      wyczyscPanel(ctx.panel);
      gra._mocBtn = null;
      naglowek(ctx.panel, Object.assign({}, cfg, { opis: cfg.instrukcja(i + 1, pula.length) }));
      const post = ui.postep(cfg.licznik, i, pula.length);
      const pas = pasek(cfg, cb, post, gra);
      ctx.panel.appendChild(pas);

      token = ui.el('div', 'karta');
      token.appendChild(ui.el('p', 'karta-naglowek', cfg.naglowekKarty));
      token.appendChild(ui.el('p', 'karta-tekst', karta.tekst));
      ctx.panel.appendChild(token);

      const strefyEl = ui.el('div', 'strefy');
      strefy = cfg.kategorie.map((k) => {
        const z = ui.el('div', 'strefa');
        z.appendChild(ui.el('p', 'strefa-tytul', k.tytul));
        z.appendChild(ui.el('p', 'strefa-opis', k.opis));
        strefyEl.appendChild(z);
        return { el: z, id: k.id, echo: k.echo };
      });
      ctx.panel.appendChild(strefyEl);
      fb = ui.feedback();
      ctx.panel.appendChild(fb);

      function upusc(strefa) {
        if (token.dataset.zablokowany === '1') return;
        if (strefa.id !== karta.kat) {
          ASZD.audio.zle(); cb.blad();
          strefa.el.classList.add('strefa-zla');
          setTimeout(() => strefa.el.classList.remove('strefa-zla'), 600);
          fb.pokaz('zle', cfg.zle);
          odswiezMoc(cfg, gra, pas);
          return;
        }
        token.dataset.zablokowany = '1';
        strefa.el.classList.add('strefa-ok');
        wynik[strefa.id]++;
        i++;
        ASZD.audio.dobrze(i);
        cb.dobrze(i);
        if (karta.karta) cb.karta(karta.karta);
        post.aktualizuj(i);
        fb.pokaz('dobrze', strefa.echo);
        setTimeout(krok, 1100);
      }
      ASZD.dnd.ustaw(token, strefy, (s) => upusc(s));
      ASZD.dnd.strefyKlikalne(strefy, () => token, (s) => upusc(s));
    }
    krok();

    gra.podpowiedz = () => {
      const karta = pula[i];
      const s = strefy.find((x) => x.id === (karta && karta.kat));
      if (!s) return;
      s.el.classList.add('strefa-podpowiedz');
      setTimeout(() => s.el.classList.remove('strefa-podpowiedz'), 2200);
      if (fb) fb.pokaz('info', T.mocPodpowiedz);
    };
    gra.stop = () => {};
    return gra;
  }

  /* ---------------------------------------------------------------
     5. KOLEJNOŚĆ: ułóż kroki po kolei, pułapki nie należą do planu
     cfg: kroki[{id, tekst, krotki}], pulapki[{id, tekst}], licznik, tablica, pusto,
          zlaPulapka, zlaKolejnosc(tekst), zapisany(tekst), karta
     --------------------------------------------------------------- */
  function kolejnosc(ctx, cfg, cb) {
    const gra = {};
    const ulozone = [];
    let wybrany = null;

    naglowek(ctx.panel, cfg);
    const post = ui.postep(cfg.licznik, 0, cfg.kroki.length);
    const pas = pasek(cfg, cb, post, gra);
    ctx.panel.appendChild(pas);

    const tablica = ui.el('div', 'strefa strefa-tablica');
    tablica.appendChild(ui.el('p', 'strefa-tytul', cfg.tablica));
    const lista = ui.el('p', 'tablica-lista', cfg.pusto);
    tablica.appendChild(lista);
    ctx.panel.appendChild(tablica);
    const strefy = [{ el: tablica, id: 'tablica' }];

    const pula = ui.el('div', 'kroki');
    const pulapkiIds = (cfg.pulapki || []).map((p) => p.id);
    const tokeny = tasuj(cfg.kroki.concat(cfg.pulapki || [])).map((krok) => {
      const t = ui.el('button', 'krok');
      t.appendChild(ui.el('span', null, krok.tekst));
      t.dataset.id = krok.id;
      t.addEventListener('click', () => {
        if (t.dataset.zablokowany === '1') return;
        ASZD.audio.dotyk();
        tokeny.forEach((x) => x.classList.remove('krok-wybrany'));
        t.classList.add('krok-wybrany');
        wybrany = t;
      });
      pula.appendChild(t);
      return t;
    });
    ctx.panel.appendChild(pula);
    const fb = ui.feedback();
    ctx.panel.appendChild(fb);

    function upusc(_, token) {
      const id = token.dataset.id;
      const oczekiwany = cfg.kroki[ulozone.length];
      if (pulapkiIds.indexOf(id) !== -1 || id !== oczekiwany.id) {
        ASZD.audio.zle(); cb.blad();
        token.classList.add('krok-zly');
        setTimeout(() => token.classList.remove('krok-zly'), 600);
        fb.pokaz('zle', pulapkiIds.indexOf(id) !== -1 ? cfg.zlaPulapka : cfg.zlaKolejnosc(oczekiwany.tekst));
        odswiezMoc(cfg, gra, pas);
        return;
      }
      token.dataset.zablokowany = '1';
      token.classList.add('krok-ok');
      token.classList.remove('krok-wybrany');
      wybrany = null;
      ulozone.push(oczekiwany);
      ASZD.audio.dobrze(ulozone.length);
      cb.dobrze(ulozone.length);
      post.aktualizuj(ulozone.length);
      lista.textContent = ulozone.map((s) => s.krotki || s.tekst).join('  →  ');
      fb.pokaz('dobrze', cfg.zapisany(oczekiwany.tekst));
      if (ulozone.length >= cfg.kroki.length) {
        if (cfg.karta) cb.karta(cfg.karta);
        setTimeout(() => cb.koniec({ ulozone }), 1200);
      }
    }
    tokeny.forEach((t) => ASZD.dnd.ustaw(t, strefy, upusc));
    ASZD.dnd.strefyKlikalne(strefy, () => wybrany, upusc);

    gra.podpowiedz = () => {
      const oczekiwany = cfg.kroki[ulozone.length];
      const t = tokeny.find((x) => x.dataset.id === (oczekiwany && oczekiwany.id));
      if (!t) return;
      t.classList.add('krok-podpowiedz');
      setTimeout(() => t.classList.remove('krok-podpowiedz'), 2200);
      fb.pokaz('info', T.mocPodpowiedz);
    };
    gra.stop = () => {};
    return gra;
  }

  /* ---------------------------------------------------------------
     6. ROLE: dopasuj bohatera do zadania
     cfg: zadania[{id, tekst, bohater, karta}], dystraktory[], ilu, licznik, instrukcja,
          krok(i), dobrze(imie), zle(imie)
     --------------------------------------------------------------- */
  function role(ctx, cfg, cb) {
    const gra = { _mocBtn: null };
    let z = 0, tokeny = [], fb = null, zad = null;

    function krok() {
      if (z >= cfg.zadania.length) { cb.koniec({}); return; }
      zad = cfg.zadania[z];
      const inni = tasuj(cfg.dystraktory.filter((d) => d !== zad.bohater)).slice(0, cfg.ilu - 1);
      const bohaterowie = tasuj([zad.bohater].concat(inni));
      wyczyscPanel(ctx.panel);
      gra._mocBtn = null;
      naglowek(ctx.panel, Object.assign({}, cfg, { opis: cfg.instrukcja }));
      const post = ui.postep(cfg.licznik, z, cfg.zadania.length);
      const pas = pasek(cfg, cb, post, gra);
      ctx.panel.appendChild(pas);

      const strefa = ui.el('div', 'strefa strefa-zadanie');
      strefa.appendChild(ui.el('p', 'strefa-tytul', cfg.krok(z + 1)));
      strefa.appendChild(ui.el('p', 'strefa-opis', zad.tekst));
      ctx.panel.appendChild(strefa);
      const strefy = [{ el: strefa, id: zad.id }];

      const rzad = ui.el('div', 'bohaterowie');
      let wybrany = null;
      tokeny = bohaterowie.map((imie) => {
        const t = ui.el('button', 'bohater');
        const plik = ASZD.PORTRETY[imie.toUpperCase()];
        if (plik) {
          const img = ui.el('img', 'bohater-portret');
          img.src = 'assets/img/portret-' + plik + '.webp'; img.alt = '';
          t.appendChild(img);
        }
        t.appendChild(ui.el('span', 'bohater-imie', imie));
        t.dataset.imie = imie;
        t.addEventListener('click', () => {
          if (t.dataset.zablokowany === '1') return;
          ASZD.audio.dotyk();
          tokeny.forEach((x) => x.classList.remove('bohater-wybrany'));
          t.classList.add('bohater-wybrany');
          wybrany = t;
        });
        rzad.appendChild(t);
        return t;
      });
      ctx.panel.appendChild(rzad);
      fb = ui.feedback();
      ctx.panel.appendChild(fb);

      function upusc(_, token) {
        const imie = token.dataset.imie;
        if (imie !== zad.bohater) {
          ASZD.audio.zle(); cb.blad();
          token.classList.add('bohater-zly');
          setTimeout(() => token.classList.remove('bohater-zly'), 600);
          fb.pokaz('zle', cfg.zle(imie));
          odswiezMoc(cfg, gra, pas);
          return;
        }
        token.dataset.zablokowany = '1';
        strefa.classList.add('strefa-ok');
        z++;
        ASZD.audio.dobrze(z);
        cb.dobrze(z);
        if (zad.karta) cb.karta(zad.karta);
        post.aktualizuj(z);
        fb.pokaz('dobrze', cfg.dobrze(imie));
        setTimeout(krok, 1200);
      }
      tokeny.forEach((t) => ASZD.dnd.ustaw(t, strefy, upusc));
      ASZD.dnd.strefyKlikalne(strefy, () => wybrany, upusc);
    }
    krok();

    gra.podpowiedz = () => {
      const t = tokeny.find((x) => x.dataset.imie !== zad.bohater && !x.classList.contains('bohater-zly')
        && !x.classList.contains('bohater-przygaszony'));
      if (!t) return;
      t.classList.add('bohater-przygaszony');
      t.dataset.zablokowany = '1';
      if (fb) fb.pokaz('info', T.mocPodpowiedz);
    };
    gra.stop = () => {};
    return gra;
  }

  return { hotspoty, rytm, wybor, karty, kolejnosc, role, tasuj };
})();
