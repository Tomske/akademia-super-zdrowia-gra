/* Turniej Mistrza Pamięci: tryb bez końca na silniku wzorów, liczy się rekord sekwencji */
window.ASZP = window.ASZP || {};
ASZP.games = ASZP.games || {};

ASZP.games.turniej = {
  start(api) {
    return ASZP.sequenceEngine(api, {
      tiles: ASZP.TURNIEJ.tiles,
      endless: true,
      start: ASZP.TURNIEJ.start,
      gap: 620
    });
  }
};
