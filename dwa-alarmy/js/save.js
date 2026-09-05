/* zapis: localStorage, bez kont i bez wysyłania danych.
   Struktura pól odwzorowuje SaveData z oryginału (schemaVersion, completedChapters,
   achievements, observeFirst, endingVariant), żeby dało się porównać przebieg gry. */
window.ASZD = window.ASZD || {};

ASZD.save = (function () {
  const KEY = 'asz_dwa_alarmy_v1';
  const DEFAULTS = {
    v: 1,
    wiek: null,            // 'maly' | 'duzy'
    rozdzial: 1,           // najdalszy odblokowany
    ukonczone: [],         // numery ukończonych rozdziałów
    gwiazdki: {},          // nr rozdziału -> najlepszy wynik 1..3
    osiagniecia: [],       // nazwy zdobytych osiągnięć
    obserwacje: 0,         // ślady uważności: trafione wskazówki i rytmy
    obserwacjeMax: 0,
    pierwszyAlarm: null,   // 'quiet' | 'loud'
    pomylki: 0,
    ukonczona: false,
    muzyka: true,
    dzwiek: true
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return Object.assign({}, DEFAULTS);
      return Object.assign({}, DEFAULTS, JSON.parse(raw));
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* tryb prywatny */ }
  }

  return {
    get: () => state,
    set(patch) { Object.assign(state, patch); persist(); },
    maZapis() { return state.wiek !== null && (state.ukonczone.length > 0 || state.rozdzial > 1); },
    maly() { return state.wiek === 'maly'; },
    tryb() { return state.wiek || 'duzy'; },

    /* 3 gwiazdki bez pomyłki, 2 przy jednej lub dwóch, 1 przy większej liczbie.
       Zera nie ma: dziecko zawsze kończy rozdział, ale ma po co wrócić. */
    gwiazdkiZa(bledy) { return bledy === 0 ? 3 : (bledy <= 2 ? 2 : 1); },
    zapiszGwiazdki(nr, ile) {
      if (!state.gwiazdki[nr] || ile > state.gwiazdki[nr]) state.gwiazdki[nr] = ile;
      persist();
    },
    gwiazdkiRozdzialu(nr) { return state.gwiazdki[nr] || 0; },
    gwiazdekRazem() {
      return Object.keys(state.gwiazdki).reduce((s, k) => s + state.gwiazdki[k], 0);
    },
    gwiazdekMax() { return ASZD.ROZDZIALY.length * 3; },

    ukonczRozdzial(nr, osiagniecie) {
      if (state.ukonczone.indexOf(nr) === -1) state.ukonczone.push(nr);
      if (osiagniecie && state.osiagniecia.indexOf(osiagniecie) === -1) state.osiagniecia.push(osiagniecie);
      if (nr + 1 > state.rozdzial) state.rozdzial = Math.min(nr + 1, 5);
      persist();
    },

    odblokowany(nr) { return nr === 1 || state.ukonczone.indexOf(nr - 1) !== -1; },

    dodajObserwacje(n) { state.obserwacje += (n || 1); persist(); },
    dodajMax(n) { state.obserwacjeMax += (n || 1); persist(); },
    dodajPomylke() { state.pomylki += 1; persist(); },

    zakoncz() {
      state.ukonczona = true;
      if (state.osiagniecia.indexOf(ASZD.OSIAGNIECIA.final) === -1) {
        state.osiagniecia.push(ASZD.OSIAGNIECIA.final);
      }
      persist();
    },

    /* wariant zakończenia zależy od tego, czy gracz zbadał najpierw cichy sygnał */
    wariantFinalu() { return state.pierwszyAlarm === 'quiet' ? 'czysty' : 'poprawka'; },

    reset() {
      const muzyka = state.muzyka, dzwiek = state.dzwiek;
      state = Object.assign({}, DEFAULTS, { muzyka, dzwiek });
      persist();
    }
  };
})();
