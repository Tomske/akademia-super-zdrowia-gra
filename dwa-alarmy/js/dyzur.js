/* Dyżur w Akademii: codziennie trzy krótkie sytuacje z życia, w mechanikach z kampanii.
   Ten sam dzień daje te same trzy sytuacje (losowanie z ziarnem daty), więc dziecko nie
   może "przelosować" łatwiejszych. Nagroda: odznaka dnia, seria dni, karty do albumu. */
window.ASZD = window.ASZD || {};

ASZD.dyzur = (function () {
  const ui = ASZD.ui;
  const T = ASZD.T;
  const M = ASZD.minigry;
  const NA_DZIEN = 3;

  function ziarno(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  }

  /* najpierw sytuacje jeszcze nierobione, w stałej kolejności na dany dzień */
  function dzisiejsze() {
    const los = ziarno(ASZD.save.dzis() + '|dwa-alarmy');
    const zrobione = ASZD.save.get().dyzur.zrobione;
    const wszystkie = ASZD.DYZUR.slice().sort(() => los() - 0.5);
    const nowe = wszystkie.filter((s) => zrobione.indexOf(s.id) === -1);
    const stare = wszystkie.filter((s) => zrobione.indexOf(s.id) !== -1);
    return nowe.concat(stare).slice(0, NA_DZIEN);
  }

  function odblokowany() { return ASZD.save.get().ukonczone.indexOf(2) !== -1; }

  /* ---------- ekran startowy dyżuru ---------- */
  function start(onBack) {
    ui.ustawTlo('dyzur-zbiorka');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel');
    const st = ASZD.save.get();
    p.appendChild(ui.el('p', 'etykieta', T.marka));
    p.appendChild(ui.el('h2', null, T.dyzur));
    const stat = ui.el('div', 'dyzur-stat');
    stat.appendChild(kafel(T.seria, ASZD.save.seriaDyzurow(), '🔥'));
    stat.appendChild(kafel(T.odznaki, st.dyzur.odznaki, '🎖'));
    stat.appendChild(kafel(T.sytuacje, st.dyzur.zrobione.length + '/' + ASZD.DYZUR.length, '✓'));
    p.appendChild(stat);

    if (ASZD.save.dyzurDzisZrobiony()) {
      p.appendChild(ui.el('p', 'opis', T.dyzurZrobiony));
      p.appendChild(ui.przycisk(T.dyzurJeszcze, () => graj(onBack, true), 'btn-ghost'));
    } else {
      p.appendChild(ui.el('p', 'opis', T.dyzurOpis));
      p.appendChild(ui.przycisk(T.dyzurStart, () => graj(onBack, false)));
    }
    p.appendChild(ui.przycisk(T.menuGlowne, onBack, 'btn-ghost'));
    s.appendChild(p);
  }

  function kafel(nazwa, wartosc, ikona) {
    const k = ui.el('div', 'dyzur-kafel');
    k.appendChild(ui.el('span', 'dyzur-kafel-ikona', ikona));
    k.appendChild(ui.el('strong', null, String(wartosc)));
    k.appendChild(ui.el('span', 'dyzur-kafel-nazwa', nazwa));
    return k;
  }

  /* ---------- przebieg: trzy sytuacje po kolei ---------- */
  function graj(onBack, powtorka) {
    const lista = dzisiejsze();
    let i = 0, bledy = 0, widget = null, gra = null, mocUzyta = false;

    const cb = (koniec) => ({
      blad() { ASZD.save.dodajPomylke(); bledy++; if (widget) widget.aktualizuj(ASZD.save.gwiazdkiZa(bledy)); },
      dobrze() {},
      karta(id) { ASZD.album.odblokuj(id); },
      licznik() { widget = ui.gwiazdkiLive(); widget.aktualizuj(ASZD.save.gwiazdkiZa(bledy)); return widget; },
      koniec
    });
    const moc = () => {
      const b = ASZD.BOHATEROWIE_LISTA.find((x) => x.id === ASZD.save.bohater());
      return b ? { nazwa: b.moc, opis: b.opis, dostepna: () => bledy > 0 && !mocUzyta, uzyj: () => { mocUzyta = true; } } : null;
    };

    function ekran(syt) {
      if (gra) { gra.stop(); gra = null; }
      ui.ustawTlo(syt.obraz);
      const s = ui.wyczysc();
      s.appendChild(ui.naglowekGry(i + 1, T.dyzurSytuacja(i + 1, lista.length), () => ASZD.main.pauza(), T.dyzur));
      const panel = ui.el('div', 'panel');
      s.appendChild(panel);
      return panel;
    }

    function nastepna() {
      if (i >= lista.length) { koniec(); return; }
      const syt = lista[i];
      const panel = ekran(syt);
      const cfg = Object.assign({ etykieta: T.dyzurEtykieta }, syt, { moc: moc() });
      if (syt.typ === 'karty') cfg.kategorie = ASZD.R4.kategorie;
      if (syt.typ === 'wybor') cfg.tasuj = true;
      if (syt.typ === 'hotspoty') cfg.pokazEtykiety = false;
      gra = M[syt.typ]({ panel, root: ui.scena() }, cfg, cb(() => {
        if (syt.karta) ASZD.album.odblokuj(syt.karta);
        i++;
        nastepna();
      }));
      ASZD.lektor.czytajPanel(panel);
    }

    function koniec() {
      if (gra) { gra.stop(); gra = null; }
      const gwiazdek = ASZD.save.gwiazdkiZa(bledy);
      if (!powtorka) {
        ASZD.save.zaliczDyzur(lista.map((s) => s.id));
        ASZD.save.dodajXp(gwiazdek);
      }
      ASZD.audio.rozdzial(gwiazdek);
      if (gwiazdek === 3) ui.konfetti();
      ui.ustawTlo('r5-koniec');
      const s = ui.wyczysc();
      const p = ui.el('div', 'panel');
      p.appendChild(ui.el('p', 'etykieta', T.dyzur));
      p.appendChild(ui.el('h2', null, powtorka ? T.dyzurPowtorkaKoniec : T.dyzurKoniec));
      p.appendChild(ui.gwiazdkiDuze(gwiazdek));
      p.appendChild(ui.el('p', 'ocena', bledy === 0 ? T.bezBledu : (bledy === 1 ? T.jednaPomylka : T.wielePomylek)));
      if (!powtorka) {
        const seria = ASZD.save.seriaDyzurow();
        p.appendChild(ui.el('p', 'opis', T.dyzurSeria(seria)));
      }
      p.appendChild(ui.przycisk(T.album, () => ASZD.album.pokaz(() => ASZD.main.menu()), 'btn-ghost'));
      p.appendChild(ui.przycisk(T.menuGlowne, onBack));
      s.appendChild(p);
    }

    nastepna();
  }

  return { start, odblokowany, dzisiejsze };
})();
