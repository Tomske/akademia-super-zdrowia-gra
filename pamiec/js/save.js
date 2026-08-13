/* zapis: localStorage, profile graczy, bez kont i bez wysyłania danych */
window.ASZP = window.ASZP || {};

ASZP.save = (function () {
  const KEY = 'asz_pamiec_v1';
  const DEFAULTS = { v: 1, players: [], active: null, sound: true };

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

  function addPlayer(name, color) {
    const p = {
      id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1000),
      name: (name || '').trim().slice(0, 16) || 'Super Gracz',
      color: color || ASZP.COLORS[0],
      stars: {},   // levelId -> 0..3
      best: {},    // levelId -> najlepszy wynik
      points: 0,   // Punkty Pamięci (suma wyników)
      record: 0    // rekord turnieju (długość sekwencji)
    };
    state.players.push(p);
    state.active = p.id;
    persist();
    return p;
  }

  function removePlayer(id) {
    state.players = state.players.filter(p => p.id !== id);
    if (state.active === id) state.active = state.players.length ? state.players[0].id : null;
    persist();
  }

  function active() {
    return state.players.find(p => p.id === state.active) || null;
  }

  function setActive(id) { state.active = id; persist(); }

  function starsTotal(p) {
    const pl = p || active();
    if (!pl) return 0;
    return ASZP.LEVELS.reduce((s, l) => s + (pl.stars[l.id] || 0), 0);
  }

  function isLevelUnlocked(levelId) {
    const pl = active();
    if (!pl) return false;
    const level = ASZP.levelById(levelId);
    if (level.nr === 1) return true;
    const prev = ASZP.levelsOf(level.zone).find(l => l.nr === level.nr - 1);
    return (pl.stars[prev.id] || 0) > 0;
  }

  function tournamentUnlocked() {
    return starsTotal() >= ASZP.TURNIEJ.unlockStars;
  }

  function recordResult(levelId, stars, score) {
    const pl = active();
    if (!pl) return { gained: 0 };
    const prevStars = pl.stars[levelId] || 0;
    const prevBest = pl.best[levelId] || 0;
    if (stars > prevStars) pl.stars[levelId] = stars;
    if (score > prevBest) pl.best[levelId] = score;
    pl.points += score;
    persist();
    return { gained: score, newBest: score > prevBest, prevBest };
  }

  function recordTournament(seqLen) {
    const pl = active();
    if (!pl) return { gained: 0, newRecord: false };
    const newRecord = seqLen > (pl.record || 0);
    if (newRecord) pl.record = seqLen;
    const gained = seqLen * 10;
    pl.points += gained;
    persist();
    return { gained, newRecord, record: pl.record };
  }

  function badgeFor(record) {
    return ASZP.TURNIEJ.badges.find(b => record >= b.at) || null;
  }

  return {
    get: () => state,
    set(patch) { Object.assign(state, patch); persist(); },
    addPlayer,
    removePlayer,
    active,
    setActive,
    starsTotal,
    isLevelUnlocked,
    tournamentUnlocked,
    recordResult,
    recordTournament,
    badgeFor
  };
})();
