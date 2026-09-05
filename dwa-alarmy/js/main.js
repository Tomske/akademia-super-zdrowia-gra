/* Routing gry: menu -> wybór trybu wiekowego -> rozdziały -> zakończenie.
   Odpowiednik MenuFlow, AgeSelectFlow, ChapterSelectFlow i EndingFlow z oryginału. */
window.ASZD = window.ASZD || {};

ASZD.main = (function () {
  const ui = ASZD.ui;
  const T = ASZD.T;

  function stosujTryb() {
    document.documentElement.dataset.tryb = ASZD.save.tryb();
  }

  /* ---------- menu ---------- */

  function menu() {
    ASZD.audio.odswiezMuzyke();
    ui.ustawTlo('menu');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel panel-menu');

    p.appendChild(ui.herb());
    p.appendChild(ui.el('p', 'etykieta', T.marka));
    p.appendChild(ui.el('h1', 'tytul-gry', T.tytulGry));
    p.appendChild(ui.el('p', 'podtytul', T.podtytul));
    p.appendChild(ui.el('p', 'opis', T.powitanie));

    if (ASZD.save.maZapis()) {
      p.appendChild(ui.przycisk(T.kontynuuj, () => pokazRozdzialy()));
      p.appendChild(ui.przycisk(T.graj, () => nowaGra(), 'btn-ghost'));
    } else {
      p.appendChild(ui.przycisk(T.graj, () => nowaGra()));
    }
    p.appendChild(ui.przycisk(T.ustawienia, () => ustawienia(), 'btn-ghost'));

    const d = ui.el('p', 'druzyna');
    ui.wieloliniowy(d, T.druzyna);
    p.appendChild(d);
    p.appendChild(ui.el('p', 'fineprint', T.prywatnosc));
    s.appendChild(p);
    s.appendChild(stopka());
  }

  function stopka() {
    const f = ui.el('footer', 'foot');
    const a = ui.el('a', null, T.inneGry);
    a.href = '/?menu=1';
    f.appendChild(a);
    f.appendChild(ui.el('span', null, ' · '));
    const b = ui.el('a', null, 'akademiasuperzdrowia.pl');
    b.href = 'https://www.akademiasuperzdrowia.pl';
    b.target = '_blank'; b.rel = 'noopener';
    f.appendChild(b);
    return f;
  }

  function ustawienia() {
    ui.ustawTlo('pauza');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel panel-menu');
    p.appendChild(ui.el('p', 'etykieta', T.lokalnie));
    p.appendChild(ui.el('h2', null, T.ustawienia));

    const muz = ui.przycisk('', () => {
      const on = !ASZD.save.get().muzyka;
      ASZD.save.set({ muzyka: on });
      ASZD.audio.odswiezMuzyke();
      opisz();
    }, 'btn-ghost');
    const dzw = ui.przycisk('', () => {
      ASZD.save.set({ dzwiek: !ASZD.save.get().dzwiek });
      opisz();
    }, 'btn-ghost');

    function opisz() {
      muz.textContent = T.muzyka + (ASZD.save.get().muzyka ? T.wl : T.wyl);
      dzw.textContent = T.dzwieki + (ASZD.save.get().dzwiek ? T.wl : T.wyl);
    }
    opisz();

    p.appendChild(muz);
    p.appendChild(dzw);
    p.appendChild(ui.przycisk(T.menuGlowne, menu));
    p.appendChild(ui.el('p', 'fineprint', T.prywatnosc));
    s.appendChild(p);
  }

  /* ---------- wybór trybu wiekowego ---------- */

  function nowaGra() {
    ASZD.save.reset();
    wybierzTryb();
  }

  function wybierzTryb() {
    ui.ustawTlo('wiek');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel');
    p.appendChild(ui.el('p', 'etykieta', T.dopasujemy));
    p.appendChild(ui.el('h2', null, T.wybierzTryb));

    T.tryby.forEach((t) => {
      const k = ui.el('div', 'tryb');
      k.appendChild(ui.el('h3', null, t.tytul));
      k.appendChild(ui.el('p', 'tryb-opis', t.opis));
      k.appendChild(ui.przycisk(t.cta, () => {
        ASZD.save.set({ wiek: t.id });
        stosujTryb();
        pokazRozdzialy();
      }));
      p.appendChild(k);
    });
    s.appendChild(p);
  }

  /* ---------- lista rozdziałów ---------- */

  function pokazRozdzialy() {
    if (!ASZD.save.get().wiek) { wybierzTryb(); return; }
    stosujTryb();
    ui.ustawTlo('menu');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel panel-szeroki');
    p.appendChild(ui.el('p', 'etykieta', T.marka));
    p.appendChild(ui.el('h2', null, T.rozdzialy));
    p.appendChild(ui.el('p', 'suma-gwiazdek',
      T.gwiazdkiRazem(ASZD.save.gwiazdekRazem(), ASZD.save.gwiazdekMax())));

    const lista = ui.el('div', 'lista-rozdzialow');
    ASZD.ROZDZIALY.forEach((r) => {
      const otwarty = ASZD.save.odblokowany(r.nr);
      const gw = ASZD.save.gwiazdkiRozdzialu(r.nr);
      const b = ui.el('button', 'rozdzial' + (otwarty ? '' : ' rozdzial-zamkniety'));
      b.appendChild(ui.el('span', 'rozdzial-nr', r.nr));
      const t = ui.el('span', 'rozdzial-tytul', r.tytul);
      b.appendChild(t);
      if (gw) {
        const g = ui.el('span', 'rozdzial-gwiazdki');
        g.setAttribute('aria-label', T.gwiazdki + ': ' + gw + ' z 3');
        for (let i = 0; i < 3; i++) {
          g.appendChild(ui.el('span', 'gwiazdka' + (i < gw ? ' gwiazdka-ma' : ''), '★'));
        }
        b.appendChild(g);
      } else {
        b.appendChild(ui.el('span', 'rozdzial-stan', otwarty ? '' : '🔒'));
      }
      if (otwarty) {
        b.addEventListener('click', () => { ASZD.audio.klik(); graj(r.nr); });
      } else {
        b.disabled = true;
      }
      lista.appendChild(b);
    });
    p.appendChild(lista);

    if (ASZD.save.get().ukonczona) {
      p.appendChild(ui.przycisk(T.zakonczenie, final, 'btn-ghost'));
    }
    p.appendChild(ui.przycisk(T.menuGlowne, menu, 'btn-ghost'));
    s.appendChild(p);
    s.appendChild(stopka());
  }

  function graj(nr) {
    stosujTryb();
    ASZD.audio.odblokuj();
    ASZD.rozdzialy.uruchom(nr, () => {
      if (nr < 5) graj(nr + 1); else final();
    });
  }

  /* ---------- pauza ---------- */

  function pauza(nr) {
    const nakladka = document.getElementById('nakladka');
    const tresc = document.getElementById('nakladka-tresc');
    tresc.textContent = '';
    tresc.appendChild(ui.el('p', 'etykieta', T.pauza));
    tresc.appendChild(ui.el('h2', null, T.postepBezpieczny));
    tresc.appendChild(ui.el('p', 'opis', T.pauzaOpis));
    tresc.appendChild(ui.przycisk(T.wrocDoGry, () => nakladka.classList.add('hidden')));
    tresc.appendChild(ui.przycisk(T.wyborRozdzialu, () => {
      nakladka.classList.add('hidden');
      pokazRozdzialy();
    }, 'btn-ghost'));
    tresc.appendChild(ui.przycisk(T.menuGlowne, () => {
      nakladka.classList.add('hidden');
      menu();
    }, 'btn-ghost'));
    nakladka.classList.remove('hidden');
  }

  /* ---------- zakończenie ---------- */

  function final() {
    ASZD.save.zakoncz();
    ASZD.audio.fanfara();
    ui.konfetti();
    ui.ustawTlo('final');
    const st = ASZD.save.get();
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel');
    p.appendChild(ui.el('p', 'etykieta', T.finalTytul));
    p.appendChild(ui.el('h2', null, T.finalNaglowek));
    p.appendChild(ui.el('p', 'opis',
      ASZD.save.wariantFinalu() === 'czysty' ? T.finalCzysty : T.finalPoprawka));

    const box = ui.el('div', 'sytuacja');
    box.appendChild(ui.el('p', 'sytuacja-naglowek', T.finalOsiagniecia.replace(': ', '')));
    box.appendChild(ui.el('p', null, st.osiagniecia.join('  •  ')));
    p.appendChild(box);

    const slady = ui.el('p', 'opis');
    ui.wieloliniowy(slady, T.finalSlady(st.obserwacje, Math.max(st.obserwacjeMax, st.obserwacje)));
    p.appendChild(slady);

    p.appendChild(ui.przycisk(T.nowaPrzygoda, nowaGra));
    p.appendChild(ui.przycisk(T.wyborRozdzialu, pokazRozdzialy, 'btn-ghost'));
    p.appendChild(ui.przycisk(T.menuGlowne, menu, 'btn-ghost'));
    s.appendChild(p);
    s.appendChild(stopka());
  }

  /* ---------- start ---------- */

  function start() {
    stosujTryb();
    /* WebAudio wymaga gestu użytkownika: pierwszy klik odblokowuje i włącza muzykę */
    const odblokuj = () => {
      ASZD.audio.odblokuj();
      ASZD.audio.odswiezMuzyke();
      document.removeEventListener('pointerdown', odblokuj);
    };
    document.addEventListener('pointerdown', odblokuj);
    menu();
  }

  return { start, menu, pokazRozdzialy, pauza, graj, final };
})();

document.addEventListener('DOMContentLoaded', ASZD.main.start);
