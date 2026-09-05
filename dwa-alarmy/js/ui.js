/* UI: odpowiednik klasy UI z oryginału (Panel, Button, StoryCard, Hotspot, Grid, Feedback).
   Wszystko budowane w JS, tak jak w Unity budowane było w C#. */
window.ASZD = window.ASZD || {};

ASZD.ui = (function () {
  const scena = () => document.getElementById('scena');
  const tlo = () => document.getElementById('tlo');

  function el(tag, cls, txt) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined && txt !== null) n.textContent = txt;
    return n;
  }

  /* teksty z \n zamieniamy na akapity, bo oryginał używał ich w kilku miejscach */
  function wieloliniowy(node, txt) {
    String(txt).split('\n').forEach((linia, i) => {
      if (i) node.appendChild(document.createElement('br'));
      node.appendChild(document.createTextNode(linia));
    });
    return node;
  }

  function ustawTlo(nazwa) {
    const t = tlo();
    const src = 'assets/img/' + nazwa + '.webp';
    if (t.dataset.src === src) return;
    t.dataset.src = src;
    t.style.backgroundImage = 'url("' + src + '")';
    t.classList.remove('tlo-wejscie');
    void t.offsetWidth;
    t.classList.add('tlo-wejscie');
  }

  function wyczysc() {
    const s = scena();
    while (s.firstChild) s.removeChild(s.firstChild);
    return s;
  }

  /* panel: główny kontener treści nad ilustracją */
  function panel(opts) {
    const s = wyczysc();
    const p = el('div', 'panel' + (opts.szeroki ? ' panel-szeroki' : ''));
    if (opts.etykieta) p.appendChild(el('p', 'etykieta', opts.etykieta));
    if (opts.tytul) p.appendChild(el('h2', null, opts.tytul));
    s.appendChild(p);
    return p;
  }

  function naglowekGry(nrRozdzialu, tytul, onPauza) {
    const bar = el('header', 'topbar');
    const wstecz = el('button', 'iconbtn', '⏸');
    wstecz.setAttribute('aria-label', ASZD.T.pauza);
    wstecz.addEventListener('click', () => { ASZD.audio.klik(); onPauza(); });
    const info = el('div', 'topinfo');
    info.appendChild(el('span', 'topnr', ASZD.T.rozdzialZ(nrRozdzialu)));
    info.appendChild(el('span', 'toptytul', tytul));
    bar.appendChild(info);
    bar.appendChild(wstecz);
    return bar;
  }

  /* karta dialogu z portretem mówcy wyciętym z ilustracji: dzieci przywiązują się
     do twarzy, a sama nazwa wersalikami nic dla nich nie znaczy */
  function kartaDialogu(mowca, tekst) {
    const k = el('div', 'story');
    const plik = ASZD.PORTRETY[mowca];
    if (plik) {
      const img = el('img', 'story-portret');
      img.src = 'assets/img/portret-' + plik + '.webp';
      img.alt = '';
      k.appendChild(img);
    }
    const tresc = el('div', 'story-tresc');
    tresc.appendChild(el('p', 'story-mowca', mowca));
    tresc.appendChild(wieloliniowy(el('p', 'story-tekst'), tekst));
    k.appendChild(tresc);
    return k;
  }

  /* licznik gwiazdek widoczny w trakcie zadania: dziecko widzi, że pomyłka kosztuje,
     zanim zacznie klikać na oślep */
  function gwiazdkiLive() {
    const w = el('div', 'gwiazdki-live');
    w.setAttribute('aria-label', ASZD.T.gwiazdki);
    const g = [0, 1, 2].map(() => {
      const i = el('span', 'gwiazdka gwiazdka-ma', '★');
      w.appendChild(i);
      return i;
    });
    w.aktualizuj = (n) => {
      g.forEach((x, i) => {
        const byla = x.classList.contains('gwiazdka-ma');
        x.classList.toggle('gwiazdka-ma', i < n);
        if (byla && i >= n) {
          x.classList.remove('gwiazdka-gasnie');
          void x.offsetWidth;
          x.classList.add('gwiazdka-gasnie');
        }
      });
    };
    return w;
  }

  /* duże gwiazdki na ekranie wyniku, wjeżdżają po kolei */
  function gwiazdkiDuze(n) {
    const w = el('div', 'gwiazdki-duze');
    for (let i = 0; i < 3; i++) {
      const g = el('span', 'gwiazdka-duza' + (i < n ? ' gwiazdka-zdobyta' : ''), '★');
      g.style.animationDelay = (i * 0.22) + 's';
      w.appendChild(g);
    }
    return w;
  }

  /* pasek fazy obserwacji: wymusza patrzenie, zanim można klikać */
  function odliczanie(sekundy, onKoniec) {
    const w = el('div', 'odliczanie');
    const tekst = el('p', 'odliczanie-tekst', ASZD.T.obserwuj(sekundy));
    const tor = el('div', 'postep-tor');
    const fill = el('div', 'odliczanie-fill');
    tor.appendChild(fill);
    w.appendChild(tekst);
    w.appendChild(tor);
    const start = performance.now();
    const total = sekundy * 1000;
    (function tik(t) {
      const uplyw = (t || performance.now()) - start;
      const zostalo = Math.max(0, total - uplyw);
      fill.style.width = (zostalo / total * 100) + '%';
      tekst.textContent = ASZD.T.obserwuj(Math.ceil(zostalo / 1000));
      if (zostalo > 0) requestAnimationFrame(tik);
      else { w.remove(); onKoniec(); }
    })();
    return w;
  }

  function przycisk(tekst, onClick, wariant) {
    const b = el('button', 'btn ' + (wariant || 'btn-gold'));
    wieloliniowy(b, tekst);
    b.addEventListener('click', (ev) => { ASZD.audio.klik(); onClick(ev); });
    return b;
  }

  function siatkaWyborow(opcje, onPick) {
    const g = el('div', 'wybory');
    opcje.forEach((o) => {
      const b = el('button', 'wybor');
      wieloliniowy(b, o.tekst);
      b.addEventListener('click', () => { ASZD.audio.klik(); onPick(o, b); });
      g.appendChild(b);
    });
    return g;
  }

  /* pasek postępu zadania, np. "Zebrane wskazówki 2/3" */
  function postep(etykieta, teraz, ile) {
    const w = el('div', 'postep');
    const t = el('div', 'postep-tekst');
    t.appendChild(el('span', null, etykieta));
    const licz = el('span', 'postep-licz', teraz + '/' + ile);
    t.appendChild(licz);
    const tor = el('div', 'postep-tor');
    const fill = el('div', 'postep-fill');
    fill.style.width = (ile ? (teraz / ile) * 100 : 0) + '%';
    tor.appendChild(fill);
    w.appendChild(t); w.appendChild(tor);
    w.aktualizuj = (n) => {
      licz.textContent = n + '/' + ile;
      fill.style.width = (ile ? (n / ile) * 100 : 0) + '%';
    };
    return w;
  }

  /* komunikat zwrotny: dobrze / spróbuj ponownie / wskazówka */
  function feedback() {
    const f = el('div', 'feedback');
    f.pokaz = (rodzaj, tekst) => {
      const prefix = rodzaj === 'dobrze' ? ASZD.T.dobrze
        : rodzaj === 'zle' ? ASZD.T.ponownie : ASZD.T.wskazowka;
      f.className = 'feedback feedback-' + rodzaj;
      f.textContent = '';
      wieloliniowy(f, prefix + tekst);
      f.classList.remove('feedback-puls');
      void f.offsetWidth;
      f.classList.add('feedback-puls');
      if (tekst) {
        try { f.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* starsze przeglądarki */ }
      }
    };
    f.pokaz('info', '');
    f.textContent = '';
    return f;
  }

  /* plansza z ilustracją i klikalnymi punktami (rozdziały 1 i 3) */
  /* pokazEtykiety=false: punkty mają znak zapytania i odsłaniają nazwę dopiero po trafieniu
     (tak jak w oryginale, gdzie hotspot rysowany był jako "?"). Nazwa zostaje w aria-label. */
  function planszaHotspotow(obraz, punkty, onPick, pokazEtykiety) {
    const w = el('div', 'plansza');
    const img = el('img', 'plansza-img');
    img.src = 'assets/img/' + obraz + '.webp';
    img.alt = '';
    w.appendChild(img);
    punkty.forEach((p) => {
      const b = el('button', 'hotspot');
      b.style.left = p.x + '%';
      b.style.top = p.y + '%';
      b.style.width = p.r * 2 + '%';
      b.setAttribute('aria-label', p.etykieta);
      b.appendChild(el('span', 'hotspot-pierscien'));
      const et = el('span', 'hotspot-etykieta', pokazEtykiety ? p.etykieta : '?');
      if (!pokazEtykiety) et.classList.add('hotspot-etykieta-znak');
      b.appendChild(el('span', 'hotspot-znak', pokazEtykiety ? '' : '?'));
      b.appendChild(et);
      b._nazwa = p.etykieta;
      b.addEventListener('click', () => { ASZD.audio.dotyk(); onPick(p, b); });
      p._el = b;
      w.appendChild(b);
    });
    return w;
  }

  /* drugi panel pod ilustracją: postęp i komunikat zwrotny blisko miejsca akcji */
  function panelPod() {
    const p = el('div', 'panel panel-pod');
    scena().appendChild(p);
    return p;
  }

  const HERB = 'M 200,50 L 800,50 C 910,50 950,120 950,210 L 950,440 C 950,720 780,880 500,990 C 220,880 50,720 50,440 L 50,210 C 50,120 90,50 200,50 Z';
  const HERB2 = 'M 236,106.4 L 764,106.4 C 860.8,106.4 896,168 896,247.2 L 896,449.6 C 896,696 746.4,836.8 500,933.6 C 253.6,836.8 104,696 104,449.6 L 104,247.2 C 104,168 139.2,106.4 236,106.4 Z';
  const GWIAZDA = '500,185 577.6,363.2 771.1,381.9 625.5,510.8 667.5,700.6 500,602 332.5,700.6 374.5,510.8 228.9,381.9 422.4,363.2';

  function herb() {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 1000 1000');
    svg.setAttribute('class', 'herb');
    svg.setAttribute('aria-hidden', 'true');
    [[HERB, '#FFC300'], [HERB2, '#14213D']].forEach(([d, fill]) => {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', fill);
      svg.appendChild(path);
    });
    const poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('points', GWIAZDA);
    poly.setAttribute('fill', '#FFC300');
    svg.appendChild(poly);
    return svg;
  }

  function konfetti() {
    const c = document.getElementById('konfetti');
    c.textContent = '';
    for (let i = 0; i < 26; i++) {
      const s = el('i');
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDelay = (Math.random() * 0.5) + 's';
      s.style.background = i % 3 === 0 ? '#FFC300' : (i % 3 === 1 ? '#81C784' : '#ffffff');
      c.appendChild(s);
    }
    c.classList.remove('hidden');
    setTimeout(() => c.classList.add('hidden'), 2200);
  }

  return { el, wieloliniowy, ustawTlo, wyczysc, panel, panelPod, naglowekGry, kartaDialogu,
    przycisk, siatkaWyborow, postep, feedback, planszaHotspotow, herb, konfetti, scena,
    gwiazdkiLive, gwiazdkiDuze, odliczanie };
})();
