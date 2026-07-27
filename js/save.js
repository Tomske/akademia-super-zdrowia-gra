/* zapis postępu: localStorage, bez kont i bez danych osobowych */
window.ASZ = window.ASZ || {};

ASZ.save = (function () {
  const KEY = 'asz_save_v1';
  const DEFAULTS = {
    v: 1,
    zdrowomoc: 0,
    stars: {},        // missionId -> 0..3
    best: {},         // missionId -> najlepszy wynik
    comic: false,     // komiks cz. 1 odblokowany
    intro: false,     // intro obejrzane
    sound: true
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...DEFAULTS };
      const parsed = JSON.parse(raw);
      return { ...DEFAULTS, ...parsed };
    } catch (e) {
      return { ...DEFAULTS };
    }
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* tryb prywatny itp. */ }
  }

  function starsTotal() {
    return ASZ.MISSIONS.reduce((sum, m) => sum + (state.stars[m.id] || 0), 0);
  }

  /* misja odblokowana, gdy poprzednia ukończona (>=1 gwiazdka) */
  function unlockedCount() {
    let n = 1;
    for (const m of ASZ.MISSIONS) {
      if ((state.stars[m.id] || 0) > 0) n++;
      else break;
    }
    return Math.min(n, ASZ.MISSIONS.length);
  }

  function recordResult(missionId, stars, score) {
    const prevStars = state.stars[missionId] || 0;
    const prevBest = state.best[missionId] || 0;
    if (stars > prevStars) state.stars[missionId] = stars;
    if (score > prevBest) state.best[missionId] = score;
    state.zdrowomoc += score;
    persist();
  }

  return {
    get: () => state,
    set(patch) { Object.assign(state, patch); persist(); },
    recordResult,
    starsTotal,
    unlockedCount,
    reset() { state = { ...DEFAULTS }; persist(); }
  };
})();
