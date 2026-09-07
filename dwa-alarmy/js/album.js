/* Album Kart Faktów: odblokowywanie kart w trakcie gry i ekran albumu.
   Karta odblokowuje się konkretnym trafieniem, nie samym ukończeniem rozdziału.
   Złota wersja: komplet gwiazdek w rozdziale, z którego pochodzi karta. */
window.ASZD = window.ASZD || {};

ASZD.album = (function () {
  const ui = ASZD.ui;
  const T = ASZD.T;

  /* które karty należą do którego rozdziału (do złocenia za komplet gwiazdek) */
  const KARTY_ROZDZIALU = {
    1: ['cichy-sygnal', 'woda-najpierw', 'fakt-panel', 'zatrzymaj-powiedz'],
    2: ['rytm', 'ciche-potrzeby'],
    3: ['zmierz-zanim', 'ludzie-najpierw', 'kolejnosc-laczy'],
    4: ['fakt', 'hipoteza', 'domysl', 'nie-wiemy-jeszcze'],
    5: ['moc-do-zadania', 'zabezpiecz-sprawdz', 'odpoczynek-w-planie']
  };

  function karta(id) { return ASZD.KARTY.find((k) => k.id === id); }

  function odblokuj(id, zlota) {
    const k = karta(id);
    if (!k) return;
    const nowa = ASZD.save.dodajKarte(id, zlota);
    if (nowa) toast(k, zlota);
  }

  function zloc(nr) {
    (KARTY_ROZDZIALU[nr] || []).forEach((id) => { if (ASZD.save.maKarte(id)) ASZD.save.dodajKarte(id, true); });
  }

  /* krótki komunikat "nowa karta" w rogu ekranu, nie przerywa gry */
  let toastTimer = null;
  function toast(k, zlota) {
    let t = document.getElementById('karta-toast');
    if (!t) {
      t = ui.el('div', 'karta-toast');
      t.id = 'karta-toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = '';
    t.className = 'karta-toast' + (zlota ? ' karta-toast-zlota' : '');
    t.appendChild(ui.el('span', 'karta-toast-ikona', zlota ? '★' : '✦'));
    const tr = ui.el('div');
    tr.appendChild(ui.el('strong', null, zlota ? T.kartaZlota : T.kartaNowa));
    tr.appendChild(ui.el('span', null, k.tytul));
    t.appendChild(tr);
    void t.offsetWidth;
    t.classList.add('karta-toast-widoczny');
    ASZD.audio.gwiazdka(zlota ? 2 : 0);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('karta-toast-widoczny'), 2600);
  }

  /* ---------- ekran albumu ---------- */
  function pokaz(onBack) {
    ui.ustawTlo('r4-review');
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel panel-szeroki');
    const st = ASZD.save.get();
    p.appendChild(ui.el('p', 'etykieta', T.marka));
    p.appendChild(ui.el('h2', null, T.album));
    p.appendChild(ui.el('p', 'suma-gwiazdek', T.albumLicznik(st.karty.length, ASZD.KARTY.length, st.zlote.length)));
    p.appendChild(ui.el('p', 'opis', T.albumOpis));

    Object.keys(ASZD.KARTY_KAT).forEach((kat) => {
      const grupa = ASZD.KARTY.filter((k) => k.kat === kat);
      const h = ui.el('h3', 'album-kat', ASZD.KARTY_KAT[kat].nazwa);
      h.style.color = ASZD.KARTY_KAT[kat].kolor;
      p.appendChild(h);
      const siatka = ui.el('div', 'album-siatka');
      grupa.forEach((k) => {
        const ma = ASZD.save.maKarte(k.id);
        const zlota = ASZD.save.zlotaKarta(k.id);
        const el = ui.el('button', 'album-karta' + (ma ? '' : ' album-karta-brak') + (zlota ? ' album-karta-zlota' : ''));
        el.style.setProperty('--kat', ASZD.KARTY_KAT[kat].kolor);
        el.appendChild(ui.el('span', 'album-karta-ikona', ma ? (zlota ? '★' : '✦') : '?'));
        el.appendChild(ui.el('span', 'album-karta-tytul', ma ? k.tytul : T.kartaNieznana));
        if (ma) el.addEventListener('click', () => { ASZD.audio.klik(); szczegol(k, zlota, () => pokaz(onBack)); });
        else el.disabled = true;
        siatka.appendChild(el);
      });
      p.appendChild(siatka);
    });

    p.appendChild(ui.przycisk(T.menuGlowne, onBack, 'btn-ghost'));
    s.appendChild(p);
  }

  function szczegol(k, zlota, onBack) {
    const s = ui.wyczysc();
    const p = ui.el('div', 'panel');
    p.appendChild(ui.el('p', 'etykieta', ASZD.KARTY_KAT[k.kat].nazwa + (zlota ? ' • ' + T.kartaZlota : '')));
    const duza = ui.el('div', 'album-duza' + (zlota ? ' album-duza-zlota' : ''));
    duza.style.setProperty('--kat', ASZD.KARTY_KAT[k.kat].kolor);
    duza.appendChild(ui.el('span', 'album-duza-ikona', zlota ? '★' : '✦'));
    duza.appendChild(ui.el('h2', null, k.tytul));
    duza.appendChild(ui.el('p', 'album-duza-tekst', k.tekst));
    if (k.zrodlo) duza.appendChild(ui.el('p', 'album-zrodlo', T.zrodlo + ': ' + k.zrodlo));
    p.appendChild(duza);
    p.appendChild(ui.przycisk(T.album, onBack, 'btn-ghost'));
    s.appendChild(p);
    ASZD.lektor.czytaj(k.tytul + '. ' + k.tekst);
  }

  return { odblokuj, zloc, pokaz, karta };
})();
