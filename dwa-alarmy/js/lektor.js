/* Lektor: Web Speech API (speechSynthesis) po polsku, zero plików.
   Otwiera grę na dzieci, które jeszcze nie czytają. Domyślnie włączony w trybie 4-7.
   Jakość głosu zależy od systemu (Windows: Paulina, Android: Google polski, iOS: Zosia).
   Gdy przeglądarka nie ma polskiego głosu, lektor po cichu nic nie robi. */
window.ASZD = window.ASZD || {};

ASZD.lektor = (function () {
  const synth = window.speechSynthesis || null;
  let glos = null, szukano = false;

  function znajdzGlos() {
    if (!synth || szukano) return;
    const glosy = synth.getVoices();
    if (!glosy.length) return;
    szukano = true;
    glos = glosy.find((g) => /^pl/i.test(g.lang) && /google|paulina|zosia|natural/i.test(g.name))
      || glosy.find((g) => /^pl/i.test(g.lang)) || null;
  }
  if (synth) {
    znajdzGlos();
    synth.addEventListener && synth.addEventListener('voiceschanged', () => { szukano = false; znajdzGlos(); });
  }

  function dostepny() { znajdzGlos(); return !!(synth && glos); }
  function wlaczony() { return dostepny() && ASZD.save.lektorWlaczony(); }

  function czytaj(tekst) {
    if (!wlaczony() || !tekst) return;
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(String(tekst).replace(/[•→✓★]/g, ' '));
      u.lang = 'pl-PL';
      u.voice = glos;
      u.rate = ASZD.save.maly() ? 0.9 : 1.0;
      u.pitch = 1.05;
      synth.speak(u);
    } catch (e) { /* brak wsparcia */ }
  }

  /* czyta tytuł i opis zadania z panelu, bez przycisków */
  function czytajPanel(panel) {
    if (!wlaczony() || !panel) return;
    const czesci = [];
    const h = panel.querySelector('h2'); if (h) czesci.push(h.textContent);
    const o = panel.querySelector('.opis'); if (o) czesci.push(o.textContent);
    const s = panel.querySelector('.sytuacja p:last-child'); if (s) czesci.push(s.textContent);
    const d = panel.querySelector('.story-tekst'); if (d) czesci.push(d.textContent);
    czytaj(czesci.join('. '));
  }

  function stop() { if (synth) { try { synth.cancel(); } catch (e) { /* nic */ } } }

  return { dostepny, wlaczony, czytaj, czytajPanel, stop };
})();
