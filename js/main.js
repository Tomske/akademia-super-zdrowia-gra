/* start aplikacji: preload, tytuł, nawigacja, PWA */
window.ASZ = window.ASZ || {};

(function () {
  const $ = ASZ.ui.$;

  /* stary adres GitHub Pages -> domena docelowa (zachowaj ścieżkę w obrębie repo) */
  if (location.hostname === 'tomske.github.io') {
    const rest = location.pathname.replace(/^\/akademia-super-zdrowia-gra\/?/, '');
    location.replace('https://gra.akademiasuperzdrowia.pl/' + rest + location.search + location.hash);
    return;
  }

  /* Vercel Web Analytics (bezcookiesowe) — tylko na domenach serwowanych przez Vercel */
  if (/(^gra\.akademiasuperzdrowia\.pl$)|(\.vercel\.app$)/.test(location.hostname)) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    document.head.appendChild(s);
  }

  /* ---------- preload ---------- */
  function preload(onProgress) {
    const list = [...new Set(ASZ.PRELOAD)];
    let done = 0;
    return Promise.all(list.map(src => new Promise(resolve => {
      const im = ASZ.ui.img(src);
      const fin = () => { done++; onProgress(done / list.length); resolve(); };
      if (im.complete && im.width) fin();
      else {
        im.addEventListener('load', fin, { once: true });
        im.addEventListener('error', fin, { once: true });
      }
    })));
  }

  /* ---------- PWA: instalacja ---------- */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    $('#btn-install').classList.remove('hidden');
  });
  $('#btn-install').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    $('#btn-install').classList.add('hidden');
  });
  window.addEventListener('appinstalled', () => {
    $('#btn-install').classList.add('hidden');
    ASZ.ui.toast('Gra zainstalowana! Znajdziesz ją na ekranie głównym.');
  });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  /* ---------- pomoc ---------- */
  const HELP_HTML = `
    <h3>Jak grać?</h3>
    <p>Przechodź misje drużyny Akademii, ładuj Kryształ i pokonaj Glutona X.
    Za każdą misję dostajesz 1-3 gwiazdki: możesz wracać i poprawiać wynik.
    Po pokonaniu Glutona odblokujesz <b>komiks część 1</b>.</p>
    <h4>Sterowanie</h4>
    <ul>
      <li>Telefon / tablet: palcem (przesuwanie, klepnięcie, przeciąganie).</li>
      <li>Komputer: mysz albo strzałki, spacja = skok / strzał.</li>
    </ul>
    <h4>Jak zainstalować grę jako aplikację?</h4>
    <p><b>Android (Chrome):</b> menu ⋮ → „Dodaj do ekranu głównego” (albo przycisk „Zainstaluj aplikację”).</p>
    <p><b>iPhone / iPad (Safari):</b> przycisk Udostępnij <span style="border:1px solid #999;border-radius:4px;padding:0 5px">↑</span> → „Dodaj do ekranu początkowego”.</p>
    <p><b>Komputer (Chrome / Edge):</b> ikona instalacji w pasku adresu.</p>
    <p>Po instalacji gra działa też <b>offline</b>, a postęp zapisuje się na urządzeniu.</p>
    <h4>Prywatność</h4>
    <p>Gra nie ma logowania, reklam ani formularzy i nie wysyła żadnych danych.
    Postęp zapisuje się wyłącznie na Twoim urządzeniu.</p>`;

  $('#btn-help').addEventListener('click', () => { ASZ.audio.tap(); ASZ.ui.showModal(HELP_HTML); });
  $('#btn-modal-close').addEventListener('click', () => { ASZ.audio.tap(); $('#modal').classList.add('hidden'); });

  /* ---------- nawigacja ---------- */
  $('#btn-play').addEventListener('click', () => {
    ASZ.audio.unlock();
    ASZ.audio.tap();
    if (!ASZ.save.get().intro) {
      ASZ.ui.playIntro(() => { ASZ.ui.show('screen-map'); ASZ.ui.renderMap(); });
    } else {
      ASZ.ui.show('screen-map');
      ASZ.ui.renderMap();
    }
  });

  $('#btn-quit').addEventListener('click', () => {
    ASZ.audio.tap();
    ASZ.ui.stopActiveGame();
    $('#dialog').classList.add('hidden');
    $('#result').classList.add('hidden');
    ASZ.ui.show('screen-map');
    ASZ.ui.renderMap();
  });

  $('#btn-reward-map').addEventListener('click', () => {
    ASZ.audio.tap();
    ASZ.ui.show('screen-map');
    ASZ.ui.renderMap();
  });

  $('#btn-sound').addEventListener('click', ASZ.ui.toggleSound);
  $('#btn-sound-map').addEventListener('click', ASZ.ui.toggleSound);

  /* ---------- start ---------- */
  const fill = $('#load-fill');
  preload(f => { fill.style.width = Math.round(f * 100) + '%'; }).then(() => {
    setTimeout(() => {
      ASZ.ui.paintSoundBtns();
      ASZ.ui.show('screen-title');
    }, 250);
  });
})();
