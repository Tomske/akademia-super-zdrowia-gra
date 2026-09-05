/* Przeciąganie z alternatywą dotknięcia.
   Oryginał miał obie ścieżki ("Przeciągnij ją do kategorii albo dotknij wybranej kategorii")
   i to jest konieczne: w trybie 4-7 przeciąganie palcem bywa za trudne. */
window.ASZD = window.ASZD || {};

ASZD.dnd = (function () {

  /* Zwraca strefę pod punktem ekranu. Nie używamy natywnego HTML5 drag&drop,
     bo na mobile jest niespójny; Pointer Events działają wszędzie tak samo. */
  function strefaPod(strefy, x, y) {
    for (const s of strefy) {
      const r = s.el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return s;
    }
    return null;
  }

  /* token: element do przeciągania; strefy: [{el, id}]; onDrop(strefa, token) */
  function ustaw(token, strefy, onDrop) {
    let ciagnie = false, dx = 0, dy = 0, aktywna = null, przesuniete = false;

    function podswietl(s) {
      if (aktywna && aktywna !== s) aktywna.el.classList.remove('strefa-cel');
      if (s) s.el.classList.add('strefa-cel');
      aktywna = s;
    }

    token.addEventListener('pointerdown', (e) => {
      if (token.dataset.zablokowany === '1') return;
      ciagnie = true; przesuniete = false;
      const r = token.getBoundingClientRect();
      dx = e.clientX - r.left; dy = e.clientY - r.top;
      token.setPointerCapture(e.pointerId);
      token.classList.add('ciagniety');
      token.style.width = r.width + 'px';
      token.style.left = r.left + 'px';
      token.style.top = r.top + 'px';
    });

    token.addEventListener('pointermove', (e) => {
      if (!ciagnie) return;
      if (!przesuniete && Math.abs(e.movementX) + Math.abs(e.movementY) < 2) return;
      przesuniete = true;
      token.style.left = (e.clientX - dx) + 'px';
      token.style.top = (e.clientY - dy) + 'px';
      podswietl(strefaPod(strefy, e.clientX, e.clientY));
    });

    function koniec(e) {
      if (!ciagnie) return;
      ciagnie = false;
      token.classList.remove('ciagniety');
      token.style.width = ''; token.style.left = ''; token.style.top = '';
      const s = przesuniete ? strefaPod(strefy, e.clientX, e.clientY) : null;
      podswietl(null);
      if (s) onDrop(s, token);
    }

    token.addEventListener('pointerup', koniec);
    token.addEventListener('pointercancel', koniec);
  }

  /* ścieżka dotykowa: kliknięcie strefy zalicza aktualnie wybrany token */
  function strefyKlikalne(strefy, dajToken, onDrop) {
    strefy.forEach((s) => {
      s.el.addEventListener('click', () => {
        const t = dajToken();
        if (!t || t.dataset.zablokowany === '1') return;
        ASZD.audio.dotyk();
        onDrop(s, t);
      });
    });
  }

  return { ustaw, strefyKlikalne };
})();
