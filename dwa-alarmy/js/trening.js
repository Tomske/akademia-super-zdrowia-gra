/* Trening: Cichy sygnał z poziomami.
   Ta sama mechanika co w rozdziale 2, ale coraz trudniej odróżnić rytm od hałasu:
   więcej paneli, dystraktory coraz lepiej udają rytm, w tle pojawiają się błyski.
   Trzy życia na podejście, wynik to osiągnięty poziom. To trening uwagi i dosłownie
   lekcja gry: ciche potrzeby giną w hałasie, jeśli nie zwolnisz. */
window.ASZD = window.ASZD || {};

ASZD.trening = (function () {
  const ui = ASZD.ui;
  const T = ASZD.T;
  const M = ASZD.minigry;
  const MAX = 20;
  const ZYCIA = 3;

  function parametry(poziom) {
    const maly = ASZD.save.maly();
    return {
      ile: Math.min(4 + Math.floor((poziom - 1) / 2), maly ? 8 : 12),
      rytmicznych: poziom < 6 ? 2 : (poziom < 14 ? 3 : 4),
      dystraktor: poziom < 6 ? 'skok' : (poziom < 12 ? 'plynny' : 'imitator'),
      tloBlyski: poziom >= 9,
      obserwacja: Math.max(2, (maly ? 4 : 5) - Math.floor(poziom / 7)),
      okres: 1500 - Math.min(500, (poziom - 1) * 30)
    };
  }

  function odblokowany() { return ASZD.save.get().ukonczone.indexOf(2) !== -1; }

  function start(onBack) {
    ui.ustawTlo('r2-minigra');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel');
    const rekord = ASZD.save.get().trening.rekord;
    p.appendChild(ui.el('p', 'etykieta', T.marka));
    p.appendChild(ui.el('h2', null, T.trening));
    p.appendChild(ui.el('p', 'opis', T.treningOpis));
    const stat = ui.el('div', 'dyzur-stat');
    const k = ui.el('div', 'dyzur-kafel');
    k.appendChild(ui.el('span', 'dyzur-kafel-ikona', '🏆'));
    k.appendChild(ui.el('strong', null, rekord ? String(rekord) : '–'));
    k.appendChild(ui.el('span', 'dyzur-kafel-nazwa', T.rekord));
    stat.appendChild(k);
    p.appendChild(stat);
    p.appendChild(ui.przycisk(T.treningStart, () => graj(1, onBack)));
    p.appendChild(ui.przycisk(T.menuGlowne, onBack, 'btn-ghost'));
    s.appendChild(p);
  }

  function graj(poziom, onBack) {
    let zycia = ZYCIA, gra = null;

    function ekran() {
      if (gra) { gra.stop(); gra = null; }
      ui.ustawTlo('r2-minigra');
      const s = ui.wyczysc();
      s.appendChild(ui.naglowekGry(poziom, T.trening, () => ASZD.main.pauza(), T.poziom(poziom)));
      const panel = ui.el('div', 'panel');
      s.appendChild(panel);
      return panel;
    }

    function zyciaWidget() {
      const w = ui.el('div', 'zycia');
      w.setAttribute('aria-label', T.zycia + ': ' + zycia);
      for (let i = 0; i < ZYCIA; i++) w.appendChild(ui.el('span', 'zycie' + (i < zycia ? ' zycie-ma' : ''), '♥'));
      w.aktualizuj = () => { [...w.children].forEach((c, i) => c.classList.toggle('zycie-ma', i < zycia)); };
      return w;
    }

    function poziomStart() {
      const panel = ekran();
      const par = parametry(poziom);
      let widget = null;
      const cfg = Object.assign({
        etykieta: T.poziom(poziom) + ' • ' + T.zycia + ' ' + zycia,
        tytul: ASZD.R2.tytul,
        opis: T.treningPoziomOpis(par.rytmicznych, par.ile),
        opisObserwacji: T.treningPoziomOpis(par.rytmicznych, par.ile),
        licznik: ASZD.R2.licznik, status: ASZD.R2.status, powtorka: ASZD.R2.powtorka,
        dobry: ASZD.R2.dobry, zly: ASZD.R2.zly, komplet: ASZD.R2.komplet
      }, par);
      gra = M.rytm({ panel, root: ui.scena() }, cfg, {
        blad() {
          zycia--;
          if (widget) widget.aktualizuj();
          if (zycia <= 0) setTimeout(koniec, 700);
        },
        dobrze() {},
        karta() {},
        licznik() { widget = zyciaWidget(); return widget; },
        koniec() {
          gra.stop();
          if (poziom % 5 === 0) ASZD.album.odblokuj(poziom === 5 ? 'rytm' : (poziom === 10 ? 'zmeczenie-zlosc' : (poziom === 15 ? 'ciche-potrzeby' : 'nazwij-emocje')));
          if (poziom >= MAX) { poziom = MAX; koniec(true); return; }
          poziom++;
          ASZD.audio.dobrze(3);
          poziomStart();
        }
      });
    }

    function koniec(mistrz) {
      if (gra) { gra.stop(); gra = null; }
      const osiagniety = mistrz ? MAX : poziom - 1;
      const nowyRekord = ASZD.save.zapiszRekord(osiagniety);
      if (osiagniety > 0) ASZD.save.dodajXp(Math.ceil(osiagniety / 5));
      if (nowyRekord && osiagniety > 0) { ASZD.audio.fanfara(); ui.konfetti(); } else ASZD.audio.zle();
      ui.ustawTlo('r2-koniec');
      const s = ui.wyczysc();
      const p = ui.el('div', 'panel');
      p.appendChild(ui.el('p', 'etykieta', T.trening));
      p.appendChild(ui.el('h2', null, mistrz ? T.treningMistrz : T.treningKoniec));
      p.appendChild(ui.el('p', 'wynik-duzy', T.poziom(osiagniety)));
      p.appendChild(ui.el('p', 'opis', nowyRekord ? T.nowyRekord : T.rekordJest(ASZD.save.get().trening.rekord)));
      p.appendChild(ui.przycisk(T.treningJeszcze, () => graj(1, onBack)));
      p.appendChild(ui.przycisk(T.menuGlowne, onBack, 'btn-ghost'));
      s.appendChild(p);
    }

    poziomStart();
  }

  return { start, odblokowany, parametry };
})();
