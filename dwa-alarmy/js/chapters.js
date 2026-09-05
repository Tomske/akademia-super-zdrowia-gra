/* Pięć rozdziałów. Każdy: dialog -> zadanie -> wniosek.
   Odwzorowanie Chapter01Flow..Chapter05Flow z oryginału. */
window.ASZD = window.ASZD || {};

ASZD.rozdzialy = (function () {
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

  /* ---------- wspólna powłoka rozdziału ---------- */

  function ekran(nr, obraz, buduj) {
    const rozdzial = ASZD.ROZDZIALY[nr - 1];
    ui.ustawTlo(obraz || rozdzial.obraz);
    const s = ui.wyczysc();
    s.appendChild(ui.naglowekGry(nr, rozdzial.tytul, () => ASZD.main.pauza(nr)));
    const box = ui.el('div', 'panel');
    s.appendChild(box);
    buduj(box);
    return box;
  }

  function dialog(nr, onDone) {
    const linie = ASZD.DIALOGI[nr][ASZD.save.tryb()];
    let i = 0;

    function pokaz() {
      const box = ekran(nr, null, (b) => {
        b.appendChild(ui.el('p', 'etykieta', T.scenaZ(i + 1, linie.length)));
        b.appendChild(ui.kartaDialogu(linie[i][0], linie[i][1]));
        const ostatnia = i === linie.length - 1;
        b.appendChild(ui.przycisk(ostatnia ? T.doZadania : T.dalej, () => {
          i++;
          if (i < linie.length) pokaz(); else onDone();
        }));
      });
      return box;
    }
    pokaz();
  }

  function zakoncz(nr, wniosek, onNext) {
    const osiagniecie = ASZD.OSIAGNIECIA['r' + nr];
    ASZD.save.ukonczRozdzial(nr, osiagniecie);
    ASZD.audio.rozdzial();
    ui.konfetti();
    ekran(nr, null, (b) => {
      b.appendChild(ui.el('p', 'etykieta', T.ukonczony));
      b.appendChild(ui.el('h2', null, T.wynik));
      const w = ui.el('div', 'wniosek');
      w.appendChild(ui.el('p', 'wniosek-naglowek', T.wniosek));
      const p = ui.el('p', 'wniosek-tekst');
      ui.wieloliniowy(p, wniosek);
      w.appendChild(p);
      b.appendChild(w);
      b.appendChild(ui.el('p', 'osiagniecie', T.osiagniecie + osiagniecie));
      b.appendChild(ui.przycisk(nr < 5 ? T.nastepny : T.zakonczenie, onNext));
      b.appendChild(ui.przycisk(T.wyborRozdzialu, () => ASZD.main.pokazRozdzialy(), 'btn-ghost'));
    });
  }

  /* ---------- rozdział 1: rozejrzyj się przed działaniem ---------- */

  function rozdzial1(onNext) {
    const D = ASZD.R1;
    const potrzeba = D.potrzeba[ASZD.save.tryb()];
    const znalezione = [];
    ASZD.save.dodajMax(potrzeba);

    dialog(1, minigra);

    function minigra() {
      let post, fb;
      ekran(1, 'r1-scena', (b) => {
        b.appendChild(ui.el('p', 'etykieta', D.etykieta));
        b.appendChild(ui.el('h2', null, D.tytul));
        b.appendChild(ui.el('p', 'opis', D.opis[ASZD.save.tryb()]));
      });
      const plansza = ui.planszaHotspotow('r1-scena', D.punkty, (p, node) => {
        if (znalezione.indexOf(p.id) !== -1) { fb.pokaz('info', D.powtorka); return; }
        if (!p.dobry) {
          ASZD.audio.zle(); ASZD.save.dodajPomylke();
          fb.pokaz('zle', p.tekst);
          return;
        }
        znalezione.push(p.id);
        node.classList.add('hotspot-znaleziony');
        node.dataset.zablokowany = '1';
        node.querySelector('.hotspot-etykieta').textContent = node._nazwa;
        const znak = node.querySelector('.hotspot-znak');
        if (znak) znak.textContent = '✓';
        ASZD.audio.dobrze(znalezione.length);
        ASZD.save.dodajObserwacje(1);
        post.aktualizuj(znalezione.length);
        fb.pokaz('dobrze', p.tekst);
        if (znalezione.length >= potrzeba) setTimeout(decyzja, 1400);
      });
      ui.scena().appendChild(plansza);
      const pod = ui.panelPod();
      post = ui.postep(D.licznik, znalezione.length, potrzeba);
      fb = ui.feedback();
      pod.appendChild(post);
      pod.appendChild(fb);
    }

    function decyzja() {
      const S = D.decyzja;
      ekran(1, 'r1-decyzja', (b) => {
        b.appendChild(ui.el('p', 'etykieta', S.etykieta));
        b.appendChild(ui.el('h2', null, S.tytul));
        b.appendChild(ui.el('p', 'licznik-ok', S.licznik + ': ' + znalezione.length + '/' + potrzeba));
        const box = ui.el('div', 'sytuacja');
        box.appendChild(ui.el('p', 'sytuacja-naglowek', S.naglowek));
        box.appendChild(ui.el('p', null, S.tresc));
        b.appendChild(box);
        const fb = ui.feedback();
        b.appendChild(fb);
        b.appendChild(ui.siatkaWyborow(S.opcje, (o, node) => {
          if (!o.dobry) {
            ASZD.audio.zle(); ASZD.save.dodajPomylke();
            node.classList.add('wybor-zly');
            fb.pokaz('zle', S.zle);
            return;
          }
          node.classList.add('wybor-dobry');
          zakoncz(1, S.wniosek, onNext);
        }));
      });
    }
  }

  /* ---------- rozdział 2: znajdź powtarzający się rytm ---------- */

  function rozdzial2(onNext) {
    const D = ASZD.R2;
    const tryb = ASZD.save.tryb();
    const ile = D.paneli[tryb];
    const rytmicznych = D.rytmicznych[tryb];
    let raf = null;

    dialog(2, minigra);

    function minigra() {
      const rytmiczne = tasuj(Array.from({ length: ile }, (_, i) => i)).slice(0, rytmicznych);
      const znalezione = [];
      ASZD.save.dodajMax(rytmicznych);

      ekran(2, 'r2-minigra', (b) => {
        b.appendChild(ui.el('p', 'etykieta', D.etykieta));
        b.appendChild(ui.el('h2', null, D.tytul));
        b.appendChild(ui.el('p', 'opis', D.opis[tryb]));
        const post = ui.postep(D.licznik, 0, rytmicznych);
        b.appendChild(post);
        const status = ui.el('p', 'status', D.status.obserwuj);
        b.appendChild(status);

        const siatka = ui.el('div', 'panele');
        const panele = [];
        for (let i = 0; i < ile; i++) {
          const rytm = rytmiczne.indexOf(i) !== -1;
          const p = ui.el('button', 'panelik');
          p.appendChild(ui.el('span', 'panelik-kropka', '●'));
          p.appendChild(ui.el('span', 'panelik-nazwa', 'PANEL ' + (i + 1)));
          const stan = ui.el('span', 'panelik-stan', '');
          p.appendChild(stan);
          const dane = {
            el: p, stan, rytm, i,
            okres: rytm ? 1500 : (900 + Math.random() * 1800),
            faza: rytm ? (i * 220) : Math.random() * 3000,
            nastepny: 0
          };
          p.addEventListener('click', () => kliknij(dane));
          panele.push(dane);
          siatka.appendChild(p);
        }
        b.appendChild(siatka);

        const fb = ui.feedback();
        b.appendChild(fb);

        const potwierdz = ui.przycisk(D.status.potwierdz, () => {
          stopAnim();
          zakoncz(2, D.wniosek, onNext);
        });
        potwierdz.disabled = true;
        potwierdz.classList.add('btn-nieaktywny');
        b.appendChild(potwierdz);

        function kliknij(d) {
          if (d.el.dataset.zablokowany === '1') { fb.pokaz('info', D.powtorka); return; }
          if (!d.rytm) {
            ASZD.audio.zle(); ASZD.save.dodajPomylke();
            d.el.classList.add('panelik-zly');
            setTimeout(() => d.el.classList.remove('panelik-zly'), 600);
            fb.pokaz('zle', D.zly);
            return;
          }
          d.el.dataset.zablokowany = '1';
          d.el.classList.add('panelik-ok');
          d.stan.textContent = '✓';
          znalezione.push(d.i);
          ASZD.audio.cichy();
          ASZD.save.dodajObserwacje(1);
          post.aktualizuj(znalezione.length);
          if (znalezione.length >= rytmicznych) {
            status.textContent = D.status.zapisany;
            fb.pokaz('dobrze', D.komplet);
            potwierdz.disabled = false;
            potwierdz.classList.remove('btn-nieaktywny');
          } else {
            fb.pokaz('dobrze', D.dobry);
          }
        }

        /* animacja pulsowania: rytmiczne mają stały okres, reszta nieregularny */
        const start = performance.now();
        function klatka(t) {
          const czas = t - start;
          panele.forEach((d) => {
            if (d.el.dataset.zablokowany === '1') { d.el.style.setProperty('--blask', 1); return; }
            const faza = ((czas + d.faza) % d.okres) / d.okres;
            let jasnosc;
            if (d.rytm) {
              jasnosc = 0.25 + 0.75 * Math.pow(Math.sin(faza * Math.PI), 3);
            } else {
              jasnosc = faza < 0.08 ? 1 : 0.18;
              if (faza > 0.98) { d.okres = 700 + Math.random() * 2200; }
            }
            d.el.style.setProperty('--blask', jasnosc.toFixed(3));
          });
          raf = requestAnimationFrame(klatka);
        }
        stopAnim();
        raf = requestAnimationFrame(klatka);
      });
    }

    function stopAnim() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
  }

  /* ---------- rozdział 3: co sprawdzić najpierw ---------- */

  function rozdzial3(onNext) {
    const D = ASZD.R3;
    const kolejnosc = [];

    dialog(3, plansza);

    function plansza() {
      ekran(3, 'r3-scena', (b) => {
        b.appendChild(ui.el('p', 'etykieta', D.etykieta));
        b.appendChild(ui.el('h2', null, D.tytul));
        const box = ui.el('div', 'sytuacja');
        box.appendChild(ui.el('p', 'sytuacja-naglowek', D.naglowek));
        box.appendChild(ui.el('p', null, D.tresc));
        b.appendChild(box);
      });
      const wolne = D.alarmy.filter((a) => kolejnosc.indexOf(a.id) === -1);
      const p = ui.planszaHotspotow('r3-scena', wolne, (alarm) => {
        if (!kolejnosc.length) ASZD.save.set({ pierwszyAlarm: alarm.id });
        kolejnosc.push(alarm.id);
        if (alarm.id === 'loud') ASZD.audio.glosny(); else ASZD.audio.cichy();
        weryfikacja(alarm.id);
      }, true);
      ui.scena().appendChild(p);
      const pod = ui.panelPod();
      pod.appendChild(ui.postep(D.licznik, kolejnosc.length, 2));
      pod.appendChild(ui.el('p', 'opis', kolejnosc.length ? D.drugi(kolejnosc[0]) : D.podpowiedz));
    }

    function weryfikacja(id) {
      const W = D.weryfikacja[id];
      ekran(3, W.obraz, (b) => {
        b.appendChild(ui.el('p', 'etykieta', D.weryfikacja.etykieta));
        b.appendChild(ui.el('h2', null, W.tytul));
        b.appendChild(ui.kartaDialogu(W.mowca, W.tresc));
        const fb = ui.feedback();
        b.appendChild(fb);
        b.appendChild(ui.siatkaWyborow(W.opcje, (o, node) => {
          if (!o.dobry) {
            ASZD.audio.zle(); ASZD.save.dodajPomylke();
            node.classList.add('wybor-zly');
            fb.pokaz('zle', W.zle);
            return;
          }
          node.classList.add('wybor-dobry');
          ASZD.audio.dobrze(kolejnosc.length);
          fb.pokaz('dobrze', W.dobrze);
          setTimeout(() => {
            if (kolejnosc.length < 2) plansza(); else podsumowanie();
          }, 1200);
        }));
      });
    }

    function podsumowanie() {
      const S = D.podsumowanie;
      const wariant = kolejnosc[0] === 'quiet' ? S.quiet : S.loud;
      ekran(3, 'r3-koniec', (b) => {
        b.appendChild(ui.el('p', 'etykieta', S.etykieta));
        b.appendChild(ui.el('h2', null, S.tytul));
        b.appendChild(ui.kartaDialogu(S.mowca, wariant.tresc));
        b.appendChild(ui.przycisk(S.przycisk, () => {
          zakoncz(3, wariant.wynik + S.sufiks, onNext);
        }));
      });
    }
  }

  /* ---------- rozdział 4: fakt, hipoteza, domysł ---------- */

  function rozdzial4(onNext) {
    const D = ASZD.R4;
    const maly = ASZD.save.maly();
    /* w trybie 4-7 mniej kart, ale zawsze po jednej z każdej kategorii */
    const pula = maly
      ? tasuj([D.karty[0], D.karty[2], D.karty[4], tasuj(D.karty.slice(1))[0]]).slice(0, D.kartMaly)
      : tasuj(D.karty);
    const wynik = { fakt: 0, hipoteza: 0, domysl: 0 };
    let i = 0;

    dialog(4, minigra);

    function minigra() {
      if (i >= pula.length) { review(); return; }
      const karta = pula[i];

      ekran(4, 'r4-minigra', (b) => {
        b.appendChild(ui.el('p', 'etykieta', D.etykieta));
        b.appendChild(ui.el('h2', null, D.tytul));
        b.appendChild(ui.el('p', 'opis', D.instrukcja(i + 1, pula.length)));
        const post = ui.postep(D.licznik, i, pula.length);
        b.appendChild(post);

        const token = ui.el('div', 'karta');
        token.appendChild(ui.el('p', 'karta-naglowek', D.naglowekKarty));
        token.appendChild(ui.el('p', 'karta-tekst', karta.tekst));
        b.appendChild(token);

        const strefyEl = ui.el('div', 'strefy');
        const strefy = D.kategorie.map((k) => {
          const z = ui.el('div', 'strefa');
          z.appendChild(ui.el('p', 'strefa-tytul', k.tytul));
          z.appendChild(ui.el('p', 'strefa-opis', k.opis));
          strefyEl.appendChild(z);
          return { el: z, id: k.id, echo: k.echo };
        });
        b.appendChild(strefyEl);

        const fb = ui.feedback();
        b.appendChild(fb);

        function upusc(strefa) {
          if (strefa.id !== karta.kat) {
            ASZD.audio.zle(); ASZD.save.dodajPomylke();
            strefa.el.classList.add('strefa-zla');
            setTimeout(() => strefa.el.classList.remove('strefa-zla'), 600);
            fb.pokaz('zle', D.zle);
            return;
          }
          token.dataset.zablokowany = '1';
          strefa.el.classList.add('strefa-ok');
          wynik[strefa.id]++;
          i++;
          ASZD.audio.dobrze(i);
          post.aktualizuj(i);
          fb.pokaz('dobrze', strefa.echo);
          setTimeout(minigra, 1100);
        }

        ASZD.dnd.ustaw(token, strefy, (s) => upusc(s));
        ASZD.dnd.strefyKlikalne(strefy, () => token, (s) => upusc(s));
      });
    }

    function review() {
      const R = D.review;
      ekran(4, 'r4-review', (b) => {
        b.appendChild(ui.el('p', 'etykieta', R.etykieta));
        b.appendChild(ui.el('h2', null, R.tytul));
        const box = ui.el('div', 'sytuacja');
        ui.wieloliniowy(box, R.tresc(wynik.fakt, wynik.hipoteza, wynik.domysl));
        b.appendChild(box);
        b.appendChild(ui.przycisk(R.przycisk, () => zakoncz(4, R.wniosek, onNext)));
      });
    }
  }

  /* ---------- rozdział 5: role, plan i kolejność ---------- */

  function rozdzial5(onNext) {
    const D = ASZD.R5;
    let z = 0;

    dialog(5, zadania);

    function zadania() {
      if (z >= D.zadania.length) { wyborPlanu(); return; }
      const zad = D.zadania[z];
      const ilu = ASZD.save.maly() ? 2 : 3;
      const inni = tasuj(D.dystraktory).slice(0, ilu - 1);
      const bohaterowie = tasuj([zad.bohater].concat(inni));

      ekran(5, 'r5-zadania', (b) => {
        b.appendChild(ui.el('p', 'etykieta', D.etykieta));
        b.appendChild(ui.el('h2', null, D.tytul));
        b.appendChild(ui.el('p', 'opis', D.instrukcja));
        const post = ui.postep(D.licznik, z, D.zadania.length);
        b.appendChild(post);

        const strefa = ui.el('div', 'strefa strefa-zadanie');
        strefa.appendChild(ui.el('p', 'strefa-tytul', D.krok(z + 1)));
        strefa.appendChild(ui.el('p', 'strefa-opis', zad.tekst));
        b.appendChild(strefa);
        const strefy = [{ el: strefa, id: zad.id }];

        const rzad = ui.el('div', 'bohaterowie');
        let wybrany = null;
        const tokeny = bohaterowie.map((imie) => {
          const t = ui.el('button', 'bohater');
          t.appendChild(ui.el('span', 'bohater-imie', imie));
          t.addEventListener('click', () => {
            if (t.dataset.zablokowany === '1') return;
            ASZD.audio.dotyk();
            tokeny.forEach((x) => x.classList.remove('bohater-wybrany'));
            t.classList.add('bohater-wybrany');
            wybrany = t;
          });
          t.dataset.imie = imie;
          rzad.appendChild(t);
          return t;
        });
        b.appendChild(rzad);

        const fb = ui.feedback();
        b.appendChild(fb);

        function upusc(_, token) {
          const imie = token.dataset.imie;
          if (imie !== zad.bohater) {
            ASZD.audio.zle(); ASZD.save.dodajPomylke();
            token.classList.add('bohater-zly');
            setTimeout(() => token.classList.remove('bohater-zly'), 600);
            fb.pokaz('zle', D.zle(imie));
            return;
          }
          token.dataset.zablokowany = '1';
          strefa.classList.add('strefa-ok');
          z++;
          ASZD.audio.dobrze(z);
          post.aktualizuj(z);
          fb.pokaz('dobrze', D.dobrze(imie));
          setTimeout(zadania, 1200);
        }

        tokeny.forEach((t) => ASZD.dnd.ustaw(t, strefy, upusc));
        ASZD.dnd.strefyKlikalne(strefy, () => wybrany, upusc);
      });
    }

    function wyborPlanu() {
      const P = D.plan;
      ekran(5, 'r5-plan', (b) => {
        b.appendChild(ui.el('p', 'etykieta', P.etykieta));
        b.appendChild(ui.kartaDialogu(P.mowca, P.tresc));
        const fb = ui.feedback();
        b.appendChild(fb);
        b.appendChild(ui.siatkaWyborow(P.opcje, (o, node) => {
          if (!o.dobry) {
            ASZD.audio.zle(); ASZD.save.dodajPomylke();
            node.classList.add('wybor-zly');
            fb.pokaz('zle', P.odpowiedzi[o.id]);
            return;
          }
          node.classList.add('wybor-dobry');
          fb.pokaz('dobrze', P.odpowiedzi[o.id]);
          setTimeout(kolejnosc, 1300);
        }));
      });
    }

    function kolejnosc() {
      const K = D.kolejnosc;
      const ulozone = [];

      ekran(5, 'r5-kolejnosc', (b) => {
        b.appendChild(ui.el('p', 'etykieta', K.etykieta));
        b.appendChild(ui.el('h2', null, K.tytul));
        const post = ui.postep(K.licznik, 0, K.kroki.length);
        b.appendChild(post);

        const tablica = ui.el('div', 'strefa strefa-tablica');
        tablica.appendChild(ui.el('p', 'strefa-tytul', K.tablica));
        const lista = ui.el('p', 'tablica-lista', K.pusto);
        tablica.appendChild(lista);
        b.appendChild(tablica);
        const strefy = [{ el: tablica, id: 'tablica' }];

        const pula = ui.el('div', 'kroki');
        let wybrany = null;
        const tokeny = tasuj(K.kroki.concat([K.pulapka])).map((krok) => {
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
        b.appendChild(pula);

        const fb = ui.feedback();
        b.appendChild(fb);

        function upusc(_, token) {
          const id = token.dataset.id;
          if (id === K.pulapka.id) {
            ASZD.audio.zle(); ASZD.save.dodajPomylke();
            token.classList.add('krok-zly');
            setTimeout(() => token.classList.remove('krok-zly'), 600);
            fb.pokaz('zle', K.zlaPulapka);
            return;
          }
          const oczekiwany = K.kroki[ulozone.length];
          if (id !== oczekiwany.id) {
            ASZD.audio.zle(); ASZD.save.dodajPomylke();
            token.classList.add('krok-zly');
            setTimeout(() => token.classList.remove('krok-zly'), 600);
            fb.pokaz('zle', K.zlaKolejnosc(oczekiwany.tekst));
            return;
          }
          token.dataset.zablokowany = '1';
          token.classList.add('krok-ok');
          token.classList.remove('krok-wybrany');
          wybrany = null;
          ulozone.push(oczekiwany);
          ASZD.audio.dobrze(ulozone.length);
          post.aktualizuj(ulozone.length);
          lista.textContent = ulozone.map((s) => s.krotki).join('  →  ');
          fb.pokaz('dobrze', K.zapisany(oczekiwany.tekst));
          if (ulozone.length >= K.kroki.length) setTimeout(review, 1200);
        }

        tokeny.forEach((t) => ASZD.dnd.ustaw(t, strefy, upusc));
        ASZD.dnd.strefyKlikalne(strefy, () => wybrany, upusc);
      });
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
    uruchom(nr, onNext) { MAPA[nr](onNext); }
  };
})();
