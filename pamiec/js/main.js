/* start aplikacji: nawigacja i pierwsze uruchomienie */
window.ASZP = window.ASZP || {};

(function () {
  const $ = (s) => document.querySelector(s);

  /* dodanie gracza */
  $('#player-form').addEventListener('submit', (e) => {
    e.preventDefault();
    ASZP.audio.unlock();
    const name = $('#player-name').value;
    ASZP.save.addPlayer(name, ASZP.ui.getPickedColor());
    $('#player-name').value = '';
    ASZP.audio.tap();
    ASZP.ui.enterMap();
  });

  /* nagłówek mapy */
  $('#chip-player').addEventListener('click', () => {
    ASZP.audio.tap();
    ASZP.ui.renderPlayers();
    ASZP.ui.show('screen-players');
  });
  $('#btn-sound').addEventListener('click', ASZP.ui.toggleSound);

  /* powrót z gry na mapę */
  $('#btn-back').addEventListener('click', () => {
    ASZP.audio.tap();
    ASZP.ui.stopActiveGame();
    ASZP.ui.enterMap();
  });

  /* pierwsze uruchomienie: wybór gracza albo od razu mapa */
  ASZP.ui.renderPlayers();
  if (ASZP.save.active()) ASZP.ui.enterMap();
  else ASZP.ui.show('screen-players');
})();
