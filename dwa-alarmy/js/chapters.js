/* Pięć rozdziałów kampanii na wspólnym silniku minigier (minigry.js).
   Rozdział = dialog -> zadanie -> wniosek. Do tego: rama z Glutonem X, moc bohatera,
   karty do albumu, ekran "Pokaż rodzicowi" i misja na dziś. */
window.ASZD = window.ASZD || {};

ASZD.rozdzialy = (function () {
  const ui = ASZD.ui;
  const T = ASZD.T;
  const M = ASZD.minigry;

  /* ---------- sesja rozdziału: pomyłki, gwiazdki, moc ---------- */
  let sesja = null;
  function nowaSesja(nr) { sesja = { nr, bledy: 0, widget: null, mocUzyta: false, gra: null }; }
  function blad() {
    ASZD.save.dodajPomylke();
    if (!sesja) return;
    sesja.bledy++;
    if (sesja.widget) sesja.widget.aktualizuj(ASZD.save.gwiazdkiZa(sesja.bledy));
  }
  function licznikGwiazdek() {
    const w = ui.gwiazdkiLive();
    if (sesja) { sesja.widget = w; w.aktualizuj(ASZD.save.gwiazdkiZa(sesja.bledy)); }
    return w;
  }
  function moc() {
    const b = ASZD.BOHATEROWIE_LISTA.find((x) => x.id === ASZD.save.bohater());
    if (!b) return null;
    return {
      nazwa: b.moc,
      opis: b.opis,
      dostepna: () => !!sesja && sesja.bledy > 0 && !sesja.mocUzyta,
      uzyj: () => { sesja.mocUzyta = true; }
    };
  }
  function cb(extra) {
    return Object.assign({
      blad,
      dobrze: () => {},
      karta: (id) => ASZD.album.odblokuj(id),
      licznik: licznikGwiazdek,
      koniec: () => {}
    }, extra || {});
  }

  /* ---------- wspólna powłoka ---------- */
  function ekran(nr, obraz, buduj) {
    if (sesja && sesja.gra) { sesja.gra.stop(); sesja.gra = null; }
    ASZD.lektor.stop();
    const rozdzial = ASZD.ROZDZIALY[nr - 1];
    ui.ustawTlo(obraz || rozdzial.obraz);
    const s = ui.wyczysc();
    s.appendChild(ui.naglowekGry(nr, rozdzial.tytul, () => ASZD.main.pauza(nr)));
    const box = ui.el('div', 'panel');
    s.appendChild(box);
    if (buduj) buduj(box);
    return box;
  }

  function zadanie(nr, obraz, typ, cfg, onKoniec, extra) {
    const panel = ekran(nr, obraz);
    cfg.moc = moc();
    sesja.gra = M[typ]({ panel, root: ui.scena() }, cfg, cb(Object.assign({ koniec: onKoniec }, extra || {})));
    ASZD.lektor.czytajPanel(panel);
    return panel;
  }

  function dialog(nr, onDone) {
    const linie = ASZD.DIALOGI[nr][ASZD.save.tryb()];
    let i = 0;
    function pokaz() {
      ekran(nr, null, (b) => {
        b.appendChild(ui.el('p', 'etykieta', T.scenaZ(i + 1, linie.length)));
        b.appendChild(ui.kartaDialogu(linie[i][0], linie[i][1]));
        const ostatnia = i === linie.length - 1;
        b.appendChild(ui.przycisk(ostatnia ? T.doZadania : T.dalej, () => {
          i++;
          if (i < linie.length) pokaz(); else onDone();
        }));
        ASZD.lektor.czytaj(linie[i][0] + '. ' + linie[i][1]);
      });
    }
    pokaz();
  }

  /* karta z Glutonem X: rama fabularna, przed rozdziałem 1 i po rozdziale 3 */
  function kartaGlutona(nr, obraz, etykieta, tytul, tekst, przycisk, onNext) {
    ekran(nr, obraz, (b) => {
      b.appendChild(ui.el('p', 'etykieta', etykieta));
      b.appendChild(ui.el('h2', null, tytul));
      const g = ui.el('div', 'gluton');
      const img = ui.el('img', 'gluton-img');
      img.src = 'assets/img/gluton.webp'; img.alt = ASZD.GLUTON.imie;
      g.appendChild(img);
      const t = ui.el('div', 'gluton-tresc');
      t.appendChild(ui.el('p', 'gluton-imie', ASZD.GLUTON.tytulKarty + ': ' + ASZD.GLUTON.imie));
      t.appendChild(ui.el('p', 'opis', tekst));
      g.appendChild(t);
      b.appendChild(g);
      b.appendChild(ui.przycisk(przycisk, onNext));
      ASZD.lektor.czytaj(tekst);
    });
  }

  function zakoncz(nr, wniosek, onNext) {
    const osiagniecie = ASZD.OSIAGNIECIA['r' + nr];
    const bledy = sesja ? sesja.bledy : 0;
    const gwiazdek = ASZD.save.gwiazdkiZa(bledy);
    ASZD.save.ukonczRozdzial(nr, osiagniecie);
    const xp = ASZD.save.zapiszGwiazdki(nr, gwiazdek);
    if (gwiazdek === 3) ASZD.album.zloc(nr);
    ASZD.audio.rozdzial(gwiazdek);
    if (gwiazdek === 3) ui.konfetti();
    wynik(nr, wniosek, onNext, { bledy, gwiazdek, xp, osiagniecie });
  }

  function wynik(nr, wniosek, onNext, w) {
    ekran(nr, null, (b) => {
      b.appendChild(ui.el('p', 'etykieta', T.ukonczony));
      b.appendChild(ui.el('h2', null, ASZD.ROZDZIALY[nr - 1].tytul));
      b.appendChild(ui.gwiazdkiDuze(w.gwiazdek));
      b.appendChild(ui.el('p', 'ocena', w.bledy === 0 ? T.bezBledu : (w.bledy === 1 ? T.jednaPomylka : T.wielePomylek)));
      if (w.xp > 0) b.appendChild(ui.el('p', 'xp-info', T.xpZdobyte(w.xp)));
      const box = ui.el('div', 'wniosek');
      box.appendChild(ui.el('p', 'wniosek-naglowek', T.wniosek));
      const p = ui.el('p', 'wniosek-tekst');
      ui.wieloliniowy(p, wniosek);
      box.appendChild(p);
      b.appendChild(box);
      b.appendChild(ui.el('p', 'osiagniecie', T.osiagniecie + w.osiagniecie));

      b.appendChild(ui.przycisk(nr < 5 ? T.nastepny : T.zakonczenie, () => misjaPotem(onNext)));
      b.appendChild(ui.przycisk(T.pokazRodzicowi, () => rodzic(nr, () => wynik(nr, wniosek, onNext, w)), 'btn-ghost'));
      if (w.gwiazdek < 3) b.appendChild(ui.przycisk(T.jeszczeRaz, () => ASZD.main.graj(nr), 'btn-ghost'));
      b.appendChild(ui.przycisk(T.wyborRozdzialu, () => ASZD.main.pokazRozdzialy(), 'btn-ghost'));
      ASZD.lektor.czytaj(wniosek);
    });
  }

  /* jeśli nie ma aktywnej misji na dziś, proponujemy jedną po rozdziale */
  function misjaPotem(onNext) {
    const st = ASZD.save.get();
    if (st.misja && st.misja.stan === 'trwa') { onNext(); return; }
    const pula = ASZD.MISJE.filter((m) => st.misjeZrobione.indexOf(m.id) === -1);
    if (!pula.length) { onNext(); return; }
    const m = pula[Math.floor(Math.random() * pula.length)];
    ASZD.save.ustawMisje(m.id);
    ASZD.main.ekranMisji(m, onNext);
  }

  /* Pokaż rodzicowi: dziecko MÓWI trzy zdania, rodzic zadaje pytanie */
  function rodzic(nr, onBack) {
    const R = ASZD.RODZIC[nr];
    ekran(nr, null, (b) => {
      b.appendChild(ui.el('p', 'etykieta', T.pokazRodzicowi));
      b.appendChild(ui.el('h2', null, T.powiedzRodzicowi));
      const lista = ui.el('ol', 'rodzic-lista');
      R.powiedz.forEach((z) => lista.appendChild(ui.el('li', null, z)));
      b.appendChild(lista);
      const box = ui.el('div', 'sytuacja');
      box.appendChild(ui.el('p', 'sytuacja-naglowek', T.pytanieDlaRodzica));
      box.appendChild(ui.el('p', null, R.pytanie));
      b.appendChild(box);
      b.appendChild(ui.przycisk(T.wrocDoWyniku, onBack));
    });
  }

  /* ---------- rozdział 1 ---------- */
  function rozdzial1(onNext) {
    nowaSesja(1);
    const D = ASZD.R1;
    const potrzeba = D.potrzeba[ASZD.save.tryb()];
    ASZD.save.dodajMax(potrzeba);
    const KARTY = { senek: 'cichy-sygnal', water: 'woda-najpierw', panel: 'fakt-panel' };

    kartaGlutona(1, 'r1-scena', T.marka, T.coSieDzieje, ASZD.GLUTON.intro, T.dalej, () => dialog(1, minigra));

    function minigra() {
      zadanie(1, 'r1-scena', 'hotspoty', {
        etykieta: D.etykieta, tytul: D.tytul, opis: D.opis[ASZD.save.tryb()],
        obraz: 'r1-scena', potrzeba, licznik: D.licznik, powtorka: D.powtorka,
        punkty: D.punkty.map((p) => Object.assign({}, p, { karta: KARTY[p.id] }))
      }, decyzja, { dobrze: () => ASZD.save.dodajObserwacje(1) });
    }
    function decyzja() {
      const S = D.decyzja;
      zadanie(1, 'r1-decyzja', 'wybor', {
        etykieta: S.etykieta, tytul: S.tytul,
        sytuacja: { naglowek: S.naglowek, tresc: S.tresc },
        opcje: S.opcje, zle: S.zle, karta: 'zatrzymaj-powiedz'
      }, () => zakoncz(1, S.wniosek, onNext));
    }
  }

  /* ---------- rozdział 2 ---------- */
  function rozdzial2(onNext) {
    nowaSesja(2);
    const D = ASZD.R2;
    const tryb = ASZD.save.tryb();
    ASZD.save.dodajMax(D.rytmicznych[tryb]);
    dialog(2, () => {
      zadanie(2, 'r2-minigra', 'rytm', {
        etykieta: D.etykieta, tytul: D.tytul, opis: D.opis[tryb], opisObserwacji: D.opis[tryb],
        ile: D.paneli[tryb], rytmicznych: D.rytmicznych[tryb], obserwacja: ASZD.save.maly() ? 3 : 5,
        dystraktor: 'skok', licznik: D.licznik, status: D.status, powtorka: D.powtorka,
        dobry: D.dobry, zly: D.zly, komplet: D.komplet, karta: 'rytm'
      }, () => { ASZD.album.odblokuj('ciche-potrzeby'); zakoncz(2, D.wniosek, onNext); },
      { dobrze: () => ASZD.save.dodajObserwacje(1) });
    });
  }

  /* ---------- rozdział 3 ---------- */
  function rozdzial3(onNext) {
    nowaSesja(3);
    const D = ASZD.R3;
    const kolejnosc = [];
    dialog(3, plansza);

    function plansza() {
      const wolne = D.alarmy.filter((a) => kolejnosc.indexOf(a.id) === -1);
      zadanie(3, 'r3-scena', 'hotspoty', {
        etykieta: D.etykieta, tytul: D.tytul,
        sytuacja: { naglowek: D.naglowek, tresc: D.tresc + ' ' + ASZD.GLUTON.rozdzial3 },
        opis: kolejnosc.length ? D.drugi(kolejnosc[0]) : D.podpowiedz,
        obraz: 'r3-scena', potrzeba: 1, licznik: D.licznik, powtorka: '', pokazEtykiety: true,
        punkty: wolne.map((a) => Object.assign({}, a, { dobry: true, tekst: a.po }))
      }, (dane) => {
        const id = dane.znalezione[0];
        if (!kolejnosc.length) ASZD.save.set({ pierwszyAlarm: id });
        kolejnosc.push(id);
        if (id === 'loud') ASZD.audio.glosny(); else ASZD.audio.cichy();
        weryfikacja(id);
      });
    }
    function weryfikacja(id) {
      const W = D.weryfikacja[id];
      zadanie(3, W.obraz, 'wybor', {
        etykieta: D.weryfikacja.etykieta, tytul: W.tytul, dialog: [W.mowca, W.tresc],
        opcje: W.opcje, zle: W.zle, dobrze: W.dobrze,
        karta: id === 'quiet' ? 'zmierz-zanim' : 'ludzie-najpierw'
      }, () => { if (kolejnosc.length < 2) plansza(); else podsumowanie(); });
    }
    function podsumowanie() {
      const S = D.podsumowanie;
      const wariant = kolejnosc[0] === 'quiet' ? S.quiet : S.loud;
      kartaGlutona(3, 'r3-koniec', S.etykieta, S.tytul, ASZD.GLUTON.demaskacja + ' ' + wariant.tresc, S.przycisk, () => {
        ASZD.album.odblokuj('kolejnosc-laczy');
        zakoncz(3, wariant.wynik + S.sufiks, onNext);
      });
    }
  }

  /* ---------- rozdział 4 ---------- */
  function rozdzial4(onNext) {
    nowaSesja(4);
    const D = ASZD.R4;
    const maly = ASZD.save.maly();
    const pula = maly
      ? M.tasuj([D.karty[0], D.karty[2], D.karty[4], M.tasuj(D.karty.slice(1))[0]]).slice(0, D.kartMaly)
      : D.karty;
    dialog(4, () => {
      zadanie(4, 'r4-minigra', 'karty', {
        etykieta: D.etykieta, tytul: D.tytul, instrukcja: D.instrukcja, naglowekKarty: D.naglowekKarty,
        licznik: D.licznik, zle: D.zle, kategorie: D.kategorie,
        karty: pula.map((k) => Object.assign({}, k, { karta: k.kat }))
      }, (dane) => review(dane.wynik));
    });
    function review(w) {
      const R = D.review;
      ASZD.album.odblokuj('nie-wiemy-jeszcze');
      ekran(4, 'r4-review', (b) => {
        b.appendChild(ui.el('p', 'etykieta', R.etykieta));
        b.appendChild(ui.el('h2', null, R.tytul));
        const box = ui.el('div', 'sytuacja');
        ui.wieloliniowy(box, R.tresc(w.fakt, w.hipoteza, w.domysl));
        b.appendChild(box);
        b.appendChild(ui.przycisk(R.przycisk, () => zakoncz(4, R.wniosek, onNext)));
      });
    }
  }

  /* ---------- rozdział 5 ---------- */
  function rozdzial5(onNext) {
    nowaSesja(5);
    const D = ASZD.R5;
    dialog(5, zadania);

    function zadania() {
      zadanie(5, 'r5-zadania', 'role', {
        etykieta: D.etykieta, tytul: D.tytul, instrukcja: D.instrukcja, licznik: D.licznik,
        ilu: ASZD.save.maly() ? 2 : 3, krok: D.krok, zadania: D.zadania, dystraktory: D.dystraktory,
        dobrze: D.dobrze, zle: D.zle
      }, () => { ASZD.album.odblokuj('moc-do-zadania'); wyborPlanu(); });
    }
    function wyborPlanu() {
      const P = D.plan;
      zadanie(5, 'r5-plan', 'wybor', {
        etykieta: P.etykieta, dialog: [P.mowca, P.tresc],
        opcje: P.opcje, zle: P.odpowiedzi, dobrze: { wspolny: P.odpowiedzi.wspolny }, karta: 'zabezpiecz-sprawdz'
      }, kolejnosc);
    }
    function kolejnosc() {
      const K = D.kolejnosc;
      zadanie(5, 'r5-kolejnosc', 'kolejnosc', {
        etykieta: K.etykieta, tytul: K.tytul, licznik: K.licznik, tablica: K.tablica, pusto: K.pusto,
        kroki: K.kroki, pulapki: [K.pulapka], zlaPulapka: K.zlaPulapka,
        zlaKolejnosc: K.zlaKolejnosc, zapisany: K.zapisany, karta: 'odpoczynek-w-planie'
      }, review);
    }
    function review() {
      const R = D.kolejnosc.review;
      ekran(5, 'r5-koniec', (b) => {
        b.appendChild(ui.el('p', 'etykieta', R.etykieta));
        b.appendChild(ui.el('h2', null, R.tytul));
        const box = ui.el('div', 'sytuacja');
        box.appendChild(ui.el('p', 'sytuacja-naglowek', R.naglowek));
        const p = ui.el('p', null);
        ui.wieloliniowy(p, R.tresc);
        box.appendChild(p);
        b.appendChild(box);
        b.appendChild(ui.przycisk(R.przycisk, () => zakoncz(5, R.wniosek, onNext)));
      });
    }
  }

  const MAPA = { 1: rozdzial1, 2: rozdzial2, 3: rozdzial3, 4: rozdzial4, 5: rozdzial5 };

  return {
    uruchom(nr, onNext) { MAPA[nr](onNext); },
    stop() { if (sesja && sesja.gra) { sesja.gra.stop(); sesja.gra = null; } }
  };
})();
