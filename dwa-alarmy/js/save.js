/* zapis: localStorage, bez kont i bez wysyłania danych.
   Struktura pól odwzorowuje SaveData z oryginału (schemaVersion, completedChapters,
   achievements, observeFirst, endingVariant) i rozszerza ją o to, czego oryginał nie miał:
   bohatera z doświadczeniem, album kart, dyżury, trening i misje na dziś. */
window.ASZD = window.ASZD || {};

ASZD.save = (function () {
  const KEY = 'asz_dwa_alarmy_v1';
  const DEFAULTS = {
    v: 2,
    wiek: null,            // 'maly' | 'duzy'
    bohater: null,         // id z ASZD.BOHATEROWIE_LISTA
    xp: 0,                 // suma zdobytych gwiazdek (z kampanii i dyżurów)
    rozdzial: 1,           // najdalszy odblokowany
    ukonczone: [],         // numery ukończonych rozdziałów
    gwiazdki: {},          // nr rozdziału -> najlepszy wynik 1..3
    osiagniecia: [],       // nazwy zdobytych osiągnięć
    karty: [],             // id kart w albumie
    zlote: [],             // id kart zdobytych za komplet gwiazdek
    obserwacje: 0,         // ślady uważności: trafione wskazówki i rytmy
    obserwacjeMax: 0,
    pierwszyAlarm: null,   // 'quiet' | 'loud'
    pomylki: 0,
    ukonczona: false,
    dyzur: { ostatni: null, seria: 0, zrobione: [], odznaki: 0 },
    trening: { rekord: 0 },
    misja: null,           // { id, data, stan: 'trwa' | 'tak' | 'nie' }
    misjeZrobione: [],
    muzyka: true,
    dzwiek: true,
    lektor: null           // null = nie ustawiono, w trybie 4-7 domyślnie włączony
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return klon(DEFAULTS);
      const parsed = JSON.parse(raw);
      const s = Object.assign(klon(DEFAULTS), parsed);
      s.dyzur = Object.assign(klon(DEFAULTS.dyzur), parsed.dyzur || {});
      s.trening = Object.assign(klon(DEFAULTS.trening), parsed.trening || {});
      return s;
    } catch (e) {
      return klon(DEFAULTS);
    }
  }

  function klon(o) { return JSON.parse(JSON.stringify(o)); }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* tryb prywatny */ }
  }

  /* klucz dnia w czasie lokalnym, np. 2026-09-05 */
  function dzis() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function wczoraj() {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  return {
    get: () => state,
    set(patch) { Object.assign(state, patch); persist(); },
    dzis, wczoraj,
    maZapis() { return state.wiek !== null && (state.ukonczone.length > 0 || state.rozdzial > 1 || state.bohater); },
    maly() { return state.wiek === 'maly'; },
    tryb() { return state.wiek || 'duzy'; },
    lektorWlaczony() { return state.lektor === null ? state.wiek === 'maly' : !!state.lektor; },

    /* ---------- bohater ---------- */
    bohater() { return state.bohater; },
    wybierzBohatera(id) { state.bohater = id; persist(); },
    dodajXp(n) { state.xp += (n || 0); persist(); },
    poziom() { return Math.floor(state.xp / 6) + 1; },
    xpDoNastepnego() { return 6 - (state.xp % 6); },

    /* ---------- gwiazdki ---------- */
    /* 3 gwiazdki bez pomyłki, 2 przy jednej lub dwóch, 1 przy większej liczbie.
       Zera nie ma: dziecko zawsze kończy rozdział, ale ma po co wrócić. */
    gwiazdkiZa(bledy) { return bledy === 0 ? 3 : (bledy <= 2 ? 2 : 1); },
    zapiszGwiazdki(nr, ile) {
      const przyrost = Math.max(0, ile - (state.gwiazdki[nr] || 0));
      if (!state.gwiazdki[nr] || ile > state.gwiazdki[nr]) state.gwiazdki[nr] = ile;
      state.xp += przyrost;
      persist();
      return przyrost;
    },
    gwiazdkiRozdzialu(nr) { return state.gwiazdki[nr] || 0; },
    gwiazdekRazem() { return Object.keys(state.gwiazdki).reduce((s, k) => s + state.gwiazdki[k], 0); },
    gwiazdekMax() { return ASZD.ROZDZIALY.length * 3; },

    ukonczRozdzial(nr, osiagniecie) {
      if (state.ukonczone.indexOf(nr) === -1) state.ukonczone.push(nr);
      if (osiagniecie && state.osiagniecia.indexOf(osiagniecie) === -1) state.osiagniecia.push(osiagniecie);
      if (nr + 1 > state.rozdzial) state.rozdzial = Math.min(nr + 1, 5);
      persist();
    },
    odblokowany(nr) { return nr === 1 || state.ukonczone.indexOf(nr - 1) !== -1; },
    kampaniaUkonczona() { return state.ukonczone.length >= ASZD.ROZDZIALY.length; },

    dodajObserwacje(n) { state.obserwacje += (n || 1); persist(); },
    dodajMax(n) { state.obserwacjeMax += (n || 1); persist(); },
    dodajPomylke() { state.pomylki += 1; persist(); },

    /* ---------- album ---------- */
    dodajKarte(id, zlota) {
      let nowa = false;
      if (id && state.karty.indexOf(id) === -1) { state.karty.push(id); nowa = true; }
      if (zlota && state.zlote.indexOf(id) === -1) { state.zlote.push(id); nowa = true; }
      persist();
      return nowa;
    },
    maKarte(id) { return state.karty.indexOf(id) !== -1; },
    zlotaKarta(id) { return state.zlote.indexOf(id) !== -1; },

    /* ---------- dyżur ---------- */
    dyzurDzisZrobiony() { return state.dyzur.ostatni === dzis(); },
    zaliczDyzur(ids) {
      const d = state.dyzur;
      d.seria = (d.ostatni === wczoraj()) ? d.seria + 1 : 1;
      d.ostatni = dzis();
      d.odznaki += 1;
      ids.forEach((id) => { if (d.zrobione.indexOf(id) === -1) d.zrobione.push(id); });
      persist();
    },
    seriaDyzurow() {
      const d = state.dyzur;
      if (d.ostatni === dzis() || d.ostatni === wczoraj()) return d.seria;
      return 0;
    },

    /* ---------- trening ---------- */
    zapiszRekord(poziom) {
      if (poziom > state.trening.rekord) { state.trening.rekord = poziom; persist(); return true; }
      return false;
    },

    /* ---------- misja na dziś ---------- */
    ustawMisje(id) { state.misja = { id, data: dzis(), stan: 'trwa' }; persist(); },
    misjaDoSprawdzenia() {
      return state.misja && state.misja.stan === 'trwa' && state.misja.data !== dzis();
    },
    zamknijMisje(tak) {
      if (!state.misja) return;
      state.misja.stan = tak ? 'tak' : 'nie';
      if (tak && state.misjeZrobione.indexOf(state.misja.id) === -1) state.misjeZrobione.push(state.misja.id);
      persist();
    },

    zakoncz() {
      state.ukonczona = true;
      if (state.osiagniecia.indexOf(ASZD.OSIAGNIECIA.final) === -1) {
        state.osiagniecia.push(ASZD.OSIAGNIECIA.final);
      }
      persist();
    },

    /* wariant zakończenia zależy od tego, czy gracz zbadał najpierw cichy sygnał */
    wariantFinalu() { return state.pierwszyAlarm === 'quiet' ? 'czysty' : 'poprawka'; },

    /* nowa przygoda kasuje kampanię, ale zostawia album, dyżury, trening i ustawienia:
       to jest dorobek dziecka, nie stan jednej rozgrywki */
    reset() {
      const zostaje = {
        muzyka: state.muzyka, dzwiek: state.dzwiek, lektor: state.lektor,
        karty: state.karty, zlote: state.zlote, dyzur: state.dyzur, trening: state.trening,
        misjeZrobione: state.misjeZrobione, bohater: state.bohater, xp: state.xp
      };
      state = Object.assign(klon(DEFAULTS), zostaje);
      persist();
    }
  };
})();
