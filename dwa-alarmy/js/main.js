/* Routing gry: menu -> tryb wiekowy -> bohater -> rozdziały -> zakończenie,
   plus Album, Dyżur, Trening, Misja na dziś i ustawienia (muzyka, dźwięki, lektor). */
window.ASZD = window.ASZD || {};

ASZD.main = (function () {
  const ui = ASZD.ui;
  const T = ASZD.T;

  function stosujTryb() {
    document.documentElement.dataset.tryb = ASZD.save.tryb();
  }
  function wyjdzZGry() { ASZD.rozdzialy.stop(); ASZD.lektor.stop(); }

  /* ---------- menu ---------- */
  function menu() {
    wyjdzZGry();
    ASZD.audio.odswiezMuzyke();
    /* rano gra pyta o wczorajszą misję, zanim pokaże menu */
    if (ASZD.save.misjaDoSprawdzenia()) { sprawdzMisje(menu); return; }

    ui.ustawTlo('menu');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel panel-menu');
    const st = ASZD.save.get();

    p.appendChild(ui.herb());
    p.appendChild(ui.el('p', 'etykieta', T.marka));
    p.appendChild(ui.el('h1', 'tytul-gry', T.tytulGry));
    p.appendChild(ui.el('p', 'podtytul', ASZD.GLUTON.menu));

    if (st.bohater) p.appendChild(pasekBohatera());

    if (ASZD.save.maZapis()) {
      p.appendChild(ui.przycisk(T.kontynuuj, pokazRozdzialy));
    } else {
      p.appendChild(ui.el('p', 'opis', T.powitanie));
      p.appendChild(ui.przycisk(T.graj, nowaGra));
    }

    const siatka = ui.el('div', 'menu-siatka');
    siatka.appendChild(kafelMenu('✦', T.album, T.albumLicznik(st.karty.length, ASZD.KARTY.length, 0), true,
      () => ASZD.album.pokaz(menu)));
    const dyzurOk = ASZD.dyzur.odblokowany();
    siatka.appendChild(kafelMenu('🎖', T.dyzur, dyzurOk ? (ASZD.save.dyzurDzisZrobiony() ? T.dyzurZrobiony.split('.')[0] : T.dyzurOpis.split('.')[0]) : T.dyzurZablokowany,
      dyzurOk, () => ASZD.dyzur.start(menu)));
    const treningOk = ASZD.trening.odblokowany();
    siatka.appendChild(kafelMenu('◉', T.trening, treningOk ? (st.trening.rekord ? T.rekordJest(st.trening.rekord) : T.treningOpis.split('.')[0]) : T.treningZablokowany,
      treningOk, () => ASZD.trening.start(menu)));
    p.appendChild(siatka);

    if (st.misja && st.misja.stan === 'trwa') {
      const m = ASZD.MISJE.find((x) => x.id === st.misja.id);
      if (m) {
        const box = ui.el('div', 'sytuacja misja-box');
        box.appendChild(ui.el('p', 'sytuacja-naglowek', T.misjaNaDzis));
        box.appendChild(ui.el('p', null, m.tekst));
        p.appendChild(box);
      }
    }

    if (ASZD.save.maZapis()) p.appendChild(ui.przycisk(T.graj, nowaGra, 'btn-ghost'));
    p.appendChild(ui.przycisk(T.ustawienia, ustawienia, 'btn-ghost'));
    p.appendChild(ui.el('p', 'fineprint', T.prywatnosc));
    s.appendChild(p);
    s.appendChild(stopka());
  }

  function kafelMenu(ikona, tytul, opis, aktywny, onClick) {
    const k = ui.el('button', 'kafel' + (aktywny ? '' : ' kafel-zablokowany'));
    k.appendChild(ui.el('span', 'kafel-ikona', ikona));
    const t = ui.el('div', 'kafel-tresc');
    t.appendChild(ui.el('strong', null, tytul));
    t.appendChild(ui.el('span', 'kafel-opis', opis));
    k.appendChild(t);
    if (aktywny) k.addEventListener('click', () => { ASZD.audio.klik(); onClick(); });
    else k.disabled = true;
    return k;
  }

  function pasekBohatera() {
    const b = ASZD.BOHATEROWIE_LISTA.find((x) => x.id === ASZD.save.bohater());
    const w = ui.el('button', 'bohater-pasek');
    const img = ui.el('img', 'bohater-pasek-portret');
    img.src = 'assets/img/portret-' + b.id + '.webp'; img.alt = '';
    w.appendChild(img);
    const t = ui.el('div', 'bohater-pasek-tresc');
    t.appendChild(ui.el('strong', null, b.imie));
    t.appendChild(ui.el('span', null, T.poziomBohatera(ASZD.save.poziom()) + ' • ' + b.moc));
    const tor = ui.el('div', 'postep-tor');
    const fill = ui.el('div', 'postep-fill');
    fill.style.width = ((6 - ASZD.save.xpDoNastepnego()) / 6 * 100) + '%';
    tor.appendChild(fill);
    t.appendChild(tor);
    w.appendChild(t);
    w.title = T.zmienBohatera;
    w.addEventListener('click', () => { ASZD.audio.klik(); wybierzBohatera(menu); });
    return w;
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

  /* ---------- ustawienia ---------- */
  function ustawienia() {
    ui.ustawTlo('pauza');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel panel-menu');
    p.appendChild(ui.el('p', 'etykieta', T.lokalnie));
    p.appendChild(ui.el('h2', null, T.ustawienia));

    const muz = ui.przycisk('', () => { ASZD.save.set({ muzyka: !ASZD.save.get().muzyka }); ASZD.audio.odswiezMuzyke(); opisz(); }, 'btn-ghost');
    const dzw = ui.przycisk('', () => { ASZD.save.set({ dzwiek: !ASZD.save.get().dzwiek }); opisz(); }, 'btn-ghost');
    const lek = ui.przycisk('', () => {
      const teraz = ASZD.save.lektorWlaczony();
      ASZD.save.set({ lektor: !teraz });
      opisz();
      if (!teraz) ASZD.lektor.czytaj(T.tytulGry);
    }, 'btn-ghost');

    function opisz() {
      muz.textContent = T.muzyka + (ASZD.save.get().muzyka ? T.wl : T.wyl);
      dzw.textContent = T.dzwieki + (ASZD.save.get().dzwiek ? T.wl : T.wyl);
      lek.textContent = T.lektor + (ASZD.save.lektorWlaczony() ? T.wl : T.wyl);
    }
    opisz();

    p.appendChild(muz);
    p.appendChild(dzw);
    if (ASZD.lektor.dostepny()) p.appendChild(lek);
    else p.appendChild(ui.el('p', 'fineprint', T.lektorBrak));
    if (ASZD.save.bohater()) p.appendChild(ui.przycisk(T.zmienBohatera, () => wybierzBohatera(ustawienia), 'btn-ghost'));
    p.appendChild(ui.przycisk(T.menuGlowne, menu));
    p.appendChild(ui.el('p', 'fineprint', T.prywatnosc));
    s.appendChild(p);
  }

  /* ---------- nowa gra: tryb wiekowy, potem bohater ---------- */
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
        if (ASZD.save.bohater()) pokazRozdzialy(); else wybierzBohatera(pokazRozdzialy);
      }));
      p.appendChild(k);
    });
    s.appendChild(p);
  }

  function wybierzBohatera(onDone) {
    ui.ustawTlo('r1-scena');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel panel-szeroki');
    p.appendChild(ui.el('p', 'etykieta', T.marka));
    p.appendChild(ui.el('h2', null, T.wybierzBohatera));
    p.appendChild(ui.el('p', 'opis', T.wybierzBohateraOpis));
    const siatka = ui.el('div', 'bohaterowie-wybor');
    let wybrany = ASZD.save.bohater() || null;
    const cta = ui.przycisk('', () => {
      if (!wybrany) return;
      ASZD.save.wybierzBohatera(wybrany);
      onDone();
    });
    function odswiez() {
      [...siatka.children].forEach((k) => k.classList.toggle('bohater-karta-wybrana', k.dataset.id === wybrany));
      const b = ASZD.BOHATEROWIE_LISTA.find((x) => x.id === wybrany);
      cta.textContent = b ? T.gramJako(b.imie) : T.wybierzBohatera;
      cta.classList.toggle('btn-nieaktywny', !b);
    }
    ASZD.BOHATEROWIE_LISTA.forEach((b) => {
      const k = ui.el('button', 'bohater-karta');
      k.dataset.id = b.id;
      const img = ui.el('img', 'bohater-karta-portret');
      img.src = 'assets/img/portret-' + b.id + '.webp'; img.alt = '';
      k.appendChild(img);
      k.appendChild(ui.el('strong', null, b.imie));
      k.appendChild(ui.el('span', 'bohater-karta-moc', b.moc));
      k.appendChild(ui.el('span', 'bohater-karta-opis', b.opis));
      k.addEventListener('click', () => { ASZD.audio.dotyk(); wybrany = b.id; odswiez(); });
      siatka.appendChild(k);
    });
    p.appendChild(siatka);
    p.appendChild(cta);
    odswiez();
    s.appendChild(p);
  }

  /* ---------- lista rozdziałów ---------- */
  function pokazRozdzialy() {
    wyjdzZGry();
    if (!ASZD.save.get().wiek) { wybierzTryb(); return; }
    if (!ASZD.save.bohater()) { wybierzBohatera(pokazRozdzialy); return; }
    stosujTryb();
    ui.ustawTlo('menu');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel panel-szeroki');
    p.appendChild(ui.el('p', 'etykieta', T.marka));
    p.appendChild(ui.el('h2', null, T.rozdzialy));
    p.appendChild(ui.el('p', 'suma-gwiazdek', T.gwiazdkiRazem(ASZD.save.gwiazdekRazem(), ASZD.save.gwiazdekMax())));
    p.appendChild(pasekBohatera());

    const lista = ui.el('div', 'lista-rozdzialow');
    ASZD.ROZDZIALY.forEach((r) => {
      const otwarty = ASZD.save.odblokowany(r.nr);
      const gw = ASZD.save.gwiazdkiRozdzialu(r.nr);
      const b = ui.el('button', 'rozdzial' + (otwarty ? '' : ' rozdzial-zamkniety'));
      b.appendChild(ui.el('span', 'rozdzial-nr', r.nr));
      b.appendChild(ui.el('span', 'rozdzial-tytul', r.tytul));
      if (gw) {
        const g = ui.el('span', 'rozdzial-gwiazdki');
        g.setAttribute('aria-label', T.gwiazdki + ': ' + gw + ' z 3');
        for (let i = 0; i < 3; i++) g.appendChild(ui.el('span', 'gwiazdka' + (i < gw ? ' gwiazdka-ma' : ''), '★'));
        b.appendChild(g);
      } else {
        b.appendChild(ui.el('span', 'rozdzial-stan', otwarty ? '' : '🔒'));
      }
      if (otwarty) b.addEventListener('click', () => { ASZD.audio.klik(); graj(r.nr); });
      else b.disabled = true;
      lista.appendChild(b);
    });
    p.appendChild(lista);

    if (ASZD.save.get().ukonczona) p.appendChild(ui.przycisk(T.zakonczenie, final, 'btn-ghost'));
    p.appendChild(ui.przycisk(T.menuGlowne, menu, 'btn-ghost'));
    s.appendChild(p);
    s.appendChild(stopka());
  }

  function graj(nr) {
    stosujTryb();
    ASZD.audio.odblokuj();
    ASZD.rozdzialy.uruchom(nr, () => { if (nr < 5) graj(nr + 1); else final(); });
  }

  /* ---------- misja na dziś ---------- */
  function ekranMisji(m, onNext) {
    ui.ustawTlo('dyzur-plac');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel');
    p.appendChild(ui.el('p', 'etykieta', T.misjaNaDzis));
    p.appendChild(ui.el('h2', null, T.misjaNaDzis));
    p.appendChild(ui.el('p', 'opis', T.misjaOpis));
    const box = ui.el('div', 'sytuacja misja-box');
    box.appendChild(ui.el('p', null, m.tekst));
    p.appendChild(box);
    p.appendChild(ui.przycisk(T.misjaPrzyjmuje, onNext));
    s.appendChild(p);
    ASZD.lektor.czytaj(m.tekst);
  }

  function sprawdzMisje(onNext) {
    const st = ASZD.save.get();
    const m = ASZD.MISJE.find((x) => x.id === st.misja.id);
    ui.ustawTlo('dyzur-plac');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel');
    p.appendChild(ui.el('p', 'etykieta', T.misjaNaDzis));
    p.appendChild(ui.el('h2', null, T.misjaPytanie));
    const box = ui.el('div', 'sytuacja misja-box');
    box.appendChild(ui.el('p', null, m ? m.tekst : ''));
    p.appendChild(box);
    const fb = ui.feedback();
    p.appendChild(fb);
    const dalej = ui.przycisk(T.dalej, onNext);
    dalej.classList.add('hidden');
    p.appendChild(ui.przycisk(T.misjaTak, () => {
      ASZD.save.zamknijMisje(true);
      ASZD.album.odblokuj('pros-o-pomoc');
      ASZD.save.dodajXp(1);
      ASZD.audio.dobrze(3);
      fb.pokaz('dobrze', T.misjaTakOdp);
      dalej.classList.remove('hidden');
    }));
    p.appendChild(ui.przycisk(T.misjaNie, () => {
      ASZD.save.zamknijMisje(false);
      fb.pokaz('info', T.misjaNieOdp);
      dalej.classList.remove('hidden');
    }, 'btn-ghost'));
    p.appendChild(dalej);
    s.appendChild(p);
  }

  /* ---------- pauza ---------- */
  function pauza() {
    const nakladka = document.getElementById('nakladka');
    const tresc = document.getElementById('nakladka-tresc');
    tresc.textContent = '';
    tresc.appendChild(ui.el('p', 'etykieta', T.pauza));
    tresc.appendChild(ui.el('h2', null, T.postepBezpieczny));
    tresc.appendChild(ui.el('p', 'opis', T.pauzaOpis));
    tresc.appendChild(ui.przycisk(T.wrocDoGry, () => nakladka.classList.add('hidden')));
    tresc.appendChild(ui.przycisk(T.menuGlowne, () => { nakladka.classList.add('hidden'); menu(); }, 'btn-ghost'));
    nakladka.classList.remove('hidden');
  }

  /* ---------- zakończenie ---------- */
  function final() {
    wyjdzZGry();
    ASZD.save.zakoncz();
    ASZD.album.odblokuj('bohater-akademii');
    ASZD.audio.fanfara();
    ui.konfetti();
    ui.ustawTlo('final');
    const st = ASZD.save.get();
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel');
    p.appendChild(ui.el('p', 'etykieta', T.finalTytul));
    p.appendChild(ui.el('h2', null, T.finalNaglowek));
    const czysty = ASZD.save.wariantFinalu() === 'czysty';
    p.appendChild(ui.el('p', 'opis', czysty ? ASZD.GLUTON.finalCzysty : ASZD.GLUTON.finalPoprawka));

    const box = ui.el('div', 'sytuacja');
    box.appendChild(ui.el('p', 'sytuacja-naglowek', T.finalOsiagniecia.replace(': ', '')));
    box.appendChild(ui.el('p', null, st.osiagniecia.join('  •  ')));
    p.appendChild(box);
    p.appendChild(ui.el('p', 'suma-gwiazdek', T.gwiazdkiRazem(ASZD.save.gwiazdekRazem(), ASZD.save.gwiazdekMax())));

    p.appendChild(ui.przycisk(T.dyzur, () => ASZD.dyzur.start(menu)));
    p.appendChild(ui.przycisk(T.album, () => ASZD.album.pokaz(menu), 'btn-ghost'));
    p.appendChild(ui.przycisk(T.wyborRozdzialu, pokazRozdzialy, 'btn-ghost'));
    p.appendChild(ui.przycisk(T.menuGlowne, menu, 'btn-ghost'));
    s.appendChild(p);
    s.appendChild(stopka());
    ASZD.lektor.czytaj(czysty ? ASZD.GLUTON.finalCzysty : ASZD.GLUTON.finalPoprawka);
  }

  /* ---------- start ---------- */
  function start() {
    stosujTryb();
    const odblokuj = () => {
      ASZD.audio.odblokuj();
      ASZD.audio.odswiezMuzyke();
      document.removeEventListener('pointerdown', odblokuj);
    };
    document.addEventListener('pointerdown', odblokuj);
    menu();
  }

  return { start, menu, pokazRozdzialy, pauza, graj, final, ekranMisji, wybierzBohatera };
})();

document.addEventListener('DOMContentLoaded', ASZD.main.start);
